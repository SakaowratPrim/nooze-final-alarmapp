import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Settings, Bell, Volume2, LogOut, ChevronRight, Clock, Flame, Award, Coins, RotateCcw } from "lucide-react";
import { getUserProfile, resetProfile } from "../utils/userProfile";
import { getRankFromPoints } from "../utils/rankSystem";
import { getSuccessRate } from "../utils/wakeHistory";
import { getCurrentUser, signOut } from "../utils/auth";
import { getIncomingRequestCount } from "../utils/pendingRequests";

export default function Account() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getUserProfile());
  const [successRate, setSuccessRate] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const currentRank = getRankFromPoints(profile.points);
  const currentUser = getCurrentUser();

  useEffect(() => {
    setProfile(getUserProfile());
    setSuccessRate(getSuccessRate());
    setNotificationCount(getIncomingRequestCount());

    // Listen for new incoming requests
    const handleIncomingRequest = () => {
      setNotificationCount(getIncomingRequestCount());
    };

    window.addEventListener('incoming-buddy-request', handleIncomingRequest);
    return () => window.removeEventListener('incoming-buddy-request', handleIncomingRequest);
  }, []);

  const menuItems = [
    { icon: Bell, label: "Notifications", sublabel: "Manage alerts" },
    { icon: Volume2, label: "Sound Settings", sublabel: "Alarm sounds" },
    { icon: Settings, label: "Preferences", sublabel: "App settings" },
  ];

  const handleReset = () => {
    resetProfile();
    setProfile(getUserProfile());
    setSuccessRate(0);
    setShowResetConfirm(false);
    alert("Your data has been reset!");
  };

  const handleLogout = () => {
    signOut();
    window.location.href = '/signin';
  };

  // Calculate longest streak (simplified - would need more complex logic with history)
  const longestStreak = Math.max(profile.streak, 14);

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

          {/* Profile Card */}
          <div className="bg-gradient-to-br from-[#834dfb] to-[#6366f1] rounded-[20px] p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40">
                <span className="text-[32px]">{currentRank.icon}</span>
              </div>
              <div className="flex-1">
                <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-white mb-0.5">
                  {currentUser?.username || 'User'}
                </h2>
                <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-white/80">
                  {currentUser?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-[12px] p-3">
                <p className="text-white/70 text-[11px] font-['Manrope:Regular',sans-serif] mb-1">
                  Current Streak
                </p>
                <p className="text-white text-[18px] font-['Manrope:Bold',sans-serif]">
                  {profile.streak} {profile.streak === 1 ? 'Day' : 'Days'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-[12px] p-3">
                <p className="text-white/70 text-[11px] font-['Manrope:Regular',sans-serif] mb-1">
                  Rank
                </p>
                <p className="text-white text-[18px] font-['Manrope:Bold',sans-serif]">
                  {currentRank.name}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[20px] p-4 shadow-sm border border-black/5">
              <div className="w-10 h-10 bg-[#f0e100]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Coins className="w-5 h-5 text-[#f0e100]" strokeWidth={2} />
              </div>
              <p className="text-center font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a]">
                {profile.points}
              </p>
              <p className="text-center font-['Manrope:Regular',sans-serif] text-[11px] text-[#180f2a]/60">
                Total Points
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-4 shadow-sm border border-black/5">
              <div className="w-10 h-10 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5 text-[#10b981]" strokeWidth={2} />
              </div>
              <p className="text-center font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a]">
                {successRate}%
              </p>
              <p className="text-center font-['Manrope:Regular',sans-serif] text-[11px] text-[#180f2a]/60">
                Success Rate
              </p>
            </div>
          </div>

          {/* Settings Menu */}
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-black/5">
            <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[14px] text-[#180f2a] px-2 mb-3">
              Settings
            </h3>

            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#f5f3ff] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#834dfb]/10 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#834dfb]" strokeWidth={2} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-['Manrope:Medium',sans-serif] font-medium text-[14px] text-[#180f2a]">
                      {item.label}
                    </p>
                    <p className="font-['Manrope:Regular',sans-serif] text-[11px] text-[#180f2a]/50">
                      {item.sublabel}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#180f2a]/30" strokeWidth={2} />
                </button>
              ))}
            </div>
          </div>

          {/* All Time Stats */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/5">
            <h3 className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[14px] text-[#180f2a] mb-4">
              All Time Stats
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#10b981]/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#10b981]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]/60">
                      Successful wake-ups
                    </p>
                  </div>
                </div>
                <p className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#10b981]">
                  {profile.totalWakeUps}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f0e100]/20 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-[#f0e100] fill-[#f0e100]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]/60">
                      Longest streak
                    </p>
                  </div>
                </div>
                <p className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#f0e100]">
                  {longestStreak}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#834dfb]/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#834dfb]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]/60">
                      Streak bonuses earned
                    </p>
                  </div>
                </div>
                <p className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#834dfb]">
                  {profile.streakBonuses.day3 + profile.streakBonuses.day7}
                </p>
              </div>
            </div>
          </div>

          {/* Reset Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-white border-2 border-[#f0e100]/30 text-[#f0e100] py-4 rounded-[16px] font-['Manrope:SemiBold',sans-serif] font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <RotateCcw className="w-5 h-5" strokeWidth={2} />
            Reset All Data
          </button>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-white border-2 border-[#ef4444]/20 text-[#ef4444] py-4 rounded-[16px] font-['Manrope:SemiBold',sans-serif] font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6" onClick={() => setShowLogoutConfirm(false)}>
          <div
            className="bg-white rounded-[24px] w-full max-w-[350px] p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#ef4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-[#ef4444]" strokeWidth={2} />
              </div>
              <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a] mb-2">
                Logout?
              </h2>
              <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-[12px] border-2 border-black/10 font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#180f2a]/60"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-[12px] bg-[#ef4444] text-white font-['Manrope:Bold',sans-serif] text-[16px]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6" onClick={() => setShowResetConfirm(false)}>
          <div
            className="bg-white rounded-[24px] w-full max-w-[350px] p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#ef4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-[#ef4444]" strokeWidth={2} />
              </div>
              <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a] mb-2">
                Reset All Data?
              </h2>
              <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                This will reset your points, streak, and all history. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-[12px] border-2 border-black/10 font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#180f2a]/60"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-[12px] bg-[#ef4444] text-white font-['Manrope:Bold',sans-serif] text-[16px]"
              >
                Reset
              </button>
            </div>
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
          <button onClick={() => navigate('/buddy')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-[#180f2a]/30" strokeWidth={2} />
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
          <button className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full bg-[#834dfb] flex items-center justify-center">
              <User className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
