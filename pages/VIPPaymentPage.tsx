
import React, { useState } from 'react';
import { VIPPackage, VIPLevel } from '../types';

interface VIPPaymentPageProps {
  pkg: VIPPackage;
  onConfirmUpgrade: (pkg: VIPPackage, walletAddress: string) => void;
  onCancel: () => void;
}

const VIPPaymentPage: React.FC<VIPPaymentPageProps> = ({ pkg, onConfirmUpgrade, onCancel }) => {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [userWallet, setUserWallet] = useState('');
  const depositAddress = '0x2f61efe6342849cc50ce4725dc6bcc9a2125eeb3';

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isWalletValid = userWallet.startsWith('0x') && userWallet.length >= 42;

  const handleConfirm = () => {
    if (!isWalletValid) {
      alert("Please enter a valid USDT BEP20 sending address.");
      return;
    }

    setConfirming(true);
    setTimeout(() => {
      onConfirmUpgrade(pkg, userWallet);
      setConfirming(false);
      alert(`Request submitted! Our team will verify your payment from ${userWallet.slice(0, 6)}... soon. Check your profile for status.`);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold">Upgrade to {pkg.name}</h2>
          <p className="text-gray-400 text-sm">Send exactly ${pkg.cost.toFixed(2)} USDT</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
            <div className="bg-[#f3ba2f]/10 text-[#f3ba2f] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-[#f3ba2f]/20">
                Network: BNB Smart Chain (BEP20)
            </div>
            <div className="text-4xl font-bold text-white tracking-tight">
              ${pkg.cost.toFixed(2)} <span className="text-sm font-normal text-gray-500">USDT</span>
            </div>
        </div>

        <div className="bg-white p-4 inline-block rounded-2xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="w-40 h-40 bg-gray-200 flex items-center justify-center text-gray-400">
             <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-300 opacity-50"></div>
             <svg className="w-24 h-24 relative z-10 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 3h2v2h-2v-2zm3-3h3v2h-3v-2zM13 13h2v2h-2v-2zm0 3h2v2h-2v-2zm3 0h2v2h-2v-2zm0 3h2v2h-2v-2z" />
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">USDT BEP20 Destination Address</label>
          <div className="flex items-center gap-2 bg-[#1e2329] p-4 rounded-2xl border border-[#f3ba2f]/10 relative group">
            <span className="text-[11px] font-mono truncate flex-1 text-gray-300 font-semibold">{depositAddress}</span>
            <button 
              onClick={handleCopy}
              className="bnb-gradient text-black p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
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
        </div>

        <div className="pt-6 border-t border-white/5 space-y-6 text-left">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-yellow-500 uppercase tracking-widest px-1">Provide Proof of Payment</label>
            <p className="text-[11px] text-gray-400 mb-2">Enter the wallet address you used to send the payment for verification.</p>
            <input
              type="text"
              value={userWallet}
              onChange={(e) => setUserWallet(e.target.value)}
              placeholder="Your sending wallet address (0x...)"
              className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#f3ba2f]/50 transition-all text-sm font-mono text-white placeholder:text-gray-600"
            />
          </div>

          <button 
            onClick={handleConfirm}
            disabled={confirming || !isWalletValid}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
              isWalletValid 
                ? 'bnb-gradient text-black shadow-yellow-500/20' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed shadow-none'
            }`}
          >
            {confirming ? (
                <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Submitting Request...
                </>
            ) : 'Submit for Verification'}
          </button>
          <p className="text-[10px] text-center text-gray-600">Verification is processed manually. The blockchain is audited before approval.</p>
        </div>
      </div>
    </div>
  );
};

export default VIPPaymentPage;
