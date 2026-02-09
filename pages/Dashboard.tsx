
import React, { useEffect, useState } from 'react';
import { UserState, Page, VIPLevel, VIPPackage } from '../types';
import { DAILY_RETURN_PERCENTAGE } from '../constants';
import { getMarketInsight } from '../services/geminiService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
  user: UserState;
  vipPackages: VIPPackage[];
  onNavigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, vipPackages, onNavigate }) => {
  const [insight, setInsight] = useState<string>('Analyzing market volatility...');

  useEffect(() => {
    const fetchInsight = async () => {
      const text = await getMarketInsight(user.vipLevel);
      setInsight(text);
    };
    fetchInsight();
  }, [user.vipLevel]);

  const currentPkg = vipPackages.find(p => p.level === user.vipLevel);
  const potentialDailyProfit = currentPkg ? (currentPkg.cost * DAILY_RETURN_PERCENTAGE) : 0;
  
  const chartData = [
    { name: 'Mon', value: potentialDailyProfit, roi: '5%' },
    { name: 'Tue', value: potentialDailyProfit * 2, roi: '10%' },
    { name: 'Wed', value: potentialDailyProfit * 3, roi: '15%' },
    { name: 'Thu', value: potentialDailyProfit * 4, roi: '20%' },
    { name: 'Fri', value: potentialDailyProfit * 5, roi: '25%' },
    { name: 'Sat', value: potentialDailyProfit * 5, roi: '25%' },
    { name: 'Sun', value: potentialDailyProfit * 5, roi: '25%' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e2329] border border-white/10 p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{label} Forecast</p>
          <p className="text-white font-bold text-lg">${payload[0].value.toFixed(2)}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] bg-[#00c076]/20 text-[#00c076] px-1.5 py-0.5 rounded font-black">
              {payload[0].payload.roi} ROI
            </span>
            <span className="text-[9px] text-gray-500 uppercase">Yield</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none transition-transform group-hover:scale-110">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm0 4.1L18.6 18H5.4L12 6.1z"/>
          </svg>
        </div>
        
        <div className="flex justify-between items-start mb-2">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Total Assets (USDT)</p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f3ba2f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f3ba2f]"></span>
              </span>
              <span className="text-[10px] text-[#f3ba2f] font-bold uppercase tracking-widest">Live Balance</span>
            </div>
        </div>
        
        <h2 className="text-4xl font-black mb-6 tracking-tighter flex items-baseline gap-1 transition-all hover:scale-[1.02] cursor-default">
            <span className="text-gray-500 text-2xl font-normal">$</span>
            <span className="animate-pulse duration-[2000ms]">{user.balance.toFixed(2)}</span>
        </h2>
        
        <div className="flex gap-3">
          <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/[0.07] transition-all">
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Withdrawable</p>
            <p className="text-[#00c076] font-black text-xl">${user.withdrawableBalance.toFixed(2)}</p>
          </div>
          <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/[0.07] transition-all">
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Net Profits</p>
            <p className="text-[#f3ba2f] font-black text-xl">${user.totalEarnings.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <button 
            onClick={() => onNavigate('withdrawal')}
            className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-all border border-white/5 active:scale-95 text-sm uppercase tracking-wider"
          >
            Withdraw
          </button>
          <button 
             onClick={() => onNavigate('tasks')}
            className="flex-1 bnb-gradient text-black py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-500/20 text-sm uppercase tracking-wider"
          >
            Execution Unit
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 border-l-4 border-[#f3ba2f] flex items-center gap-4 hover:bg-white/2 transition-all">
        <div className="w-10 h-10 rounded-full bg-[#f3ba2f]/10 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-[#f3ba2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#f3ba2f] block mb-0.5 opacity-70">Expert Market Pulse</span>
            <p className="text-[11px] leading-relaxed italic text-gray-300 font-medium">"{insight}"</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Projected Yield Forecast</h3>
            <p className="text-[10px] text-gray-500 font-bold mt-0.5 tracking-wider">Based on VIP {user.vipLevel || 0} Tier</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-[#00c076] uppercase tracking-widest">7D Accumulation</p>
            <p className="text-xl font-black text-white">25.00%</p>
          </div>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f3ba2f" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f3ba2f" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#4b5563', fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f3ba2f', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#f3ba2f" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600 font-black uppercase tracking-widest">
           <span className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
             Start: MON 00:00
           </span>
           <span className="text-[#f3ba2f] flex items-center gap-1.5">
             Reset: MON 00:00
             <div className="w-1.5 h-1.5 rounded-full bg-[#f3ba2f]"></div>
           </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
