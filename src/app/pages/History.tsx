import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, XCircle, Clock, Bell, Flame, ChevronRight, TrendingUp, Award, Edit3 } from "lucide-react";
import { getWakeHistory, getSuccessRate, updateEntryNote, type WakeHistoryEntry } from "../utils/wakeHistory";
import { getUserProfile } from "../utils/userProfile";
import { getIncomingRequestCount } from "../utils/pendingRequests";

export default function History() {
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] = useState<WakeHistoryEntry | null>(null);
  const [history, setHistory] = useState<WakeHistoryEntry[]>([]);
  const [successRate, setSuccessRate] = useState(0);
  const [profile, setProfile] = useState(getUserProfile());
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadedHistory = getWakeHistory();
    setHistory(loadedHistory);
    setSuccessRate(getSuccessRate());
    setProfile(getUserProfile());
    setNotificationCount(getIncomingRequestCount());

    // Listen for new incoming requests
    const handleIncomingRequest = () => {
      setNotificationCount(getIncomingRequestCount());
    };

    window.addEventListener('incoming-buddy-request', handleIncomingRequest);
    return () => window.removeEventListener('incoming-buddy-request', handleIncomingRequest);
  }, []);

  const handleSaveNote = () => {
    if (selectedEntry) {
      updateEntryNote(selectedEntry.date, noteText);
      // Refresh history
      const updatedHistory = getWakeHistory();
      setHistory(updatedHistory);
      // Update selected entry
      const updatedEntry = updatedHistory.find(h => h.date === selectedEntry.date);
      if (updatedEntry) {
        setSelectedEntry(updatedEntry);
      }
      setEditingNote(false);
    }
  };

  const handleOpenDetail = (entry: WakeHistoryEntry) => {
    setSelectedEntry(entry);
    setNoteText(entry.note || "");
    setEditingNote(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const successCount = history.filter(h => h.success).length;
  const missedCount = history.filter(h => !h.success).length;

  const formatCurrentDate = () => {
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
        <div className="max-w-[400px] mx-auto py-6">

          {/* Date Display */}
          <div className="text-center mb-4">
            <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-[#180f2a]/60">
              {formatCurrentDate()}
            </p>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="font-['Manrope:Bold',sans-serif] font-bold text-[28px] text-[#180f2a] mb-1">
              History
            </h1>
            <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
              Track your wake-up journey
            </p>
          </div>

          {/* Stats Overview */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/5 mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                </div>
                <p className="font-['Manrope:Bold',sans-serif] font-bold text-[24px] text-[#180f2a]">
                  {successCount}
                </p>
                <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/60">Success</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#ef4444]/10 flex items-center justify-center mx-auto mb-2">
                  <XCircle className="w-6 h-6 text-[#ef4444]" strokeWidth={2} />
                </div>
                <p className="font-['Manrope:Bold',sans-serif] font-bold text-[24px] text-[#180f2a]">
                  {missedCount}
                </p>
                <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/60">Missed</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#834dfb]/10 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-[#834dfb]" strokeWidth={2} />
                </div>
                <p className="font-['Manrope:Bold',sans-serif] font-bold text-[24px] text-[#180f2a]">
                  {successRate}%
                </p>
                <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/60">Rate</p>
              </div>
            </div>
          </div>

          {/* Total Stats */}
          <div className="bg-gradient-to-br from-[#834dfb] to-[#6366f1] rounded-[20px] p-5 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-white/80 mb-1">
                  Total Wake-ups
                </p>
                <p className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[32px] text-white leading-none">
                  {profile.totalWakeUps}
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Award className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* History List */}
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-[#180f2a]/20 mx-auto mb-4" strokeWidth={1.5} />
              <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                No history yet. Start your wake-up journey!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry, index) => (
                <button
                  key={index}
                  onClick={() => handleOpenDetail(entry)}
                  className="w-full bg-white rounded-[16px] p-4 shadow-sm border border-black/5 hover:bg-[#f5f3ff] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      entry.success ? "bg-[#10b981]/10" : "bg-[#ef4444]/10"
                    }`}>
                      {entry.success ? (
                        <CheckCircle2 className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                      ) : (
                        <XCircle className="w-6 h-6 text-[#ef4444]" strokeWidth={2} />
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold text-[15px] text-[#180f2a] mb-0.5">
                        {formatDate(entry.date)}
                      </p>
                      <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-[#180f2a]/60">
                        {entry.success
                          ? `Woke up at ${entry.alarmTime || formatTime(entry.date)}`
                          : entry.alarmTime ? `Missed ${entry.alarmTime} alarm` : "Alarm missed"
                        }
                      </p>
                      {entry.note && (
                        <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#180f2a]/50 italic mt-1 line-clamp-1">
                          "{entry.note}"
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className={`font-['Manrope:Bold',sans-serif] font-bold text-[16px] ${
                        entry.pointsEarned >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
                      }`}>
                        {entry.pointsEarned >= 0 ? "+" : ""}{entry.pointsEarned}
                      </p>
                      {entry.bonusEarned && (
                        <p className="font-['Manrope:Regular',sans-serif] text-[11px] text-[#f0e100]">
                          +{entry.bonusEarned} bonus
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setSelectedEntry(null)}>
          <div
            className="bg-white rounded-t-[28px] w-full max-w-[400px] p-6 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-black/10 rounded-full mx-auto mb-6" />

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                selectedEntry.success ? "bg-[#10b981]/10" : "bg-[#ef4444]/10"
              }`}>
                {selectedEntry.success ? (
                  <CheckCircle2 className="w-8 h-8 text-[#10b981]" strokeWidth={2} />
                ) : (
                  <XCircle className="w-8 h-8 text-[#ef4444]" strokeWidth={2} />
                )}
              </div>

              <div>
                <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[20px] text-[#180f2a] mb-1">
                  {formatDate(selectedEntry.date)}
                </h2>
                <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/60">
                  {selectedEntry.success
                    ? `Woke up at ${selectedEntry.alarmTime || formatTime(selectedEntry.date)}`
                    : selectedEntry.alarmTime ? `Missed ${selectedEntry.alarmTime} alarm` : "Missed alarm"
                  }
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="bg-[#f5f3ff] rounded-[12px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-[#180f2a]">
                    Points
                  </p>
                  <p className={`font-['Manrope:Bold',sans-serif] font-bold text-[20px] ${
                    selectedEntry.pointsEarned >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
                  }`}>
                    {selectedEntry.pointsEarned >= 0 ? "+" : ""}{selectedEntry.pointsEarned}
                  </p>
                </div>
                {selectedEntry.bonusEarned && (
                  <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-[#f0e100]">
                    Includes +{selectedEntry.bonusEarned} streak bonus
                  </p>
                )}
              </div>

              <div className="bg-[#f5f3ff] rounded-[12px] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-[#180f2a]">
                    Streak at time
                  </p>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[#f0e100] fill-[#f0e100]" strokeWidth={2} />
                    <p className="font-['Manrope:Bold',sans-serif] font-bold text-[18px] text-[#180f2a]">
                      {selectedEntry.streakAtTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-[#f5f3ff] rounded-[12px] p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-[#180f2a]">
                    Notes
                  </p>
                  {!editingNote && (
                    <button
                      onClick={() => setEditingNote(true)}
                      className="flex items-center gap-1 text-[13px] font-['Manrope:Medium',sans-serif] text-[#834dfb]"
                    >
                      <Edit3 className="w-3 h-3" strokeWidth={2.5} />
                      {selectedEntry.note ? "Edit" : "Add"}
                    </button>
                  )}
                </div>

                {editingNote ? (
                  <>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="How did you feel? Why did you miss?"
                      className="w-full bg-white border border-[#834dfb]/20 rounded-[12px] p-3 text-[14px] font-['Manrope:Regular',sans-serif] focus:outline-none focus:border-[#834dfb] resize-none h-24 mb-3"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingNote(false)}
                        className="flex-1 py-2 rounded-[12px] border border-black/10 font-['Manrope:Medium',sans-serif] text-[14px] text-[#180f2a]/60"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNote}
                        className="flex-1 py-2 rounded-[12px] bg-[#834dfb] text-white font-['Manrope:SemiBold',sans-serif] text-[14px]"
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-[#180f2a]/70 min-h-[40px]">
                    {selectedEntry.note || "No notes yet"}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedEntry(null)}
              className="w-full mt-6 py-3 rounded-[12px] bg-[#834dfb] text-white font-['Manrope:Bold',sans-serif] text-[16px]"
            >
              Close
            </button>
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
          <button className="flex flex-col items-center gap-1 min-w-[60px]">
            <div className="w-12 h-12 rounded-full bg-[#834dfb] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
