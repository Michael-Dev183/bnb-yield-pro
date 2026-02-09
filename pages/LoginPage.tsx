
import React, { useState } from 'react';
import { Page } from '../types';

interface LoginPageProps {
  onLogin: (username: string, password?: string) => void;
  onNavigate: (page: Page) => void;
  onForgotPassword?: (username: string) => void;
  authError?: string | null;
  onResendVerification?: (email: string) => Promise<boolean>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate, authError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username.trim(), password.trim());
    }
  };

  const isAdminAttempt = username.toLowerCase() === 'admin';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0b0e11]">
      <div className="w-full max-w-sm glass-card rounded-3xl p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bnb-gradient rounded-full flex items-center justify-center font-bold text-black text-xl mx-auto mb-4 shadow-lg shadow-yellow-500/10">BNB</div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Log in to your Yield Pro account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <div className="border p-4 rounded-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-red-500/10 border-red-500/20">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-bold uppercase tracking-tight text-red-500">
                  Access Denied
                </p>
              </div>
              <p className="text-[11px] leading-relaxed font-medium text-red-400/80">{authError}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email"
              className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#f3ba2f]/50 text-white transition-all"
              required
            />
            {isAdminAttempt && (
               <div className="mt-2 bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl animate-in fade-in duration-300">
                 <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">Admin Login</p>
                 <p className="text-[9px] text-gray-500">Accessing secure protocol console.</p>
               </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <button 
                type="button" 
                onClick={() => onNavigate('forgot-password')}
                className="text-[10px] text-[#f3ba2f] font-bold uppercase tracking-tighter hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#1e2329] border border-white/5 rounded-2xl px-5 py-4 pr-12 focus:outline-none focus:border-[#f3ba2f]/50 text-white transition-all"
                required
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

          <button
            type="submit"
            className="w-full bnb-gradient text-black py-4 rounded-2xl font-bold text-lg shadow-xl shadow-yellow-500/10 active:scale-95 transition-all"
          >
            Log In
          </button>
        </form>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="text-[#f3ba2f] font-bold hover:underline">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
