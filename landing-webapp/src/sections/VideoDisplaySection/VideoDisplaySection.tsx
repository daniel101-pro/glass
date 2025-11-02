import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

gsap.registerPlugin(ScrollTrigger);

export const VideoDisplaySection = (): JSX.Element => {
  const [activeSection, setActiveSection] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Use GSAP context for proper cleanup in React
    const ctx = gsap.context(() => {
      // Ensure both path refs are available
      if (!path1Ref.current || !path2Ref.current) return;

      // Get the total length of each path
      const length1 = path1Ref.current.getTotalLength();
      const length2 = path2Ref.current.getTotalLength();

      // Set the initial "hidden" state for both paths
      gsap.set([path1Ref.current, path2Ref.current], {
        strokeDasharray: (i) => (i === 0 ? length1 : length2),
        strokeDashoffset: (i) => (i === 0 ? length1 : length2),
      });

      // Create a timeline controlled by the ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svgContainerRef.current, // Use the SVG container as the trigger
          start: "top start", // Start when the top of the SVG hits the screen's center
          end: "bottom end", // End when the bottom of the SVG hits the screen's center
          scrub: 1,
          // markers: true, // Uncomment this for debugging!
        },
      });

      // Add both path animations to the timeline
      // The "<" position parameter makes the second animation start at the same time as the first one.
      tl.to(path1Ref.current, { strokeDashoffset: 0, ease: "none" })
        .to(path2Ref.current, { strokeDashoffset: 0, ease: "none" }, "<");

    }, sectionRef); // Scope the context to our main section

    // Cleanup function to revert all GSAP animations when the component unmounts
    return () => ctx.revert();
  }, []);

  // Data for numbered badges
  const badges = [
    { number: 1, top: "top-[194px]", left: "left-[199px]" },
    { number: 2, top: "top-[755px]", left: "left-[1194px]" },
    { number: 3, top: "top-[1061px]", left: "left-[228px]" },
    { number: 4, top: "top-[1377px]", left: "left-[1241px]" },
  ];

  // Data for feature cards
  const featureCards = [
    {
      title: "Built for Speed",
      description: (
        <>
          <span className="tracking-[-0.21px]">
            Select text on any site, hit{" "}
          </span>
          <span className="font-medium text-[27.3px] tracking-[-0.30px]">
            ⌘+/ (or Ctrl+/),
          </span>
          <span className="tracking-[-0.21px]"> get results.</span>
        </>
      ),
      top: "top-[242px]",
      left: "left-[269px]",
      rotation: "rotate-[1.05deg]",
    },
    {
      title: "Context on the go",
      description: "See fact-checks, source bias, credibility instantly.",
      top: "top-[557px]",
      left: "left-[854px]",
      rotation: "rotate-[-2.55deg]",
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
      top: "top-[873px]",
      left: "left-[205px]",
      rotation: "-rotate-1",
    },
    {
      title: "Works everywhere",
      description:
        "Social posts, news articles, PDFs — if you can see it, you can Glass it.",
      top: "top-[1179px]",
      left: "left-[916px]",
      rotation: "rotate-[2.55deg]",
    },
  ];

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['#see-through', '#blur', '#why', '#faq', '#team'];
      const scrollPosition = window.scrollY + 100; // Adding offset for better UX

      for (const section of sections) {
        const element = document.querySelector(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Set initial active section
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data for navigation items with their corresponding hrefs
  const navItems = [
    { name: "Glass", href: "#see-through" },
    { name: "Blur", href: "#blur" },
    { name: "Why", href: "#why" },
    { name: "FAQ", href: "#faq" },
    { name: "Team", href: "#team" }
  ];

  // Data for decorative circles
  const decorativeCircles = [
    { rotation: "-rotate-90" },
    { rotation: "-rotate-45" },
    { rotation: "rotate-45" },
    { rotation: "" },
  ];

  return (
    <section ref={sectionRef} className="relative w-[1440px] h-[2548px] overflow-hidden mt-[100px] mx-auto">
      {/* Main content section */}
      <div className="relative w-full h-[1617px] bg-[#85b5d9]" id="faq">
        {/* Hero section */}
        <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms] gap-[30px] top-0 left-1/2 transform -translate-x-1/2 inline-flex flex-col items-center absolute">
          <div className="inline-flex flex-col items-center justify-center gap-5 relative flex-[0_0_auto]">
            <div className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto] mt-[20px] mb-[30px]">
              <div className="w-[102px] h-[61px] font-['Instrument_Sans'] font-semibold text-[50px] leading-[61px] tracking-[-0.04em] text-[#C0DDEF]">
                How
              </div>
              <div className="w-[121px] h-[61px] font-['Instrument_Sans'] font-semibold text-[50px] leading-[61px] tracking-[-0.04em] text-[#F3F4F9]">
                Glass
              </div>
              <div className="w-[155px] h-[61px] font-['Instrument_Sans'] font-semibold text-[50px] leading-[61px] tracking-[-0.04em] text-[#C0DDEF]">
                Works.
              </div>
            </div>

            <div className="px-2.5 py-1.5 relative flex-[0_0_auto] bg-[#eef9fd1a] backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] inline-flex items-center gap-2.5 rounded-[39px]">
              <Button className="flex w-[120px] gap-[8.57px] px-3 py-2 relative bg-[#ffffff05] rounded-[32px] items-center justify-center backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] h-auto border-0 hover:bg-[#ffffff10] transition-colors">
                <div className="w-[67px] h-[24px] font-['Instrument_Sans'] font-medium text-[20px] leading-[24px] tracking-[-0.04em] text-[#F3F4F9]">
                  Overlay
                </div>
              </Button>

              <Button className="inline-flex items-center justify-center gap-[8.57px] px-3 py-2 relative flex-[0_0_auto] bg-[#ffffff05] rounded-[32px] h-auto border-0 hover:bg-[#ffffff10] transition-colors">
                <div className="w-[96px] h-[24px] font-['Instrument_Sans'] font-medium text-[20px] leading-[24px] tracking-[-0.04em] text-[#F3F4F9]">
                  Dashboard
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Numbered badges */}
        {badges.map((badge, index) => (
          <div
            key={`badge-${badge.number}`}
            className={`translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:${200 + index * 100}ms] inline-flex items-center gap-[7.5px] p-[7.5px] absolute ${badge.top} ${badge.left} bg-[#749fbfcc] rounded-[750px]`}
          >
            <div className="flex flex-col w-[52.5px] h-[52.5px] items-center justify-center gap-[7.5px] p-[7.5px] relative bg-[#85b5d9] rounded-[74999.25px]">
              <div className="relative flex items-center justify-center self-stretch [font-family:'SF_Pro_Rounded-Bold',Helvetica] font-bold text-white text-3xl text-center tracking-[-1.20px] leading-[normal]">
                {badge.number}
              </div>
            </div>
          </div>
        ))}

       {/* Vector graphics - Combined into a single SVG */}
