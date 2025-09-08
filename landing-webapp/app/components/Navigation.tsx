'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const pathname = usePathname();
  const glassBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple sheen loop on top navbar
    let t = 0; 
    let raf: number;
    const el = glassBarRef.current;
    const loop = () => {
      t += 0.008;
      if (el) el.style.background = `linear-gradient(135deg, rgba(255,255,255,${0.06 + Math.sin(t)*0.03}) 0%, rgba(255,255,255,0.08) 100%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/enterprise', label: 'Enterprise' },
    { href: '/careers', label: 'Careers' },
    { href: '/help', label: 'Help Center' },
  ];

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 ${className}`}>
      <div 
        ref={glassBarRef} 
        className="px-4 py-2 rounded-full border border-white/20 backdrop-blur-xl flex items-center gap-2"
      >
        <img src="/logo.svg" alt="Glass" className="w-5 h-5" />
        <span className="text-sm font-medium">Glass</span>
        <span className="w-px h-4 bg-white/20 mx-2" />
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <motion.a
              key={item.href}
              href={item.href}
              className={`text-sm transition-all duration-300 relative ${
                isActive 
                  ? 'text-white' 
                  : 'text-white/80 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
              <span className="relative z-10 px-3 py-1 block">
                {item.label}
              </span>
              
              {/* Glow effect for active item */}
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
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}

