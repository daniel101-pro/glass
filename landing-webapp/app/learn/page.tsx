'use client';

import { useEffect, useRef } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400','600','700','800'], display: 'swap' });

export default function LearnPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !sectionsRef.current) return;

    const ctx = gsap.context(() => {
      // Hero stagger intro
      gsap.from('[data-hero-stagger]', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
      });

      // Scroll reveal for all .reveal
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el, i) => {
        gsap.fromTo(el, { y: 36, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        });
      });

      // Parallax bands
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amt = Number(el.dataset.parallax) || 50;
        gsap.to(el, {
          y: amt,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Progress bar
      const progress = document.querySelector('#learn-progress');
      if (progress) {
        gsap.to(progress, {
          scaleX: 1,
          transformOrigin: '0% 50%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionsRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          }
        });
      }
    }, [heroRef, sectionsRef]);

    return () => ctx.revert();
  }, []);

  const pillars = [
    {
      title: 'Real-time Fact Checks',
      detail: 'Instant verification overlays for text, images, and video timelines — no context switching.'
    },
    {
      title: 'Source Transparency',
      detail: 'Weighted credibility signals and provenance hints from diverse, reputable sources.'
    },
    {
      title: 'Privacy by Design',
      detail: 'On-device processing where possible, strict encryption, and ephemeral session handling.'
    },
    {
      title: 'Explainability',
      detail: 'Clear, human-readable rationales and citations accompany every verdict.'
    },
  ];

  const flows = [
    {
      name: 'Conversations',
      steps: [
        'Live meeting notes are scanned for claims.',
        'Claims resolve against trusted knowledge graphs.',
        'Inline verdict chips appear with confidence bands.',
      ],
    },
    {
      name: 'Articles & Feeds',
      steps: [
        'Selection hotkey summons the overlay.',
        'Cross-doc entity linking builds context fast.',
        'One-tap citations expand into source cards.',
      ],
    },
    {
      name: 'Images & Video',
      steps: [
        'Per-frame signals (compression, shadows, edges).',
        'Camera path and reflection consistency checks.',
        'Reverse search and provenance scoring.',
      ],
    },
  ];

  return (
    <div className={`min-h-screen bg-black text-white ${jakarta.className}`}>
      <Navigation />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-[2px] bg-white/10">
        <div id="learn-progress" className="h-full bg-white/70" style={{ transform: 'scaleX(0)' }} />
      </div>

      {/* Hero */}
      <section ref={heroRef} className="pt-28 md:pt-36 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight">
            <span data-hero-stagger className="inline-block">Learn more about </span>
            <span data-hero-stagger className="inline-block text-white/70">Glass</span>
          </h1>
          <p data-hero-stagger className="mt-4 text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            A deep dive into what Glass is, how it works, and why it matters.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="/onboarding" className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:opacity-90 transition">Get Early Access</a>
            <a href="/pricing" className="px-5 py-2 rounded-full border border-white/25 bg-white/10 hover:bg-white/15 transition">Pricing</a>
          </div>
        </div>
      </section>

      <div ref={sectionsRef}>
        {/* Pillars */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
              <div key={p.title} className="reveal rounded-[18px] border border-white/25 bg-white/10 backdrop-blur-xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" data-parallax="30" />
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-white/85">{p.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works flows */}
        <section className="py-10">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="reveal text-3xl md:text-4xl font-semibold text-center">How Glass Works</h2>
            <p className="reveal mt-3 text-center text-white/80 max-w-3xl mx-auto">Under the hood, Glass balances speed, accuracy, and privacy.</p>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {flows.map((flow, idx) => (
                <div key={flow.name} className="reveal rounded-[18px] border border-white/25 bg-white/10 backdrop-blur-xl p-6">
                  <div className="text-white/70 text-sm">{String(idx + 1).padStart(2, '0')}</div>
                  <h3 className="mt-1 text-xl font-semibold">{flow.name}</h3>
                  <ul className="mt-3 space-y-2">
                    {flow.steps.map((s) => (
                      <li key={s} className="text-white/85 leading-relaxed">• {s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="reveal text-3xl md:text-4xl font-semibold text-center">FAQ</h2>
            <div className="mt-6 space-y-4">
              {[
                ['Is my data safe?', 'Yes. We prioritize privacy with on-device processing wherever feasible and strict encryption for cloud workflows.'],
                ['What sources do you cite?', 'We aggregate from diverse, reputable sources and expose citations for each verdict.'],
                ['How fast is it?', 'Most responses return in under a second for text, and within a few seconds for media checks.'],
              ].map(([q, a]) => (
                <div key={q} className="reveal rounded-[14px] border border-white/20 bg-white/10 backdrop-blur-xl p-4">
                  <div className="text-white font-medium">{q}</div>
                  <div className="text-white/85 mt-2">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}


