
import React, { useState } from 'react';
import { Page } from '../types';

interface SignupPageProps {
  onSignup: (username: string, email: string, password?: string, refCode?: string) => Promise<{ success: boolean; message: string }>;
  onNavigate: (page: Page) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await onSignup(username.trim(), email.trim(), password.trim(), refCode.trim());
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0b0e11]">
        <div className="w-full max-w-sm glass-card rounded-3xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bnb-gradient rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/20">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Registration Complete</h2>
            <p className="text-[#f3ba2f] font-bold text-xs uppercase tracking-widest font-mono">Profile Synchronized</p>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your account <span className="text-white font-bold">{username}</span> has been successfully registered on the BNB Yield Pro protocol.
          </p>

          <div className="bg-[#f3ba2f]/5 border border-[#f3ba2f]/10 p-4 rounded-2xl text-left">
            <p className="text-[10px] text-[#f3ba2f] font-bold uppercase tracking-widest mb-1">Secure Activation</p>
            <p className="text-[11px] text-gray-400 leading-tight">
              Please check your email for any verification links if enabled. You may now proceed to sign in and activate your VIP mining yield.
            </p>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => onNavigate('login')}
              className="w-full bnb-gradient text-black py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all shadow-xl shadow-yellow-500/20"
            >
              Sign In to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0b0e11]">
      <div className="w-full max-w-sm glass-card rounded-3xl p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bnb-gradient rounded-full flex items-center justify-center font-bold text-black text-xl mx-auto mb-4 shadow-lg shadow-yellow-500/10">BNB</div>
          <h1 className="text-2xl font-bold">Join Yield Pro</h1>
          <p className="text-gray-500 text-sm">Create your decentralized yield account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-2xl flex flex-col gap-2 animate-in fade-in duration-300 bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] font-bold uppercase tracking-tighter text-red-400">
                  Registration Error
                </p>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight px-1">
                {error}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#f3ba2f]/50 text-white transition-all"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#f3ba2f]/50 text-white transition-all"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:border-[#f3ba2f]/50 text-white transition-all"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m18 18l-6.888-6.888" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Referral Code (Optional)</label>
            <input
              type="text"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
              placeholder="Referral Code"
              className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#f3ba2f]/50 text-white transition-all"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bnb-gradient text-black py-4 rounded-2xl font-bold text-lg shadow-xl shadow-yellow-500/10 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Initializing Protocol...
              </>
            ) : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already a member?{' '}
          <button onClick={() => onNavigate('login')} className="text-[#f3ba2f] font-bold hover:underline" disabled={loading}>Log In</button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
