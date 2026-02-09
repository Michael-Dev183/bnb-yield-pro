
import React, { useState, useEffect, useMemo } from 'react';
import { UserState, VIPLevel, Page, Transaction, VIPPackage } from '../types';
import { DAILY_RETURN_PERCENTAGE } from '../constants';

interface TaskPageProps {
  user: UserState;
  vipPackages: VIPPackage[];
  onClaim: (amount: number) => void;
  onNavigate: (page: Page) => void;
}

const TaskPage: React.FC<TaskPageProps> = ({ user, vipPackages, onClaim, onNavigate }) => {
  const [claiming, setClaiming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const currentVIP = vipPackages.find(p => p.level === user.vipLevel);
  const dailyProfit = currentVIP ? currentVIP.cost * DAILY_RETURN_PERCENTAGE : 0;
  
  const DAY_IN_MS = 86400000;
  const today = new Date().getDay();
  const isWeekend = today === 0 || today === 6;

  const taskHistory = useMemo(() => {
    return user.transactions
      .filter((tx: Transaction) => tx.type === 'reward')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [user.transactions]);

  useEffect(() => {
    const updateCountdown = () => {
      if (!user.lastTaskClaim) {
        setTimeLeft(null);
        return;
      }
      const now = Date.now();
      const nextAvailable = new Date(user.lastTaskClaim).getTime() + DAY_IN_MS;
      const diff = nextAvailable - now;
      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const pad = (n: number) => n.toString().padStart(2, '0');
        setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [user.lastTaskClaim]);

  const canClaim = user.vipLevel !== VIPLevel.NONE && !timeLeft && !isWeekend;

  const startTask = () => {
    if (!canClaim) return;
    setClaiming(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onClaim(dailyProfit);
          setClaiming(false);
          setProgress(0);
        }, 500);
      }
    }, 30);
  };

  if (user.vipLevel === VIPLevel.NONE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">No VIP Plan Active</h2>
        <p className="text-gray-400 mb-8">Upgrade to a VIP package to start earning your daily 5% returns.</p>
        <button onClick={() => onNavigate('vip')} className="bnb-gradient text-black px-8 py-3 rounded-2xl font-bold">View VIP Plans</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Daily Tasks</h2>
        <p className="text-gray-400 text-sm">One task per 24 hours (Mon-Fri)</p>
      </div>
      
      <div className="glass-card rounded-3xl p-8 text-center border-2 border-white/5 relative overflow-hidden">
        {isWeekend && !claiming && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center p-6 text-center">
             <div className="bg-[#1e2329] border border-white/10 p-8 rounded-[40px] shadow-2xl max-w-xs">
               <div className="w-16 h-16 bg-[#f3ba2f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#f3ba2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Earnings Paused</h3>
               <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Weekend Protocol Active</p>
               <p className="text-[11px] text-gray-400 leading-relaxed">
                 Tasks and earnings are available from <span className="text-white font-bold">Monday to Friday</span>. The system is currently in maintenance mode.
               </p>
             </div>
          </div>
        )}

        {timeLeft && !isWeekend && !claiming && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6">
             <div className="bg-[#1e2329] border border-white/10 p-6 rounded-3xl shadow-2xl">
               <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Next Task Available In</p>
               <div className="text-4xl font-mono font-bold text-[#f3ba2f] tracking-tighter tabular-nums">{timeLeft}</div>
               <p className="text-[10px] text-gray-600 mt-3 uppercase">Cooldown Active</p>
             </div>
          </div>
        )}
        <div className="mb-6">
          <div className="inline-block p-4 bg-[#f3ba2f]/10 rounded-full mb-4">
            <svg className="w-12 h-12 text-[#f3ba2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-1">{currentVIP?.name} System</h3>
          <p className="text-[#00c076] font-semibold text-lg">Daily Reward: ${dailyProfit.toFixed(2)}</p>
        </div>
        {claiming ? (
          <div className="space-y-4">
            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bnb-gradient transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest px-1">
              <span>Optimizing Nodes...</span>
              <span>{progress}%</span>
            </div>
          </div>
        ) : (
          <button
            onClick={startTask}
            disabled={!!timeLeft || isWeekend}
            className={`w-full py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all active:scale-95 ${(!timeLeft && !isWeekend) ? 'bnb-gradient text-black shadow-yellow-500/20' : 'bg-gray-800 text-gray-600 opacity-50 cursor-not-allowed shadow-none'}`}
          >
            {isWeekend ? 'System Paused' : timeLeft ? 'System in Cooldown' : 'Execute Daily Task'}
          </button>
        )}
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#f3ba2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold">Recent Task History</h3>
          </div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{taskHistory.length} Completed</span>
        </div>
        <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5">
          {taskHistory.length === 0 ? (
            <div className="p-10 text-center text-gray-600 text-xs italic">
              Your task rewards will appear here after completion.
            </div>
          ) : (
            taskHistory.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00c076]/10 text-[#00c076] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Task Reward Claimed</p>
                    <p className="text-[10px] text-gray-500">{new Date(tx.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#00c076]">
                    +${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-[8px] text-gray-600 uppercase font-black">Success</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#f3ba2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Protocol Rules
        </h4>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><span className="text-xs font-bold">01</span></div>
            <p className="text-xs text-gray-400 leading-relaxed">Each VIP tier grants exactly one task per <span className="text-white font-bold">24-hour cycle</span>.</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><span className="text-xs font-bold">02</span></div>
            <p className="text-xs text-gray-400 leading-relaxed">Tasks are only available from <span className="text-white font-bold">Monday to Friday</span>. No tasks on weekends.</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><span className="text-xs font-bold">03</span></div>
            <p className="text-xs text-gray-400 leading-relaxed">Rewards are generated based on <span className="text-[#00c076] font-bold">5.00%</span> of your package cost.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
