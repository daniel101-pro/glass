'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'motion/react';
import SplitText from '../TextAnimations/SplitText/SplitText';
import BlurText from '../TextAnimations/BlurText/BlurText';
import GradientBlinds from '../Backgrounds/GradientBlinds/GradientBlinds';

const Hyperspeed = dynamic(() => import('./Hyperspeed'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />
});
import { Plus_Jakarta_Sans } from 'next/font/google';

// React Three Fiber scene is split out so the rest of the page can stream instantly
const Scene = dynamic(() => import('./scene/Scene').then(m => m.Scene), { ssr: false, loading: () => null });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400','600','700','800'], display: 'swap' });

export default function NewLandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const glassBarRef = useRef<HTMLDivElement>(null);

  const handleAnimationComplete = () => {
    console.log('Hero animation completed!');
  };

  useEffect(() => {
    // simple sheen loop on top navbar
    let t = 0; let raf: number;
    const el = glassBarRef.current;
    const loop = () => {
      t += 0.008;
      if (el) el.style.background = `linear-gradient(135deg, rgba(255,255,255,${0.06 + Math.sin(t)*0.03}) 0%, rgba(255,255,255,0.08) 100%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`min-h-screen bg-black text-white relative overflow-x-hidden ${jakarta.className}`}> 
      {/* Floating top glass nav */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div ref={glassBarRef} className="px-4 py-2 rounded-full border border-white/20 backdrop-blur-xl flex items-center gap-2">
          <img src="/logo.svg" alt="Glass" className="w-5 h-5" />
          <span className="text-sm font-medium">Glass</span>
          <span className="w-px h-4 bg-white/20 mx-2" />
          <a href="#why" className="text-sm text-white/80 hover:text-white">Why</a>
          <a href="#works" className="text-sm text-white/80 hover:text-white">How</a>
          <a href="/onboarding" className="ml-2 text-sm px-3 py-1 rounded-full bg-white/10 border border-white/25 hover:bg-white/15">Get Access</a>
        </div>
      </div>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center">
        {/* Gradient Blinds background */}
        <div className="absolute inset-0">
          <GradientBlinds
            gradientColors={["#FF9FFC", "#5227FF"]}
            angle={44}
            noise={0.73}
            blindCount={32}
            blindMinWidth={95}
            spotlightRadius={0.3}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.26}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
          />
        </div>


        {/* copy */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-center" style={{ WebkitFontSmoothing: 'antialiased', fontKerning: 'normal', fontVariantLigatures: 'common-ligatures' }}>
            <span className="inline-flex items-baseline gap-4">
              <BlurText
                text="Clarity"
                delay={150}
                animateBy="chars"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="inline-block text-white"
              />
              <BlurText
                text="starts here"
                delay={250}
                animateBy="words"
                direction="top"
                className="inline-block text-white/40"
              />
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent inline-block" style={{ backgroundImage: 'linear-gradient(90deg,#7dd3fc,#60a5fa,#a78bfa)' }}>
                  <BlurText
                    text="Glass"
                    delay={350}
                    animateBy="chars"
                    direction="top"
                    className="inline-block opacity-40"
                  />
                </span>
              </span>
            </span>
          </h1>
          <p className="mt-5 text-white/80 text-lg md:text-xl">An award‑level, glassmorphic experience. Real‑time fact‑checking, 3D clarity, and cinematic scroll.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a href="/onboarding" className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:opacity-90 transition">Start Now</a>
            <a href="#why" className="px-6 py-3 rounded-full border border-white/30 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition">Learn more</a>
          </div>
        </div>
      </section>

      {/* SEE THROUGH THE GLASS */}
      <section className="relative py-28 overflow-hidden">
        {/* Hyperspeed background - properly contained */}
        <div className="absolute inset-0 -z-10">
          <Hyperspeed
            effectOptions={{
              onSpeedUp: () => {},
              onSlowDown: () => {},
              distortion: 'turbulentDistortion',
              length: 400,
              roadWidth: 10,
              islandWidth: 2,
              lanesPerRoad: 3,
              fov: 90,
              fovSpeedUp: 150,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 20,
              lightPairsPerRoadWay: 40,
              shoulderLinesWidthPercentage: 0.05,
              brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [400 * 0.03, 400 * 0.2],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.8, 0.8],
              carFloorSeparation: [0, 5],
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                sticks: 0x03b3c3
              }
            }}
          />
        </div>
        <div className="relative z-20 max-w-5xl mx-auto text-center px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-[34px] md:text-[40px] font-semibold tracking-tight"
          >
            <span className="text-white/85">See through the </span>
            <span className="text-white">Glass</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-3 text-white/85 max-w-3xl mx-auto leading-snug"
          >
            Glass works in the background, scanning the world around you — text,
            images, audio, and video — to separate fact from fiction in real time.
          </motion.p>

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            {['Conversations', 'Documents', 'Images & Video', 'Social Media', 'Everyday Use'].map((t, index) => (
              <motion.button
                key={t}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0.1)',
                    '0 0 20px rgba(255,255,255,0.2)',
                    '0 0 0px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                  'Conversations' === t
                    ? 'text-white bg-white/10 border-white/25'
                    : 'text-white/75 hover:text-white bg-transparent border-white/20'
                }`}
              >
                {t}
              </motion.button>
            ))}
          </motion.div>

          {/* Media Mock */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            className="mt-8"
          >
            <motion.div 
              animate={{ 
                boxShadow: [
                  '0 0 0px rgba(255,255,255,0.1)',
                  '0 0 30px rgba(255,255,255,0.15)',
                  '0 0 0px rgba(255,255,255,0.1)'
                ]
              }}
              transition={{ 
                boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="relative rounded-[28px] border border-white/25 bg-white/10 backdrop-blur-xl p-3 md:p-5"
            >
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/15">
                <Image
                  src="/assets/images/seenow.svg"
                  alt="See now"
                  width={1600}
                  height={900}
                  className="w-full h-auto"
                  priority
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs"
                >
                  Conversations
                </motion.div>
              </div>
            </motion.div>

            {/* CTA below mock */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
              className="mt-8"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0.1)',
                    '0 0 15px rgba(255,255,255,0.2)',
                    '0 0 0px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="px-5 py-2.5 text-white font-medium text-[14px] tracking-tight transition-all rounded-full bg-transparent backdrop-blur-sm border border-white/20"
              >
                Get Early Access
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY (dark to our blue) */}
      <section id="why" className="relative py-28 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold">Why Glass</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {['Truth in motion','Signal over noise','Proof, not promises'].map((title, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: 0.08 * i, duration: 0.6 }}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-white/75">Advanced heuristics + AI + on‑device magic. Every claim checked, sourced, and shown beautifully.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW GLASS WORKS */}
      <section className="relative py-28">
        <div className="max-w-6xl mx-auto px-6">
          {/* Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <h3 className="text-[32px] md:text-[38px] font-semibold tracking-tight text-white/90">
              <span className="text-white/80">How </span>
              <span className="text-white">Glass</span>
              <span className="text-white/80"> Works.</span>
            </h3>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/25 rounded-full px-2 py-1 backdrop-blur-sm"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0.1)',
                    '0 0 10px rgba(255,255,255,0.15)',
                    '0 0 0px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="px-3 py-1 text-sm rounded-full text-white bg-white/10 border border-white/20"
              >
                Overlay
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 text-sm rounded-full text-white/85"
              >
                Dashboard
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Canvas area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="relative mt-10 h-[820px] rounded-[18px]"
          >
            {/* SVG connectors */}
            <motion.svg 
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 2, delay: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 1200 820" 
              preserveAspectRatio="none"
            >
              <g stroke="rgba(255,255,255,0.55)" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.8">
                {/* 1 -> 2 */}
                <path d="M320,260 C500,520 680,480 760,430" />
                {/* 1 -> 4 */}
                <path d="M340,300 C560,520 760,720 860,740" />
                {/* 3 -> 2 */}
                <path d="M300,560 C520,470 700,460 760,430" />
                {/* 3 -> 4 */}
                <path d="M330,580 C520,680 720,760 840,740" />
                {/* 2 -> 4 */}
                <path d="M760,430 C760,520 800,660 840,740" />
              </g>
            </motion.svg>

            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -50, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
              className="absolute left-[8%] top-[16%]"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0px rgba(255,255,255,0.2)',
                      '0 0 15px rgba(255,255,255,0.3)',
                      '0 0 0px rgba(255,255,255,0.2)'
                    ]
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/30 shadow-sm flex items-center justify-center text-white/90 text-sm"
                >
                  1
                </motion.div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0.1)',
                    '0 0 20px rgba(255,255,255,0.15)',
                    '0 0 0px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="rounded-[14px] border border-white/25 bg-white/10 backdrop-blur-xl text-white p-4 w-[360px]"
              >
                <div className="text-lg font-semibold">Built for Speed</div>
                <p className="mt-2 text-white/85 text-sm leading-snug">Select text on any site, hit ⌘/ (or Ctrl/), get results.</p>
              </motion.div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 50, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
              className="absolute right-[6%] top-[40%]"
            >
              <div className="flex items-center gap-2 mb-2 justify-end">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0px rgba(255,255,255,0.2)',
                      '0 0 15px rgba(255,255,255,0.3)',
                      '0 0 0px rgba(255,255,255,0.2)'
                    ]
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                    boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/30 shadow-sm flex items-center justify-center text-white/90 text-sm"
                >
                  2
                </motion.div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0.1)',
                    '0 0 20px rgba(255,255,255,0.15)',
                    '0 0 0px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                }}
                className="rounded-[14px] border border-white/25 bg-white/10 backdrop-blur-xl text-white p-4 w-[380px] rotate-[-3deg]"
              >
                <div className="text-lg font-semibold">Context on the go</div>
                <p className="mt-2 text-white/85 text-sm leading-snug">See fact-checks, source bias, credibility instantly.</p>
              </motion.div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, x: -50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
              className="absolute left-[10%] top-[60%]"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0px rgba(255,255,255,0.2)',
                      '0 0 15px rgba(255,255,255,0.3)',
                      '0 0 0px rgba(255,255,255,0.2)'
                    ]
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 },
                    boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/30 shadow-sm flex items-center justify-center text-white/90 text-sm"
                >
                  3
                </motion.div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0.1)',
                    '0 0 20px rgba(255,255,255,0.15)',
                    '0 0 0px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }
                }}
                className="rounded-[14px] border border-white/25 bg-white/10 backdrop-blur-xl text-white p-4 w-[360px]"
              >
                <div className="text-lg font-semibold">Stay in flow</div>
                <p className="mt-2 text-white/85 text-sm leading-snug">No tab-switching, no time wasted. Glass follows you around.</p>
              </motion.div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0, x: 50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
              className="absolute right-[6%] bottom-[4%]"
            >
              <div className="flex items-center gap-2 mb-2 justify-end">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0px rgba(255,255,255,0.2)',
                      '0 0 15px rgba(255,255,255,0.3)',
                      '0 0 0px rgba(255,255,255,0.2)'
                    ]
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
                    boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/30 shadow-sm flex items-center justify-center text-white/90 text-sm"
                >
                  4
                </motion.div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0.1)',
                    '0 0 20px rgba(255,255,255,0.15)',
                    '0 0 0px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
                }}
                className="rounded-[14px] border border-white/25 bg-white/10 backdrop-blur-xl text-white p-4 w-[400px] rotate-[-4deg]"
              >
                <div className="text-lg font-semibold">Works everywhere</div>
                <p className="mt-2 text-white/85 text-sm leading-snug">Social posts, news articles, PDFs — if you can see it, you can Glass it.</p>
              </motion.div>
            </motion.div>

            {/* CTA bottom center */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-1/2 bottom-[2%]"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0.1)',
                    '0 0 15px rgba(255,255,255,0.2)',
                    '0 0 0px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="px-5 py-2.5 text-white text-sm rounded-full bg-transparent backdrop-blur-sm border border-white/25"
              >
                Get Early Access
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* THE TRUTH SHOULDN'T BE BLURRY */}
      <section className="relative py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-[34px] md:text-[40px] font-semibold tracking-tight text-white"
            >
              The truth shouldn't be{' '}
              <span className="blur-sm">blurry</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="mt-6 text-white/85 max-w-4xl mx-auto leading-relaxed text-lg"
            >
              Every day, fake news, AI-generated content, and distorted information flood our feeds. 
              It's harder than ever to know what's real and what's not. Glass gives you clarity.
            </motion.p>

            {/* Keywords */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6"
            >
              {['Deepfakes', 'Misinformation', 'Trust & Verification'].map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                  className={`text-white text-lg font-medium ${
                    keyword === 'Misinformation' ? 'blur-sm' : ''
                  }`}
                >
                  {keyword}
                </motion.span>
              ))}
            </motion.div>

            {/* Data Visualization */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 1.0, ease: 'easeOut' }}
              className="mt-16 flex items-end justify-center gap-16"
            >
              {/* 2019 Data */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="text-white text-lg font-semibold mb-4">2019: (~8,000)</div>
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: 'auto' }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 1.5, delay: 1.4, ease: 'easeOut' }}
                  className="w-16 h-8 bg-white rounded-full mx-auto"
                />
              </motion.div>

              {/* 2024 Data */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="text-white text-lg font-semibold mb-4">2024: (~550,000)</div>
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: 'auto' }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 2, delay: 1.6, ease: 'easeOut' }}
                  className="w-16 h-80 bg-white rounded-full mx-auto"
                />
              </motion.div>
            </motion.div>

            {/* Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 1.8, ease: 'easeOut' }}
              className="mt-8"
            >
              <div className="text-white text-xl font-bold">
                That's a 60-70× increase (6,600%)
              </div>
            </motion.div>

            {/* Supporting Text */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 2.0, ease: 'easeOut' }}
              className="mt-8 text-white/85 max-w-4xl mx-auto leading-relaxed text-lg"
            >
              Every day, fake news, AI-generated content, and distorted information flood our feeds. 
              It's harder than ever to know what's real and what's not. Glass gives you clarity.
            </motion.p>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 2.2, ease: 'easeOut' }}
              className="mt-10"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0.1)',
                    '0 0 20px rgba(255,255,255,0.2)',
                    '0 0 0px rgba(255,255,255,0.1)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="px-8 py-4 text-white font-semibold text-lg rounded-full bg-transparent backdrop-blur-sm border-2 border-white/30 hover:bg-white/10 transition-all"
              >
                Start using Glass
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
            whileInView={{ opacity: 0.3, scale: 1, rotate: -45 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            className="absolute top-10 right-10 w-32 h-32 blur-xl bg-white/20 rounded-full"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 45 }}
            whileInView={{ opacity: 0.2, scale: 1, rotate: 45 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.5, delay: 0.7, ease: 'easeOut' }}
            className="absolute bottom-10 left-10 w-40 h-40 blur-2xl bg-white/15 rounded-full"
          />
        </div>
      </section>

      {/* SCROLL CINEMA */}
      <section id="works" className="relative py-32">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-[28px] md:text-[36px] font-semibold">Cinematic scroll, instant context</h3>
            <p className="mt-3 text-white/80">Select text anywhere, hit ⌘/ and watch Glass pull citations, cross‑check sources, and flag misinformation in real time.</p>
            <div className="mt-6 flex gap-3">
              <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10">Realtime</span>
              <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10">On‑device</span>
              <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10">Private</span>
            </div>
          </div>
          <div className="relative h-[420px] rounded-[22px] border border-white/20 overflow-hidden bg-white/5">
            <Suspense fallback={null}><Scene minimal /></Suspense>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h3 className="text-3xl md:text-4xl font-semibold">Clarity deserves a better surface.</h3>
          <p className="mt-3 text-white/75">Join early adopters using Glass across meetings, social feeds, and research.</p>
          <a href="/onboarding" className="inline-block mt-8 px-6 py-3 rounded-full bg-white text-black font-semibold hover:opacity-90 transition">Get Early Access</a>
        </div>
      </section>
    </div>
  );
}


