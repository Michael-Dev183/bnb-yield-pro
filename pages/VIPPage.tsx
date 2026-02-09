
import React from 'react';
import { UserState, VIPLevel, VIPPackage } from '../types';

interface VIPPageProps {
  user: UserState;
  vipPackages: VIPPackage[];
  onPurchaseVIP: (pkg: VIPPackage) => void;
}

const VIPPage: React.FC<VIPPageProps> = ({ user, vipPackages, onPurchaseVIP }) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black mb-2 tracking-tight">VIP Shop</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest opacity-60">Elevate your daily yield potential</p>
      </div>

      <div className="space-y-4">
        {vipPackages.map((pkg) => {
          const isCurrent = user.vipLevel === pkg.level;
          const isLower = user.vipLevel > pkg.level;
          const isOwned = user.vipLevel >= pkg.level && user.vipLevel !== VIPLevel.NONE;
          const dailyProfit = pkg.cost * (pkg.daily_return / 100);

          return (
            <div key={pkg.level} className={`glass-card rounded-3xl p-6 transition-all border-2 relative overflow-hidden ${isCurrent ? 'border-[#f3ba2f] shadow-lg shadow-yellow-500/5' : 'border-white/5 opacity-90'}`}>
              {isCurrent && (
                <div className="absolute top-0 right-0">
                   <div className="bg-[#f3ba2f] text-black text-[9px] font-black uppercase px-4 py-1 rounded-bl-xl shadow-md">Active Plan</div>
                </div>
              )}
              {isLower && (
                <div className="absolute top-0 right-0">
                   <div className="bg-white/10 text-gray-500 text-[9px] font-black uppercase px-4 py-1 rounded-bl-xl">Unlocked</div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black flex items-center gap-2">
                    {pkg.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Institutional Yield Access</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#f3ba2f] tracking-tighter">${pkg.cost}</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Contract Cost</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Daily Payout</p>
                  <p className="font-black text-[#00c076] text-lg">${dailyProfit.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Yield Rate</p>
                  <p className="font-black text-white text-lg">{pkg.daily_return}%</p>
                </div>
              </div>

              {!isOwned ? (
                <button
                  onClick={() => onPurchaseVIP(pkg)}
                  className="w-full bnb-gradient text-black py-4 rounded-2xl font-black shadow-lg shadow-yellow-500/10 active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  Acquire License
                </button>
              ) : (
                <div className="w-full bg-[#1e2329]/50 border border-white/5 text-gray-500 py-4 rounded-2xl font-black text-center text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-[#00c076]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {isCurrent ? 'Currently Mining' : 'Upgrade Available'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-5 glass-card rounded-2xl border border-white/5 text-center mt-6">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Available Capital</p>
        <p className="text-xl font-black text-[#f3ba2f] tracking-tight">${user.balance.toFixed(2)} <span className="text-xs font-normal text-gray-600">USDT</span></p>
      </div>
    </div>
  );
};

export default VIPPage;
