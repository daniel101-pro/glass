import { type JSX } from "react";
import { Button } from "../../components/ui/button";

export const MainContentSection = (): JSX.Element => {
  return (
    <section className="relative w-full min-h-screen bg-[#85b5d9]">
      {/* background element omitted for brevity */}


<main className="flex flex-col items-center justify-center min-h-screen px-6 md:px-0" id="hero">
<div className="hidden md:flex flex-col items-center gap-[30px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  {/* Hero Text Section */}
  <header className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] flex flex-col items-center justify-center gap-2.5">
    {/* Main Title */}
<div className="flex flex-row justify-center items-baseline gap-[10px] w-[789px]">
  <h1 className="font-['Instrument_Sans'] font-semibold text-[100px] tracking-[-0.04em] text-[#F3F4F9]">
    Clarity
  </h1>
  <h1 className="font-['Instrument_Sans'] font-semibold text-[100px] tracking-[-0.04em] text-[#C0DDEF]">
    starts here.
  </h1>
</div>


    {/* Subtitle */}
    <div className="flex flex-row justify-center items-center p-[0px_20px] gap-[10px] w-[90vw] max-w-[585px] h-[58px] rounded-[41px] min-w-0 overflow-hidden">
      <p className="w-full h-[58px] font-['Instrument_Sans'] font-medium text-[24px] leading-[29px] text-center tracking-[-0.04em] text-[#F3F4F9]">
        AI-powered fact-checking and media verification from live meetings to articles, images, and videos.
      </p>
    </div>
  </header>

  {/* CTA Buttons */}
<div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms] flex flex-row items-start justify-center gap-[10px] w-[90vw] max-w-[350px] h-[44px]">    <Button 
      onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      className="flex justify-center items-center px-[20px] py-[10px] gap-[10px] w-[184px] h-[44px] bg-[rgba(255,255,255,0.06)] border border-solid border-[#C0DDEF] rounded-[41px] hover:bg-[rgba(255,255,255,0.10)] transition-colors"
    >
      <span className="w-[144px] h-[24px] font-['Instrument_Sans'] font-medium text-[20px] leading-[24px] text-center text-[#F3F4F9]">
        Get Early Access
      </span>
    </Button>

    <Button className="flex justify-center items-center px-[20px] py-[10px] gap-[10px] w-[156px] h-[44px] bg-[#C1DAEE] border border-solid border-[#C0DDEF] rounded-[41px] hover:bg-[#B5D1E8] transition-colors">
      <span className="w-[116px] h-[24px] font-['Instrument_Sans'] font-medium text-[20px] leading-[24px] text-center text-[#85B5D9]">
        Watch Demo
      </span>
    </Button>
  </div>
</div>


 {/* Mobile View */}
<div className="flex flex-col items-center justify-center text-center gap-6 md:hidden w-full max-w-[90%] mx-auto py-16">
  <header className="flex flex-col items-center gap-3">
    <h1 className="font-['Instrument_Sans'] font-semibold text-[48px] sm:text-[56px] leading-[1.1] tracking-[-0.04em] text-[#F3F4F9]">
      Clarity <span className="text-[#C0DDEF]">starts here.</span>
    </h1>
    <p className="font-['Instrument_Sans'] font-medium text-[18px] leading-[26px] text-[#F3F4F9] max-w-full sm:max-w-[90%]">
      AI-powered fact-checking and media verification from live meetings to articles, images, and videos.
    </p>
  </header>

  <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-full">
    <Button 
      onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      className="px-[20px] py-[12px] bg-[rgba(255,255,255,0.06)] border border-solid border-[#C0DDEF] rounded-[41px] hover:bg-[rgba(255,255,255,0.10)] transition-colors w-full sm:w-auto"
    >
      <span className="font-['Instrument_Sans'] font-medium text-[16px] sm:text-[18px] text-[#F3F4F9]">
        Get Early Access
      </span>
    </Button>

    <Button className="px-[20px] py-[12px] bg-[#C1DAEE] border border-solid border-[#C0DDEF] rounded-[41px] hover:bg-[#B5D1E8] transition-colors w-full sm:w-auto">
      <span className="font-['Instrument_Sans'] font-medium text-[16px] sm:text-[18px] text-[#85B5D9]">
        Watch Demo
      </span>
    </Button>
  </div>
</div>

</main>

      {/* Decorative Images */}
      <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms] absolute top-[-166px] right-[-78px] w-[334px] h-[412px] flex">
        <div className="mt-[49.1px] w-[314.64px] h-[357.84px] ml-[13.7px] relative animate-breathe-rotate">
          <img
            className="absolute top-[117px] left-[37px] w-[211px] h-[254px]"
            alt="Frame"
            src="https://c.animaapp.com/mg9zrj1xAlwudc/img/frame-8.png"
          />
          <img
            className="absolute top-[117px] left-[-30px] w-[278px] h-[215px]"
            src="https://c.animaapp.com/mg9zrj1xAlwudc/img/frame-9.png"
          />
        </div>
      </div>
    </section>
  );
};
