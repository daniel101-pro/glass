'use client';

import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle animated sheen on the glass pill
    let t = 0;
    let raf: number;
    const loop = () => {
      t += 0.008;
      const bg = `linear-gradient(135deg, rgba(255,255,255,${0.06 + Math.sin(t)*0.03}) 0%, rgba(255,255,255,0.08) 100%)`;
      if (barRef.current) barRef.current.style.background = bg;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const links = [
    { href: '/new-landing', label: 'Glass' },
    { href: '#blur', label: 'Blur' },
    { href: '#why', label: 'Why' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <footer className={`relative pt-20 pb-24 ${className}`}>
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Decorative band-aid shapes (match reference aesthetic) */}
      <DecoCluster className="hidden md:block absolute -top-10 left-2" rotation={-18} />
      <DecoCluster className="hidden md:block absolute -top-12 right-4" rotation={22} />

      {/* Center glass pill */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-center">
          <div
            ref={barRef}
            className="relative z-10 flex items-center gap-3 rounded-full border border-white/20 backdrop-blur-xl bg-white/10 px-2 py-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          >
            {/* Brand token */}
            <div className="ml-1 mr-1">
              <div className="relative w-8 h-8 rounded-full bg-white/5 border border-white/20 grid place-items-center overflow-hidden">
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 1px 6px rgba(255,255,255,0.15)' }} />
                <span className="text-[13px] font-semibold text-white tracking-tight">G</span>
              </div>
            </div>

            {/* Links */}
            {links.map((l) => (
              <motion.a
                key={l.href}
                href={l.href}
                className="relative text-sm text-white/85 hover:text-white transition-colors px-3 py-1 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {l.label}
              </motion.a>
            ))}

            {/* Divider */}
            <span className="mx-1 w-px h-4 bg-white/20" />

            {/* CTA */}
            <motion.a
              href="/onboarding"
              className="text-sm font-medium text-white px-3 py-1 rounded-full border border-white/25 bg-white/10 hover:bg-white/15 transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Early Access
            </motion.a>
          </div>
        </div>

        {/* Legal strip */}
        <div className="mt-6 text-center text-[13px] text-white/60">
          © {new Date().getFullYear()} Glass. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function DecoCluster({ className = '', rotation = 0 }: { className?: string; rotation?: number }) {
  return (
    <div className={className} style={{ transform: `rotate(${rotation}deg)` }}>
      <DecoBand x={0} y={0} rotate={0} />
      <DecoBand x={36} y={-20} rotate={70} />
      <DecoBand x={-32} y={-18} rotate={-70} />
    </div>
  );
}

function DecoBand({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <div
      className="absolute w-36 h-16 rounded-[22px] bg-white/5 border border-white/25 backdrop-blur-2xl overflow-hidden"
      style={{ transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)` }}
    >
      <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 140% at 20% 20%, rgba(255,255,255,0.18), rgba(255,255,255,0) 60%)' }} />
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 1px 12px rgba(255,255,255,0.12)' }} />
    </div>
  );
}


