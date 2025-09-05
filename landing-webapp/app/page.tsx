'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import SplitText from './TextAnimations/SplitText/SplitText';

export default function Home() {
  const router = useRouter();
  const topCloudRef = useRef(null);
  const bottomCloudRef = useRef(null);
  const buttonRef = useRef(null);
  const mouseFollowerRef = useRef(null);
  const star1Ref = useRef(null);
  const star2Ref = useRef(null);

  const handleGetEarlyAccess = () => {
    router.push('/onboarding');
  };

  const handleWatchDemo = () => {
    // Demo functionality
    console.log('Watch Demo clicked');
  };

  useEffect(() => {
    // Stronger, always-on drift so movement is obvious
    gsap.to(topCloudRef.current, {
      x: 300,
      y: -80,
      duration: 10,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to(bottomCloudRef.current, {
      x: -300,
      y: 60,
      duration: 14,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Button breathing animation
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Star breathing animations
    gsap.to(star1Ref.current, {
      scale: 1.1,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(star2Ref.current, {
      scale: 1.08,
      duration: 2.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });


    // Mouse follower effect
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseFollowerRef.current) {
        gsap.to(mouseFollowerRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Glass Mouse Follower */}
      <div 
        ref={mouseFollowerRef}
        className="fixed w-40 h-40 pointer-events-none z-50 flex items-center justify-center"
        style={{
          background: 'transparent',
          borderRadius: '50%',
          backdropFilter: 'blur(1px)',
          border: '1px solid rgba(255,255,255,0.1)',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Inner completely clear circle - completely isolated from parent blur */}
        <div 
          className="w-24 h-24 rounded-full relative"
          style={{
            background: 'transparent',
            backdropFilter: 'none',
            border: '1px solid rgba(255,255,255,0.05)',
            isolation: 'isolate',
            filter: 'none',
            zIndex: 1
          }}
        />
      </div>

      {/* Top Left Cloud */}
      <div 
        ref={topCloudRef} 
        className="absolute w-[400px] h-[400px] opacity-60 -top-16 -left-[110px]"
      >
        <Image
          src="/assets/images/cloud1.svg"
          alt="Cloud decoration"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Bottom Right Cloud */}
      <div 
        ref={bottomCloudRef} 
        className="absolute w-[300px] h-[300px] opacity-50 -bottom-20 right-0"
      >
        <Image
          src="/assets/images/cloud2.svg"
          alt="Cloud decoration"
          fill
          className="object-cover"
          priority
        />
      </div>


      {/* Top Navigation Bar */}
      <div className="relative z-20 flex justify-center pt-8">
        <div className="relative flex items-center gap-2 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-full px-3 py-2 border border-white/20">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full">
            <img src="/logo.svg" alt="Glass" className="w-5 h-5" />
            <span className="text-sm font-medium text-white">Glass</span>
          </span>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-white/10 border border-white/30">Permissions</button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white/70 hover:text-white/90">Scan</button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white/70 hover:text-white/90">Chatbot</button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white/70 hover:text-white/90">Profile</button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white/70 hover:text-white/90">Customization</button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white/70 hover:text-white/90">Settings</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tighter text-center">
            <SplitText
              text="Clarity"
              className="text-white"
              delay={50}
              duration={0.4}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              tag="span"
            />
            {" "}
            <SplitText
              text="starts here."
              className="text-white/70"
              delay={50}
              duration={0.4}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              tag="span"
            />
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center max-w-2xl mb-8">
          <p className="text-[18px] md:text-[20px] text-white/85 leading-tight">
            AI-powered fact-checking and media verification —
            <br />
            from live meetings to articles, images, and videos.
          </p>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            ref={buttonRef}
            onClick={handleGetEarlyAccess}
            className="px-5 py-2.5 text-white font-medium text-[14px] tracking-tight hover:scale-105 transition-all duration-300 relative border border-white/20 rounded-full bg-transparent backdrop-blur-sm"
          >
            Get Early Access
          </button>
          <button
            onClick={handleWatchDemo}
            className="px-5 py-2.5 text-white/85 font-medium text-[14px] tracking-tight hover:scale-105 transition-all duration-300 relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-full"
          >
            Watch Demo
          </button>
        </div>
      </div>


      {/* Feature Section: See through the Glass */}
      <FeatureSection />

      {/* Evidence Section: The truth shouldn’t be blurry. */}
      <TruthSection />

      {/* Why Glass Section */}
      <WhyGlassSection />

      {/* How Glass Works Section */}
      <WorksSection />

      {/* Footer Section */}
      <FooterSection />

      {/* Diagonal glass elements */}
      <div ref={star1Ref} className="pointer-events-none absolute -top-6 -right-3 opacity-70 rotate-12">
        <Image src="/assets/images/star1.svg" alt="star" width={260} height={80} />
      </div>
      <div ref={star2Ref} className="pointer-events-none absolute left-[-60px] bottom-[120px] opacity-50 -rotate-25">
        <Image src="/assets/images/star2.svg" alt="star" width={320} height={90} />
      </div>
    </div>
  );
}

function FeatureSection() {
  const [active, setActive] = useState('Conversations');
  const tabs = ['Conversations', 'Documents', 'Images & Video', 'Social Media', 'Everyday Use'];

  return (
    <section className="relative z-20 mt-28 mb-24 px-4">

      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-[34px] md:text-[40px] font-semibold tracking-tight">
          <span className="text-white/85">See through the </span>
          <span className="text-white">Glass</span>
        </h2>
        <p className="mt-3 text-white/85 max-w-3xl mx-auto leading-snug">
          Glass works in the background, scanning the world around you — text,
          images, audio, and video — to separate fact from fiction in real time.
        </p>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                active === t
                  ? 'text-white bg-white/10 border-white/25'
                  : 'text-white/75 hover:text-white bg-transparent border-white/20'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Media Mock */}
        <div className="mt-8">
          <div className="relative rounded-[28px] border border-white/25 bg-white/10 backdrop-blur-xl p-3 md:p-5">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/15">
              <Image
                src="/assets/images/seenow.svg"
                alt="See now"
                width={1600}
                height={900}
                className="w-full h-auto"
                priority
              />
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs">
                {active}
              </div>
            </div>
          </div>

          {/* CTA below mock */}
          <div className="mt-8">
            <button className="px-5 py-2.5 text-white font-medium text-[14px] tracking-tight transition-all rounded-full bg-transparent backdrop-blur-sm border border-white/20 hover:scale-105">
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TruthSection() {
  const [active, setActive] = useState('Deepfakes');
  const tabs = ['Deepfakes', 'Misinformation', 'Trust & Verification'];

  return (
    <section className="relative z-20 mt-24 mb-28 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-[30px] md:text-[36px] font-semibold tracking-tight">
          <span className="text-white/90">The truth shouldn’t be </span>
          <span className="text-white">blurry.</span>
        </h3>
        <p className="mt-3 text-white/80 leading-snug">
          Every day, fake news, AI-generated content, and distorted information flood our feeds. It’s harder than ever to know
          what’s real and what’s not. <span className="text-white">Glass gives you clarity.</span>
        </p>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                active === t
                  ? 'text-white bg-white/10 border-white/25'
                  : 'text-white/70 hover:text-white bg-transparent border-white/20'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Glass chart card */}
        <div className="mt-6 mx-auto rounded-[22px] bg-white/10 backdrop-blur-xl border border-white/20 p-5 md:p-7 max-w-3xl text-left">
          {/* Top labels */}
          <div className="flex items-start justify-between text-white/90 font-semibold">
            <div className="text-center">
              <div className="text-base">2019 :</div>
              <div className="text-base">(~8,000)</div>
            </div>
            <div className="text-center">
              <div className="text-base">2024 :</div>
              <div className="text-base">(~550,000)</div>
            </div>
          </div>

          {/* Bars */}
          <div className="relative mt-6 grid grid-cols-2 items-end gap-6 min-h-[220px]">
            <div className="flex items-end">
              <div className="w-24 h-5 rounded-full bg-white/20 border border-white/25" />
            </div>
            <div className="flex items-end justify-end">
              <div className="w-24 md:w-28 h-[180px] rounded-[14px] bg-white/85" />
            </div>
          </div>

          {/* Increase text */}
          <div className="mt-6">
            <p className="text-white/90 text-lg font-medium">That’s a 60–70× increase (6,600%).</p>
            <p className="mt-3 text-white/80 leading-snug">
              Every day, fake news, AI-generated content, and distorted information flood our feeds. It’s harder than ever to know
              what’s real and what’s not. <span className="text-white">Glass gives you clarity.</span>
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

function WhyGlassSection() {
  return (
    <section className="relative z-20 mt-16 mb-24 px-4">
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Sharp Accuracy card */}
        <div className="rounded-[18px] border border-white/25 bg-white/10 backdrop-blur-xl p-4 md:p-5 text-white/90">
          <h4 className="text-xl font-semibold mb-3">Sharp Accuracy</h4>
          <div className="rounded-[14px] border border-white/25 bg-white/10 p-3">
            <div className="text-sm opacity-90 mb-2">Claim</div>
            <div className="text-[13px] opacity-90">“Nigeria is Africa’s largest oil exporter.” <span className="ml-2 text-emerald-300">True</span></div>
            <ul className="mt-2 text-[13px] opacity-90 list-disc list-inside">
              <li>Nigeria is consistently the top crude oil exporter in Africa, ahead of Angola and Algeria.</li>
            </ul>
            <div className="mt-3 text-sm opacity-90">Sources:</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <a className="px-3 py-1 rounded-full bg-white/10 border border-white/25 underline" href="#">OPEC Annual Report (2024) →</a>
              <a className="px-3 py-1 rounded-full bg-white/10 border border-white/25 underline" href="#">EIA World Oil Data →</a>
            </div>
            <div className="mt-3">
              <button className="px-3 py-1 rounded-full bg-white/10 border border-white/25">Close Reasoning</button>
            </div>
          </div>
          <p className="mt-3 text-white/85 text-sm leading-snug">Every claim, every source, every detail checked against the strongest signals. No fluff—just truth.</p>
        </div>

        {/* Built for Speed card */}
        <div className="rounded-[18px] border border-white/25 bg-white/10 backdrop-blur-xl p-4 md:p-5 text-white/90">
          <h4 className="text-xl font-semibold mb-3">Built for Speed</h4>
          <div className="mt-20" />
          <p className="text-white/85 text-sm leading-snug">Get Answers in seconds. Forget hours of digging. Hit ⌘/ (or Ctrl/) to fact-check instantly—right where you are.</p>
        </div>

        {/* Transparent Proof card */}
        <div className="rounded-[18px] border border-white/25 bg-white/10 backdrop-blur-xl p-4 md:p-5 text-white/90">
          <h4 className="text-xl font-semibold mb-3">Transparent Proof</h4>
          <div className="rounded-[14px] border border-white/25 bg-white/10 p-3">
            <div className="text-sm opacity-90">Sources:</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <a className="px-3 py-1 rounded-full bg-white/10 border border-white/25 underline" href="#">OPEC Annual Report (2024) →</a>
              <a className="px-3 py-1 rounded-full bg-white/10 border border-white/25 underline" href="#">EIA World Oil Data →</a>
            </div>
            <div className="mt-2">
              <button className="px-3 py-1 rounded-full bg-white/10 border border-white/25">Close Reasoning</button>
            </div>
            <div className="mt-3 text-[13px] opacity-90">“Nigeria accounts for ~15% of world’s oil exports.”</div>
            <div className="mt-2">
              <button className="px-3 py-1 rounded-full bg-white/10 border border-white/25">See Reasoning</button>
            </div>
          </div>
          <p className="mt-3 text-white/85 text-sm leading-snug">We don’t just say what’s real—we show you why. Evidence, context, and reasoning you can trust.</p>
        </div>

        {/* Always With You card */}
        <div className="rounded-[18px] border border-white/25 bg-white/10 backdrop-blur-xl p-4 md:p-5 text-white/90">
          <h4 className="text-xl font-semibold mb-3">Always With You</h4>
          <div className="mt-20" />
          <p className="text-white/85 text-sm leading-snug">Glass lives where you are—your browser, your chats, your workflow. No switching apps, no friction.</p>
          <div className="mt-6">
            <button className="px-5 py-2 text-white text-sm rounded-full bg-transparent backdrop-blur-sm border border-white/25">Get Early Access</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorksSection() {
  // Static layout that mirrors the screenshot
  return (
    <section className="relative z-20 mt-10 mb-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h3 className="text-[32px] md:text-[38px] font-semibold tracking-tight text-white/90">
            <span className="text-white/80">How </span>
            <span className="text-white">Glass</span>
            <span className="text-white/80"> Works.</span>
          </h3>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/25 rounded-full px-2 py-1 backdrop-blur-sm">
            <button className="px-3 py-1 text-sm rounded-full text-white bg-white/10 border border-white/20">Overlay</button>
            <button className="px-3 py-1 text-sm rounded-full text-white/85">Dashboard</button>
          </div>
        </div>

        {/* Canvas area */}
        <div className="relative mt-10 h-[820px] rounded-[18px]">
          {/* SVG connectors */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 820" preserveAspectRatio="none">
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
          </svg>

          {/* Step 1 */}
          <div className="absolute left-[8%] top-[16%]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/30 shadow-sm flex items-center justify-center text-white/90 text-sm">1</div>
            </div>
            <div className="rounded-[14px] border border-white/25 bg-white/10 backdrop-blur-xl text-white p-4 w-[360px]">
              <div className="text-lg font-semibold">Built for Speed</div>
              <p className="mt-2 text-white/85 text-sm leading-snug">Select text on any site, hit ⌘/ (or Ctrl/), get results.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="absolute right-[6%] top-[40%]">
            <div className="flex items-center gap-2 mb-2 justify-end">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/30 shadow-sm flex items-center justify-center text-white/90 text-sm">2</div>
            </div>
            <div className="rounded-[14px] border border-white/25 bg-white/10 backdrop-blur-xl text-white p-4 w-[380px] rotate-[-3deg]">
              <div className="text-lg font-semibold">Context on the go</div>
              <p className="mt-2 text-white/85 text-sm leading-snug">See fact-checks, source bias, credibility instantly.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="absolute left-[10%] top-[60%]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/30 shadow-sm flex items-center justify-center text-white/90 text-sm">3</div>
            </div>
            <div className="rounded-[14px] border border-white/25 bg-white/10 backdrop-blur-xl text-white p-4 w-[360px]">
              <div className="text-lg font-semibold">Stay in flow</div>
              <p className="mt-2 text-white/85 text-sm leading-snug">No tab-switching, no time wasted. Glass follows you around.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="absolute right-[6%] bottom-[4%]">
            <div className="flex items-center gap-2 mb-2 justify-end">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/30 shadow-sm flex items-center justify-center text-white/90 text-sm">4</div>
            </div>
            <div className="rounded-[14px] border border-white/25 bg-white/10 backdrop-blur-xl text-white p-4 w-[400px] rotate-[-4deg]">
              <div className="text-lg font-semibold">Works everywhere</div>
              <p className="mt-2 text-white/85 text-sm leading-snug">Social posts, news articles, PDFs — if you can see it, you can Glass it.</p>
            </div>
          </div>

          {/* CTA bottom center */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[2%]">
            <button className="px-5 py-2.5 text-white text-sm rounded-full bg-transparent backdrop-blur-sm border border-white/25">Get Early Access</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="relative z-20 mt-20 mb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Decorative glass elements */}
        <div className="relative mb-12">
          {/* Glass pill shapes - inspired by the image */}
          <div className="absolute -top-8 left-8 w-16 h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 rotate-12 opacity-60"></div>
          <div className="absolute -top-4 left-16 w-12 h-24 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 rotate-[-8deg] opacity-70"></div>
          <div className="absolute top-2 right-12 w-20 h-40 rounded-full bg-white/8 backdrop-blur-sm border border-white/15 rotate-[-15deg] opacity-50"></div>
          <div className="absolute top-6 right-24 w-14 h-28 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 rotate-25 opacity-65"></div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">G</span>
              </div>
              <span className="text-white font-semibold text-lg">Glass</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              AI-powered fact-checking and media verification — from live meetings to articles, images, and videos. See through the noise.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Browser Extension</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">API</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">About</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Glass divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Social links with glass effect */}
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/15 transition-colors">
              <span className="text-white/70 text-xs">T</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/15 transition-colors">
              <span className="text-white/70 text-xs">L</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/15 transition-colors">
              <span className="text-white/70 text-xs">G</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-xs">© 2024 Glass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
