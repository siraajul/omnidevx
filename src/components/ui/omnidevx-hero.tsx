'use client';

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

/* ---------------- LettersPullUp ---------------- */
interface LettersPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}

const LettersPullUp = ({ text, className = "", showAsterisk = false }: LettersPullUpProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const letters = text.split("");

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.letter-anim', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'power4.out', delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`inline-flex ${className}`}>
      {letters.map((char, i) => (
        <span key={i} className="letter-anim inline-block opacity-0 relative">
          {char}
          {showAsterisk && i === letters.length - 1 && (
            <span className="absolute top-[0.1em] -right-[0.4em] text-[0.31em] text-blue-500">*</span>
          )}
        </span>
      ))}
    </div>
  );
};

/* ---------------- Hero ---------------- */
export default function OmnidevxHero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.fade-up-anim',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 1 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen w-full">
      <div className="relative h-full w-full overflow-hidden bg-zinc-900">
        
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />

        {/* CSS Noise overlay trick */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Gradient overlays for text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />


        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 sm:px-10 md:px-16 lg:pb-12">
          <div className="grid grid-cols-12 items-end gap-6 md:gap-12">
            
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-black leading-[0.85] tracking-tighter text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] text-white"
              >
                <LettersPullUp text="OMNIDEVX" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-6 pb-2 lg:col-span-4 lg:pb-8">
              
              <p
                className="fade-up-anim opacity-0 text-sm md:text-base lg:text-lg text-zinc-300 leading-relaxed max-w-md font-medium"
              >
                Omnidevx is a global engineering collective building intelligent software systems for high-growth startups and visionary founders.
              </p>

              <button
                className="fade-up-anim opacity-0 group inline-flex items-center gap-4 self-start rounded-full bg-white py-2 pl-6 pr-2 text-sm font-bold uppercase tracking-widest text-black transition-all hover:gap-6 sm:text-base hover:bg-zinc-100"
              >
                Explore Services
                <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
