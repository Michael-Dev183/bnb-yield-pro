
import React, { useState } from 'react';
import { UserState } from '../types';

interface WithdrawalPageProps {
  user: UserState;
  // Fixed: Update to return Promise<boolean> to match App.tsx handleWithdraw
  onWithdraw: (amount: number, address: string, isReferral?: boolean) => Promise<boolean>;
}

export default function WithdrawalPage({ user, onWithdraw }: WithdrawalPageProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAmount, setLastAmount] = useState(0);
  const [withdrawType, setWithdrawType] = useState<'task' | 'referral'>('task');

  const dayOfWeek = new Date().getDay();
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  
  const savedAddress = user.withdrawalAddress;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    const balanceToCheck = withdrawType === 'referral' ? user.referralBalance : user.withdrawableBalance;
    
    if (!savedAddress || savedAddress.length < 42) {
      alert("Please set your withdrawal address in the Profile section first.");
      return;
    }
    
    if (isNaN(val) || val < 1) {
      alert("Minimum withdrawal is $1.00");
      return;
    }
    
    if (val > balanceToCheck) {
      alert(`Insufficient ${withdrawType} profits.`);
      return;
    }

    if (isSaturday) {
      alert("Withdrawals are completely closed on Saturdays.");
      return;
    }

    if (withdrawType === 'task' && !isWeekday) {
      alert("Task profits can only be withdrawn from Monday to Friday.");
      return;
    }

    if (withdrawType === 'referral' && !isSunday) {
      alert("Referral profits can only be withdrawn on Sundays.");
      return;
    }

    setLoading(true);
    // Fixed: Added async/await for onWithdraw
    setTimeout(async () => {
      const success = await onWithdraw(val, savedAddress, withdrawType === 'referral');
      if (success) {
        setLastAmount(val);
        setShowSuccessModal(true);
        setAmount('');
      }
      setLoading(false);
    }, 1500);
  };

  const getStatusMessage = () => {
    if (isSaturday) return { text: "Withdrawals Closed", sub: "Saturday Protocol Active", color: "red", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" };
    if (isSunday) {
        if (withdrawType === 'referral') return { text: "Referral Open", sub: "Sunday Window Active", color: "green", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" };
        return { text: "Task Closed", sub: "Sundays for Referral Only", color: "yellow", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" };
    }
    if (isWeekday) {
        if (withdrawType === 'task') return { text: "Task Open", sub: "Weekday Window Active", color: "green", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" };
        return { text: "Referral Closed", sub: "Available on Sundays", color: "yellow", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" };
    }
    return { text: "Status Unknown", sub: "Contact Admin", color: "gray", icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" };
  };

  const status = getStatusMessage();

  return (
    <div className="space-y-8 relative">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-sm rounded-[40px] p-8 text-center space-y-6 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bnb-gradient rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/20">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Withdrawal Succeeded</h3>
              <p className="text-[#00c076] font-bold text-lg">${lastAmount.toFixed(2)} USDT</p>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed px-4">
              Your payment is being processed. It may take <span className="text-white font-bold">2 to 3 minutes</span> to appear in your wallet.
            </p>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bnb-gradient text-black py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Withdraw</h2>
        <p className="text-gray-400 text-sm">Transfer profits to your BEP20 USDT wallet</p>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setWithdrawType('task')}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all ${
            withdrawType === 'task' ? 'bnb-gradient text-black border-transparent shadow-lg' : 'bg-white/5 text-gray-500 border-white/5'
          }`}
        >
          Task Profits
        </button>
        <button 
          onClick={() => setWithdrawType('referral')}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all ${
            withdrawType === 'referral' ? 'bnb-gradient text-black border-transparent shadow-lg' : 'bg-white/5 text-gray-500 border-white/5'
          }`}
        >
          Referral Profits
        </button>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
          <div>
             <p className="text-[10px] text-gray-500 uppercase font-bold">Withdrawal Type</p>
             <p className="text-sm font-bold text-white">{withdrawType === 'referral' ? 'Inviter Rewards' : 'Daily Task Yield'}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-gray-500 uppercase font-bold">Available</p>
             <p className="text-xl font-bold text-[#00c076]">
                ${(withdrawType === 'referral' ? user.referralBalance : user.withdrawableBalance).toFixed(2)}
             </p>
          </div>
        </div>

        <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${
            status.color === 'green' ? 'bg-green-500/10 border-green-500/20' : 
            status.color === 'red' ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20'
        }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                status.color === 'green' ? 'bg-green-500' : 
                status.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'
            }`}>
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={status.icon} />
            </svg>
            </div>
            <div>
            <p className="text-xs font-bold uppercase tracking-tighter text-white">
                {status.text}
            </p>
            <p className="text-[10px] text-gray-500">
                {status.sub}
            </p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Amount (USDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Min 1.00"
              className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#f3ba2f]/50 transition-colors text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">Withdrawal Address (BEP20)</label>
            {savedAddress ? (
              <div className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-xs font-mono text-gray-400 break-all">
                {savedAddress}
              </div>
            ) : (
              <div className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-1">
                No address saved. Please update in Profile.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !savedAddress || isSaturday || (withdrawType === 'task' && !isWeekday) || (withdrawType === 'referral' && !isSunday)}
            className="w-full bnb-gradient text-black py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : status.text}
          </button>
        </form>
      </div>

      <div className="glass-card rounded-3xl p-6 border-l-4 border-[#f3ba2f]">
        <h4 className="font-bold mb-2 text-xs uppercase tracking-widest">Protocol Schedule</h4>
        <div className="space-y-2 text-[11px] text-gray-500 leading-relaxed">
          <p>• <span className="text-white">Task Yield:</span> Mon-Fri only.</p>
          <p>• <span className="text-[#f3ba2f]">Referral Profits:</span> Sundays only.</p>
          <p>• <span className="text-red-500 font-bold">Saturdays:</span> System maintenance. No withdrawals.</p>
          <p>• <span className="text-white">Fee:</span> $0.00 Transaction Fee across all withdrawals.</p>
        </div>
      </div>
    </div>
  );
}
