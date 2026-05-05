import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Flame, Coins, Award, TrendingUp, CheckCircle2, XCircle, Bell, BellOff, Trash2, Calendar, MessageCircle } from "lucide-react";
import { getBuddies, removeBuddy, isNewBuddy, type Buddy } from "../utils/buddyStorage";
import { getRankFromPoints } from "../utils/rankSystem";

export default function BuddyProfile() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [muted, setMuted] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  useEffect(() => {
    const buddies = getBuddies();
    const foundBuddy = buddies.find(b => b.name === username);
    if (foundBuddy) {
      setBuddy(foundBuddy);
    } else {
      navigate('/buddy');
    }
  }, [username, navigate]);

  if (!buddy) {
    return null;
  }

  const isNew = isNewBuddy(buddy);

  // Mock data for demo (in real app, would fetch from API)
  const buddyData = {
    points: 245,
    successRate: 87,
    longestStreak: 21,
    totalDays: 45,
    usualWakeTime: "6:30 AM",
    mostActiveOn: "Weekdays",
    lastNote: "Feeling energized today! 🌟",
    weekHistory: [
      { day: "Mon", success: true },
      { day: "Tue", success: true },
      { day: "Wed", success: false },
      { day: "Thu", success: true },
      { day: "Fri", success: true },
      { day: "Sat", success: true },
      { day: "Sun", success: true },
    ],
  };

  const rank = getRankFromPoints(buddyData.points);

  const handleRemove = () => {
    removeBuddy(buddy.name);
    navigate('/buddy');
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-[#f2f1ec] relative size-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-none h-[80px] flex items-center justify-between px-6 border-b border-black/5">
        <button
          onClick={() => navigate('/buddy')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-[#f5f3ff] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#180f2a]" strokeWidth={2.5} />
        </button>

        <div className="flex flex-col font-['ABeeZee:Regular',sans-serif] items-center">
          <p className="text-[20px] text-[#180f2a]">
            <span className="font-['Miniver:Regular',sans-serif]">N</span>
            <span className="font-['Michroma:Regular',sans-serif]">ooze</span>
          </p>
        </div>

        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-[120px]">
        <div className="max-w-[400px] mx-auto py-6 space-y-6">

          {/* New Buddy Notice */}
          {isNew && (
            <div className="bg-[#834dfb]/10 border-2 border-[#834dfb]/30 rounded-[20px] p-5 shadow-sm animate-fade-in-down">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#834dfb]" strokeWidth={2} />
                <div>
                  <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-[#834dfb]">
                    New Buddy
                  </p>
                  <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#834dfb]/70">
                    Stats will be available from tomorrow
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-gradient-to-br from-[#834dfb] to-[#6366f1] rounded-[24px] p-6 shadow-lg animate-scale-in">
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${rank.color}, ${rank.color}dd)` }}
              >
                <span className="text-[36px] font-['Manrope:ExtraBold',sans-serif] text-white">
                  {getInitial(buddy.name)}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[28px] text-white mb-1">
                  {buddy.name}
                </h1>
                {!isNew && (
                  <div className="flex items-center gap-2">
                    <span className="text-[20px]">{rank.icon}</span>
                    <p className="font-['Manrope:Bold',sans-serif] text-[15px] text-white/90">
                      {rank.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!isNew && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-[12px] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="w-4 h-4 text-white/70" strokeWidth={2} />
                    <p className="text-white/70 text-[11px] font-['Manrope:Regular',sans-serif]">
                      Points
                    </p>
                  </div>
                  <p className="text-white text-[24px] font-['Manrope:Bold',sans-serif]">
                    {buddyData.points}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-[12px] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-white/70" strokeWidth={2} />
                    <p className="text-white/70 text-[11px] font-['Manrope:Regular',sans-serif]">
                      Streak
                    </p>
                  </div>
                  <p className="text-white text-[24px] font-['Manrope:Bold',sans-serif]">
                    {buddy.streak} {buddy.streak === 1 ? 'Day' : 'Days'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!isNew && (
            <>
              {/* Statistics */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[16px] text-[#180f2a] mb-4">
                  Statistics
                </h3>

                <div className="space-y-4">
                  {/* Success Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#10b981]" strokeWidth={2} />
                        <p className="font-['Manrope:Medium',sans-serif] text-[14px] text-[#180f2a]">
                          Success Rate
                        </p>
                      </div>
                      <p className="font-['Manrope:Bold',sans-serif] text-[18px] text-[#10b981]">
                        {buddyData.successRate}%
                      </p>
                    </div>
                    <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#10b981] rounded-full transition-all duration-1000 ease-out animate-progress-bar"
                        style={{ width: `${buddyData.successRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Longest Streak */}
                  <div className="flex items-center justify-between p-3 bg-[#f0e100]/10 rounded-[12px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#f0e100]/20 rounded-full flex items-center justify-center">
                        <Flame className="w-5 h-5 text-[#f0e100] fill-[#f0e100]" strokeWidth={2} />
                      </div>
                      <p className="font-['Manrope:Medium',sans-serif] text-[14px] text-[#180f2a]">
                        Longest Streak
                      </p>
                    </div>
                    <p className="font-['Manrope:Bold',sans-serif] text-[20px] text-[#f0e100]">
                      {buddyData.longestStreak}
                    </p>
                  </div>

                  {/* Total Days */}
                  <div className="flex items-center justify-between p-3 bg-[#834dfb]/10 rounded-[12px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#834dfb]/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-[#834dfb]" strokeWidth={2} />
                      </div>
                      <p className="font-['Manrope:Medium',sans-serif] text-[14px] text-[#180f2a]">
                        Total Days
                      </p>
                    </div>
                    <p className="font-['Manrope:Bold',sans-serif] text-[20px] text-[#834dfb]">
                      {buddyData.totalDays}
                    </p>
                  </div>
                </div>
              </div>

              {/* Week History */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[16px] text-[#180f2a] mb-4">
                  This Week
                </h3>

                <div className="grid grid-cols-7 gap-2">
                  {buddyData.weekHistory.map((day, index) => (
                    <div
                      key={day.day}
                      className="flex flex-col items-center gap-2 animate-pop-in"
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        day.success
                          ? 'bg-[#10b981]/20'
                          : 'bg-[#ef4444]/20'
                      }`}>
                        {day.success ? (
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" strokeWidth={2.5} />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#ef4444]" strokeWidth={2.5} />
                        )}
                      </div>
                      <p className="font-['Manrope:Regular',sans-serif] text-[11px] text-[#180f2a]/60">
                        {day.day}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[16px] text-[#180f2a] mb-4">
                  Insights
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-[#f5f3ff] rounded-[12px]">
                    <div className="w-2 h-2 rounded-full bg-[#834dfb] mt-1.5" />
                    <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]">
                      Usually wakes up at <span className="font-['Manrope:SemiBold',sans-serif] text-[#834dfb]">{buddyData.usualWakeTime}</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#f5f3ff] rounded-[12px]">
                    <div className="w-2 h-2 rounded-full bg-[#834dfb] mt-1.5" />
                    <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]">
                      Most active on <span className="font-['Manrope:SemiBold',sans-serif] text-[#834dfb]">{buddyData.mostActiveOn}</span>
                    </p>
                  </div>

                  {buddyData.lastNote && (
                    <div className="flex items-start gap-3 p-3 bg-[#f0e100]/10 rounded-[12px]">
                      <div className="w-2 h-2 rounded-full bg-[#f0e100] mt-1.5" />
                      <div>
                        <p className="font-['Manrope:SemiBold',sans-serif] text-[12px] text-[#180f2a]/60 mb-1">
                          Latest note
                        </p>
                        <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]">
                          "{buddyData.lastNote}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {/* Chat Button */}
            <button
              onClick={() => navigate(`/chat/${buddy.name}`)}
              className="w-full flex items-center justify-center gap-3 p-4 bg-[#834dfb] rounded-[16px] shadow-sm hover:bg-[#6d3dd9] transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 text-white" strokeWidth={2} />
              <p className="font-['Manrope:SemiBold',sans-serif] text-[15px] text-white">
                Send Message
              </p>
            </button>

            {/* Mute Toggle */}
            <button
              onClick={() => setMuted(!muted)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-[16px] shadow-sm border border-black/5 hover:border-[#834dfb]/30 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                {muted ? (
                  <BellOff className="w-5 h-5 text-[#180f2a]/60" strokeWidth={2} />
                ) : (
                  <Bell className="w-5 h-5 text-[#834dfb]" strokeWidth={2} />
                )}
                <p className="font-['Manrope:SemiBold',sans-serif] text-[15px] text-[#180f2a]">
                  {muted ? 'Notifications Muted' : 'Notifications Active'}
                </p>
              </div>

              <div className={`w-12 h-7 rounded-full transition-colors ${
                muted ? 'bg-black/10' : 'bg-[#834dfb]'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full mt-1 transition-transform shadow-sm ${
                  muted ? 'ml-1' : 'ml-6'
                }`} />
              </div>
            </button>

            {/* Remove Button */}
            <button
              onClick={() => setShowRemoveConfirm(true)}
              className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-[#ef4444]/20 rounded-[16px] shadow-sm hover:border-[#ef4444]/40 hover:bg-[#ef4444]/5 transition-all active:scale-[0.98]"
            >
              <Trash2 className="w-5 h-5 text-[#ef4444]" strokeWidth={2} />
              <p className="font-['Manrope:SemiBold',sans-serif] text-[15px] text-[#ef4444]">
                Remove Buddy
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6" onClick={() => setShowRemoveConfirm(false)}>
          <div
            className="bg-white rounded-[24px] w-full max-w-[350px] p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#ef4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-[#ef4444]" strokeWidth={2} />
              </div>
              <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a] mb-2">
                Remove {buddy.name}?
              </h2>
              <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                You won't see their wake-up status anymore. You can add them back anytime.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="flex-1 py-3 rounded-[12px] border-2 border-black/10 font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#180f2a]/60"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="flex-1 py-3 rounded-[12px] bg-[#ef4444] text-white font-['Manrope:Bold',sans-serif] text-[16px]"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
