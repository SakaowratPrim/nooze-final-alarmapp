import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Bell, UserPlus, Check, X, Users } from "lucide-react";
import { getIncomingRequests, acceptIncomingRequest, declineIncomingRequest, type IncomingRequest } from "../utils/pendingRequests";
import { addBuddy, canAddMoreBuddies, getBuddyCount } from "../utils/buddyStorage";

export default function Notifications() {
  const navigate = useNavigate();
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [buddyCount, setBuddyCount] = useState(getBuddyCount());

  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    setIncomingRequests(getIncomingRequests());

    // Listen for new incoming requests
    const handleIncomingRequest = () => {
      setIncomingRequests(getIncomingRequests());
    };

    window.addEventListener('incoming-buddy-request', handleIncomingRequest);
    return () => window.removeEventListener('incoming-buddy-request', handleIncomingRequest);
  }, []);

  const handleAccept = (requestId: string, fromUsername: string) => {
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
      setBuddyCount(getBuddyCount()); // Update buddy count
      setProcessingRequestId(null);
      showToastNotification(`You're now buddies with ${fromUsername}!`);
    }, 300);
  };

  const handleDecline = (requestId: string, fromUsername: string) => {
    setProcessingRequestId(requestId);

    setTimeout(() => {
      declineIncomingRequest(requestId);
      setIncomingRequests(getIncomingRequests());
      setProcessingRequestId(null);
      showToastNotification(`Declined request from ${fromUsername}`);
    }, 300);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (username: string) => {
    const colors = ['#834dfb', '#10b981', '#f0e100', '#ef4444', '#6366f1', '#ec4899'];
    const index = username.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-[#f2f1ec] relative size-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-none h-[80px] flex items-center justify-between px-6 border-b border-black/5 bg-white">
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full bg-[#f5f3ff] flex items-center justify-center hover:bg-[#834dfb]/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#180f2a]" strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <h1 className="font-['Manrope:Bold',sans-serif] font-bold text-[18px] text-[#180f2a]">
            Notifications
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/60">
              {incomingRequests.length} pending
            </p>
            <span className="text-[#180f2a]/30">•</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#834dfb]" strokeWidth={2} />
              <p className="font-['Manrope:SemiBold',sans-serif] text-[12px] text-[#834dfb]">
                {buddyCount.current}/{buddyCount.max}
              </p>
            </div>
          </div>
        </div>

        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-[100px]">
        <div className="max-w-[600px] mx-auto py-6 space-y-4">

          {incomingRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-[#834dfb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-[#834dfb]" strokeWidth={2} />
              </div>
              <p className="font-['Manrope:SemiBold',sans-serif] text-[16px] text-[#180f2a] mb-2">
                All caught up!
              </p>
              <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]/60">
                You have no new notifications
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-[#180f2a] mb-2">
                Buddy Requests
              </h2>

              {incomingRequests.map((request) => (
                <div
                  key={request.id}
                  className={`bg-white rounded-[20px] p-5 shadow-sm border border-black/5 ${
                    processingRequestId === request.id ? 'animate-slide-out-right' : 'animate-scale-in'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-['Manrope:Bold',sans-serif] font-bold text-white text-[14px]"
                      style={{ backgroundColor: getAvatarColor(request.fromUsername) }}
                    >
                      {getInitials(request.fromUsername)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-['Manrope:Bold',sans-serif] font-bold text-[16px] text-[#180f2a]">
                          {request.fromUsername}
                        </p>
                        <span className="px-2 py-0.5 bg-[#834dfb]/10 text-[#834dfb] rounded-full text-[10px] font-['Manrope:SemiBold',sans-serif]">
                          {request.status}
                        </span>
                      </div>
                      <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]/70 mb-1">
                        Wants to be your wake-up buddy
                      </p>
                      <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/50">
                        {formatTimeAgo(request.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAccept(request.id, request.fromUsername)}
                      disabled={processingRequestId === request.id}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] bg-[#10b981] text-white font-['Manrope:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                    >
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(request.id, request.fromUsername)}
                      disabled={processingRequestId === request.id}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] bg-[#ef4444]/10 text-[#ef4444] border-2 border-[#ef4444]/20 font-['Manrope:SemiBold',sans-serif] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                    >
                      <X className="w-5 h-5" strokeWidth={2.5} />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-scale-in">
          <div className="bg-[#180f2a] text-white px-6 py-3 rounded-[16px] shadow-2xl flex items-center gap-3 border-2 border-[#f0e100]">
            <Check className="w-5 h-5 text-[#f0e100]" strokeWidth={2.5} />
            <p className="font-['Manrope:SemiBold',sans-serif] text-[14px]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Fixed */}
      <div className="flex-none h-[90px] bg-white border-t border-black/5 px-6">
        <div className="max-w-[400px] mx-auto h-full flex items-center justify-around">
          <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#180f2a]/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full bg-[#834dfb] flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </button>
          <button onClick={() => navigate('/buddy')} className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#180f2a]/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
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
