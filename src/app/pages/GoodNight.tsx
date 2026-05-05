import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Moon, Sparkles } from "lucide-react";

export default function GoodNight() {
  const navigate = useNavigate();
  const location = useLocation();
  const alarmTime = location.state?.alarmTime || '06:30 AM';

  useEffect(() => {
    // หลัง 3 วินาที ไปหน้า Morning (สมมุติเช้าแล้ว)
    const timer = setTimeout(() => {
      navigate('/morning', { state: { alarmTime } });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, alarmTime]);

  return (
    <div className="bg-[#0f0a1a] relative size-full flex flex-col items-center justify-center">
      {/* Moon Animation */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-[#f0e100]/20 rounded-full blur-3xl animate-pulse" />
        <Moon className="w-32 h-32 text-[#f0e100] fill-[#f0e100] relative z-10" strokeWidth={1.5} />
        <Sparkles className="w-8 h-8 text-[#f0e100] absolute -top-4 -right-4 animate-pulse" strokeWidth={2} />
        <Sparkles className="w-6 h-6 text-[#f0e100] absolute -bottom-2 -left-2 animate-pulse delay-500" strokeWidth={2} />
      </div>

      {/* Message */}
      <div className="text-center px-8">
        <h1 className="font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[42px] text-white mb-3 leading-tight">
          Good Night
        </h1>
        <p className="font-['Manrope:Regular',sans-serif] text-[18px] text-white/70 mb-2">
          Your alarm is set for
        </p>
        <p className="font-['Manrope:Bold',sans-serif] font-bold text-[32px] text-[#f0e100]">
          {alarmTime}
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-12 text-center px-8">
        <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-white/50">
          A better morning begins tonight ✨
        </p>
      </div>
    </div>
  );
}
