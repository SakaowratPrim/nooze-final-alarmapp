import { useState } from "react";
import { useNavigate } from "react-router";
import { signIn } from "../utils/auth";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = () => {
    if (name && email && password) {
      // In a real app, this would create an account first
      // For now, we'll just sign in
      const result = signIn(email, password);
      if (result.success) {
        window.location.href = '/home';
      }
    }
  };

  return (
    <div className="bg-[#f2f1ec] relative size-full" data-name="Sign Up">
      <div className="-translate-y-1/2 absolute flex flex-col font-['ABeeZee:Regular',sans-serif] justify-center leading-[0] left-[161px] not-italic text-[#180f2a] text-[22.857px] top-[39.5px] tracking-[-1.3714px] whitespace-nowrap">
        <p>
          <span className="font-['Miniver:Regular',sans-serif] leading-[24.762px]">N</span>
          <span className="font-['Michroma:Regular',sans-serif] leading-[24.762px]">ooze</span>
        </p>
      </div>
      <div className="absolute bg-[#180f2a] h-[745px] left-0 rounded-tl-[50px] rounded-tr-[50px] top-[129px] w-[402px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] left-[43px] text-[#f5f3ff] text-[32px] top-[193px] whitespace-nowrap">
        <p className="leading-[27.152px]">Sign Up</p>
      </div>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="absolute bg-[#f5f3ff] h-[45px] left-[43px] rounded-[10px] top-[270px] w-[316px] px-4 text-[14px]"
      />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] left-[43px] text-[#f5f3ff] text-[14px] top-[256px] whitespace-nowrap pointer-events-none">
        <p className="leading-[27.152px]">Your name</p>
      </div>

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="absolute bg-[#f5f3ff] h-[45px] left-[43px] rounded-[10px] top-[379px] w-[316px] px-4 text-[14px]"
      />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] left-[43px] text-[#f5f3ff] text-[14px] top-[365px] whitespace-nowrap pointer-events-none">
        <p className="leading-[27.152px]">Email Address</p>
      </div>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="absolute bg-[#f5f3ff] h-[45px] left-[43px] rounded-[10px] top-[488px] w-[316px] px-4 text-[14px]"
      />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] left-[43px] text-[#f5f3ff] text-[14px] top-[474px] whitespace-nowrap pointer-events-none">
        <p className="leading-[27.152px]">Password</p>
      </div>

      <button
        onClick={handleCreateAccount}
        className="absolute h-[41px] left-[102px] top-[587px] w-[198.969px] cursor-pointer"
        data-name="Create Account"
      >
        <div className="absolute bg-[#d9d9d9] inset-0 rounded-[26.5px]" />
        <div className="absolute flex flex-col font-['Manrope:Regular',sans-serif] font-normal inset-[17.07%_20.62%_14.63%_20.1%] justify-center leading-[0] text-[16px] text-black">
          <p className="leading-[27.152px]">Create account</p>
        </div>
      </button>

      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] left-[201px] text-[#f5f3ff] text-[14px] text-center top-[678px] whitespace-nowrap">
        <p className="leading-[27.152px]">or</p>
      </div>

      <div className="absolute h-0 left-[53px] top-[678px] w-[298px]">
        <div className="absolute inset-[-0.5px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 298 0.500011">
            <g id="Group 6">
              <line id="Line 1" stroke="white" strokeWidth="0.5" x1="2.18557e-08" x2="130" y1="0.25" y2="0.250011" />
              <line id="Line 2" stroke="white" strokeWidth="0.5" x1="168" x2="298" y1="0.25" y2="0.250011" />
            </g>
          </svg>
        </div>
      </div>

      <button className="absolute bg-[#f5f3ff] h-[45px] left-[43px] rounded-[10px] top-[727px] w-[316px] cursor-pointer">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] left-[216px] text-[#180f2a] text-[14px] text-center top-[23px] whitespace-nowrap">
          <p className="leading-[27.152px]">Sign up with Google</p>
        </div>
      </button>
    </div>
  );
}
