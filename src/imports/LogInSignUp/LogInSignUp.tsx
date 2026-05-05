export default function LogInSignUp() {
  return (
    <div className="bg-[#f2f1ec] relative size-full" data-name="LogIn/SignUp">
      <div className="absolute flex h-[67.201px] items-center justify-center left-[24px] top-[314px] w-[320.301px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-1.53deg]">
          <div className="bg-[#180f2a] h-[58.724px] w-[318.849px]" />
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold h-[206px] justify-center leading-[0] left-[40px] text-[60px] text-black top-[280px] tracking-[-3.6px] w-[338px]">
        <p className="leading-[65px] mb-0 text-[#180f2a]">Overslept again?</p>
        <p className="leading-[65px] text-[#f0e100]">We got you</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['ABeeZee:Regular',sans-serif] justify-center leading-[0] left-[161px] not-italic text-[#180f2a] text-[22.857px] top-[39.5px] tracking-[-1.3714px] whitespace-nowrap">
        <p>
          <span className="font-['Miniver:Regular',sans-serif] leading-[24.762px]">N</span>
          <span className="font-['Michroma:Regular',sans-serif] leading-[24.762px]">ooze</span>
        </p>
      </div>
      <div className="absolute h-[53px] left-[66px] top-[562px] w-[271px]" data-name="LogIn">
        <div className="absolute bg-[#d9d9d9] inset-0 rounded-[26.5px]" />
        <div className="absolute flex flex-col font-['Manrope:Regular',sans-serif] font-normal inset-[24.53%_37.27%_22.64%_37.27%] justify-center leading-[0] text-[25.063px] text-black whitespace-nowrap">
          <p className="leading-[27.152px]">Log In</p>
        </div>
      </div>
      <div className="absolute h-[53px] left-[65px] top-[658px] w-[271px]" data-name="SignUp">
        <div className="absolute bg-[#d9d9d9] inset-0 rounded-[26.5px]" />
        <div className="absolute flex flex-col font-['Manrope:Regular',sans-serif] font-normal inset-[24.53%_33.58%_22.64%_33.58%] justify-center leading-[0] text-[25.063px] text-black whitespace-nowrap">
          <p className="leading-[27.152px]">Sign Up</p>
        </div>
      </div>
    </div>
  );
}