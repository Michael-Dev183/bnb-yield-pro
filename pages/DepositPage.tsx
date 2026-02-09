
import React, { useState } from 'react';
import { UserState, Page } from '../types';

interface DepositPageProps {
  user: UserState;
  onSubmitRequest: (amount: number, userWallet: string) => void;
  onNavigate: (page: Page) => void;
}

const DepositPage: React.FC<DepositPageProps> = ({ user, onSubmitRequest, onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [userWallet, setUserWallet] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isWalletValid = userWallet.startsWith('0x') && userWallet.length >= 42;

  const handleGoToStep2 = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
    setStep(2);
  };

  const handleConfirm = () => {
    const val = parseFloat(amount);
    if (!isWalletValid) {
      alert("Please enter your valid USDT BEP20 sending address.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      onSubmitRequest(val, userWallet);
      setSubmitting(false);
      // Instead of an alert, we redirect to the profile page to view transaction status
      onNavigate('profile');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Deposit Funds</h2>
        <p className="text-gray-400 text-sm">Add USDT (BEP20) to your BNB Yield account</p>
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-6 relative overflow-hidden">
        {step === 1 ? (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bnb-gradient rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/20">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-8-8h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Enter Deposit Amount</h3>
              <p className="text-xs text-gray-500">How much USDT do you want to add to your balance?</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Amount (USDT)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-[#f3ba2f]/50 text-2xl font-bold text-white transition-all"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold">USDT</span>
              </div>
            </div>

            <button 
              onClick={handleGoToStep2}
              disabled={!amount || parseFloat(amount) <= 0}
              className={`w-full py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all active:scale-95 ${
                amount && parseFloat(amount) > 0 
                  ? 'bnb-gradient text-black shadow-yellow-500/20' 
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed shadow-none'
              }`}
            >
              Deposit Now
            </button>

            <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
              <div className="w-2 h-2 rounded-full bg-[#f3ba2f]"></div>
              <span>Step 1 of 2</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setStep(1)} className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="text-xl font-bold">Payment Details</h3>
            </div>

            <div className="bg-[#1e2329] p-6 rounded-2xl border border-white/5 space-y-4 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Send Exactly</p>
              <p className="text-3xl font-bold text-white">${parseFloat(amount).toFixed(2)} USDT</p>
              <div className="text-[10px] bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full inline-block border border-yellow-500/20">
                Network: BEP20 (Binance Smart Chain)
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Destination Wallet Address:</label>
              <div className="flex items-center gap-2 bg-[#1e2329] p-4 rounded-2xl border border-white/5 group">
                <span className="text-[11px] font-mono truncate flex-1 text-gray-400 select-all">{user.depositAddress}</span>
                <button 
                  onClick={handleCopy}
                  className="bnb-gradient text-black p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  {copied ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10">
                <p className="text-[10px] text-yellow-500 font-bold mb-2 uppercase">Verification Menu</p>
                <label className="block text-xs font-bold text-gray-400 mb-2">Enter the Wallet Address You Used to Send Funds:</label>
                <input
                  type="text"
                  value={userWallet}
                  onChange={(e) => setUserWallet(e.target.value)}
                  placeholder="0x... (Your BEP20 Sender Address)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#f3ba2f]/50 text-xs font-mono text-white placeholder:text-gray-700"
                />
              </div>

              <button 
                onClick={handleConfirm}
                disabled={submitting || !isWalletValid}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 ${
                  isWalletValid 
                    ? 'bnb-gradient text-black shadow-yellow-500/20' 
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed shadow-none'
                }`}
              >
                {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Submitting...
                    </div>
                ) : 'Submit for Verification'}
              </button>
            </div>

            <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
              <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              <div className="w-2 h-2 rounded-full bg-[#f3ba2f]"></div>
              <span>Step 2 of 2</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 glass-card rounded-2xl border border-white/5 flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          The transaction will be verified by auditing the provided wallet address on the blockchain. Funds are typically added to your dashboard within 30 minutes.
        </p>
      </div>
    </div>
  );
};

export default DepositPage;
