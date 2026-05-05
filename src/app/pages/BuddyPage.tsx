import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Flame, Star, Coins, CheckCircle2, XCircle, Clock, Bell, AlertTriangle, ChevronRight, Loader, X as XIcon, Calendar, Users, MessageCircle } from "lucide-react";
import { getRankFromPoints, getNextRank, getRankProgress } from "../utils/rankSystem";
import { getBuddies, addBuddy, isNewBuddy, canAddMoreBuddies, getBuddyCount, type Buddy } from "../utils/buddyStorage";
import { getUserProfile, recordWakeUpSuccess, recordWakeUpFailure } from "../utils/userProfile";
import { addWakeHistoryEntry } from "../utils/wakeHistory";
import { getPendingRequests, cancelPendingRequest, simulateAutoAccept, acceptRequest, getIncomingRequestCount, type PendingRequest } from "../utils/pendingRequests";
import { getAlarmSetupState } from "../utils/alarmSetup";

export default function BuddyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const success = location.state?.success || false;
  const failed = location.state?.failed || false;
  const reason = location.state?.reason || '';

  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [earnedBonus, setEarnedBonus] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [showAcceptedToast, setShowAcceptedToast] = useState(false);
  const [acceptedBuddyName, setAcceptedBuddyName] = useState("");
  const [removingRequestId, setRemovingRequestId] = useState<string | null>(null);
  const [addingBuddyName, setAddingBuddyName] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);


  useEffect(() => {
    setBuddies(getBuddies());
    setPendingRequests(getPendingRequests());
    setNotificationCount(getIncomingRequestCount());

    // Update user profile based on success/failure
    if (success) {
      const profile = recordWakeUpSuccess();
      setUserProfile(profile);

      // Calculate bonus
      let bonus = 0;
      if (profile.streak % 7 === 0) {
        bonus = 15;
      } else if (profile.streak % 3 === 0) {
        bonus = 5;
      }
      setEarnedBonus(bonus);

      // Record in history
      const alarmSetup = getAlarmSetupState();
      addWakeHistoryEntry({
        date: new Date().toISOString(),
        success: true,
        pointsEarned: 10 + bonus,
        streakAtTime: profile.streak,
        bonusEarned: bonus > 0 ? bonus : undefined,
        alarmTime: alarmSetup.alarmTime,
      });
    } else if (failed) {
      const profile = recordWakeUpFailure();
      setUserProfile(profile);

      // Record in history
      const alarmSetup = getAlarmSetupState();
      addWakeHistoryEntry({
        date: new Date().toISOString(),
        success: false,
        pointsEarned: -15,
        streakAtTime: 0,
        alarmTime: alarmSetup.alarmTime,
      });
    }

    // Listen for accepted requests
    const handleAccepted = (event: CustomEvent) => {
      const { requestId, targetName } = event.detail;

      // Animate pending removal
      setRemovingRequestId(requestId);

      setTimeout(() => {
        // Remove from pending
        acceptRequest(requestId);
        setPendingRequests(getPendingRequests());

        // Add to buddies with animation
        setAddingBuddyName(targetName);
        addBuddy(targetName);
        setBuddies(getBuddies());

        // Reset animation state
        setRemovingRequestId(null);
        setTimeout(() => setAddingBuddyName(null), 300);

        // Show toast
        setAcceptedBuddyName(targetName);
        setShowAcceptedToast(true);
        setTimeout(() => setShowAcceptedToast(false), 4000);
      }, 300);
    };

    // Listen for incoming requests to update notification count
    const handleIncomingRequest = () => {
      setNotificationCount(getIncomingRequestCount());
    };

    window.addEventListener('buddy-request-accepted', handleAccepted as EventListener);
    window.addEventListener('incoming-buddy-request', handleIncomingRequest);
    return () => {
      window.removeEventListener('buddy-request-accepted', handleAccepted as EventListener);
      window.removeEventListener('incoming-buddy-request', handleIncomingRequest);
    };
  }, [success, failed]);

  // Auto-accept pending requests after 5 seconds for demo
  useEffect(() => {
    pendingRequests.forEach(req => {
      if (req.status === 'pending' && req.type === 'buddy') {
        simulateAutoAccept(req.id, 8000); // Accept after 8 seconds
      }
    });
  }, [pendingRequests]);

  const handleCancelRequest = (id: string) => {
    if (confirm("Cancel this request?")) {
      // Animate removal
      setRemovingRequestId(id);

      // Wait for animation, then remove
      setTimeout(() => {
        cancelPendingRequest(id);
        setPendingRequests(getPendingRequests());
        setRemovingRequestId(null);
      }, 300);
    }
  };

  const currentPoints = userProfile.points;
  const currentStreak = userProfile.streak;
  const currentRank = getRankFromPoints(currentPoints);
  const { rank: nextRank, pointsNeeded } = getNextRank(currentPoints);
  const progress = getRankProgress(currentPoints);

  // Format current date
  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-[#f2f1ec] relative size-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-none h-[80px] flex items-center justify-center border-b border-black/5">
        <div className="flex flex-col font-['ABeeZee:Regular',sans-serif] items-center">
          <p className="text-[20px] text-[#180f2a]">
            <span className="font-['Miniver:Regular',sans-serif]">N</span>
            <span className="font-['Michroma:Regular',sans-serif]">ooze</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-[100px]">
        <div className="max-w-[400px] mx-auto py-6 space-y-6">

          {/* Date Display */}
          <div className="text-center">
            <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-[#180f2a]/60">
              {formatDate()}
            </p>
          </div>

          {/* Failed Alert */}
          {failed && (
            <div className="bg-[#ef4444] rounded-[24px] p-6 shadow-xl border-2 border-[#991b1b] animate-shake">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h2 className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[24px] text-white mb-1">
                    Streak Lost!
                  </h2>
                  <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-white/90">
                    {reason === 'timeout' ? 'You took too long to wake up' : 'You missed your alarm'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-white/20 rounded-[12px] p-3 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-white" strokeWidth={2.5} />
                  <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-white">
                    -15 points deducted
                  </p>
                </div>
                <div className="bg-white/20 rounded-[12px] p-3 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
                  <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-white">
                    Streak reset to 0 days
                  </p>
                </div>
                <div className="bg-white/20 rounded-[12px] p-3 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-white" strokeWidth={2.5} />
                  <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-white">
                    Your buddies have been notified
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Greeting */}
          {!failed && (
            <div className="text-center">
              <h1 className="font-['Manrope:Bold',sans-serif] font-bold text-[28px] text-[#180f2a] mb-1">
                Good Morning!
              </h1>
              <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                You're ahead before the day begins
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/5">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto ${
                failed ? 'bg-[#ef4444]/10' : 'bg-[#834dfb]/10'
              }`}>
                <Flame className={`w-6 h-6 ${failed ? 'text-[#ef4444]' : 'text-[#834dfb]'}`} strokeWidth={2} />
              </div>
              <p className="text-center font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/60 mb-1">
                Streak
              </p>
              <p className={`text-center font-['Manrope:Bold',sans-serif] font-bold text-[24px] ${
                failed ? 'text-[#ef4444]' : 'text-[#180f2a]'
              }`}>
                {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/5">
              <div className="flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto" style={{ backgroundColor: `${currentRank.color}20` }}>
                <span className="text-[24px]">{currentRank.icon}</span>
              </div>
              <p className="text-center font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/60 mb-1">
                Current Rank
              </p>
              <p className="text-center font-['Manrope:Bold',sans-serif] font-bold text-[14px] text-[#180f2a] mb-1">
                {currentRank.name}
              </p>
              {nextRank && (
                <p className="text-center font-['Manrope:Regular',sans-serif] text-[11px] text-[#180f2a]/50">
                  Next: {nextRank.name}
                </p>
              )}
            </div>
          </div>

          {/* Points Card with Rank Progress */}
          <div className="bg-gradient-to-br from-[#834dfb] to-[#6366f1] rounded-[20px] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-white/80 mb-1">
                  Total Points
                </p>
                <p className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[32px] text-white leading-none">
                  {currentPoints.toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Coins className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Rank Progress */}
            {nextRank && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/80 text-[12px] font-['Manrope:SemiBold',sans-serif]">
                    Progress to {nextRank.name}
                  </p>
                  <p className="text-white text-[12px] font-['Manrope:Bold',sans-serif]">
                    {pointsNeeded} points
                  </p>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f0e100] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className={`backdrop-blur-sm rounded-[12px] p-3 ${
              failed ? 'bg-[#ef4444]/30 border border-[#ef4444]/50' : 'bg-white/10'
            }`}>
              <p className="text-white/90 text-[12px] font-['Manrope:Regular',sans-serif]">
                {failed
                  ? '-15 points for missing alarm'
                  : earnedBonus > 0
                    ? `+10 points for waking up + ${earnedBonus} streak bonus!`
                    : '+10 points for waking up today'
                }
              </p>
            </div>
          </div>

          {/* Sent Requests */}
          {pendingRequests.length > 0 && (
            <div className="bg-[#f0e100]/10 border-2 border-[#f0e100]/30 rounded-[20px] p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#f0e100]/20 flex items-center justify-center">
                  <Loader className="w-4 h-4 text-[#f0e100] animate-spin" strokeWidth={2.5} />
                </div>
                <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[16px] text-[#180f2a]">
                  Sent Requests
                </h3>
              </div>

              <div className="space-y-2">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`bg-white rounded-[12px] p-3 flex items-center justify-between ${
                      removingRequestId === request.id ? 'animate-slide-out-right' : 'animate-scale-in'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f0e100]/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#f0e100]" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="font-['Manrope:Medium',sans-serif] font-medium text-[14px] text-[#180f2a]">
                          {request.targetName}
                        </p>
                        <p className="font-['Manrope:Regular',sans-serif] text-[11px] text-[#f0e100]">
                          Waiting for approval...
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelRequest(request.id)}
                      className="w-8 h-8 rounded-full bg-[#ef4444]/10 flex items-center justify-center hover:bg-[#ef4444]/20 transition-colors"
                    >
                      <XIcon className="w-4 h-4 text-[#ef4444]" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buddy Chain */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#834dfb]/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#834dfb]" strokeWidth={2} />
                </div>
                <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[16px] text-[#180f2a]">
                  Buddy Chain
                </h3>
              </div>
            </div>

            <p className="text-[12px] font-['Manrope:Regular',sans-serif] text-[#180f2a]/50 mb-4 flex items-center gap-1">
              <span>👆</span> Tap any buddy to view their profile
            </p>

            <div className="space-y-2">
              {buddies.map((buddy, index) => {
                const isNew = isNewBuddy(buddy);
                const isJustAdded = addingBuddyName === buddy.name;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${
                      isJustAdded ? 'animate-fade-in-down' : ''
                    }`}
                  >
                    <button
                      onClick={() => navigate(`/buddy/${buddy.name}`)}
                      className="flex-1 flex items-center justify-between p-3 bg-[#f5f3ff] rounded-[12px] hover:bg-[#834dfb]/10 hover:scale-[1.02] transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                          isNew ? "bg-[#834dfb]/10" : buddy.awake ? "bg-[#f0e100]/10" : "bg-[#ef4444]/10"
                        }`}>
                          {isNew ? (
                            <Calendar className="w-5 h-5 text-[#834dfb]" strokeWidth={2} />
                          ) : buddy.awake ? (
                            <>
                              <Flame className="w-5 h-5 text-[#f0e100] fill-[#f0e100]" strokeWidth={2} />
                              {buddy.streak > 0 && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#834dfb] rounded-full flex items-center justify-center">
                                  <span className="text-[9px] font-['Manrope:Bold',sans-serif] text-white">
                                    {buddy.streak}
                                  </span>
                                </div>
                              )}
                            </>
                          ) : (
                            <XCircle className="w-5 h-5 text-[#ef4444]" strokeWidth={2} />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-['Manrope:Medium',sans-serif] font-medium text-[14px] text-[#180f2a]">
                            {buddy.name}
                          </p>
                          <p className="font-['Manrope:Regular',sans-serif] text-[11px] text-[#180f2a]/50">
                            {isNew
                              ? "Starting tomorrow"
                              : buddy.awake
                                ? `${buddy.streak} day streak`
                                : "Not awake"
                            }
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-[#180f2a]/30" strokeWidth={2} />
                    </button>

                    <button
                      onClick={() => navigate(`/chat/${buddy.name}`)}
                      className="w-11 h-11 bg-[#834dfb] rounded-[12px] flex items-center justify-center hover:bg-[#6d3dd9] transition-colors active:scale-[0.95]"
                    >
                      <MessageCircle className="w-5 h-5 text-white" strokeWidth={2} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-black/5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-['Manrope:Regular',sans-serif] text-[#180f2a]/60">
                  Chain Status
                </p>
                <p className="text-[13px] font-['Manrope:SemiBold',sans-serif] text-[#10b981]">
                  {buddies.filter(b => b.awake).length}/{buddies.length} Awake
                </p>
              </div>
            </div>
          </div>

          {/* Achievement */}
          {!failed && earnedBonus > 0 && (
            <div className="bg-[#f0e100]/10 border border-[#f0e100]/30 rounded-[20px] p-5">
              <div className="text-center">
                <Star className="w-10 h-10 text-[#f0e100] fill-[#f0e100] mx-auto mb-3" strokeWidth={2} />
                <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[16px] text-[#180f2a] mb-1">
                  {earnedBonus === 15 ? '7-Day Streak Bonus!' : '3-Day Streak Bonus!'}
                </h3>
                <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]/60">
                  +{earnedBonus} bonus points for your {currentStreak}-day streak!
                </p>
              </div>
            </div>
          )}

          {!failed && !earnedBonus && currentStreak > 0 && (
            <div className="bg-[#f0e100]/10 border border-[#f0e100]/30 rounded-[20px] p-5">
              <div className="text-center">
                <Star className="w-10 h-10 text-[#f0e100] fill-[#f0e100] mx-auto mb-3" strokeWidth={2} />
                <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[16px] text-[#180f2a] mb-1">
                  Streak Extended!
                </h3>
                <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]/60">
                  {currentStreak < 3
                    ? `${3 - currentStreak} more day${3 - currentStreak > 1 ? 's' : ''} to unlock +5 bonus!`
                    : currentStreak < 7
                      ? `${7 - currentStreak} more day${7 - currentStreak > 1 ? 's' : ''} to unlock +15 bonus!`
                      : `You've maintained your ${currentStreak}-day streak!`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accepted Toast Notification */}
      {showAcceptedToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-scale-in px-6">
          <div className="bg-[#10b981] text-white px-6 py-4 rounded-[20px] shadow-2xl border-2 border-[#059669] max-w-[350px]">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
              <p className="font-['Manrope:Bold',sans-serif] font-bold text-[16px]">
                You're now buddies!
              </p>
            </div>
            <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-white/90 ml-9">
              You and {acceptedBuddyName} will start waking up together tomorrow
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Fixed */}
      <div className="flex-none h-[90px] bg-white border-t border-black/5 px-6">
        <div className="max-w-[400px] mx-auto h-full flex items-center justify-around">
          <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#180f2a]/30" strokeWidth={2} />
            </div>
          </button>
          <button onClick={() => navigate('/notifications')} className="flex flex-col items-center gap-1 min-w-[60px] relative">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#180f2a]/30" strokeWidth={2} />
            </div>
            {notificationCount > 0 && (
              <div className="absolute top-0 right-3 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white font-['Manrope:Bold',sans-serif] text-[10px]">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              </div>
            )}
          </button>
          <button className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full bg-[#834dfb] flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </button>
          <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#180f2a]/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </button>
          <button onClick={() => navigate('/account')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-[#180f2a]/30" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
