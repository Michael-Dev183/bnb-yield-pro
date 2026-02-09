
import React, { useState } from 'react';
import { Page } from '../types';

interface ForgotPasswordPageProps {
  onNavigate: (page: Page) => void;
  onRequestReset: (email: string) => Promise<boolean>;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate, onRequestReset }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setLoading(true);
      const success = await onRequestReset(email.trim());
      setLoading(false);
      if (success) {
        setSubmitted(true);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0b0e11]">
        <div className="w-full max-w-sm glass-card rounded-3xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-[#00c076]/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/10">
            <svg className="w-10 h-10 text-[#00c076]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Request Processed!</h2>
            <p className="text-[#00c076] font-bold text-xs uppercase tracking-widest">Check Your Inbox</p>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            A secure reset link for account <span className="text-white font-bold">{email}</span> has been generated. Please check your <span className="text-white font-bold">registered email address</span> for instructions.
          </p>
          <div className="pt-4 space-y-4">
            <button 
              onClick={() => onNavigate('login')}
              className="w-full bnb-gradient text-black py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all shadow-xl shadow-yellow-500/20"
            >
              Back to Login
            </button>
            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">
              Didn't receive it? Check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0b0e11]">
      <div className="w-full max-w-sm glass-card rounded-3xl p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-gray-500 text-sm">Enter your email to request a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            disabled={loading || !email}
            className={`w-full bnb-gradient text-black py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Sending...
              </>
            ) : 'Request Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Remembered your password?{' '}
          <button onClick={() => onNavigate('login')} className="text-[#f3ba2f] font-bold hover:underline" disabled={loading}>Log In</button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
