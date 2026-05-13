import React, { useState, useEffect } from 'react';

export const AiMvpDashboard = () => {
  const [step, setStep] = useState(3); // Start pre-filled so terminal isn't empty on load
  const [typedCommand, setTypedCommand] = useState('');
  const fullCommand = 'generate ui --prompt "Dark mode analytics dashboard with charts"';

  useEffect(() => {
    let typeInterval: NodeJS.Timeout;
    let finishTimers: NodeJS.Timeout[] = [];
    
    const finishSequence = () => {
      setStep(4);
      const t1 = setTimeout(() => setStep(5), 3000);
      const t2 = setTimeout(() => setStep(6), 4000);
      finishTimers = [t1, t2];
    };

    const typeCommand = () => {
      let i = 0;
      typeInterval = setInterval(() => {
        if (i <= fullCommand.length) {
          setTypedCommand(fullCommand.slice(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
          finishSequence();
        }
      }, 50);
    };

    const startLoopSequence = () => {
      setStep(3);
      setTypedCommand('');
      typeCommand();
    };

    // Start immediately on mount
    startLoopSequence();
    
    // Loop the dynamic part endlessly without clearing the initial logs
    const masterLoop = setInterval(startLoopSequence, 10000);

    return () => {
      clearInterval(masterLoop);
      if (typeInterval) clearInterval(typeInterval);
      finishTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="h-full w-full bg-zinc-950 p-4 md:p-8 flex flex-col md:flex-row gap-6 font-sans text-white overflow-hidden">
      
      {/* Left Panel: AI Terminal/Input */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col relative shadow-inner">
          <div className="text-zinc-500 text-xs font-mono mb-4 flex justify-between">
            <span>TERMINAL</span>
            <span className="text-indigo-400">v2.4.1</span>
          </div>
          
          <div className="space-y-4 font-mono text-sm">
            {step >= 1 && (
              <div className="text-zinc-300 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-green-400">user@omnidevx:~$</span> init mvp --template SaaS
              </div>
            )}
            {step >= 2 && (
              <div className="text-zinc-500 animate-in fade-in duration-300">Initializing project structure...</div>
            )}
            
            {step >= 3 && (
              <div className="text-zinc-300">
                <span className="text-green-400">user@omnidevx:~$</span> {typedCommand}
                {step === 3 && <span className="inline-block w-2 h-4 bg-zinc-400 ml-1 animate-pulse"></span>}
              </div>
            )}
            
            {step >= 4 && (
              <div className="text-indigo-400 flex items-center gap-2 animate-in fade-in duration-300">
                {step === 4 ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span className="text-green-400 font-bold">✓</span>
                )}
                {step === 4 ? "Generating components..." : "Generation complete!"}
              </div>
            )}
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-400 flex items-center justify-between">
            <span>Status: Running</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Active</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Kanban Workflow */}
      <div className="w-full md:w-2/3 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          MVP Assembly Pipeline
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          {/* Column 1 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-xs font-bold text-zinc-500 tracking-wider">SCOPING</div>
            <div className="bg-zinc-800/50 rounded-lg p-3 text-sm border-l-2 border-green-500 shadow-sm">
              <div className="text-zinc-200 font-medium">Define Core Flow</div>
              <div className="text-zinc-500 text-xs mt-1">100% Complete</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 text-sm border-l-2 border-green-500 shadow-sm">
              <div className="text-zinc-200 font-medium">Database Schema</div>
              <div className="text-zinc-500 text-xs mt-1">100% Complete</div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-xs font-bold text-zinc-500 tracking-wider">PROTOTYPING</div>
            <div className="bg-zinc-800/50 rounded-lg p-3 text-sm border-l-2 border-green-500 shadow-sm">
              <div className="text-zinc-200 font-medium">Figma Wireframes</div>
              <div className="text-zinc-500 text-xs mt-1">100% Complete</div>
            </div>
            <div className={`bg-zinc-800/50 rounded-lg p-3 text-sm transition-all duration-500 ${step >= 5 ? 'border-l-2 border-green-500 shadow-sm' : 'border border-zinc-700/50 border-dashed'}`}>
              <div className={step >= 5 ? 'text-zinc-200 font-medium' : 'text-zinc-400 font-medium'}>AI UI Generation</div>
              <div className={`text-xs mt-1 font-mono transition-colors duration-500 ${step >= 5 ? 'text-zinc-500' : 'text-indigo-400'}`}>
                {step >= 5 ? '100% Complete' : 'In Progress...'}
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 transition-opacity duration-1000 ${step >= 6 ? 'opacity-100' : 'opacity-50'}`}>
            <div className="text-xs font-bold text-zinc-500 tracking-wider">ENGINEERING</div>
            <div className={`bg-zinc-800/50 rounded-lg p-3 text-sm transition-all duration-500 ${step >= 6 ? 'border-l-2 border-indigo-500 shadow-sm bg-indigo-500/10' : 'border border-zinc-700/50 border-dashed'}`}>
              <div className="text-zinc-200 font-medium">API Integration</div>
              {step >= 6 && <div className="text-indigo-400 text-xs mt-1 font-mono animate-pulse">In Progress...</div>}
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 text-sm border-dashed">
              <div className="text-zinc-400 font-medium">Auth Setup</div>
            </div>
          </div>

          {/* Column 4 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 opacity-50">
            <div className="text-xs font-bold text-zinc-500 tracking-wider">LAUNCH</div>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 text-sm border-dashed">
              <div className="text-zinc-400 font-medium">Vercel Deploy</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
