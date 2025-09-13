'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'motion/react';
import SplitText from '../TextAnimations/SplitText/SplitText';
import BlurText from '../TextAnimations/BlurText/BlurText';
import GradientBlinds from '../Backgrounds/GradientBlinds/GradientBlinds';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Hyperspeed = dynamic(() => import('./Hyperspeed'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />
});
import { Plus_Jakarta_Sans } from 'next/font/google';

// Removed 3D Scene import - now using static seenow.svg image
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400','600','700','800'], display: 'swap' });

export default function NewLandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  const handleAnimationComplete = () => {
    console.log('Hero animation completed!');
  };

  return (
    <div className={`min-h-screen bg-black text-white relative overflow-x-hidden ${jakarta.className}`}> 
      {/* Navigation */}
      <Navigation />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center">
        {/* Gradient Blinds background */}
        <div className="absolute inset-0">
          <GradientBlinds
            gradientColors={['#FF9FFC', '#5227FF']}
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

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-[48px] md:text-[64px] font-bold tracking-tight mb-6"
          >
            <div className="inline-flex items-center gap-4">
              <BlurText
                text="Clarity"
                className="text-white"
                delay={0.2}
              />
              <BlurText
                text="starts"
                className="text-white/40"
                delay={0.4}
              />
              <BlurText
                text="here"
                className="text-white/40"
                delay={0.6}
              />
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            AI-powered fact-checking and media verification — from live meetings to articles, images, and videos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
            className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <button className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:opacity-90 transition">
              Get Early Access
            </button>
            <a href="/learn" className="px-6 py-3 rounded-full border border-white/30 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition">
              Learn more
            </a>
          </motion.div>
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
            Glass works in the background, scanning the world around you — text, images, audio, and video — to separate fact from fiction in real time.
          </motion.p>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            {['Conversations', 'Documents', 'Images & Video', 'Social Media', 'Everyday Use'].map((tab, index) => (
              <motion.button
                key={tab}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 rounded-full text-sm transition-all border text-white/75 hover:text-white bg-transparent border-white/20"
              >
                {tab}
              </motion.button>
            ))}
          </motion.div>

          {/* Media mock */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            className="mt-10 flex justify-center"
          >
            <Image
              src="/assets/images/seenow.svg"
              alt="See through the Glass"
              width={1600}
              height={900}
              className="w-full max-w-4xl h-auto"
              priority
            />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
            className="mt-8"
          >
            <button className="px-6 py-3 rounded-full border border-white/30 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition">
              Try Glass Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* WHY GLASS */}
      <section className="relative py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <h2 className="text-[34px] md:text-[40px] font-semibold tracking-tight text-white/90">
              <span className="text-white/80">Why </span>
              <span className="text-white">Glass</span>
            </h2>
            <p className="mt-3 text-white/85 max-w-3xl mx-auto leading-snug">
              In a world drowning in misinformation, Glass provides the clarity you need to make informed decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Real-time Verification",
                description: "Get instant fact-checks as you browse, read, or watch content.",
                gradient: "from-blue-500/20 to-purple-500/20"
              },
              {
                title: "AI-Powered Analysis",
                description: "Advanced algorithms detect deepfakes, manipulated media, and false claims.",
                gradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                title: "Source Transparency",
                description: "See where information comes from and how reliable it is.",
                gradient: "from-pink-500/20 to-red-500/20"
              },
              {
                title: "Privacy First",
                description: "Your data stays private. We verify without storing your content.",
                gradient: "from-green-500/20 to-blue-500/20"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative rounded-[18px] border border-white/25 bg-white/10 backdrop-blur-xl p-6 text-white overflow-hidden group"
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/20" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-white/85 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW GLASS WORKS */}
      <HowGlassWorksSection />

      {/* THE TRUTH SHOULDN'T BE BLURRY */}
      <TruthSection />

      {/* SCROLL CINEMA */}
      <section id="works" className="relative py-32">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white/80">Scroll through </span>
              <span className="text-white">the future</span>
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Experience Glass in action. See how it seamlessly integrates into your workflow, 
              providing instant verification without disrupting your flow.
            </p>
            <button className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:opacity-90 transition">
              Start Your Journey
            </button>
          </div>
          <div className="relative h-[500px] rounded-2xl border border-white/20 overflow-hidden bg-white/5">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(99,102,241,0.25), rgba(0,0,0,0) 70%)' }} />
            <Image
              src="/assets/images/seenow.svg"
              alt="Glass in action"
              fill
              className="object-cover"
              priority
            />
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

function HowGlassWorksSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      // Calculate scroll progress (0 to 1) - more aggressive triggering
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top + sectionHeight * 0.3) / (windowHeight + sectionHeight * 0.7)
      ));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Built for Speed",
      description: "Select text on any site, hit ⌘/ (or Ctrl/), get results.",
      position: { left: "8%", top: "16%" },
      pathProgress: 0.1,
      cardProgress: 0.15
    },
    {
      id: 2,
      title: "Context on the go",
      description: "See fact-checks, source bias, credibility instantly.",
      position: { right: "6%", top: "40%" },
      pathProgress: 0.3,
      cardProgress: 0.35
    },
    {
      id: 3,
      title: "Stay in flow",
      description: "No tab-switching, no time wasted. Glass follows you around.",
      position: { left: "10%", top: "60%" },
      pathProgress: 0.5,
      cardProgress: 0.55
    },
    {
      id: 4,
      title: "Learn & improve",
      description: "Glass gets smarter with every interaction, adapting to your needs.",
      position: { right: "6%", bottom: "4%" },
      pathProgress: 0.7,
      cardProgress: 0.75
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-28">
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
        <div className="relative mt-10 h-[820px] rounded-[18px]">
          {/* SVG connectors with scroll-based drawing */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1200 820" 
            preserveAspectRatio="none"
          >
            <g stroke="rgba(255,255,255,0.55)" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.8">
              {/* 1 -> 2 */}
              <path 
                d="M320,260 C500,520 680,480 760,430" 
                strokeDasharray="1000"
                strokeDashoffset={1000 - (scrollProgress * 1000)}
                style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
              />
              {/* 1 -> 4 */}
              <path 
                d="M340,300 C560,520 760,720 860,740" 
                strokeDasharray="1200"
                strokeDashoffset={1200 - (Math.max(0, scrollProgress - 0.1) * 1200)}
                style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
              />
              {/* 3 -> 2 */}
              <path 
                d="M300,560 C520,470 700,460 760,430" 
                strokeDasharray="1000"
                strokeDashoffset={1000 - (Math.max(0, scrollProgress - 0.2) * 1000)}
                style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
              />
              {/* 3 -> 4 */}
              <path 
                d="M330,580 C520,680 720,760 840,740" 
                strokeDasharray="1200"
                strokeDashoffset={1200 - (Math.max(0, scrollProgress - 0.3) * 1200)}
                style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
              />
              {/* 2 -> 4 */}
              <path 
                d="M760,430 C760,520 800,660 840,740" 
                strokeDasharray="800"
                strokeDashoffset={800 - (Math.max(0, scrollProgress - 0.4) * 800)}
                style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
              />
            </g>
          </svg>

          {/* Step cards with scroll-based reveal */}
          {steps.map((step) => {
            const isVisible = scrollProgress >= step.cardProgress;
            const isPathVisible = scrollProgress >= step.pathProgress;
            
            return (
              <div
                key={step.id}
                className="absolute"
                style={step.position}
              >
                {/* Step number */}
                <div className={`flex items-center gap-2 mb-2 ${step.position.right ? 'justify-end' : ''}`}>
                  <motion.div 
                    animate={isVisible ? { 
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 0 0px rgba(255,255,255,0.2)',
                        '0 0 15px rgba(255,255,255,0.3)',
                        '0 0 0px rgba(255,255,255,0.2)'
                      ]
                    } : {}}
                    transition={{ 
                      scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                      boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    }}
                    className={`w-8 h-8 rounded-full bg-white/10 border border-white/30 shadow-sm flex items-center justify-center text-white/90 text-sm transition-all duration-500 ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                  >
                    {step.id}
                  </motion.div>
                </div>
                
                {/* Step card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.8,
                    y: isVisible ? 0 : 20
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`rounded-[14px] border border-white/25 bg-white/10 backdrop-blur-xl text-white p-4 w-[360px] transition-all duration-500 ${
                    step.id === 2 ? 'rotate-[-3deg] w-[380px]' : 
                    step.id === 4 ? 'rotate-[2deg] w-[380px]' : ''
                  }`}
                >
                  <div className="text-lg font-semibold">{step.title}</div>
                  <p className="mt-2 text-white/85 text-sm leading-snug">{step.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TruthSection() {
  const [active, setActive] = useState('Deepfakes');
  
  // Real-time data for each category
  const data = {
    'Deepfakes': {
      title: 'Deepfake Detection',
      description: 'AI-generated videos and images are becoming indistinguishable from reality.',
      stats: {
        '2019': { value: 8, label: '~8,000', height: 'h-5' },
        '2024': { value: 550, label: '~550,000', height: 'h-[180px]' }
      },
      increase: '60–70× increase (6,600%)',
      detail: 'Deepfake technology has advanced rapidly, making it increasingly difficult to distinguish between real and synthetic media. This poses significant risks for misinformation and identity fraud.'
    },
    'Misinformation': {
      title: 'Misinformation Spread',
      description: 'False information spreads faster and wider than ever before.',
      stats: {
        '2019': { value: 12, label: '~12,000', height: 'h-6' },
        '2024': { value: 850, label: '~850,000', height: 'h-[200px]' }
      },
      increase: '70× increase (7,000%)',
      detail: 'Social media algorithms amplify false information, with misleading content reaching millions before fact-checkers can respond. The speed of misinformation now outpaces verification efforts.'
    },
    'Trust & Verification': {
      title: 'Trust in Media',
      description: 'Public trust in traditional media sources continues to decline.',
      stats: {
        '2019': { value: 65, label: '65%', height: 'h-[120px]' },
        '2024': { value: 32, label: '32%', height: 'h-[60px]' }
      },
      increase: '50% decrease in trust',
      detail: 'Trust in media has plummeted as people struggle to identify reliable sources. This decline creates fertile ground for conspiracy theories and alternative narratives to take root.'
    }
  };

  const currentData = data[active as keyof typeof data];

  return (
    <section className="relative py-28">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h3 className="text-[30px] md:text-[36px] font-semibold tracking-tight">
          <span className="text-white/90">The truth shouldn't be </span>
          <span className="text-white blur-sm">blurry.</span>
        </h3>
        <p className="mt-3 text-white/80 leading-snug">
          Every day, fake news, AI-generated content, and distorted information flood our feeds. It's harder than ever to know
          what's real and what's not. <span className="text-white">Glass gives you clarity.</span>
        </p>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {Object.keys(data).map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                active === tab
                  ? 'text-white bg-white/10 border-white/25'
                  : 'text-white/70 hover:text-white bg-transparent border-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Glass chart card */}
        <div className="mt-6 mx-auto rounded-[22px] bg-white/10 backdrop-blur-xl border border-white/20 p-5 md:p-7 max-w-3xl text-left">
          {/* Dynamic title */}
          <div className="text-center mb-4">
            <h4 className="text-white text-lg font-semibold">{currentData.title}</h4>
            <p className="text-white/70 text-sm mt-1">{currentData.description}</p>
          </div>

          {/* Top labels */}
          <div className="flex items-start justify-between text-white/90 font-semibold">
            <div className="text-center">
              <div className="text-base">2019 :</div>
              <div className="text-base">({currentData.stats['2019'].label})</div>
            </div>
            <div className="text-center">
              <div className="text-base">2024 :</div>
              <div className="text-base">({currentData.stats['2024'].label})</div>
            </div>
          </div>

          {/* Dynamic Bars */}
          <div className="relative mt-6 grid grid-cols-2 items-end gap-6 min-h-[220px]">
            <div className="flex items-end">
              <div className={`w-24 ${currentData.stats['2019'].height} rounded-full bg-white/20 border border-white/25 transition-all duration-1000`} />
            </div>
            <div className="flex items-end justify-end">
              <div className={`w-24 md:w-28 ${currentData.stats['2024'].height} rounded-[14px] bg-white/85 transition-all duration-1000`} />
            </div>
          </div>

          {/* Dynamic increase text */}
          <div className="mt-6">
            <p className="text-white/90 text-lg font-medium">{currentData.increase}</p>
            <p className="mt-3 text-white/80 leading-snug">
              {currentData.detail}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-6 flex justify-center">
            <button className="px-5 py-2 text-white text-sm rounded-full bg-transparent backdrop-blur-sm border border-white/25 hover:scale-105 transition-all">
              Start using Glass
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
