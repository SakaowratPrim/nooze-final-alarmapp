import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { signIn } from "../utils/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = signIn(email, password);

      if (result.success) {
        // Use window.location to force a full page reload and re-evaluate auth state
        window.location.href = '/home';
      } else {
        setError(result.error || 'Sign in failed');
      }

      setLoading(false);
    }, 500); // Small delay for UX
  };

  return (
    <div className="bg-gradient-to-br from-[#834dfb] to-[#6366f1] relative size-full flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <p className="text-[48px] font-['ABeeZee:Regular',sans-serif] text-white">
              <span className="font-['Miniver:Regular',sans-serif]">N</span>
              <span className="font-['Michroma:Regular',sans-serif]">ooze</span>
            </p>
          </div>
          <h1 className="font-['Manrope:Bold',sans-serif] font-bold text-[28px] text-white mb-2">
            Welcome Back
          </h1>
          <p className="font-['Manrope:Regular',sans-serif] text-[14px] text-white/80">
            Sign in to continue your wake-up journey
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-[#ef4444]/20 border-2 border-[#ef4444] rounded-[16px] p-4 flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-white flex-shrink-0" strokeWidth={2.5} />
              <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] text-white">
                {error}
              </p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block font-['Manrope:SemiBold',sans-serif] text-[14px] text-white/90 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" strokeWidth={2.5} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-[16px] pl-12 pr-4 py-4 text-[16px] font-['Manrope:Regular',sans-serif] text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block font-['Manrope:SemiBold',sans-serif] text-[14px] text-white/90 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" strokeWidth={2.5} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-[16px] pl-12 pr-4 py-4 text-[16px] font-['Manrope:Regular',sans-serif] text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-all"
                required
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f0e100] text-[#180f2a] py-4 rounded-[16px] font-['Manrope:ExtraBold',sans-serif] font-extrabold text-[18px] shadow-2xl active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Info */}
        <div className="mt-8 text-center">
          <p className="font-['Manrope:Regular',sans-serif] text-[12px] text-white/60">
            Demo: Use any email and password (6+ characters)
          </p>
        </div>
      </div>
    </div>
  );
}