<div ref={svgContainerRef} className=""> {/* <-- Attach the ref here */}
  <svg
    // Use a single set of positioning classes for the entire SVG group.
    className="animate-fade-in opacity-0 [--animation-delay:600ms] absolute top-[380px] left-[573px]"
    // The width, height, and viewBox should be large enough to contain all paths.
    // I've used the dimensions from your largest SVG.
    width="386"
    height="806"
    viewBox="0 0 386 806"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* First path */}
    <path
      ref={path1Ref}
      d="M75.5777 7.50801L197.95 169.17L305.864 311.731C313.396 321.681 310.088 336.023 298.957 341.669L7.50948 489.491"
      stroke="#C0DDEF"
      strokeWidth="15"
      strokeLinecap="round"
    />
    
    {/* Second path */}
    <path
      ref={path2Ref}
      // If you need paths to animate sequentially, you can apply animation classes directly to them.
      // className="animate-fade-in opacity-0 [--animation-delay:700ms]" 
      d="M75.5743 7.50787L195.75 166.268C197.201 168.185 198.295 170.347 198.979 172.652L377.142 772.637C382.897 792.018 359.567 806.742 344.549 793.208L7.50738 489.481"
      stroke="#C0DDEF"
      strokeWidth="15"
      strokeLinecap="round"
    />
  </svg>
