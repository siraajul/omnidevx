import React, { useState, useEffect } from 'react';

export const GenAiDashboard = () => {
  const [typedPrompt, setTypedPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fullPrompt = 'Synthesize context and generate grounded response...';

  useEffect(() => {
    let typeInterval: NodeJS.Timeout;
    
    const startTyping = () => {
      setIsProcessing(false);
      setTypedPrompt('');
      let i = 0;
      typeInterval = setInterval(() => {
        if (i <= fullPrompt.length) {
          setTypedPrompt(fullPrompt.slice(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsProcessing(true);
        }
      }, 50);
    };

    startTyping();
    const loopInterval = setInterval(startTyping, 8000); // Restart every 8 seconds

    return () => {
      clearInterval(loopInterval);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, []);

  return (
    <div className="h-full w-full bg-zinc-950 p-4 md:p-8 flex gap-6 font-sans text-white overflow-hidden">
      
      {/* Sidebar: Chat History */}
      <div className="hidden md:flex w-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-col gap-4 shadow-inner">
        <button className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          New Chat
        </button>
        <div className="flex flex-col gap-2 mt-4 overflow-y-auto">
          <div className="text-xs font-semibold text-zinc-500 mb-2">TODAY</div>
          <div className="bg-zinc-800/50 text-zinc-300 text-sm p-3 rounded-lg truncate cursor-pointer hover:bg-zinc-800 transition-colors border border-zinc-700/50">
            Analyze customer feedback...
          </div>
          <div className="text-zinc-400 text-sm p-3 rounded-lg truncate cursor-pointer hover:bg-zinc-800/50 transition-colors">
            Generate financial report Q3
          </div>
          <div className="text-zinc-400 text-sm p-3 rounded-lg truncate cursor-pointer hover:bg-zinc-800/50 transition-colors">
            Summarize legal contracts
          </div>
        </div>
      </div>

      {/* Main Content: RAG Pipeline Graph */}
      <div className="flex-1 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 flex flex-col relative">
        <h3 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
          <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          RAG Processing Pipeline
        </h3>
        
        {/* Node Graph */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          
          {/* Top Row: Query & Vector DB */}
          <div className="flex items-center gap-12 mb-12">
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4 w-48 text-center relative shadow-lg shadow-purple-500/10 z-10">
              <div className="text-purple-400 text-xs font-bold tracking-widest mb-1">INPUT</div>
              <div className="text-white font-medium">User Query</div>
            </div>
            
            {/* Connecting Line */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-zinc-700 to-purple-500 relative overflow-hidden">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc] z-10"></div>
              {isProcessing && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-1 bg-purple-400/50 blur-sm rounded-full animate-[slideRight_1.5s_linear_infinite]"></div>}
            </div>
            
            <div className="bg-zinc-900 border-2 border-purple-500/50 rounded-xl p-4 w-48 text-center relative shadow-[0_0_30px_rgba(168,85,247,0.15)] z-10">
              <div className={`absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full ${isProcessing ? 'animate-ping' : ''}`}></div>
              <div className="text-purple-400 text-xs font-bold tracking-widest mb-1">VECTOR DB</div>
              <div className="text-white font-medium">Semantic Search</div>
            </div>
          </div>

          {/* Vertical Connecting Line */}
          <div className="w-0.5 h-12 bg-gradient-to-b from-purple-500 to-blue-500 relative -mt-4 mb-8 z-0 overflow-hidden">
             {isProcessing && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-blue-400/50 blur-sm rounded-full animate-[slideDown_1.5s_linear_infinite_0.5s]"></div>}
          </div>

          {/* Bottom Row: LLM & Output */}
          <div className="flex items-center gap-12">
            <div className="bg-zinc-900 border-2 border-blue-500/50 rounded-xl p-4 w-48 text-center relative shadow-[0_0_30px_rgba(59,130,246,0.15)] z-10">
              <div className="text-blue-400 text-xs font-bold tracking-widest mb-1">LLM</div>
              <div className="text-white font-medium">Context Synthesis</div>
            </div>
            
            {/* Connecting Line */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 relative overflow-hidden">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80] z-10"></div>
              {isProcessing && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-1 bg-green-400/50 blur-sm rounded-full animate-[slideRight_1.5s_linear_infinite]"></div>}
            </div>
            
            <div className={`bg-zinc-900 border-2 ${isProcessing ? 'border-green-400' : 'border-green-500/50'} rounded-xl p-4 w-48 text-center relative shadow-lg shadow-green-500/10 z-10 transition-colors duration-500`}>
              <div className="text-green-400 text-xs font-bold tracking-widest mb-1">OUTPUT</div>
              <div className="text-white font-medium">Grounded Response</div>
            </div>
          </div>

        </div>

        {/* Bottom Chat Input Simulation */}
        <div className={`mt-8 bg-zinc-900 border ${isProcessing ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-zinc-800'} rounded-xl p-3 flex items-center gap-4 transition-all duration-500`}>
          <div className="flex-1 text-zinc-300 text-sm px-2 font-mono">
            {typedPrompt}
            {!isProcessing && <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse"></span>}
          </div>
          <button className={`${isProcessing ? 'bg-purple-500 animate-pulse' : 'bg-purple-600'} w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300`}>
            {isProcessing ? (
              <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Add custom keyframes for the data flow animation */}
      <style>{`
        @keyframes slideRight {
          0% { transform: translate(-100%, -50%); }
          100% { transform: translate(300%, -50%); }
        }
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </div>
  );
};
