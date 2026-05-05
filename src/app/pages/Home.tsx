import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Clock, Shuffle, Music, Coins, Flame, Bell, UserPlus, Link2, Users, X, CheckCircle, Loader, Calendar, TrendingUp, Volume2, Play, Check } from "lucide-react";
import { addBuddy, getBuddies, removeBuddy, isNewBuddy, canAddMoreBuddies, getBuddyCount, type Buddy } from "../utils/buddyStorage";
import { addPendingRequest, getPendingRequests, hasPendingRequest, cancelPendingRequest, getIncomingRequests, acceptIncomingRequest, declineIncomingRequest, startAutoGenerateIncomingRequests, type PendingRequest, type IncomingRequest } from "../utils/pendingRequests";
import { getUserProfile } from "../utils/userProfile";
import { getRankFromPoints, getNextRank } from "../utils/rankSystem";
import { getAlarmSettings, setRandomSound, setCustomSound, alarmSounds, getCategoryIcon, type AlarmSound } from "../utils/alarmSound";
import { markAlarmAsSetup } from "../utils/alarmSetup";
import { getIncomingRequestCount } from "../utils/pendingRequests";

export default function Home() {
  const navigate = useNavigate();
  const [selectedHour, setSelectedHour] = useState(6);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");
  const [showAddBuddy, setShowAddBuddy] = useState(false);
  const [showJoinChain, setShowJoinChain] = useState(false);
  const [showManageBuddies, setShowManageBuddies] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [buddyUsername, setBuddyUsername] = useState("");
  const [chainCode, setChainCode] = useState("");
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [removingBuddyName, setRemovingBuddyName] = useState<string | null>(null);
  const [removingRequestId, setRemovingRequestId] = useState<string | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  // User profile state
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const currentRank = getRankFromPoints(userProfile.points);
  const nextRankInfo = getNextRank(userProfile.points);

  // Alarm sound state
  const [alarmSettings, setAlarmSettings] = useState(getAlarmSettings());
  const [previewingSound, setPreviewingSound] = useState<string | null>(null);

  // Load buddies and pending requests
  useEffect(() => {
    setBuddies(getBuddies());
    setPendingRequests(getPendingRequests());
    setIncomingRequests(getIncomingRequests());
    setNotificationCount(getIncomingRequestCount());

    // Start auto-generating incoming buddy requests for demo
    startAutoGenerateIncomingRequests();
  }, []);

  // Listen for incoming buddy requests
  useEffect(() => {
    const handleIncomingRequest = (event: CustomEvent) => {
      setIncomingRequests(getIncomingRequests());
      setNotificationCount(getIncomingRequestCount());
      const { request } = event.detail;
      showToastNotification(`${request.fromUsername} sent you a buddy request!`);
    };

    window.addEventListener('incoming-buddy-request', handleIncomingRequest as EventListener);
    return () => window.removeEventListener('incoming-buddy-request', handleIncomingRequest as EventListener);
  }, []);

  // Format current date
  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  const handleRandomSound = () => {
    const sound = setRandomSound();
    setAlarmSettings(getAlarmSettings());
    showToastNotification(`Random sound selected: ${sound.name}`);
  };

  const handleCustomSound = () => {
    setShowSoundModal(true);
  };

  const handleSelectSound = (sound: AlarmSound) => {
    setCustomSound(sound);
    setAlarmSettings(getAlarmSettings());
    setShowSoundModal(false);
    showToastNotification(`Sound selected: ${sound.name}`);
  };

  const handlePreviewSound = (soundId: string) => {
    setPreviewingSound(soundId);
    // Simulate playing sound
    setTimeout(() => setPreviewingSound(null), 2000);
  };

  const handleReplayCurrentSound = () => {
    if (alarmSettings.selectedSound) {
      handlePreviewSound(alarmSettings.selectedSound.id);
    }
  };

  // Reload buddies when modals are opened/closed
  useEffect(() => {
    if (!showManageBuddies && !showAddBuddy) {
      setBuddies(getBuddies());
      setPendingRequests(getPendingRequests());
    }
  }, [showManageBuddies, showAddBuddy]);

  // Show toast notification
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Listen for accepted requests
  useEffect(() => {
    const handleAccepted = (event: CustomEvent) => {
      const { targetName } = event.detail;
      // Refresh buddies and pending requests
      setBuddies(getBuddies());
      setPendingRequests(getPendingRequests());

      // Show friendly notification
      showToastNotification(`You're now buddies with ${targetName}!`);
    };

    window.addEventListener('buddy-request-accepted', handleAccepted as EventListener);
    return () => window.removeEventListener('buddy-request-accepted', handleAccepted as EventListener);
  }, []);

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    // Scroll to initial positions with a slight delay to ensure DOM is ready
    setTimeout(() => {
      if (hourScrollRef.current) {
        const hourIndex = hours.indexOf(selectedHour);
        hourScrollRef.current.scrollTop = hourIndex * 60;
      }
      if (minuteScrollRef.current) {
        minuteScrollRef.current.scrollTop = selectedMinute * 60;
      }
    }, 10);
  }, []);

  const handleHourScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / 60);
    setSelectedHour(hours[index] || 1);
  };

  const handleMinuteScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / 60);
    setSelectedMinute(minutes[index] || 0);
  };

  const handleSetAlarm = () => {
    const formattedTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    markAlarmAsSetup(formattedTime);
    navigate('/goodnight', { state: { alarmTime: formattedTime } });
  };

  const handleAddBuddy = () => {
    if (buddyUsername.trim()) {
      const username = buddyUsername.trim();

      // Check buddy limit
      if (!canAddMoreBuddies()) {
        const { current, max } = getBuddyCount();
        showToastNotification(`Buddy limit reached (${current}/${max}). Remove a buddy to add more.`);
        setBuddyUsername("");
        setShowAddBuddy(false);
        return;
      }

      // Check if already a buddy
      if (getBuddies().some(b => b.name.toLowerCase() === username.toLowerCase())) {
        showToastNotification(`${username} is already in your buddy chain`);
        setBuddyUsername("");
        setShowAddBuddy(false);
        return;
      }

      // Check if already pending
      if (hasPendingRequest(username)) {
        showToastNotification(`Request to ${username} is already pending`);
        setBuddyUsername("");
        setShowAddBuddy(false);
        return;
      }

      // Create pending request
      addPendingRequest('buddy', username);
      setPendingRequests(getPendingRequests());
      showToastNotification(`Request sent to ${username}`);

      setBuddyUsername("");
      setShowAddBuddy(false);
    }
  };

  const handleAcceptRequest = (requestId: string, fromUsername: string) => {
    // Check buddy limit
    if (!canAddMoreBuddies()) {
      const { current, max } = getBuddyCount();
      showToastNotification(`Buddy limit reached (${current}/${max}). Remove a buddy first.`);
      return;
    }

    setProcessingRequestId(requestId);

    setTimeout(() => {
      acceptIncomingRequest(requestId);
      addBuddy(fromUsername);
      setIncomingRequests(getIncomingRequests());
      setBuddies(getBuddies());
      setProcessingRequestId(null);
      showToastNotification(`You're now buddies with ${fromUsername}!`);
    }, 300);
  };

  const handleDeclineRequest = (requestId: string, fromUsername: string) => {
    setProcessingRequestId(requestId);

    setTimeout(() => {
      declineIncomingRequest(requestId);
      setIncomingRequests(getIncomingRequests());
      setProcessingRequestId(null);
      showToastNotification(`Declined buddy request from ${fromUsername}`);
    }, 300);
  };

  const handleJoinChain = () => {
    if (chainCode.trim()) {
      const code = chainCode.trim().toUpperCase();

      // Check if already pending
      if (hasPendingRequest(code)) {
        showToastNotification(`Request to join ${code} is already pending`);
        setChainCode("");
        setShowJoinChain(false);
        return;
      }

      // Create pending request
      addPendingRequest('chain', code);
      setPendingRequests(getPendingRequests());
      showToastNotification(`Request sent to join chain ${code}`);

      setChainCode("");
      setShowJoinChain(false);
    }
  };

  const handleRemoveBuddy = (name: string) => {
    if (confirm(`Remove ${name} from your buddy chain?`)) {
      // Animate removal
      setRemovingBuddyName(name);

      setTimeout(() => {
        const success = removeBuddy(name);
        if (success) {
          const updatedBuddies = getBuddies();
          setBuddies(updatedBuddies);
          showToastNotification(`${name} removed from your buddy chain`);
        }
        setRemovingBuddyName(null);
      }, 300);
    }
  };

  const handleCancelRequest = (id: string) => {
    const request = pendingRequests.find(r => r.id === id);
    if (request && confirm(`Cancel request to ${request.targetName}?`)) {
      // Animate removal
      setRemovingRequestId(id);

      setTimeout(() => {
        const success = cancelPendingRequest(id);
        if (success) {
          setPendingRequests(getPendingRequests());
          showToastNotification('Request cancelled');
        }
        setRemovingRequestId(null);
      }, 300);
    }
  };

  return (
    <div className="bg-[#f0e100] relative size-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-none h-[80px] flex items-center justify-center border-b border-black/10">
        <div className="flex flex-col font-['ABeeZee:Regular',sans-serif] items-center">
          <p className="text-[20px] text-[#180f2a]">
            <span className="font-['Miniver:Regular',sans-serif]">N</span>
            <span className="font-['Michroma:Regular',sans-serif]">ooze</span>
          </p>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-[100px]">
        <div className="max-w-[400px] mx-auto py-6 space-y-6">

          {/* Date Display */}
          <div className="text-center">
            <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-[#180f2a]/60 mb-1">
              {formatDate()}
            </p>
          </div>

          {/* Greeting */}
          <div className="text-center">
            <h1 className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[32px] text-[#180f2a] mb-1">
              Set Your Alarm
            </h1>
            <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/70">
              Get ready for a better tomorrow
            </p>
          </div>

          {/* Next Rank Indicator */}
          <div className="bg-white rounded-[24px] p-5 shadow-md border border-black/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-[32px]">{currentRank.icon}</div>
                <div>
                  <p className="font-['Manrope:Bold',sans-serif] font-bold text-[16px] text-[#180f2a]">
                    {currentRank.name}
                  </p>
                  <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/60">
                    {userProfile.points} points
                  </p>
                </div>
              </div>

              {nextRankInfo.rank && (
                <div className="text-right">
                  <p className="font-['Manrope:SemiBold',sans-serif] text-[11px] text-[#180f2a]/50 mb-1">
                    Next: {nextRankInfo.rank.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-[#834dfb]" strokeWidth={2.5} />
                    <p className="font-['Manrope:Bold',sans-serif] text-[12px] text-[#834dfb]">
                      {nextRankInfo.pointsNeeded} pts
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {nextRankInfo.rank && (
              <div className="space-y-2">
                <div className="w-full bg-black/5 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(100, ((userProfile.points - currentRank.minPoints) / (nextRankInfo.rank.minPoints - currentRank.minPoints)) * 100)}%`,
                      backgroundColor: currentRank.color,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-['Manrope:Medium',sans-serif] text-[#180f2a]/50">
                  <span>{currentRank.minPoints} pts</span>
                  <span>{nextRankInfo.rank.minPoints} pts</span>
                </div>
              </div>
            )}

            {!nextRankInfo.rank && (
              <div className="text-center py-2">
                <p className="font-['Manrope:SemiBold',sans-serif] text-[13px] text-[#f0e100]">
                  🏆 Max Rank Achieved!
                </p>
              </div>
            )}
          </div>

          {/* Time Picker - Scroll Style */}
          <div className="bg-[#180f2a] rounded-[28px] p-8 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-[#f0e100]" strokeWidth={2.5} />
              <h3 className="font-['Manrope:Bold',sans-serif] font-bold text-[16px] text-[#f0e100]">
                Wake-up Time
              </h3>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Hour Picker */}
              <div className="relative h-[180px] w-[80px]">
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="absolute top-[60px] h-[60px] w-full bg-[#834dfb]/20 rounded-[12px]" />
                </div>
                <div
                  ref={hourScrollRef}
                  onScroll={handleHourScroll}
                  className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none' }}
                >
                  <div className="h-[60px]" /> {/* Top padding */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={`h-[60px] snap-center flex items-center justify-center font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[40px] transition-all ${
                        hour === selectedHour
                          ? "text-[#f0e100] scale-110"
                          : "text-white/30 scale-90"
                      }`}
                    >
                      {hour.toString().padStart(2, '0')}
                    </div>
                  ))}
                  <div className="h-[60px]" /> {/* Bottom padding */}
                </div>
              </div>

              <div className="text-[36px] font-bold text-[#f0e100]">:</div>

              {/* Minute Picker */}
              <div className="relative h-[180px] w-[80px]">
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="absolute top-[60px] h-[60px] w-full bg-[#834dfb]/20 rounded-[12px]" />
                </div>
                <div
                  ref={minuteScrollRef}
                  onScroll={handleMinuteScroll}
                  className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none' }}
                >
                  <div className="h-[60px]" /> {/* Top padding */}
                  {minutes.map((minute) => (
                    <div
                      key={minute}
                      className={`h-[60px] snap-center flex items-center justify-center font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[40px] transition-all ${
                        minute === selectedMinute
                          ? "text-[#f0e100] scale-110"
                          : "text-white/30 scale-90"
                      }`}
                    >
                      {minute.toString().padStart(2, '0')}
                    </div>
                  ))}
                  <div className="h-[60px]" /> {/* Bottom padding */}
                </div>
              </div>
            </div>

            {/* AM/PM Toggle */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setSelectedPeriod("AM")}
                className={`px-6 py-2 rounded-[12px] font-['Manrope:Bold',sans-serif] font-bold text-[16px] transition-all ${
                  selectedPeriod === "AM"
                    ? "bg-[#f0e100] text-[#180f2a]"
                    : "bg-white/10 text-white/50"
                }`}
              >
                AM
              </button>
              <button
                onClick={() => setSelectedPeriod("PM")}
                className={`px-6 py-2 rounded-[12px] font-['Manrope:Bold',sans-serif] font-bold text-[16px] transition-all ${
                  selectedPeriod === "PM"
                    ? "bg-[#f0e100] text-[#180f2a]"
                    : "bg-white/10 text-white/50"
                }`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Sound Selection */}
          <div className="bg-white rounded-[24px] p-5 shadow-md border border-black/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-['Manrope:Bold',sans-serif] font-bold text-[15px] text-[#180f2a]">
                Alarm Sound
              </h3>
              {alarmSettings.selectedSound && (
                <button
                  onClick={handleReplayCurrentSound}
                  className="w-8 h-8 rounded-full bg-[#834dfb]/10 flex items-center justify-center hover:bg-[#834dfb]/20 transition-colors"
                >
                  <Volume2 className={`w-4 h-4 text-[#834dfb] ${previewingSound === alarmSettings.selectedSound.id ? 'animate-pulse' : ''}`} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Selected Sound Display */}
            {alarmSettings.selectedSound && (
              <div className="mb-3 p-3 bg-[#834dfb]/5 rounded-[12px] border border-[#834dfb]/20">
                <div className="flex items-center gap-2">
                  <span className="text-[16px]">{getCategoryIcon(alarmSettings.selectedSound.category)}</span>
                  <div className="flex-1">
                    <p className="font-['Manrope:SemiBold',sans-serif] text-[13px] text-[#834dfb]">
                      {alarmSettings.selectedSound.name}
                    </p>
                    <p className="font-['Manrope:Regular',sans-serif] text-[11px] text-[#834dfb]/70">
                      {alarmSettings.mode === 'random' ? 'Random Selection' : 'Custom Selection'}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#834dfb] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleRandomSound}
                className="p-4 rounded-[16px] border-2 border-[#834dfb] bg-[#834dfb]/10 hover:bg-[#834dfb]/20 transition-all"
              >
                <Shuffle className="w-6 h-6 mx-auto mb-2 text-[#834dfb]" strokeWidth={2.5} />
                <p className="text-[13px] font-['Manrope:SemiBold',sans-serif] text-center text-[#834dfb]">
                  Random
                </p>
              </button>

              <button
                onClick={handleCustomSound}
                className="p-4 rounded-[16px] border-2 border-[#834dfb] bg-[#834dfb]/10 hover:bg-[#834dfb]/20 transition-all"
              >
                <Music className="w-6 h-6 mx-auto mb-2 text-[#834dfb]" strokeWidth={2.5} />
                <p className="text-[13px] font-['Manrope:SemiBold',sans-serif] text-center text-[#834dfb]">
                  Custom
                </p>
              </button>
            </div>
          </div>

          {/* Consequences */}
          <div className="bg-white rounded-[24px] p-5 shadow-md border border-black/5">
            <h3 className="font-['Manrope:Bold',sans-serif] font-bold text-[15px] text-[#180f2a] mb-3">
              If you miss your alarm
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-[#fef3f2] rounded-[12px] border border-[#ef4444]/20">
                <div className="w-8 h-8 rounded-full bg-[#ef4444] flex items-center justify-center flex-shrink-0">
                  <Coins className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-['Manrope:SemiBold',sans-serif] text-[13px] text-[#180f2a]">
                  Lose 15 points
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#fef3f2] rounded-[12px] border border-[#ef4444]/20">
                <div className="w-8 h-8 rounded-full bg-[#ef4444] flex items-center justify-center flex-shrink-0">
                  <Flame className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-['Manrope:SemiBold',sans-serif] text-[13px] text-[#180f2a]">
                  Reset your streak
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#fef3f2] rounded-[12px] border border-[#ef4444]/20">
                <div className="w-8 h-8 rounded-full bg-[#ef4444] flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-['Manrope:SemiBold',sans-serif] text-[13px] text-[#180f2a]">
                  Notify your buddies
                </span>
              </div>
            </div>
          </div>

          {/* Buddy Section */}
          <div className="bg-white rounded-[24px] p-5 shadow-md border border-black/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-['Manrope:Bold',sans-serif] font-bold text-[15px] text-[#180f2a]">
                  Morning Buddies
                </h3>
                <p className="font-['Manrope:Regular',sans-serif] text-[11px] text-[#180f2a]/50">
                  {buddies.length}/{getBuddyCount().max} buddies
                </p>
              </div>
              <button
                onClick={() => setShowManageBuddies(true)}
                className="text-[#834dfb] font-['Manrope:SemiBold',sans-serif] text-[13px]"
              >
                Manage {incomingRequests.length > 0 && (
                  <span className="ml-1 bg-[#ef4444] text-white text-[10px] px-2 py-0.5 rounded-full">
                    {incomingRequests.length}
                  </span>
                )}
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowAddBuddy(true)}
                className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-[#834dfb]/10 border-2 border-[#834dfb] hover:bg-[#834dfb]/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#834dfb] flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-['Manrope:Bold',sans-serif] text-[14px] text-[#834dfb]">
                  Add a buddy
                </span>
              </button>

              <button
                onClick={() => setShowJoinChain(true)}
                className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-[#834dfb]/10 border-2 border-[#834dfb] hover:bg-[#834dfb]/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#834dfb] flex items-center justify-center flex-shrink-0">
                  <Link2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-['Manrope:Bold',sans-serif] text-[14px] text-[#834dfb]">
                  Join buddy chain
                </span>
              </button>
            </div>

            {/* Incoming Requests Preview */}
            {incomingRequests.length > 0 && (
              <div className="mt-3 pt-3 border-t border-black/5">
                <p className="text-[12px] font-['Manrope:SemiBold',sans-serif] text-[#ef4444] mb-2 flex items-center gap-1">
                  <Bell className="w-3 h-3" strokeWidth={2.5} />
                  {incomingRequests.length} new buddy request{incomingRequests.length > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Pending Requests Preview */}
            {pendingRequests.length > 0 && (
              <div className="mt-3 pt-3 border-t border-black/5">
                <p className="text-[12px] font-['Manrope:SemiBold',sans-serif] text-[#f0e100] mb-2 flex items-center gap-1">
                  <Loader className="w-3 h-3 animate-spin" strokeWidth={2.5} />
                  {pendingRequests.length} sent request{pendingRequests.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Set Alarm Button */}
          <button
            onClick={handleSetAlarm}
            className="w-full bg-[#180f2a] text-[#f0e100] py-5 rounded-[20px] font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[18px] shadow-2xl active:scale-[0.98] transition-transform border-2 border-[#180f2a]"
          >
            Set Alarm
          </button>
        </div>
      </div>

      {/* Add Buddy Modal */}
      {showAddBuddy && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowAddBuddy(false)}>
          <div
            className="bg-white rounded-t-[28px] w-full max-w-[400px] p-6 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-black/10 rounded-full mx-auto mb-6" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#834dfb]/10 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-[#834dfb]" strokeWidth={2.5} />
              </div>

              <div>
                <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a] mb-1">
                  Add a Buddy
                </h2>
                <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                  Enter their username
                </p>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={buddyUsername}
                onChange={(e) => setBuddyUsername(e.target.value)}
                placeholder="@username"
                className="w-full bg-[#f5f3ff] border-2 border-[#834dfb]/20 rounded-[12px] p-4 text-[16px] font-['Manrope:Regular',sans-serif] focus:outline-none focus:border-[#834dfb]"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddBuddy(false)}
                className="flex-1 py-3 rounded-[12px] border-2 border-black/10 font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#180f2a]/60"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBuddy}
                disabled={!buddyUsername.trim()}
                className="flex-1 py-3 rounded-[12px] bg-[#834dfb] text-white font-['Manrope:Bold',sans-serif] text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Buddy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Chain Modal */}
      {showJoinChain && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowJoinChain(false)}>
          <div
            className="bg-white rounded-t-[28px] w-full max-w-[400px] p-6 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-black/10 rounded-full mx-auto mb-6" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#834dfb]/10 flex items-center justify-center">
                <Link2 className="w-8 h-8 text-[#834dfb]" strokeWidth={2.5} />
              </div>

              <div>
                <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a] mb-1">
                  Join Buddy Chain
                </h2>
                <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                  Enter the chain code
                </p>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={chainCode}
                onChange={(e) => setChainCode(e.target.value)}
                placeholder="ABC123"
                className="w-full bg-[#f5f3ff] border-2 border-[#834dfb]/20 rounded-[12px] p-4 text-[16px] font-['Manrope:Regular',sans-serif] focus:outline-none focus:border-[#834dfb] uppercase"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinChain(false)}
                className="flex-1 py-3 rounded-[12px] border-2 border-black/10 font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#180f2a]/60"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinChain}
                disabled={!chainCode.trim()}
                className="flex-1 py-3 rounded-[12px] bg-[#834dfb] text-white font-['Manrope:Bold',sans-serif] text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Chain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Buddies Modal */}
      {showManageBuddies && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowManageBuddies(false)}>
          <div
            className="bg-white rounded-t-[28px] w-full max-w-[400px] p-6 pb-8 animate-slide-up max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-black/10 rounded-full mx-auto mb-6" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#834dfb]/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-[#834dfb]" strokeWidth={2.5} />
              </div>

              <div>
                <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a] mb-1">
                  Manage Buddies
                </h2>
                <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                  {buddies.length}/{getBuddyCount().max} buddies{incomingRequests.length > 0 ? ` • ${incomingRequests.length} new` : ''}
                </p>
              </div>
            </div>

            {/* Incoming Requests Section */}
            {incomingRequests.length > 0 && (
              <>
                <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[14px] text-[#180f2a] mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#ef4444]" strokeWidth={2.5} />
                  Incoming Requests
                </h3>
                <div className="space-y-2 mb-6">
                  {incomingRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-3 bg-[#834dfb]/5 border border-[#834dfb]/30 rounded-[12px] ${
                        processingRequestId === request.id ? 'animate-slide-out-right' : 'animate-scale-in'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#834dfb]/20 flex items-center justify-center">
                          <UserPlus className="w-5 h-5 text-[#834dfb]" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <p className="font-['Manrope:Medium',sans-serif] font-medium text-[14px] text-[#180f2a]">
                            {request.fromUsername}
                          </p>
                          <p className="font-['Manrope:Regular',sans-serif] text-[11px] text-[#834dfb]">
                            wants to be your buddy
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id, request.fromUsername)}
                          disabled={processingRequestId === request.id}
                          className="flex-1 py-2 rounded-[10px] bg-[#10b981] text-white font-['Manrope:SemiBold',sans-serif] text-[13px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request.id, request.fromUsername)}
                          disabled={processingRequestId === request.id}
                          className="flex-1 py-2 rounded-[10px] bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 font-['Manrope:SemiBold',sans-serif] text-[13px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Sent Requests Section */}
            {pendingRequests.length > 0 && (
              <>
                <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[14px] text-[#180f2a] mb-3 flex items-center gap-2">
                  <Loader className="w-4 h-4 text-[#f0e100] animate-spin" strokeWidth={2.5} />
                  Sent Requests
                </h3>
                <div className="space-y-2 mb-6">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`flex items-center justify-between p-3 bg-[#f0e100]/5 border border-[#f0e100]/30 rounded-[12px] ${
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
                        <X className="w-4 h-4 text-[#ef4444]" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Active Buddies Section */}
            {buddies.length > 0 && (
              <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[14px] text-[#180f2a] mb-3">
                Active Buddies
              </h3>
            )}

            {buddies.length === 0 && pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[14px] text-[#180f2a]/60 font-['Manrope:Regular',sans-serif]">
                  No buddies yet. Add some to stay motivated!
                </p>
              </div>
            ) : buddies.length > 0 ? (
              <div className="space-y-2 mb-4">
                {buddies.map((buddy, index) => {
                  const isNew = isNewBuddy(buddy);
                  const isRemoving = removingBuddyName === buddy.name;
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 bg-[#f5f3ff] rounded-[12px] ${
                        isRemoving ? 'animate-slide-out-right' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                          isNew ? "bg-[#834dfb]/10" : "bg-[#f0e100]/10"
                        }`}>
                          {isNew ? (
                            <Calendar className="w-5 h-5 text-[#834dfb]" strokeWidth={2} />
                          ) : (
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
                          )}
                        </div>
                        <div>
                          <p className="font-['Manrope:Medium',sans-serif] font-medium text-[14px] text-[#180f2a]">
                            {buddy.name}
                          </p>
                          <p className="font-['Manrope:Regular',sans-serif] text-[11px] text-[#180f2a]/50">
                            {isNew ? 'New buddy' : buddy.awake ? `${buddy.streak} day streak` : 'Not awake'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveBuddy(buddy.name)}
                        className="w-8 h-8 rounded-full bg-[#ef4444]/10 flex items-center justify-center hover:bg-[#ef4444]/20 transition-colors"
                      >
                        <X className="w-4 h-4 text-[#ef4444]" strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <button
              onClick={() => setShowManageBuddies(false)}
              className="w-full py-3 rounded-[12px] bg-[#834dfb] text-white font-['Manrope:Bold',sans-serif] text-[16px]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Sound Selection Modal */}
      {showSoundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowSoundModal(false)}>
          <div
            className="bg-white rounded-t-[28px] w-full max-w-[400px] p-6 pb-8 animate-slide-up max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-black/10 rounded-full mx-auto mb-6" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#834dfb]/10 flex items-center justify-center">
                <Music className="w-8 h-8 text-[#834dfb]" strokeWidth={2.5} />
              </div>

              <div>
                <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a] mb-1">
                  Choose Alarm Sound
                </h2>
                <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                  Select your wake-up sound
                </p>
              </div>
            </div>

            {/* Categorized Sounds */}
            {(['gentle', 'energetic', 'nature', 'classic'] as const).map((category) => {
              const categorySounds = alarmSounds.filter(s => s.category === category);
              return (
                <div key={category} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[20px]">{getCategoryIcon(category)}</span>
                    <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[14px] text-[#180f2a] capitalize">
                      {category}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {categorySounds.map((sound) => (
                      <div
                        key={sound.id}
                        className={`flex items-center justify-between p-3 rounded-[12px] border-2 transition-all ${
                          alarmSettings.selectedSound?.id === sound.id
                            ? 'border-[#834dfb] bg-[#834dfb]/10'
                            : 'border-black/5 bg-white hover:border-[#834dfb]/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <p className="font-['Manrope:Medium',sans-serif] font-medium text-[14px] text-[#180f2a]">
                            {sound.name}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreviewSound(sound.id)}
                            className="w-8 h-8 rounded-full bg-[#834dfb]/10 flex items-center justify-center hover:bg-[#834dfb]/20 transition-colors"
                          >
                            <Play className={`w-4 h-4 text-[#834dfb] ${previewingSound === sound.id ? 'animate-pulse' : ''}`} strokeWidth={2.5} />
                          </button>

                          <button
                            onClick={() => handleSelectSound(sound)}
                            className={`px-4 py-2 rounded-[10px] font-['Manrope:SemiBold',sans-serif] text-[13px] transition-all ${
                              alarmSettings.selectedSound?.id === sound.id
                                ? 'bg-[#834dfb] text-white'
                                : 'bg-[#834dfb]/10 text-[#834dfb] hover:bg-[#834dfb]/20'
                            }`}
                          >
                            {alarmSettings.selectedSound?.id === sound.id ? 'Selected' : 'Use'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setShowSoundModal(false)}
              className="w-full py-3 rounded-[12px] bg-[#834dfb] text-white font-['Manrope:Bold',sans-serif] text-[16px]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-scale-in">
          <div className="bg-[#180f2a] text-white px-6 py-3 rounded-[16px] shadow-2xl flex items-center gap-3 border-2 border-[#f0e100]">
            <CheckCircle className="w-5 h-5 text-[#f0e100]" strokeWidth={2.5} />
            <p className="font-['Manrope:SemiBold',sans-serif] text-[14px]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Fixed */}
      <div className="flex-none h-[90px] bg-[#180f2a] border-t-2 border-[#f0e100] px-6">
        <div className="max-w-[400px] mx-auto h-full flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full bg-[#f0e100] flex items-center justify-center shadow-lg shadow-[#f0e100]/50">
              <Clock className="w-6 h-6 text-[#180f2a]" strokeWidth={2.5} />
            </div>
          </button>
          <button onClick={() => navigate('/notifications')} className="flex flex-col items-center gap-1 min-w-[60px] relative">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            </div>
            {notificationCount > 0 && (
              <div className="absolute top-0 right-3 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center border-2 border-[#180f2a]">
                <span className="text-white font-['Manrope:Bold',sans-serif] text-[10px]">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              </div>
            )}
          </button>
          <button onClick={() => navigate('/buddy')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            </div>
          </button>
          <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </button>
          <button onClick={() => navigate('/account')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-white/40" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
