import React from 'react';
import { useWebDevDashboard } from '../../../hooks/useWebDevDashboard';
import { siteConfig } from '../../../config/site';

export const WebDevDashboard = () => {
  // Logic is now completely extracted to a custom hook
  const { users, chartHeights } = useWebDevDashboard();
  
  // Content is now extracted to centralized config
  const content = siteConfig.pages.webDevDashboard;

  return (
    <div className="h-full w-full bg-[#f5f3ea] dark:bg-zinc-950 p-4 md:p-6 flex flex-col gap-4 font-sans text-[#161616] dark:text-white overflow-hidden rounded-xl border border-[#e8e5db] dark:border-zinc-800">
      
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#e8e5db] dark:border-zinc-800">
        <div className="font-bold tracking-widest text-[#444] text-xs">OMNIDEVX // ENTERPRISE ANALYTICS</div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="flex gap-4 w-full">
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-[#e8e5db] dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-bold text-[#444] tracking-wider flex justify-between">
            {content.metrics.usersLabel.toUpperCase()} <span className="text-[#2A6FDB]">—</span>
          </div>
          <div className="text-3xl font-black mt-2">
            {users.toLocaleString()}
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-[#e8e5db] dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-bold text-[#444] tracking-wider flex justify-between">
            LOAD TIME <span className="text-purple-500">—</span>
          </div>
          <div className="text-3xl font-black mt-2">0.4s</div>
        </div>
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-[#e8e5db] dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-bold text-[#444] tracking-wider flex justify-between">
            UPTIME <span className="text-green-500">—</span>
          </div>
          <div className="text-3xl font-black mt-2">99.9%</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="flex gap-4 flex-1">
        
        {/* Bar Chart Panel */}
        <div className="flex-[2] bg-white dark:bg-zinc-900 border border-[#e8e5db] dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col relative">
          <div className="text-xs font-bold text-[#444] tracking-wider flex justify-between mb-6">
            TRAFFIC GROWTH <span className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded text-[10px]">+24%</span>
          </div>
          <div className="flex items-end justify-between flex-1 gap-2 md:gap-4 px-2 pb-2">
            <div className="w-full bg-[#2A6FDB] rounded-t-sm transition-all duration-1000 ease-out" style={{ height: `${chartHeights[0]}%` }}></div>
            <div className="w-full bg-purple-400 rounded-t-sm transition-all duration-1000 ease-out" style={{ height: `${chartHeights[1]}%` }}></div>
            <div className="w-full bg-pink-400 rounded-t-sm transition-all duration-1000 ease-out" style={{ height: `${chartHeights[2]}%` }}></div>
            <div className="w-full bg-orange-400 rounded-t-sm transition-all duration-1000 ease-out" style={{ height: `${chartHeights[3]}%` }}></div>
            <div className="w-full bg-green-400 rounded-t-sm transition-all duration-1000 ease-out" style={{ height: `${chartHeights[4]}%` }}></div>
            <div className="w-full bg-cyan-400 rounded-t-sm transition-all duration-1000 ease-out" style={{ height: `${chartHeights[5]}%` }}></div>
            <div className="w-full bg-yellow-400 rounded-t-sm transition-all duration-1000 ease-out" style={{ height: `${chartHeights[6]}%` }}></div>
          </div>
          {/* Horizontal grid lines simulated */}
          <div className="absolute top-1/3 left-4 right-4 h-px bg-[#f5f3ea] dark:bg-zinc-800/50 z-0 pointer-events-none"></div>
          <div className="absolute top-2/3 left-4 right-4 h-px bg-[#f5f3ea] dark:bg-zinc-800/50 z-0 pointer-events-none"></div>
        </div>

        {/* Donut Chart Panel */}
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-[#e8e5db] dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
          <div className="text-xs font-bold text-[#444] tracking-wider mb-4">SOURCES</div>
          <div className="flex-1 flex items-center justify-center relative">
            {/* Simulated Donut Chart using CSS */}
            <div className="w-24 h-24 rounded-full border-[12px] border-[#e8e5db] dark:border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2A6FDB] transform origin-left"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-purple-500 transform origin-top rotate-45"></div>
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-orange-500 transform origin-bottom-right -rotate-12"></div>
              {/* Inner Circle to make it a donut */}
              <div className="absolute inset-0 m-auto w-12 h-12 bg-white dark:bg-zinc-900 rounded-full z-10"></div>
            </div>
            
            {/* Legend */}
            <div className="absolute right-0 flex flex-col gap-2 text-[10px] font-medium">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#2A6FDB]"></div> Direct</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Organic</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Social</div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Table */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e8e5db] dark:border-zinc-800 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between text-[10px] font-bold text-[#444] tracking-wider mb-3 pb-2 border-b border-[#e8e5db] dark:border-zinc-800">
          <div className="w-1/3">RECENT DEPLOYMENTS</div>
          <div className="w-1/3 text-center">LATENCY</div>
          <div className="w-1/3 text-right">STATUS</div>
        </div>
        <div className="flex justify-between items-center text-xs py-2">
          <div className="w-1/3 font-medium">api/v2/graphql</div>
          <div className="w-1/3 text-center text-[#444]">42ms</div>
          <div className="w-1/3 text-right">
            <span className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-1 rounded text-[10px] font-bold">HEALTHY</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs py-2">
          <div className="w-1/3 font-medium">web/dashboard-ui</div>
          <div className="w-1/3 text-center text-[#444]">{content.metrics.latency}</div>
          <div className="w-1/3 text-right">
            <span className="bg-[#e8f0fd] dark:bg-[#2A6FDB]/20 text-[#2A6FDB] dark:text-[#2A6FDB] px-3 py-1 rounded text-[10px] font-bold">{content.metrics.serverStatus.toUpperCase()}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
