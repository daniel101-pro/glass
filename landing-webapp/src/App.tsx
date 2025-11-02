import type { JSX } from "react";
import { useEffect, useState } from "react";
import { HeaderSection } from "./sections/HeaderSection/HeaderSection";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";
import { VideoDisplaySection } from "./sections/VideoDisplaySection/VideoDisplaySection";
import { MobileVideoDisplaySection } from "./sections/MobileVideoDisplaySection";
import { WaitlistPage } from "./sections/WaitlistPage/WaitlistPage";
import { AdminPage } from "./pages/AdminPage";
import { Navbar } from "./components/Navbar";

export const App = (): JSX.Element => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1353);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced smooth scrolling for React
  useEffect(() => {
    // Add smooth scrolling class to document
    document.documentElement.style.scrollBehavior = 'smooth';

    // Cleanup on unmount
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Handle waitlist and admin page routing
  useEffect(() => {
    const checkHash = () => {
      setShowWaitlist(window.location.hash === '#waitlist');
      setShowAdmin(window.location.hash === '#admin');
    };
    
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);
  const decorativeElements = [
    {
      className: "absolute top-[-150px] left-[0px] w-[361.37110115641343px] h-[590.4843871021617px] hidden xl:block",
      src: "./Frame2147223669.png",
      alt: "Frame",
    },
     {
      className: "absolute top-[500px] left-[-50px] w-[300px] h-[401px] ",
      src: "https://c.animaapp.com/mg9zrj1xAlwudc/img/frame-8-2.svg",
      alt: "Frame",
    },
    {
      className: "absolute top-[673px] right-[-260px] w-[493px] h-[660px]",
      src: "https://c.animaapp.com/mg9zrj1xAlwudc/img/vector-3.svg",
      alt: "Vector",
    },
  ];

  // Show admin page if hash is #admin
  if (showAdmin) {
    return <AdminPage />;
  }

  // Show waitlist page if hash is #waitlist
  if (showWaitlist) {
    return <WaitlistPage />;
  }

  return (
    <div
      className="flex flex-col items-center justify-start w-full h-fit opend:hidden relative"
      data-model-id="433:266"
    >
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={`relative w-full ${menuOpen ? 'blur-sm' : ''}`}>
        <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
          <MainContentSection />
        </div>

        <div id="see-through" className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          <HeaderSection />
        </div>

        <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
          {isMobile ? <MobileVideoDisplaySection /> : <VideoDisplaySection />}
        </div>

        {decorativeElements.map((element, index) => (
          <img
            key={`decorative-${index}`}
            className={`${element.className} hidden xl:block animate-breathe`}
            style={{ animationDelay: `${index * 0.5}s` }}
            alt={element.alt}
            src={element.src}
          />
        ))}

  
      </div>
    </div>
  );
};
