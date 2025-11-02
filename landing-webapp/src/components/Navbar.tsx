import { useEffect, useState, type JSX } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const Navbar = ({ menuOpen, setMenuOpen }: NavbarProps): JSX.Element => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Trigger mount animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const navigationItems = [
    { name: "Glass", href: "#see-through" },
    { name: "Blur", href: "#blur" },
    { name: "Why", href: "#why" },
    { name: "FAQ", href: "#faq" },
    { name: "Team", href: "#team" },
  ];

  // Update active section based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash);
    };

    // Set initial active section
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update URL hash without scrolling (handled by scrollIntoView)
      window.history.pushState(null, '', href);
      setActiveSection(href);
      setMenuOpen(false);
    }
  };

  // Close the mobile menu automatically if viewport becomes >= md (desktop).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setMenuOpen(false);
    };
    // Ensure closed on mount if already desktop
    if (mq.matches) setMenuOpen(false);

    if (mq.addEventListener) mq.addEventListener("change", onChange as EventListener);
    else mq.addListener(onChange as any);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange as EventListener);
      else mq.removeListener(onChange as any);
    };
  }, []);

  // Handle dropdown animation
  useEffect(() => {
    if (menuOpen) {
      setDropdownVisible(true);
    } else {
      setTimeout(() => setDropdownVisible(false), 300);
    }
  }, [menuOpen]);

  return (
    <nav 
      className={`fixed top-[51px] z-50 flex justify-center transition-all duration-500 ease-out transform ${
        isMounted 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`
        hidden md:flex items-center justify-between p-[10px] gap-[10px] 
        bg-[rgba(238,249,253,0.1)] backdrop-blur-md backdrop-brightness-[110%] 
        rounded-[39px] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] 
        transition-all duration-300 ease-in-out
        hover:backdrop-blur-lg hover:bg-[rgba(238,249,253,0.15)]
        w-full max-w-4xl mx-4
      `}>
  {/* Logo */}
  <a href="#hero">
    <div className="w-[40px] h-[40px] bg-[rgba(133,181,217,0.5)] rounded-[97px] flex items-center justify-center relative shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)]">
    <span className="font-['Instrument_Sans'] font-semibold text-[35px] text-[#F3F4F9]">G</span>
  </div>
  </a>

  {/* Desktop Links */}
  <div className="flex flex-row items-center gap-[10px]">
    {navigationItems.map((item) => (
      <a
        key={item.name}
        href={item.href}
        onClick={(e) => scrollToSection(e, item.href)}
        className={`
          flex justify-center items-center px-4 py-2 h-10 no-underline 
          transition-all duration-300 ease-out transform
          ${activeSection === item.href 
            ? 'bg-[rgba(255,255,255,0.08)] rounded-2xl scale-105 shadow-lg' 
            : 'hover:bg-[rgba(255,255,255,0.05)] hover:rounded-2xl hover:scale-102'}
        `}
      >
        <span className="font-['Instrument_Sans'] font-medium text-[20px] tracking-[-0.04em] text-[#F3F4F9]">
          {item.name}
        </span>
      </a>
    ))}

    <Button 
      onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      variant="ghost" 
      className="flex items-center justify-center px-4 py-2 w-42 h-10 
      bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] 
      rounded-2xl border-0 hover:bg-[rgba(255,255,255,0.08)] 
      transition-all duration-300 ease-out transform hover:scale-105
      hover:shadow-lg"
    >
      <span className="font-['Instrument_Sans'] font-medium text-[20px] text-[#F3F4F9]">
        Get Early Access
      </span>
    </Button>
  </div>
</div>

{/* --- MOBILE NAV --- */}
<div className={`md:hidden relative flex items-center justify-between 
  bg-[rgba(238,249,253,0.1)] backdrop-blur-md backdrop-brightness-[110%] 
  rounded-[39px] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] 
  w-[90vw] mx-auto transition-all duration-300 ease-in-out
  ${menuOpen ? 'bg-[rgba(238,249,253,0.15)] backdrop-blur-lg' : ''}
`}>

  {/* Logo */}
  <div className="w-[40px] h-[40px] bg-[rgba(133,181,217,0.5)] rounded-[97px] flex items-center justify-center">
    <span className="font-['Instrument_Sans'] font-semibold text-[35px] text-[#F3F4F9]">G</span>
  </div>

  {/* Hamburger button */}
  <button
    aria-controls="mobile-menu"
    aria-expanded={menuOpen}
    onClick={() => setMenuOpen(!menuOpen)}
  >
    {menuOpen ? <X size={28} /> : <Menu size={28} />}
  </button>

  {/* Mobile dropdown */}
  {dropdownVisible && (
    <div
      id="mobile-menu"
      className="absolute top-[70px] left-0 w-full px-4"
    >
      <div className={`bg-[rgba(0,0,0,0.5)] backdrop-blur-md rounded-[20px] py-4 flex flex-col items-center gap-4 transition-all duration-300 ease-in-out ${
        menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        {navigationItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="font-['Instrument_Sans'] text-[18px] text-[#F3F4F9] hover:text-[#C0DDEF] transition"
          >
            {item.name}
          </a>
        ))}

        <Button 
          onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false); }}
          className="mt-2 px-[12px] py-[8px] w-[160px] bg-[rgba(255,255,255,0.05)] rounded-[32px]"
        >
          <span className="text-[#F3F4F9] text-[18px]">Get Early Access</span>
        </Button>
      </div>
    </div>
  )}
</div>
</nav>
  );
};
