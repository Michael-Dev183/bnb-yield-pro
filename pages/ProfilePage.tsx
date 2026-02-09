
import React, { useState, useRef } from 'react';
import { UserState, Page } from '../types';

interface ProfilePageProps {
  user: UserState;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  onUpdateUser: (data: Partial<UserState>) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onNavigate, onUpdateUser }) => {
  const [address, setAddress] = useState(user.withdrawalAddress || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!user.withdrawalAddress);
  const [codeCopied, setCodeCopied] = useState(false);
  
  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleSaveAddress = () => {
    if (!address.startsWith('0x') || address.length < 42) {
      alert("Please enter a valid BNB Smart Chain (BEP20) wallet address.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({ withdrawalAddress: address });
      setIsSaving(false);
      setIsEditing(false);
      alert("Withdrawal wallet address updated successfully.");
    }, 1000);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveAddress();
    } else {
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const clearAddress = () => {
    setAddress('');
    inputRef.current?.focus();
  };

  const handleUpdatePassword = () => {
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      onUpdateUser({ password: newPassword });
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
      setIsUpdatingPassword(false);
      alert("Password updated successfully.");
    }, 1000);
  };

  const hasAddress = !!user.withdrawalAddress;

  // Filter out system transactions from user view (admin page only)
  const filteredTransactions = user.transactions.filter(tx => tx.type !== 'password_reset');

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-4 border-[#f3ba2f]/20 shadow-2xl relative">
          <svg className="w-12 h-12 text-[#f3ba2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-500 text-xs">{user.email}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">Code: <span className="text-[#f3ba2f] font-mono font-bold">{user.referralCode}</span></p>
            <button 
              onClick={handleCopyCode}
              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all active:scale-90"
              title="Copy referral code"
            >
              {codeCopied ? (
                <svg className="w-3.5 h-3.5 text-[#00c076]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Withdrawal Wallet Section */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-[#f3ba2f] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Withdrawal Wallet
          </h3>
          {hasAddress && !isEditing && (
            <span className="text-[10px] bg-[#00c076]/20 text-[#00c076] px-2 py-0.5 rounded-full font-bold">SAVED</span>
          )}
        </div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">BNB Smart Chain (USDT BEP20)</p>
        <div className="space-y-3">
          <div className="relative group">
            <input
              ref={inputRef}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing || isSaving}
              placeholder="0x... (Your payout address)"
              className={`w-full bg-[#1e2329] border rounded-2xl px-5 py-4 focus:outline-none transition-all text-sm font-mono text-white placeholder:text-gray-700 ${
                isEditing ? 'border-[#f3ba2f]/50 pr-12' : 'border-white/10 opacity-60'
              }`}
            />
            {isEditing && address && (
              <button 
                onClick={clearAddress}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                title="Clear input"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button 
            onClick={handleEditToggle}
            disabled={isSaving}
            className={`w-full py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
              isEditing ? 'bnb-gradient text-black' : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            {isSaving ? 'Updating...' : isEditing ? 'Save Wallet Address' : 'Change Address'}
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security Settings
          </h3>
          <button 
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="text-[10px] text-[#f3ba2f] font-bold uppercase tracking-wider hover:underline"
          >
            {showPasswordChange ? 'Cancel' : 'Update Password'}
          </button>
        </div>

        {showPasswordChange ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-3 pr-12 text-sm focus:border-[#f3ba2f]/50 outline-none text-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showNewPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m18 18l-6.888-6.888" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-3 pr-12 text-sm focus:border-[#f3ba2f]/50 outline-none text-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m18 18l-6.888-6.888" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button 
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
              className="w-full bnb-gradient text-black py-3 rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
            >
              {isUpdatingPassword ? 'Updating...' : 'Save New Password'}
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-gray-500">Protect your account with a strong, unique password. Do not share your login credentials.</p>
        )}
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold">Transaction History</h3>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{filteredTransactions.length} Total</span>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-10 text-center text-gray-600 italic">No transactions found</div>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === 'reward' || tx.type.startsWith('referral') ? 'bg-[#00c076]/10 text-[#00c076]' : 
                    tx.type === 'deposit' ? 'bg-[#f3ba2f]/10 text-[#f3ba2f]' : 
                    tx.status === 'failed' || tx.status === 'cancelled' ? 'bg-gray-500/10 text-gray-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {(tx.type === 'reward' || tx.type.startsWith('referral')) && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                      {tx.type === 'deposit' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-8-8h16" />}
                      {tx.type === 'withdrawal' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />}
                      {tx.type === 'vip_upgrade' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />}
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold capitalize">{tx.type.replace('_', ' ')}</p>
                    <p className="text-[9px] text-gray-600">{new Date(tx.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    tx.type === 'withdrawal' || tx.type === 'vip_upgrade' ? 'text-red-400' : 'text-[#00c076]'
                  }`}>
                    {tx.type === 'withdrawal' || tx.type === 'vip_upgrade' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                  {tx.type === 'withdrawal' ? (
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm ${
                      tx.status === 'completed' 
                        ? 'bg-[#00c076] text-black' 
                        : 'bg-yellow-500 text-black animate-pulse'
                    }`}>
                      {tx.status === 'completed' ? 'PAID' : 'PENDING'}
                    </span>
                  ) : (
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm ${
                      tx.status === 'completed' ? 'bg-[#00c076]/20 text-[#00c076]' : 
                      tx.status === 'failed' || tx.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {tx.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-bold border border-red-500/20 active:bg-red-500/20 transition-all"
      >
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePage;
