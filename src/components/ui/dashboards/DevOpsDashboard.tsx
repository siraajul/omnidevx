import React, { useState, useEffect, useRef } from 'react';

const LOG_SEQUENCE = [
  { text: "==> Running Playwright E2E Test Suite...", color: "text-[#666]" },
  { text: "✓ [chromium] › auth.spec.ts:12:5 › should login successfully", color: "text-green-400" },
  { text: "✓ [chromium] › dashboard.spec.ts:8:1 › should load charts", color: "text-green-400" },
  { text: "✓ [webkit] › auth.spec.ts:12:5 › should login successfully", color: "text-green-400" },
  { text: "✓ [webkit] › dashboard.spec.ts:8:1 › should load charts", color: "text-green-400" },
  { text: "==> Test summary: 124 passed, 0 failed, 0 skipped", color: "text-green-400" },
  { text: "==> Code coverage: 98.4% lines, 99.1% branches", color: "text-[#666]" },
  { text: "---", color: "text-[#444]" },
  { text: "==> Initializing AWS ECS Deployment...", color: "text-[#666]" },
  { text: "==> Pushing container image to ECR [■■■■■■■■■■■■■■■■■■■■] 100%", color: "text-[#666]" },
  { text: "Updating service omnidevx-production-cluster...", color: "text-orange-400" },
];

export const DevOpsDashboard = () => {
  const [logs, setLogs] = useState<{id: number, text: string, color: string}[]>(() => {
    // Pre-fill the terminal so it never looks empty on load
    return LOG_SEQUENCE.slice(0, 8).map((log, index) => ({
      id: index,
      ...log
    }));
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let globalIndex = 8; // Start from where we pre-filled
    
    const interval = setInterval(() => {
      const nextLog = LOG_SEQUENCE[globalIndex % LOG_SEQUENCE.length];
      
      setLogs((prev) => {
        const newLogs = [...prev, { id: Date.now(), ...nextLog }];
        // Keep only the last 15 logs so it doesn't leak memory
        return newLogs.slice(-15);
      });
      
      globalIndex++;
    }, 600); // Fast cooking speed

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full w-full bg-[#0D1117] p-4 md:p-8 flex flex-col gap-6 font-mono text-white overflow-hidden border border-zinc-800 rounded-xl">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span className="font-bold text-lg">omnidevx / core-infrastructure</span>
        </div>
        <div className="flex gap-4 text-xs font-sans font-medium text-[#444]">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> All Checks Passed</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Deploying</div>
        </div>
      </div>

      {/* Pipeline Graph */}
      <div className="bg-[#161B22] border border-zinc-800 rounded-xl p-6 flex items-center justify-between relative shadow-inner">
        <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-800 z-0">
          <div className="h-full bg-green-500 w-[75%] shadow-[0_0_10px_#22c55e]"></div>
        </div>
        
        {/* Node 1 */}
        <div className="bg-[#0D1117] border-2 border-green-500 rounded-full w-12 h-12 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        
        {/* Node 2 */}
        <div className="bg-[#0D1117] border-2 border-green-500 rounded-full w-12 h-12 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        
        {/* Node 3 */}
        <div className="bg-[#0D1117] border-2 border-green-500 rounded-full w-12 h-12 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>

        {/* Node 4 (Active) */}
        <div className="bg-[#0D1117] border-2 border-orange-500 rounded-full w-12 h-12 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(249,115,22,0.4)] relative">
          <div className="absolute inset-0 rounded-full border-2 border-orange-500 animate-ping opacity-50"></div>
          <svg className="w-5 h-5 text-orange-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </div>
      </div>

      <div className="flex justify-between text-xs font-bold text-[#444] px-4 -mt-4">
        <span>COMMIT</span>
        <span>BUILD (DOCKER)</span>
        <span>E2E (PLAYWRIGHT)</span>
        <span className="text-orange-500">DEPLOY (AWS)</span>
      </div>

      {/* Terminal View */}
      <div className="flex-1 bg-black border border-zinc-800 rounded-xl p-4 flex flex-col shadow-inner overflow-hidden relative">
        <div className="text-[#444] text-xs mb-2 border-b border-zinc-800 pb-2 flex justify-between">
          <span>TERMINAL OUTPUT</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> LIVE</span>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto text-xs leading-relaxed space-y-1 scroll-smooth scrollbar-hide">
          {logs.map((log) => (
            <div key={log.id} className={`${log.color} animate-in fade-in slide-in-from-bottom-1`}>
              {log.text}
            </div>
          ))}
          <div className="text-[#444] animate-pulse mt-1">_</div>
        </div>
      </div>

    </div>
  );
};
