
import React, { useState } from 'react';
import { UserState, VIPLevel } from '../types';
import { MAX_INVITES } from '../constants';

interface ReferralPageProps {
  user: UserState;
  onSimulateInvite: (vipLevel: VIPLevel) => void;
}

export default function ReferralPage({ user }: ReferralPageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEligible = user.vipLevel >= VIPLevel.VIP1;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Referral Program</h2>
        <p className="text-gray-400 text-sm">Grow your team and earn direct rewards</p>
      </div>

      {/* Eligibility Warning */}
      {!isEligible && (
        <div className="glass-card rounded-3xl p-6 border-2 border-red-500/20 bg-red-500/5 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-tight">Reward Eligibility Locked</p>
              <p className="text-[11px] text-gray-400 mt-0.5">You must be at least <span className="text-[#f3ba2f] font-bold">VIP 1</span> to receive invitation bonuses.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-3xl p-5 text-center border-b-4 border-[#f3ba2f]">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Invites (Limit {MAX_INVITES})</p>
          <p className="text-2xl font-bold text-white">{user.referralCount} <span className="text-sm text-gray-500 font-normal">/ {MAX_INVITES}</span></p>
        </div>
        <div className="glass-card rounded-3xl p-5 text-center border-b-4 border-[#00c076]">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Unclaimed Bonus</p>
          <p className="text-2xl font-bold text-[#00c076]">${user.referralBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 bg-yellow-500/5 border border-yellow-500/10">
         <div className="flex items-center gap-3 text-yellow-500">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] font-bold uppercase tracking-wider">Note: Referral rewards can be withdrawn on Sundays only.</p>
         </div>
      </div>

      {/* Share Section */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="font-bold mb-4">Your Invitation Code</h3>
        <div className="flex items-center gap-2 bg-[#1e2329] p-4 rounded-2xl border border-white/5 mb-4 group">
          <span className="text-xl font-mono font-bold flex-1 text-center text-[#f3ba2f] tracking-widest">{user.referralCode}</span>
          <button 
            onClick={handleCopy}
            className="bnb-gradient text-black p-3 rounded-xl active:scale-95 transition-transform"
          >
            {copied ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-sm text-[#f3ba2f] shrink-0">1</div>
            <div>
               <p className="text-sm font-bold text-white">Direct Bonus</p>
               <p className="text-xs text-gray-400">Receive <span className="text-[#00c076] font-bold">$2.00</span> instantly when your invitee activates their <span className="text-white font-bold">first VIP package</span>.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-sm text-[#f3ba2f] shrink-0">2</div>
            <div>
               <p className="text-sm font-bold text-white">Sunday Protocol</p>
               <p className="text-xs text-gray-400">All referral payouts are synchronized for <span className="text-white font-bold">Sunday</span> processing.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-sm text-[#f3ba2f] shrink-0">3</div>
            <div>
               <p className="text-sm font-bold text-white">Invite Limit</p>
               <p className="text-xs text-gray-400">Each account can benefit from a maximum of <span className="text-[#f3ba2f] font-bold">5 successful invites</span>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
