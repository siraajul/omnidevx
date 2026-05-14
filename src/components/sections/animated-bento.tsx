'use client';

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (globalThis.window !== undefined) {
  gsap.registerPlugin(ScrollTrigger);
}

function SpeedIndicator() {
  const [loading, setLoading] = useState(true);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  // Re-run animation occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      setTimeout(() => setLoading(false), 1200);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Count up animation
  useEffect(() => {
    if (!loading && numberRef.current) {
       const obj = { val: 0 };
       gsap.to(obj, { val: 14, duration: 1.5, ease: "power3.out", onUpdate: () => {
         if (numberRef.current) numberRef.current.innerHTML = Math.round(obj.val) + " DAYS";
       }});
    } else if (loading && numberRef.current) {
       numberRef.current.innerHTML = "0 DAYS";
    }
  }, [loading]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 w-full px-4">
      <div className="h-12 flex items-center justify-center overflow-hidden relative w-full">
        <div 
          className={`absolute transition-all duration-500 ${loading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <div className="h-8 w-24 bg-[#e8e5db] rounded animate-pulse" />
        </div>
        <div 
          className={`absolute transition-all duration-500 delay-200 ${loading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
          <span ref={numberRef} className="text-4xl sm:text-5xl font-display text-[#2A6FDB] tracking-tighter inline-block min-w-[120px] text-center">
            0 DAYS
          </span>
        </div>
      </div>
      <span className="text-xs font-hand tracking-wider text-[#444]">Time to Market</span>
      <div className="w-full max-w-xs h-1.5 bg-[#e8e5db] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#2A6FDB] rounded-full transition-all duration-1000 ease-out"
          style={{ width: loading ? '0%' : '100%' }}
        />
      </div>
    </div>
  );
}

function GenAIAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full w-full p-2 group">
      <div className="w-full max-w-[120px] flex flex-col gap-2">
        {/* User Message */}
        <div className={`self-end w-3/4 h-5 bg-zinc-200 rounded-2xl rounded-tr-sm transition-all duration-500 ease-out ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}></div>
        
        {/* AI Message */}
        <div className={`self-start bg-cyan-100 rounded-2xl rounded-tl-sm transition-all duration-500 ease-out overflow-hidden flex flex-col justify-center px-2 relative ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} ${step >= 3 ? 'w-full h-14 py-2' : 'w-10 h-6'}`}>
          
          {/* Typing Indicator */}
          <div className={`absolute inset-0 flex items-center gap-0.5 justify-center transition-opacity duration-300 ${step === 2 ? 'opacity-100' : 'opacity-0'}`}>
             <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
             <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          {/* Generated Text Lines */}
          <div className={`flex flex-col gap-1.5 transition-opacity duration-500 delay-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
             <div className="w-full h-1.5 bg-cyan-400/60 rounded-full"></div>
             <div className="w-[85%] h-1.5 bg-cyan-400/60 rounded-full"></div>
             <div className="w-[60%] h-1.5 bg-cyan-400/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!|{}<>[]^~';
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-2xl bg-black z-50 pointer-events-none opacity-90" />;
}

function WebAppsAnimation() {
  const [step, setStep] = useState(0);
  const [isHacked, setIsHacked] = useState(false);

  useEffect(() => {
    if (isHacked) {
      const timeout = setTimeout(() => setIsHacked(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [isHacked]);

  useEffect(() => {
    if (isHacked) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 800);
    return () => clearInterval(interval);
  }, [isHacked]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div 
      className="flex items-center justify-center h-full w-full p-4 group cursor-pointer relative"
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsHacked(true);
      }}
      onClick={(e) => {
        // Prevent link navigation if they click the graphic
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {isHacked && <MatrixRain />}
      <div className="relative w-full max-w-[140px] h-[90px] bg-white border border-[#e8e5db] rounded-lg overflow-hidden shadow-sm group-hover:border-[#2A6FDB] group-hover:shadow-md transition-all duration-500 flex flex-col">
        {/* Browser Top Bar */}
        <div className="w-full h-3 bg-[#f5f3ea] flex items-center px-1.5 gap-1 border-b border-[#e8e5db]">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
        </div>
        
        {/* Browser Body */}
        <div className="flex flex-1 w-full relative">
          {/* Sidebar */}
          <div className={`h-full w-1/4 bg-[#f5f3ea] border-r border-[#e8e5db] p-1 flex flex-col gap-1 transition-all duration-500 ease-out origin-left ${step >= 2 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}>
            <div className="w-full h-1.5 bg-zinc-200 rounded-sm"></div>
            <div className="w-full h-1.5 bg-zinc-200 rounded-sm"></div>
            <div className="w-full h-1.5 bg-zinc-200 rounded-sm"></div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-2 flex flex-col gap-1.5 relative overflow-hidden">
             {/* Header */}
             <div className={`w-full h-2.5 bg-[#e8f0fd] rounded-sm transition-all duration-500 ease-out ${step >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}></div>
             
             {/* Content Grid */}
             <div className="flex-1 grid grid-cols-2 gap-1.5">
                <div className={`bg-[#f5f3ea] rounded-sm transition-all duration-500 ease-out ${step >= 3 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
                <div className={`bg-[#f5f3ea] rounded-sm transition-all duration-500 ease-out delay-75 ${step >= 3 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileAnimation() {
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScreen((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full group">
      <div className="relative w-12 h-20 border-[3px] border-zinc-300 group-hover:border-sky-400 transition-colors duration-300 rounded-2xl overflow-hidden flex flex-col p-1 shadow-sm">
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-zinc-300 rounded-full z-10" />
        <div className="mt-3 flex-1 w-full bg-[#f5f3ea] rounded-md overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 w-full h-[200%] transition-transform duration-700 ease-in-out flex flex-col"
            style={{ transform: `translateY(${['0%', '-25%', '-50%'][screen] || '-50%'})` }}
          >
             <div className="w-full h-1/4 p-0.5"><div className="w-full h-full bg-sky-200 rounded-sm" /></div>
             <div className="w-full h-1/4 p-0.5"><div className="w-full h-full bg-[#c5d9f5] rounded-sm" /></div>
             <div className="w-full h-1/4 p-0.5"><div className="w-full h-full bg-indigo-300 rounded-sm" /></div>
             <div className="w-full h-1/4 p-0.5"><div className="w-full h-full bg-sky-200 rounded-sm" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DevOpsAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 5); // 0: reset, 1: code, 2: build, 3: deploy, 4: hold
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full w-full p-2 group">
      <div className="flex items-center justify-between w-full max-w-[130px] relative">
        
        {/* Connecting Line background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-200 rounded-full z-0"></div>
        
        {/* Progress Line */}
        <div 
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-400 rounded-full z-0 ${step === 0 ? 'transition-none' : 'transition-all duration-500 ease-in-out'}`}
          style={{ width: ['0%', '0%', '50%', '100%', '100%'][step] || '100%' }}
        ></div>

        {/* Node 1: Code */}
        <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${step >= 1 ? 'border-emerald-400 text-emerald-600 bg-emerald-50 scale-110 shadow-sm' : 'border-[#e8e5db] text-[#444] bg-white scale-100'}`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>

        {/* Node 2: Build */}
        <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${step >= 2 ? 'border-emerald-400 text-emerald-600 bg-emerald-50 scale-110 shadow-sm' : 'border-[#e8e5db] text-[#444] bg-white scale-100'}`}>
          <svg className={`w-4 h-4 ${step === 2 ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>

        {/* Node 3: Deploy/SQA */}
        <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${step >= 3 ? 'border-emerald-500 text-white bg-emerald-500 scale-110 shadow-sm' : 'border-[#e8e5db] text-[#444] bg-white scale-100'}`}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>

      </div>
    </div>
  );
}

export default function AnimatedBento() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.bento-card',
        { y: 50, opacity: 0 },
        { 
          y: 0, opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
      
      {/* 1. Speed - AI MVP (Wide) */}
      <a href="/services/ai-mvp" className="bento-card opacity-0 md:col-span-2 bg-white border border-[#e8e5db] rounded-3xl p-8 flex flex-col hover:border-[#2A6FDB] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(42,111,219,0.12)] group overflow-hidden block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f3ea]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="flex-1 relative z-10 flex items-center justify-center bg-[#f5f3ea]/40 rounded-2xl mb-6 border border-[#e8e5db] group-hover:bg-white transition-colors">
          <SpeedIndicator />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-display text-[#161616] group-hover:text-[#2A6FDB] transition-colors">AI-Powered Fast MVP</h3>
            <span className="inline-block px-3 py-1 bg-[#e8f0fd] text-[#2A6FDB] text-xs font-hand rounded-full">Flagship</span>
          </div>
          <p className="text-[#2A2A2A]">Go to market in weeks, not months. We leverage generative AI tools to rapidly prototype, build, and deploy your product.</p>
        </div>
      </a>

      {/* 2. Global Network - Gen AI */}
      <a href="/services/generative-ai" className="bento-card opacity-0 bg-white border border-[#e8e5db] rounded-3xl p-8 flex flex-col hover:border-[#2A6FDB] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(42,111,219,0.12)] group overflow-hidden block relative">
        <div className="flex-1 relative z-10 flex items-center justify-center bg-[#f5f3ea]/40 rounded-2xl mb-6 border border-[#e8e5db] group-hover:bg-white transition-colors">
          <GenAIAnimation />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-display text-[#161616] mb-2 group-hover:text-[#2A6FDB] transition-colors">Generative AI</h3>
          <p className="text-[#2A2A2A] text-sm">Integrating advanced LLMs directly into your products for intelligent automation.</p>
        </div>
      </a>

      {/* 3. Layouts - Web Apps */}
      <a href="/services/web-development" className="bento-card opacity-0 bg-white border border-[#e8e5db] rounded-3xl p-8 flex flex-col hover:border-[#2A6FDB] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(42,111,219,0.12)] group overflow-hidden block relative">
        <div className="flex-1 relative z-10 flex items-center justify-center bg-[#f5f3ea]/40 rounded-2xl mb-6 border border-[#e8e5db] group-hover:bg-white transition-colors">
          <WebAppsAnimation />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-display text-[#161616] mb-2 group-hover:text-[#2A6FDB] transition-colors">Web Applications</h3>
          <p className="text-[#2A2A2A] text-sm">Highly performant, scalable web platforms built with React, Next.js, and Astro.</p>
        </div>
      </a>

      {/* 4. Smartphone - Mobile Apps */}
      <a href="/services/mobile-development" className="bento-card opacity-0 bg-white border border-[#e8e5db] rounded-3xl p-8 flex flex-col hover:border-[#2A6FDB] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(42,111,219,0.12)] group overflow-hidden block relative">
        <div className="flex-1 relative z-10 flex items-center justify-center bg-[#f5f3ea]/40 rounded-2xl mb-6 border border-[#e8e5db] group-hover:bg-white transition-colors">
           <MobileAnimation />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-display text-[#161616] mb-2 group-hover:text-[#2A6FDB] transition-colors">Mobile Apps</h3>
          <p className="text-[#2A2A2A] text-sm">Native iOS and Android applications utilizing React Native for efficiency.</p>
        </div>
      </a>

      {/* 5. Security - DevOps */}
      <a href="/services/devops-sqa" className="bento-card opacity-0 bg-white border border-[#e8e5db] rounded-3xl p-8 flex flex-col hover:border-emerald-500 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.12)] group overflow-hidden block relative">
        <div className="flex-1 relative z-10 flex items-center justify-center bg-[#f5f3ea]/40 rounded-2xl mb-6 border border-[#e8e5db] group-hover:bg-white transition-colors">
          <DevOpsAnimation />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-display text-[#161616] mb-2 group-hover:text-emerald-500 transition-colors">DevOps & SQA</h3>
          <p className="text-[#2A2A2A] text-sm">Cloud infrastructure, CI/CD, and rigorous Software Quality Assurance.</p>
        </div>
      </a>

    </div>
  );
}