</div>

        {/* Feature cards */}
        {featureCards.map((card, index) => (
          <Card
            key={`feature-${index}`}
            className={`translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:${800 + index * 200}ms] flex flex-col w-[394px] items-start gap-[11.38px] p-[28.45px] absolute ${card.top} ${card.left} bg-[#769fbd33] rounded-[22.76px] overflow-hidden ${card.rotation} backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] border-0`}
          >
            <CardContent className="flex flex-col items-start gap-[18.21px] relative self-stretch w-full flex-[0_0_auto] p-0">
              <div className="w-fit font-['Instrument_Sans'] font-medium text-[38.81px] leading-[47px] tracking-[-0.04em] text-[#FFFFFF]">
                {card.title}
              </div>
              <div className="w-[336.33px] font-['Instrument_Sans'] font-normal text-[22.76px] leading-[28px] tracking-[-0.04em] text-[#FFFFFF]">
                {card.description}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Get Early Access button */}
        <Button 
          onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1600ms] inline-flex gap-[8.57px] px-3 py-2 absolute top-[1405px] left-[calc(50%-168px/2)] w-[168px] h-[40px] bg-[rgba(255,255,255,0.02)] rounded-[32px] items-center justify-center backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] border-0 hover:bg-[#ffffff10] transition-colors"
        >
          <div className="w-[144px] h-[24px] font-['Instrument_Sans'] font-medium text-[20px] leading-[24px] tracking-[-0.04em] text-[#F3F4F9]">
            Get Early Access
          </div>
        </Button>
      </div>

      {/* Bottom section */}
      <div className="absolute top-[1617px] left-0 w-full h-[850px] bg-[#85b5d9] overflow-hidden" id="team">
        <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1800ms] top-[calc(50.00%_-_372px)] left-[calc(50.00%_-_725px)] inline-flex flex-col items-center absolute">
          <div className="relative w-[1449px] h-[838px]">
            <div className="inline-flex items-center justify-center gap-2.5 px-5 py-0 absolute top-[90px] left-[calc(50%-585px/2)] w-[585px] h-[58px] rounded-[41px] z-[100]">
              <div className="relative w-[545px] h-[58px] mt-[-1.00px] font-['Instrument_Sans'] font-medium text-[#f3f4f9] text-[24px] text-center leading-[29px] tracking-[-0.04em]">
                AI-powered fact-checking and media verification — from live
                meetings to articles, images, and videos.
              </div>
            </div>

            <div className="inline-flex items-center justify-center gap-2.5 absolute top-[58px] left-[calc(50.00%_-_724px)]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Instrument_Sans',Helvetica] font-semibold text-[#c0ddef] text-[639.4px] tracking-[-25.58px] leading-[normal]">
                <img src="/glassimg.png" alt="glass" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <nav className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:2000ms] p-[10px] absolute top-[52px] left-[calc(50%-623px/2-0.5px)] w-[623px] h-[60px] inline-flex items-center gap-[10px] rounded-[39px]">
        <a href="#hero">
          <div className="relative w-[40px] h-[40px] bg-[rgba(133,181,217,0.5)] rounded-[97px] backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] flex-none">
            <div className="absolute w-[27px] h-[43px] left-[calc(50%-27px/2-0.5px)] top-[calc(50%-43px/2+0.5px)] font-['Instrument_Sans'] font-semibold text-[35.25px] leading-[43px] tracking-[-0.04em] text-[#F3F4F9] flex items-center justify-center">
              G
            </div>
          </div>
        </a>

          {navItems.map((item) => {
            const buttonWidths = { "Glass": "72px", "Blur": "59px", "Why": "67px", "FAQ": "63px", "Team": "74px" };
            const isActive = activeSection === item.href;
            return (
              <a 
                key={`nav-${item.name}`}
                href={item.href}
                className="no-underline"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setActiveSection(item.href);
                    window.history.pushState(null, '', item.href);
                  }
                }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`inline-flex items-center justify-center gap-[8.57px] px-3 py-2 relative flex-[0_0_auto] ${isActive ? "bg-[rgba(255,255,255,0.1)]" : "bg-[rgba(255,255,255,0.02)"} rounded-[32px] h-[40px] border-0 hover:bg-[#ffffff10] transition-all duration-300 ${isActive ? 'scale-105' : 'hover:scale-102'}`}
                  style={{ 
                    width: buttonWidths[item.name as keyof typeof buttonWidths] || "auto",
                    boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.40), inset 1px 0 0 rgba(255,255,255,0.32), inset 0 -1px 1px rgba(0,0,0,0.13), inset -1px 0 1px rgba(0,0,0,0.11)' : 'none'
                  }}
                >
                  <div className={`font-['Instrument_Sans'] font-medium text-[20px] leading-[24px] tracking-[-0.04em] ${isActive ? 'text-white' : 'text-[#F3F4F9]'}`}>
                    {item.name}
                  </div>
                </Button>
              </a>
            );
          })}

          <Button 
            onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center justify-center gap-[8.57px] px-3 py-2 relative flex-[0_0_auto] w-[168px] h-[40px] bg-[rgba(255,255,255,0.02)] rounded-[32px] backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] border-0 hover:bg-[#ffffff10] transition-colors"
          >
            <div className="w-[144px] h-[24px] font-['Instrument_Sans'] font-medium text-[20px] leading-[24px] tracking-[-0.04em] text-[#F3F4F9]">
              Get Early Access
            </div>
          </Button>
        </nav>
      </div>

      {/* Left decorative circles */}
      <div className="absolute left-4 bottom-[400px] w-[406px] h-[406px] rotate-[-104.98deg]">
        {decorativeCircles.map((circle, index) => (
          <div
            key={`circle-${index}`}
            className={`absolute top-[161px] left-1.5 w-[394px] h-[84px] bg-[#ffffff0f] rounded-[88.66px] border-[0.93px] border-solid border-[#c0ddef] ${circle.rotation} backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)]`}
          />
        ))}
      </div>

      {/* Right decorative frames */}
      <div className="top-[1514px] right-[-78px] flex absolute w-[334px] h-[412px]">
        <div className="mt-[49.1px] w-[314.64px] h-[357.84px] ml-[13.7px] relative animate-breathe-rotate" style={{ animationDelay: '1.5s' }}>
          <img
            className="absolute top-[-13px] left-[37px] w-[211px] h-96"
            alt="Frame"
            src="https://c.animaapp.com/mg9zrj1xAlwudc/img/frame-8-1.png"
          />
          <img
            className="absolute top-[26px] left-[-30px] w-[278px] h-[306px]"
            alt="Frame"
            src="https://c.animaapp.com/mg9zrj1xAlwudc/img/frame-9-1.png"
          />
        </div>
      </div>
    </section>
  );
};
