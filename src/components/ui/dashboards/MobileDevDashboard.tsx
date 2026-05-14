import React, { useState, useEffect } from 'react';

const NAMES = ['John Doe', 'Acme Corp', 'Alice Smith', 'Starbucks', 'Apple', 'AWS', 'Client X', 'Stripe Payout'];

export const MobileDevDashboard = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Acme Corp', amount: '+$1,200', positive: true },
    { id: 2, name: 'John Doe', amount: '+$240', positive: true },
    { id: 3, name: 'Starbucks', amount: '-$12', positive: false },
    { id: 4, name: 'Alice Smith', amount: '+$150', positive: true },
    { id: 5, name: 'AWS', amount: '-$85', positive: false },
  ]);
  const [chartHeights, setChartHeights] = useState([40, 70, 50, 90, 60, 80, 100]);

  useEffect(() => {
    // Live Transaction Feed
    const txInterval = setInterval(() => {
      setTransactions(prev => {
        const isPositive = Math.random() > 0.3;
        const newTx = {
          id: Date.now(),
          name: NAMES[Math.floor(Math.random() * NAMES.length)],
          amount: isPositive ? `+$${Math.floor(Math.random() * 500) + 10}` : `-$${Math.floor(Math.random() * 80) + 5}`,
          positive: isPositive
        };
        // Add to top, remove from bottom
        return [newTx, ...prev.slice(0, 4)];
      });
    }, 2500);

    // Live Chart Fluctuations
    const chartInterval = setInterval(() => {
      setChartHeights(prev => 
        prev.map(h => {
          const change = Math.floor(Math.random() * 20) - 10;
          return Math.max(20, Math.min(100, h + change));
        })
      );
    }, 2000);

    return () => {
      clearInterval(txInterval);
      clearInterval(chartInterval);
    };
  }, []);

  return (
    <div className="h-full w-full bg-[#E5E7EB] dark:bg-zinc-950 p-4 md:p-8 flex items-center justify-center gap-8 font-sans overflow-hidden">
      
      {/* Mobile Frame 1: List View */}
      <div className="w-64 h-[28rem] md:h-[32rem] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border-[8px] border-[#e8e5db] dark:border-zinc-800 relative overflow-hidden flex flex-col transform -rotate-2 hover:rotate-0 transition-transform duration-500">
        {/* Top Notch/Dynamic Island */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
          <div className="w-24 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-b-xl"></div>
        </div>
        
        {/* App Header */}
        <div className="pt-10 px-6 pb-4 border-b border-[#e8e5db] dark:border-zinc-800">
          <div className="text-xl font-bold text-[#161616] dark:text-white">Activity</div>
          <div className="text-xs text-[#444]">Today, Oct 24</div>
        </div>
        
        {/* App Content */}
        <div className="flex-1 overflow-y-hidden p-4 flex flex-col gap-3 relative">
          {transactions.map((tx, index) => (
            <div 
              key={tx.id} 
              className={`flex items-center gap-3 p-3 bg-[#f5f3ea] dark:bg-zinc-800/50 rounded-xl transition-all duration-500 ease-out absolute w-[calc(100%-2rem)]`}
              style={{
                transform: `translateY(${index * (60 + 12)}px)`, // 60px height + 12px gap
                opacity: index === 4 ? 0.3 : 1
              }}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-tr ${tx.positive ? 'from-green-400 to-emerald-600' : 'from-zinc-400 to-zinc-600'}`}></div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium text-[#161616] dark:text-white truncate">{tx.positive ? 'Payment Received' : 'Payment Sent'}</div>
                <div className="text-[10px] text-[#444] truncate">{tx.positive ? 'From' : 'To'} {tx.name}</div>
              </div>
              <div className={`text-sm font-bold ${tx.positive ? 'text-green-500' : 'text-[#444]'}`}>{tx.amount}</div>
            </div>
          ))}
        </div>
        
        {/* Bottom Tab Bar */}
        <div className="h-16 border-t border-[#e8e5db] dark:border-zinc-800 flex justify-around items-center px-4">
          <div className="w-6 h-6 rounded bg-zinc-800 dark:bg-white"></div>
          <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700"></div>
          <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700"></div>
          <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700"></div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
      </div>

      {/* Mobile Frame 2: Analytics View */}
      <div className="hidden md:flex w-64 h-[32rem] bg-zinc-900 rounded-[2.5rem] shadow-2xl border-[8px] border-zinc-800 relative overflow-hidden flex-col transform rotate-2 hover:rotate-0 transition-transform duration-500">
        {/* Top Notch/Dynamic Island */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
          <div className="w-24 h-5 bg-zinc-800 rounded-b-xl"></div>
        </div>
        
        {/* App Header */}
        <div className="pt-10 px-6 pb-4">
          <div className="text-xl font-bold text-white">Analytics</div>
        </div>
        
        {/* App Content */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* Hero Card */}
          <div className="bg-[#111] rounded-2xl p-4 text-white shadow-lg shadow-[#2A6FDB]/20">
            <div className="text-xs text-blue-200 mb-1">Total Balance</div>
            <div className="text-3xl font-black mb-4">$12,450.00</div>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/20 rounded text-center py-1 text-xs">Send</div>
              <div className="flex-1 bg-white/20 rounded text-center py-1 text-xs">Receive</div>
            </div>
          </div>
          
          {/* Mini Chart */}
          <div className="bg-zinc-800 rounded-2xl p-4 flex-1 flex flex-col justify-between">
            <div className="text-xs font-medium text-[#444]">Weekly Trend</div>
            <div className="flex items-end justify-between h-20 gap-1 mt-2">
              <div className="w-full bg-[#2A6FDB]/50 rounded-t-sm transition-all duration-500 ease-out" style={{ height: `${chartHeights[0]}%` }}></div>
              <div className="w-full bg-[#2A6FDB] rounded-t-sm transition-all duration-500 ease-out" style={{ height: `${chartHeights[1]}%` }}></div>
              <div className="w-full bg-[#2A6FDB]/50 rounded-t-sm transition-all duration-500 ease-out" style={{ height: `${chartHeights[2]}%` }}></div>
              <div className="w-full bg-[#2A6FDB] rounded-t-sm transition-all duration-500 ease-out" style={{ height: `${chartHeights[3]}%` }}></div>
              <div className="w-full bg-[#2A6FDB]/50 rounded-t-sm transition-all duration-500 ease-out" style={{ height: `${chartHeights[4]}%` }}></div>
              <div className="w-full bg-[#2A6FDB] rounded-t-sm transition-all duration-500 ease-out" style={{ height: `${chartHeights[5]}%` }}></div>
              <div className="w-full bg-[#2A6FDB] rounded-t-sm shadow-[0_0_10px_#60a5fa] transition-all duration-500 ease-out" style={{ height: `${chartHeights[6]}%` }}></div>
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-zinc-700 rounded-full"></div>
      </div>

    </div>
  );
};
