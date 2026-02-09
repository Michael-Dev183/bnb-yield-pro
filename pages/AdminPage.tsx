
import React, { useState, useEffect, useMemo } from 'react';
import { UserState, UpgradeRequest, DepositRequest, WithdrawalRequest, Page, Transaction } from '../types';

interface AdminPageProps {
  allUsers: UserState[];
  pendingUpgrades: UpgradeRequest[];
  pendingDeposits: DepositRequest[];
  pendingWithdrawals: WithdrawalRequest[];
  onApproveUpgrade: (requestId: string) => void;
  onApproveDeposit: (requestId: string) => void;
  onApproveWithdrawal: (transactionId: string) => void;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const ITEMS_PER_PAGE = 15;

export default function AdminPage({ 
  allUsers, 
  pendingUpgrades, 
  pendingDeposits, 
  pendingWithdrawals,
  onApproveUpgrade, 
  onApproveDeposit, 
  onApproveWithdrawal,
  onNavigate, 
  onLogout 
}: AdminPageProps) {
  const [verifyDepositInputs, setVerifyDepositInputs] = useState<Record<string, string>>({});
  const [verifyWithdrawalInputs, setVerifyWithdrawalInputs] = useState<Record<string, string>>({});
  const [verifyUpgradeInputs, setVerifyUpgradeInputs] = useState<Record<string, string>>({});
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return allUsers;
    return allUsers.filter(u => 
      u.username.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term)
    );
  }, [allUsers, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const resetRequests = useMemo(() => allUsers.filter(u => u.passwordResetRequested), [allUsers]);

  useEffect(() => {
    if (copyToast) {
      const timer = setTimeout(() => setCopyToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyToast]);

  const handleCopy = (text?: string, label: string = "Address") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyToast(`${label} copied!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 relative">
      {copyToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#f3ba2f] text-black px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3 border border-black/10 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            {copyToast}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Control</h2>
          <p className="text-gray-400 text-sm">Real-time management dashboard</p>
        </div>
        <button onClick={onLogout} className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all active:scale-95">Logout</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border-l-4 border-blue-500">
          <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Total Users</p>
          <p className="text-xl font-bold text-white">{allUsers.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border-l-4 border-yellow-500">
          <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Pending Payouts</p>
          <p className="text-xl font-bold text-yellow-500">{pendingWithdrawals.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border-l-4 border-green-500">
          <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Upgrade Requests</p>
          <p className="text-xl font-bold text-green-500">{pendingUpgrades.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border-l-4 border-emerald-500">
          <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Pending Deposits</p>
          <p className="text-xl font-bold text-emerald-500">{pendingDeposits.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* VIP Upgrade Requests Section */}
        <div className="glass-card rounded-3xl border border-blue-500/20 overflow-hidden">
          <div className="p-4 bg-blue-500/5 border-b border-white/5 flex justify-between">
            <h3 className="font-bold text-xs uppercase tracking-widest text-blue-400">VIP Upgrade Requests</h3>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">{pendingUpgrades.length}</span>
          </div>
          <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
            {pendingUpgrades.length === 0 ? (
              <p className="p-10 text-center text-gray-600 text-[10px] italic uppercase tracking-widest">No pending upgrades</p>
            ) : pendingUpgrades.map(req => {
              const tx = allUsers.flatMap(u => u.transactions).find(t => t.id === req.id);
              const proofAddress = tx?.address || 'No address provided';
              
              return (
                <div key={req.id} className="p-6 space-y-4 hover:bg-white/2 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-white text-xs uppercase tracking-tight block">{req.username}</span>
                      <span className="text-[10px] text-gray-500 block mt-1">{new Date(req.created_at).toLocaleString()}</span>
                    </div>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-black uppercase text-[9px]">Upgrade to VIP {req.vipLevel}</span>
                  </div>
                  
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">User's Sending Address (Proof)</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-mono text-gray-300 break-all select-all">{proofAddress}</p>
                      <button onClick={() => handleCopy(proofAddress)} className="text-blue-400 p-1.5 hover:bg-blue-400/10 rounded-lg shrink-0 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[9px] text-gray-600 font-bold uppercase tracking-widest">Type Sender Address to Confirm:</label>
                    <input 
                       type="text" 
                       placeholder="Paste proof address here to verify..." 
                       className="w-full bg-[#0b0e11] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white focus:border-blue-500/50 outline-none transition-all"
                       value={verifyUpgradeInputs[req.id] || ''}
                       onChange={e => setVerifyUpgradeInputs({...verifyUpgradeInputs, [req.id]: e.target.value})}
                    />
                    <button 
                       disabled={verifyUpgradeInputs[req.id] !== proofAddress}
                       onClick={() => onApproveUpgrade(req.id)}
                       className={`w-full py-3 rounded-2xl font-bold text-[10px] uppercase transition-all shadow-xl ${
                         verifyUpgradeInputs[req.id] === proofAddress 
                           ? 'bg-blue-500 text-white shadow-blue-500/20' 
                           : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                       }`}
                    >
                       Confirm & Activate VIP
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Similar logic for Deposits... */}
        <div className="glass-card rounded-3xl border border-emerald-500/20 overflow-hidden">
          <div className="p-4 bg-emerald-500/5 border-b border-white/5 flex justify-between">
            <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-400">Balance Deposits</h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{pendingDeposits.length}</span>
          </div>
          <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
            {pendingDeposits.length === 0 ? <p className="p-10 text-center text-gray-600 text-[10px] italic">No pending deposits</p> : pendingDeposits.map(req => (
              <div key={req.id} className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-black text-white text-xs uppercase">{req.username}</span>
                  <span className="text-emerald-400 font-black text-lg">${req.amount.toFixed(2)}</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                   <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Expected Sender:</p>
                   <p className="text-[10px] font-mono text-gray-400 truncate">{req.userWallet}</p>
                </div>
                <input 
                   type="text" 
                   placeholder="Verify Sender Address..." 
                   className="w-full bg-[#0b0e11] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white"
                   value={verifyDepositInputs[req.id] || ''}
                   onChange={e => setVerifyDepositInputs({...verifyDepositInputs, [req.id]: e.target.value})}
                />
                <button 
                   disabled={verifyDepositInputs[req.id] !== req.userWallet}
                   onClick={() => onApproveDeposit(req.id)}
                   className={`w-full py-3 rounded-2xl font-bold text-[10px] uppercase shadow-xl ${
                     verifyDepositInputs[req.id] === req.userWallet 
                       ? 'bg-emerald-500 text-black shadow-emerald-500/20' 
                       : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                   }`}
                >
                   Verify Blockchain & Credit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
