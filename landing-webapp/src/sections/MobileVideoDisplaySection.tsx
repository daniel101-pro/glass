import { type JSX } from "react";
import { Button } from "../components/ui/button";

export const MobileVideoDisplaySection = (): JSX.Element => {
  // Data for numbered badges

  // Data for feature cards
  const featureCards = [
    {
      title: "Built for Speed",
      description: (
        <>
          <span className="tracking-[-0.21px]">
            Select text on any site, hit{" "}
          </span>
          <span className="font-medium text-[16px] tracking-[-0.30px]">
            ⌘+/ (or Ctrl+/),
          </span>
          <span className="tracking-[-0.21px]"> get results.</span>
        </>
      ),
    },
    {
      title: "Context on the go",
      description: "See fact-checks, source bias, credibility instantly.",
    },
    {
      title: "Stay in flow",
      description: (
        <>
          No tab-switching, no time wasted.
          <br />
          Glass follows you around
        </>
      ),
    },
    {
      title: "Works everywhere",
      description:
        "Social posts, news articles, PDFs — if you can see it, you can Glass it.",
    },
  ];

  return (
    <section className="relative w-full h-fit bg-[#85b5d9] overflow-hidden">
      {/* Main content section */}
      <div className="relative w-full bg-[#85b5d9] px-4 py-8 sm:py-16">
        {/* Hero section */}
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center items-center gap-2 text-center mb-[20px]">
              <div className="font-['Instrument_Sans'] font-semibold text-[28px] sm:text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.04em] text-[#C0DDEF]">
                How
              </div>
              <div className="font-['Instrument_Sans'] font-semibold text-[28px] sm:text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.04em] text-[#F3F4F9]">
                Glass
              </div>
              <div className="font-['Instrument_Sans'] font-semibold text-[28px] sm:text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.04em] text-[#C0DDEF]">
                Works.
              </div>
            </div>

            
          </div>
        </div>


        {/* Feature cards */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto px-2">
          {featureCards.map((card, index) => (
            <div
              key={card.title}
              className="bg-[#749fbf99] rounded-[24px] p-6 sm:p-8 text-center backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] border border-[#ffffff0a]"
              style={{
                transform: `rotate(${index % 2 === 0 ? '1deg' : '-1deg'})`,
              }}
            >
              <h3 className="font-['Instrument_Sans'] font-semibold text-[20px] sm:text-[22px] text-[#F3F4F9] mb-3">
                {card.title}
              </h3>
              <div className="font-['Instrument_Sans'] text-[15px] sm:text-[16px] text-[#F3F4F9] leading-[1.6]">
                {card.description}
              </div>
            </div>
          ))}
        </div>

        {/* Get Early Access button */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <Button 
            onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-[#ffffff0f] rounded-[30px] border border-[#c0ddef] hover:bg-[#ffffff1a] transition-colors backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)]"
          >
            <span className="font-['Instrument_Sans'] font-medium text-[16px] sm:text-[18px] text-[#F3F4F9]">
              Get Early Access
            </span>
          </Button>
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full h-fit bg-[#85b5d9] items-center justify-center">
        <div className="text-center px-4 py-6 sm:py-8">
          <p className="font-['Instrument_Sans'] font-medium text-[16px] sm:text-[18px] text-[#f3f4f9] leading-[1.5] max-w-2xl mx-auto">
            AI-powered fact-checking and media verification — from live meetings to articles, images, and videos.
          </p>
        </div>
        <div className="flex justify-center pb-8">
          <img src="/glassimg.png" alt="glass" className="max-w-full h-auto w-full max-w-md" />
        </div>
      </div>
    </section>
  );
};
