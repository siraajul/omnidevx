'use client';

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/* ─── Phone Mockup (Right Column) ─── */
function PhoneMockup() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Phone Frame */}
      <div
        className="relative w-[260px] sm:w-[280px] md:w-[300px] flex flex-col bg-white rounded-[2.5rem] p-4 gap-3"
        style={{ boxShadow: 'rgba(17, 17, 17, 0.13) 6px 8px 0px 0px' }}
      >
        {/* Notch */}
        <div className="mx-auto w-20 h-5 bg-[#f5f3ea] rounded-full" />

        {/* Screen Content */}
        <div className="flex flex-col gap-3 px-2 pb-4">
          {/* App Header */}
          <div className="flex items-center justify-between" style={{ fontFamily: "'Kalam', cursive" }}>
            <span className="text-sm text-[#161616] font-normal">◀ omnidevx</span>
            <span className="text-[#444] text-sm">· · ·</span>
          </div>

          {/* App Headline */}
          <div>
            <h3 className="text-[26px] font-bold text-[#161616] leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
              your MVP, live.
            </h3>
            <p className="text-sm text-[#444] mt-1">from idea to production in 14 days.</p>
          </div>

          {/* Placeholder Cards */}
          <div className="flex flex-col gap-2.5 mt-1">
            <div
              className="w-full h-20 rounded-xl flex items-center justify-center text-xs text-[#444]"
              style={{
                fontFamily: "'Kalam', cursive",
                backgroundImage: 'repeating-linear-gradient(45deg, #fafaf3 0px, #fafaf3 10px, #f4f1e6 10px, #f4f1e6 20px)'
              }}
            >
              [ live dashboard ]
            </div>
            <div
              className="w-full h-10 rounded-lg flex items-center justify-center text-xs text-[#444]"
              style={{
                fontFamily: "'Kalam', cursive",
                backgroundImage: 'repeating-linear-gradient(135deg, #fbfaf1 0px, #fbfaf1 10px, #f1ecdb 10px, #f1ecdb 20px)'
              }}
            >
              [ API metrics ]
            </div>
          </div>

          {/* App CTA Button */}
          <button
            className="w-full mt-1 py-3 bg-[#111] text-white text-sm rounded-xl transition-colors hover:bg-[#2A6FDB]"
            style={{ fontFamily: "'Kalam', cursive" }}
          >
            start building →
          </button>
        </div>
      </div>

      {/* Annotation below phone */}
      <span
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-[#2A6FDB] italic whitespace-nowrap"
      >
        ← what we deliver →
      </span>
    </div>
  );
}

/* ─── Orange Blob SVG Decoration ─── */
function OrangeBlob() {
  return (
    <svg
      className="absolute -right-20 -top-20 w-[400px] h-[400px] opacity-20 pointer-events-none select-none z-0"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M280 60c60 30 100 90 100 160s-50 130-120 150c-70 20-140-10-180-60S30 180 70 120C110 60 180 10 280 60z"
        fill="#FF8C42"
        opacity="0.6"
      />
      <path
        d="M300 100c50 40 70 100 50 160s-80 100-150 100c-70 0-130-40-150-100S60 130 120 80c60-50 130-20 180 20z"
        fill="#FFA654"
        opacity="0.4"
      />
    </svg>
  );
}

/* ─── Hero Section ─── */
export default function OmnidevxHero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Animate left column content
      gsap.fromTo('.hero-fade',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
      );
      // Animate phone mockup
      gsap.fromTo('.hero-phone',
        { y: 60, opacity: 0, rotate: 3 },
        { y: 0, opacity: 1, rotate: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#FDFCF7] overflow-hidden"
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.055) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Orange Blob */}
      <OrangeBlob />

      {/* Main Content — Classic Split */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-16 pt-28 sm:pt-32 md:pt-36 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center min-h-[70vh]">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">

            {/* Pill Tag */}
            <div
              className="hero-fade opacity-0 inline-flex items-center gap-2 bg-white border border-[#e8e5db] rounded-full px-4 py-2 text-sm text-[#161616] shadow-sm"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <span className="text-[#2A6FDB]">↳</span>
              <span>now accepting projects — Q3 slots open</span>
            </div>

            {/* Headline */}
            <h1
              className="hero-fade opacity-0 text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-[#161616] tracking-[0.2px]"
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
            >
              we build{' '}
              <span className="scribble-underline text-[#2A6FDB]">AI-powered products</span>{' '}
              that ship in weeks, not months.
            </h1>

            {/* Subtitle */}
            <p className="hero-fade opacity-0 text-lg sm:text-xl text-[#2A2A2A] max-w-[520px] leading-relaxed">
              an elite engineering agency for startups who need production-ready MVPs, scalable platforms, and intelligent automation — without the big-agency overhead.
            </p>

            {/* CTA Buttons Row */}
            <div
              className="hero-fade opacity-0 flex flex-wrap items-center gap-4 mt-2"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#111] text-white text-lg rounded-full transition-all duration-300 hover:bg-[#2A6FDB] hover:shadow-lg hover:scale-105"
              >
                start a project →
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-[#161616] text-lg border-b-2 border-[#161616] rounded-none transition-all duration-300 hover:text-[#2A6FDB] hover:border-[#2A6FDB]"
              >
                see our work
              </a>
            </div>

            {/* Stat Strip */}
            <div
              className="hero-fade opacity-0 flex flex-wrap items-center gap-5 sm:gap-6 mt-4 text-sm"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#161616]">50+</span>
                <span className="text-[#444]">products shipped</span>
              </div>
              <div className="w-px h-5 bg-[#e8e5db]" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#161616]">2 wk</span>
                <span className="text-[#444]">avg MVP delivery</span>
              </div>
              <div className="w-px h-5 bg-[#e8e5db] hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-2xl font-bold text-[#161616]">99.9%</span>
                <span className="text-[#444]">uptime SLA</span>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN (Phone Mockup) ── */}
          <div className="hero-phone opacity-0 hidden lg:flex items-center justify-center lg:justify-end">
            <PhoneMockup />
          </div>

        </div>
      </div>

      {/* Hatched line decoration at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent 0px, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 7px)',
        }}
      />
    </section>
  );
}
