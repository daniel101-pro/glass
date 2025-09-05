'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GlassLoaderProps {
  isVisible: boolean;
  message?: string;
  submessage?: string;
}

export default function GlassLoader({ 
  isVisible, 
  message = "Loading...", 
  submessage = "Please wait a moment" 
}: GlassLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !glassRef.current || !cubeRef.current || !textRef.current) return;

    if (isVisible) {
      // Show loading overlay
      gsap.set(overlayRef.current, { display: 'flex' });
      
      // Animate overlay fade in with blur
      gsap.fromTo(overlayRef.current, 
        { opacity: 0, backdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(20px)', duration: 0.8, ease: 'power2.out' }
      );

      // Animate glass cube entrance
      gsap.fromTo(glassRef.current, 
        { scale: 0.3, opacity: 0, rotateX: -90, rotateY: -90 },
        { scale: 1, opacity: 1, rotateX: 0, rotateY: 0, duration: 1.2, ease: 'back.out(1.4)', delay: 0.3 }
      );

      // Continuous 3D rotation
      gsap.to(cubeRef.current, {
        rotateX: 360,
        rotateY: 360,
        duration: 4,
        ease: 'none',
        repeat: -1
      });

      // Text animation
      gsap.fromTo(textRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.6 }
      );

    } else {
      // Hide loading overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { display: 'none' });
          }
        }
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        display: 'none'
      }}
    >
      {/* Main Glass Container */}
      <div
        ref={glassRef}
        className="relative flex flex-col items-center"
        style={{ perspective: '1000px' }}
      >
        {/* 3D Rotating Glass Cube */}
        <div
          ref={cubeRef}
          className="relative mb-8"
          style={{
            width: '120px',
            height: '120px',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(0deg) rotateY(0deg)'
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 border border-white/30 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(15px)',
              transform: 'translateZ(60px)'
            }}
          />

          {/* Back Face */}
          <div
            className="absolute inset-0 border border-white/30 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(15px)',
              transform: 'translateZ(-60px) rotateY(180deg)'
            }}
          />

          {/* Right Face */}
          <div
            className="absolute inset-0 border border-white/30 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(15px)',
              transform: 'rotateY(90deg) translateZ(60px)'
            }}
          />

          {/* Left Face */}
          <div
            className="absolute inset-0 border border-white/30 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(15px)',
              transform: 'rotateY(-90deg) translateZ(60px)'
            }}
          />

          {/* Top Face */}
          <div
            className="absolute inset-0 border border-white/30 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(15px)',
              transform: 'rotateX(90deg) translateZ(60px)'
            }}
          />

          {/* Bottom Face */}
          <div
            className="absolute inset-0 border border-white/30 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(15px)',
              transform: 'rotateX(-90deg) translateZ(60px)'
            }}
          />
        </div>

        {/* Loading Text */}
        <div ref={textRef} className="text-center">
          <h3 className="text-2xl font-light text-white mb-2 tracking-wide">
            {message}
          </h3>
          <p className="text-white/60 text-sm">
            {submessage}
          </p>
        </div>


      </div>


    </div>
  );
}
