import React from "react";
import { Target, Crown } from "lucide-react";

export function HeroStatsCard() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[380px] lg:max-w-[420px] relative z-20">
      {/* Background Ambient Glow to make the dark card pop on any bg */}
      <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full translate-y-8 scale-95 pointer-events-none"></div>

      {/* Main Stats Card */}
      <div className="p-6 md:p-8 rounded-[2rem] bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative">
        {/* Internal Glow Effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-zinc-500/20 blur-[60px] rounded-full pointer-events-none"></div>
        
        {/* Header section */}
        <div className="flex items-center gap-5 mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
            <Target className="w-7 h-7 text-zinc-300" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-[2.5rem] font-black text-white tracking-tight leading-none mb-1">8+</h3>
            <p className="text-zinc-400 font-medium text-sm">Projects Delivered</p>
          </div>
        </div>

        {/* Progress Bar section */}
        <div className="mb-8 relative z-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 font-medium text-sm">Client Satisfaction</span>
            <span className="text-white font-bold">98%</span>
          </div>
          <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden shadow-inner border border-white/5">
            <div className="h-full w-[98%] bg-gradient-to-r from-zinc-500 to-white rounded-full"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex items-start justify-between mb-8 relative z-10 px-2">
          <div className="text-center flex-1">
            <h4 className="text-2xl font-black text-white mb-1">2+</h4>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Years</p>
          </div>
          
          {/* Divider */}
          <div className="w-px h-12 bg-white/10 absolute left-[33%] top-0"></div>

          <div className="text-center flex-1">
            <h4 className="text-2xl font-black text-white mb-1">100%</h4>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Quality</p>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-white/10 absolute left-[66%] top-0"></div>

          <div className="text-center flex-1">
            <h4 className="text-2xl font-black text-white mb-1">24/7</h4>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Support</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
            <div className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            </div>
            <span className="text-xs font-bold text-zinc-300 tracking-widest">ACTIVE</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-yellow-500" strokeWidth={2.5} />
            <span className="text-xs font-bold text-zinc-300 tracking-widest">PREMIUM</span>
          </div>
        </div>
      </div>

      {/* Trusted By Card */}
      <div className="px-6 py-5 rounded-3xl bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-center">
        <p className="text-zinc-500 font-medium mb-4 text-sm text-center">Trusted by Industry Leaders</p>
        <div className="flex items-center justify-between gap-2 px-1">
          {/* Logo 1: Ruby */}
          <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-rose-500 shrink-0"><path d="M12 22L2 12l10-10 10 10-10 10z" fill="currentColor" /></svg>
            <span className="font-bold text-[15px] text-zinc-300 tracking-tight whitespace-nowrap">Ruby</span>
          </div>
          {/* Logo 2: Chipset */}
          <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500 shrink-0"><path d="M6 6h12v12H6z" fill="currentColor"/><path d="M4 8h2M4 12h2M4 16h2M18 8h2M18 12h2M18 16h2M8 4v2M12 4v2M16 4v2M8 18v2M12 18v2M16 18v2" stroke="currentColor" strokeWidth="2"/></svg>
            <span className="font-bold text-[15px] text-zinc-300 tracking-tight whitespace-nowrap">Chipset</span>
          </div>
          {/* Logo 3: Acme Corp */}
          <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-indigo-500 shrink-0"><path d="M12 2l9 5v10l-9 5-9-5V7z" fill="currentColor"/></svg>
            <span className="font-bold text-[15px] text-zinc-300 tracking-tight whitespace-nowrap">Acme Corp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
