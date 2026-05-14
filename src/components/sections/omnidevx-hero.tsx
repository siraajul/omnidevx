'use client';

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const animateStatNumber = (el: HTMLElement) => {
  const targetVal = Number.parseFloat(el.dataset.val || '0');
  const format = el.dataset.format || '';
  const isFloat = format === 'percent';
  
  const obj = { val: 0 };
  gsap.to(obj, {
    val: targetVal,
    duration: 2.5,
    ease: "power3.out",
    delay: 0.8,
    onUpdate: () => {
      const formatted = isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toString();
      if (format === 'percent') el.innerHTML = formatted + '%';
      else if (format === 'plus') el.innerHTML = formatted + '+';
      else el.innerHTML = formatted;
    }
  });
};

/* ─── Phone Mockup (Right Column) ─── */
function PhoneMockup() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <button 
      type="button"
      className="relative flex items-center justify-center cursor-pointer group bg-transparent border-none appearance-none p-0 m-0 text-left"
      style={{ perspective: "1500px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 3D Container */}
      <div
        className="relative w-[280px] h-[580px] sm:w-[300px] sm:h-[620px] transition-transform duration-700 ease-out"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        {/* ======================= */}
        {/* FACE 1: iPHONE (FRONT)  */}
        {/* ======================= */}
        <div 
          className="absolute inset-0 bg-white border-[12px] border-[#161616] rounded-[3rem] overflow-hidden flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: 'rgba(17, 17, 17, 0.15) 15px 20px 0px -5px' 
          }}
        >
          {/* Hardware details: Side buttons */}
          <div className="absolute -left-[16px] top-[100px] w-[4px] h-8 bg-[#161616] rounded-l-md" />
          <div className="absolute -left-[16px] top-[150px] w-[4px] h-12 bg-[#161616] rounded-l-md" />
          <div className="absolute -left-[16px] top-[210px] w-[4px] h-12 bg-[#161616] rounded-l-md" />
          <div className="absolute -right-[16px] top-[160px] w-[4px] h-16 bg-[#161616] rounded-r-md" />

          {/* Screen Background */}
          <div className="absolute inset-0 bg-[#FDFCF7] z-0" />

          {/* Dynamic Island / Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#161616] rounded-full z-20 flex items-center justify-end px-2 shadow-sm">
             {/* Camera lens reflection */}
             <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222] shadow-[inset_0_0_2px_rgba(255,255,255,0.2)]" />
          </div>

          {/* Screen Content Wrapper */}
          <div className="relative z-10 flex-1 flex flex-col pt-14 px-5 pb-6 overflow-hidden">
            
            {/* App Header */}
            <div className="flex items-center justify-between" style={{ fontFamily: "'Kalam', cursive" }}>
              <span className="text-sm text-[#161616] font-semibold tracking-wide">◀ omnidev<span className="text-[#2A6FDB]">X</span></span>
              <span className="text-[#161616] font-bold text-xl leading-none -mt-2 tracking-widest">...</span>
            </div>

            {/* App Headline */}
            <div className="mt-8">
              <h3 className="text-[36px] font-bold text-[#161616] leading-[1.05]" style={{ fontFamily: "'Caveat', cursive" }}>
                your MVP,<br/>live.
              </h3>
              <p className="text-sm text-[#444] mt-2 leading-relaxed">
                from idea to production in just 14 days.
              </p>
            </div>

            {/* Spacer to push content down */}
            <div className="flex-1" />

            {/* Placeholder UI Elements (Simulating a sleek app interface) */}
            <div className="flex flex-col gap-3 w-full">
              <div className="mockup-card w-full bg-white rounded-2xl p-3 border border-[#e8e5db] shadow-sm flex items-center gap-3 transition-transform hover:scale-[1.02]">
                 <div className="w-10 h-10 rounded-xl bg-[#2A6FDB]/10 flex items-center justify-center">
                   <span className="text-[#2A6FDB] text-lg">⚡</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-[#161616] uppercase tracking-wide">Live Dashboard</span>
                   <span className="text-[10px] text-[#71717a]">Real-time analytics</span>
                 </div>
              </div>

              <div className="mockup-card w-full bg-white rounded-2xl p-3 border border-[#e8e5db] shadow-sm flex items-center gap-3 transition-transform hover:scale-[1.02]">
                 <div className="w-10 h-10 rounded-xl bg-[#FF8C42]/10 flex items-center justify-center">
                   <span className="text-[#FF8C42] text-lg">⚙️</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-[#161616] uppercase tracking-wide">API Metrics</span>
                   <span className="text-[10px] text-[#71717a]">0 ms latency • 100% uptime</span>
                 </div>
              </div>
            </div>

            {/* App CTA Button */}
            <button
              className="w-full mt-5 py-4 bg-[#161616] text-white text-[16px] rounded-2xl transition-transform active:scale-95 hover:bg-[#2A6FDB] shadow-md pointer-events-none"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              open app →
            </button>
          </div>
        </div>

        {/* ========================= */}
        {/* FACE 2: ANDROID (BACK)    */}
        {/* ========================= */}
        <div 
          className="absolute inset-0 bg-white border-[10px] border-[#2A2A2A] rounded-[2.5rem] overflow-hidden flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)', 
            boxShadow: 'rgba(17, 17, 17, 0.15) 15px 20px 0px -5px' 
          }}
        >
          {/* Hardware details: Android Buttons (usually all on right side) */}
          <div className="absolute -right-[14px] top-[120px] w-[4px] h-10 bg-[#2A2A2A] rounded-r-md" />
          <div className="absolute -right-[14px] top-[180px] w-[4px] h-20 bg-[#2A2A2A] rounded-r-md" />

          {/* Screen Background */}
          <div className="absolute inset-0 bg-[#F5F5F5] z-0" />

          {/* Hole-punch Camera */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#111] rounded-full z-20 flex items-center justify-center border-[2px] border-[#2A2A2A]">
             <div className="w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_0_1px_rgba(255,255,255,0.4)]" />
          </div>

          {/* Android UI Content */}
          <div className="relative z-10 flex-1 flex flex-col pt-16 px-4 pb-6 overflow-hidden">
             
             {/* Material App Header */}
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[#34A853]/10 flex items-center justify-center text-[#34A853] font-bold text-sm">A</div>
               <div className="flex flex-col">
                 <span className="text-sm font-bold text-[#161616] font-sans tracking-tight">omnidevX Android</span>
                 <span className="text-[9px] text-[#444] uppercase tracking-widest font-medium">Material Interface</span>
               </div>
             </div>

             <div className="mt-8">
               <h3 className="text-[34px] font-black text-[#161616] tracking-tight font-sans leading-[1.1]">
                 Material<br/>Design MVP.
               </h3>
               <p className="text-sm text-[#444] mt-2 leading-relaxed">
                 Seamlessly deployed to the Play Store.
               </p>
             </div>

             <div className="flex-1" />

             {/* Android Material Cards */}
             <div className="flex flex-col gap-3 w-full">
               <div className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-1 border-l-[4px] border-[#34A853]">
                  <span className="text-[10px] font-bold text-[#34A853] uppercase tracking-wider">System Status</span>
                  <span className="text-[13px] font-bold text-[#161616]">All services operational</span>
               </div>
               <div className="w-full bg-white rounded-xl p-4 shadow-sm flex flex-col gap-1 border-l-[4px] border-[#EA4335]">
                  <span className="text-[10px] font-bold text-[#EA4335] uppercase tracking-wider">Error Logs</span>
                  <span className="text-[13px] font-bold text-[#161616]">0 errors found</span>
               </div>
             </div>

             {/* Android Bottom Navigation Bar */}
             <div className="w-full h-14 bg-white rounded-full mt-6 shadow-md flex items-center justify-between px-8">
                <div className="w-4 h-4 rounded-sm border-2 border-[#161616] opacity-30" />
                <div className="w-5 h-5 rounded-full border-2 border-[#161616]" />
                <div className="w-4 h-4 border-l-2 border-b-2 border-[#161616] rotate-45 opacity-30" />
             </div>
          </div>
        </div>
      </div>

      {/* Annotation below phone */}
      <span
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-[#2A6FDB] italic whitespace-nowrap transition-all duration-300 group-hover:scale-110"
        style={{ fontFamily: "'Kalam', cursive" }}
      >
        {isFlipped ? "← android deployed →" : "← tap to flip →"}
      </span>
    </button>
  );
}

/* ─── Orange Blob SVG Decoration ─── */
function OrangeBlob() {
  const [clicks, setClicks] = useState(0);
  const innerRef = useRef<SVGGElement>(null);

  const handleClick = () => {
    if (clicks >= 10) return;
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= 10) {
      // Pop!
      gsap.to(innerRef.current, {
        scale: 1.8,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        transformOrigin: "center center"
      });
    } else {
      // Squish
      gsap.fromTo(innerRef.current, 
        { scaleX: 1.25, scaleY: 0.75, transformOrigin: "center center" },
        { scaleX: 1, scaleY: 1, duration: 1.2, ease: 'elastic.out(1, 0.3)' }
      );
    }
  };

  return (
    <svg
      onClick={handleClick}
      className={`absolute -right-20 -top-20 w-[400px] h-[400px] opacity-20 pointer-events-auto cursor-pointer select-none z-0 ${clicks < 10 ? 'blob-animate' : ''}`}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .blob-animate {
          animation: blob-spin 25s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes blob-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
      <g ref={innerRef}>
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
      </g>
    </svg>
  );
}

/* ─── Hero Section ─── */
export default function OmnidevxHero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // 1. Animate left column content
      gsap.fromTo('.hero-fade',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
      );
      
      // 2. Draw the scribble underline dynamically
      gsap.to('.scribble-svg path', {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: 1
      });

      // 3. Animate phone mockup entrance, then seamlessly transition into a continuous float
      gsap.fromTo('.hero-phone',
        { y: 60, opacity: 0, rotate: 3 },
        { 
          y: 0, opacity: 1, rotate: 0, duration: 1.2, ease: 'power3.out', delay: 0.6,
          onComplete: () => {
            gsap.to('.hero-phone', {
              y: -15,
              duration: 2.5,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut'
            });
          }
        }
      );

      // 5. Stat Number Count-up Animation
      (gsap.utils.toArray('.stat-number') as HTMLElement[]).forEach(animateStatNumber);

      // 4. Stagger internal phone UI cards jumping in after the phone enters
      gsap.fromTo('.mockup-card',
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)', delay: 1.2 }
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
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 text-[#2A6FDB]">AI-powered products</span>
                <svg className="absolute w-full h-[14px] -bottom-1 left-0 stroke-[#2A6FDB] z-0 scribble-svg pointer-events-none" viewBox="0 0 200 12" preserveAspectRatio="none" fill="none">
                  <path d="M 3 9 C 50 2 150 2 197 9" strokeWidth="4" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="200" />
                </svg>
              </span>{' '}
              that ship in weeks, not months.
            </h1>

            {/* Subtitle */}
            <p className="hero-fade opacity-0 text-lg sm:text-xl text-[#2A2A2A] max-w-[520px] leading-relaxed">
              an elite engineering agency for startups who need production-ready MVPs, scalable platforms, and intelligent automation — without the big-agency overhead.
            </p>

            {/* CTA Buttons & Social Proof Row */}
            <div
              className="hero-fade opacity-0 flex flex-wrap items-center gap-6 mt-4"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <div className="flex flex-wrap items-center gap-4">
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

              {/* Animated Avatar Group (Moved here for better conversion & layout) */}
              <div className="hidden sm:flex items-center gap-3 pl-2 sm:pl-4 sm:border-l sm:border-[#e8e5db]">
                <div className="flex items-center -space-x-3 rtl:space-x-reverse">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                  ].map((src, idx) => (
                    <img
                      key={src}
                      className="w-9 h-9 rounded-full border-2 border-[#FDFCF7] shadow-sm object-cover hover:-translate-y-1 transition-transform duration-300"
                      src={src}
                      alt="Client Avatar"
                      style={{
                        animation: `float 3s ease-in-out infinite`,
                        animationDelay: `${idx * 0.2}s`
                      }}
                    />
                  ))}
                  <style>{`
                    @keyframes float {
                      0%, 100% { transform: translateY(0); }
                      50% { transform: translateY(-4px); }
                    }
                  `}</style>
                </div>
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-0.5 text-[#f59e0b] text-[10px]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <span className="text-[11px] text-[#444] font-sans tracking-wide mt-0.5 uppercase">Loved by founders</span>
                </div>
              </div>
            </div>

            {/* Core Stat Strip (Restored Original Alignment) */}
            <div
              className="hero-fade opacity-0 flex flex-wrap items-center gap-5 sm:gap-6 mt-6 text-sm"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#161616] stat-number inline-block min-w-[40px]" data-val="50" data-format="plus">0+</span>
                <span className="text-[#444]">products shipped</span>
              </div>
              <div className="w-px h-5 bg-[#e8e5db]" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#161616]">
                  <span className="stat-number inline-block min-w-[24px]" data-val="14" data-format="none">0</span> days
                </span>
                <span className="text-[#444]">avg MVP delivery</span>
              </div>
              <div className="w-px h-5 bg-[#e8e5db] hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-2xl font-bold text-[#161616] stat-number inline-block min-w-[56px]" data-val="99.9" data-format="percent">0.0%</span>
                <span className="text-[#444]">uptime SLA</span>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN (Phone Mockup) ── */}
          <div className="hero-phone opacity-0 hidden lg:flex items-center justify-center lg:justify-end xl:pr-8">
            <div className="transform transition-transform duration-500 origin-center lg:origin-right lg:scale-[0.95] xl:scale-[1.15]">
              <PhoneMockup />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
