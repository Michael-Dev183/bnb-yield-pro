
import React from 'react';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, isAdmin }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'tasks', label: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'vip', label: 'VIP', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z' },
    { id: 'referral', label: 'Refer', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0e11] text-[#eaecef]">
      {/* Top Header */}
      <header className={`fixed top-0 left-0 right-0 h-16 glass-card z-50 px-4 flex items-center justify-between border-b ${isAdmin ? 'border-red-500/20' : 'border-white/5'}`}>
        <div className="flex items-center gap-2" onClick={() => !isAdmin && onNavigate('dashboard')} style={{ cursor: isAdmin ? 'default' : 'pointer' }}>
          <div className={`w-8 h-8 ${isAdmin ? 'bg-red-500' : 'bnb-gradient'} rounded-full flex items-center justify-center font-bold text-black text-xs`}>
            {isAdmin ? 'A' : 'BNB'}
          </div>
          <h1 className="text-lg font-bold tracking-tight">Yield Pro {isAdmin && <span className="text-red-500 ml-1 text-xs">Admin</span>}</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-grow ${isAdmin ? 'pt-20 pb-10' : 'pt-20 pb-24'} px-4 overflow-y-auto`}>
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Hidden for Admin */}
      {!isAdmin && (
        <nav className="fixed bottom-0 left-0 right-0 h-20 glass-card z-50 border-t border-white/5 px-2 flex items-center justify-between">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              className={`flex flex-1 flex-col items-center gap-1 transition-colors ${
                currentPage === item.id ? 'text-[#f3ba2f]' : 'text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="text-[9px] font-medium uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};
