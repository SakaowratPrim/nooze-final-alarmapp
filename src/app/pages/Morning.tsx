import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Sun, Bell, Moon, Stars } from "lucide-react";

export default function Morning() {
  const navigate = useNavigate();
  const location = useLocation();
  const alarmTime = location.state?.alarmTime || '06:30 AM';
  const [showNotification, setShowNotification] = useState(false);

  // Extract period (AM/PM) from alarm time
  const period = alarmTime.includes('PM') ? 'PM' : 'AM';
  const timeOnly = alarmTime.replace(' AM', '').replace(' PM', '');

  // Determine greeting and theme based on period
  const isEvening = period === 'PM';
  const greeting = isEvening ? "Wake Up Time" : "Good Morning";
  const greetingMessage = isEvening ? "Time to wake up!" : "Time to prove you're awake";

  useEffect(() => {
    // แสดง notification หลัง 500ms
    const notifTimer = setTimeout(() => {
      setShowNotification(true);
    }, 500);

    // ไปหน้า Alarm หลัง 3 วินาที
    const navTimer = setTimeout(() => {
      navigate('/alarm');
    }, 3000);

    return () => {
      clearTimeout(notifTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className={`relative size-full flex flex-col items-center justify-center ${
      isEvening
        ? 'bg-gradient-to-b from-[#1e1b4b] to-[#312e81]'
        : 'bg-gradient-to-b from-[#fef3c7] to-[#fde68a]'
    }`}>
      {/* Icon Animation - Sun for AM, Moon for PM */}
      <div className="mb-8 relative">
        {isEvening ? (
          <>
            <div className="absolute inset-0 bg-[#818cf8]/20 rounded-full blur-3xl animate-pulse" />
            <Moon className="w-32 h-32 text-[#818cf8] fill-[#818cf8] relative z-10" strokeWidth={1.5} />
            <Stars className="w-8 h-8 text-[#fbbf24] absolute -top-4 -right-4 animate-pulse" strokeWidth={2} />
            <Stars className="w-6 h-6 text-[#fbbf24] absolute -bottom-2 -left-2 animate-pulse" strokeWidth={2} style={{ animationDelay: '0.5s' }} />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[#f59e0b]/30 rounded-full blur-3xl animate-pulse" />
            <Sun className="w-32 h-32 text-[#f59e0b] fill-[#f59e0b] relative z-10 animate-spin-slow" strokeWidth={1.5} />
          </>
        )}
      </div>

      {/* Time Display */}
      <div className="text-center mb-8">
        <p className={`font-['Manrope:Regular',sans-serif] text-[16px] mb-2 ${
          isEvening ? 'text-[#c7d2fe]' : 'text-[#78350f]/70'
        }`}>
          {greeting}
        </p>
        <p className={`font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[56px] leading-none ${
          isEvening ? 'text-[#e0e7ff]' : 'text-[#78350f]'
        }`}>
          {timeOnly}
        </p>
        <p className={`font-['Manrope:SemiBold',sans-serif] font-semibold text-[18px] ${
          isEvening ? 'text-[#c7d2fe]' : 'text-[#78350f]/70'
        }`}>
          {period}
        </p>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="absolute top-20 left-6 right-6 max-w-[400px] mx-auto animate-slide-down">
          <div className={`rounded-[20px] p-5 shadow-2xl border-2 flex items-center gap-4 ${
            isEvening
              ? 'bg-[#312e81] border-[#818cf8]'
              : 'bg-[#180f2a] border-[#f0e100]'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce ${
              isEvening ? 'bg-[#818cf8]' : 'bg-[#f0e100]'
            }`}>
              <Bell className={`w-6 h-6 ${isEvening ? 'text-[#1e1b4b]' : 'text-[#180f2a]'}`} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="font-['Manrope:Bold',sans-serif] font-bold text-[16px] text-white mb-1">
                Wake Up!
              </p>
              <p className="font-['Manrope:Regular',sans-serif] text-[13px] text-white/70">
                {greetingMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* App Name */}
      <div className="absolute bottom-12 flex flex-col font-['ABeeZee:Regular',sans-serif] items-center">
        <p className={`text-[24px] ${isEvening ? 'text-[#e0e7ff]' : 'text-[#78350f]'}`}>
          <span className="font-['Miniver:Regular',sans-serif]">N</span>
          <span className="font-['Michroma:Regular',sans-serif]">ooze</span>
        </p>
      </div>
    </div>
  );
}
