'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const pathname = usePathname();
  const desktopBarRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simple sheen loop on top navbar (both desktop and mobile bars)
    let t = 0;
    let raf: number;
    const loop = () => {
      t += 0.008;
      const bg = `linear-gradient(135deg, rgba(255,255,255,${0.06 + Math.sin(t)*0.03}) 0%, rgba(255,255,255,0.08) 100%)`;
      if (desktopBarRef.current) desktopBarRef.current.style.background = bg;
      if (mobileBarRef.current) mobileBarRef.current.style.background = bg;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (isOpen) setIsOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original || '';
    }
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [isOpen]);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/enterprise', label: 'Enterprise' },
    { href: '/careers', label: 'Careers' },
    { href: '/help', label: 'Help Center' },
  ];

  return (
    <>
      {/* Mobile bar */}
      <div className={`fixed top-4 left-0 right-0 z-50 px-4 md:hidden ${className}`}>
        <div
          ref={mobileBarRef}
          className="w-full px-4 py-3 rounded-full border border-white/20 backdrop-blur-xl bg-white/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <img src="/assets/images/logo.svg" alt="Glass" className="w-5 h-5" />
            <span className="text-sm font-medium">Glass</span>
          </div>
          <motion.button
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((v) => !v)}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full border border-white/20 bg-white/10"
          >
            {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <motion.div
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        className="fixed inset-0 z-40 md:hidden"
        onClick={() => setIsOpen(false)}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-2xl"
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
        {/* Sheet */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={false}
          animate={{ y: isOpen ? 0 : -20, opacity: isOpen ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute top-20 left-4 right-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-3"
        >
          <ul className="divide-y divide-white/10">
            {navItems.map((item, index) => {
              const active = pathname === item.href;
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 10 }}
                  transition={{ delay: isOpen ? 0.04 * index : 0, duration: 0.15 }}
                >
                  <a
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl relative ${
                      active ? 'text-white' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    <span className="text-base font-medium">{item.label}</span>
                    {active && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/15 border border-white/20">Now</span>
                    )}
                    {active && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </a>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </motion.div>

      {/* Desktop bar */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-30 hidden md:block ${className}`}>
        <div
          ref={desktopBarRef}
          className="px-4 py-2 rounded-full border border-white/20 backdrop-blur-xl flex items-center gap-2"
        >
          <img src="/assets/images/logo.svg" alt="Glass" className="w-5 h-5" />
          <span className="text-sm font-medium">Glass</span>
          <span className="w-px h-4 bg-white/20 mx-2" />
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.a
                key={item.href}
                href={item.href}
                className={`text-sm transition-all duration-300 relative ${
                  isActive ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 px-3 py-1 block">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-white/5 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(255,255,255,0.1)',
                        '0 0 8px rgba(255,255,255,0.2)',
                        '0 0 0px rgba(255,255,255,0.1)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </motion.a>
            );
          })}
        </div>
      </div>
    </>
  );
}



