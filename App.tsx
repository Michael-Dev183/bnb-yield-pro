
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabaseService } from './services/supabaseService';
import { 
  Page, UserState, Transaction, VIPLevel, VIPPackage, 
  DepositRequest, WithdrawalRequest, UpgradeRequest
} from './types';
import { VIP_PACKAGES as FALLBACK_PACKAGES } from './constants';
import Dashboard from './pages/Dashboard';
import TaskPage from './pages/TaskPage';
import VIPPage from './pages/VIPPage';
import ProfilePage from './pages/ProfilePage';
import WithdrawalPage from './pages/WithdrawalPage';
import DepositPage from './pages/DepositPage';
import ReferralPage from './pages/ReferralPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import VIPPaymentPage from './pages/VIPPaymentPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { Layout } from './components/Layout';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<UserState | null>(null);
  const [allUsers, setAllUsers] = useState<UserState[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<VIPPackage | null>(null);

  const refreshUser = useCallback(async (userId: string) => {
    const profile = await supabaseService.getProfile(userId);
    if (profile) {
      setCurrentUser(profile);
      if (profile.isAdmin) {
        const users = await supabaseService.getAllUsers();
        setAllUsers(users);
      }
    }
  }, []);

  useEffect(() => {
    const initApp = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await refreshUser(session.user.id);
        if (currentPage === 'login' || currentPage === 'signup' || currentPage === 'forgot-password') {
          setCurrentPage('dashboard');
        }
      }
      setLoading(false);
    };

    initApp();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await refreshUser(session.user.id);
        setCurrentPage('dashboard');
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentPage('login');
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [refreshUser]);

  const pendingDeposits = useMemo(() => {
    const deposits: DepositRequest[] = [];
    allUsers.forEach(u => {
      u.transactions.filter(t => t.type === 'deposit' && t.status === 'pending').forEach(t => {
        deposits.push({ id: t.id, username: u.username, amount: t.amount, userWallet: t.address || '', created_at: t.created_at });
      });
    });
    return deposits;
  }, [allUsers]);

  const pendingWithdrawals = useMemo(() => {
    const withdrawals: WithdrawalRequest[] = [];
    allUsers.forEach(u => {
      u.transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').forEach(t => {
        withdrawals.push({ id: t.id, username: u.username, amount: t.amount, address: t.address || '', created_at: t.created_at, type: 'task' });
      });
    });
    return withdrawals;
  }, [allUsers]);

  const pendingUpgrades = useMemo(() => {
    const upgrades: UpgradeRequest[] = [];
    allUsers.forEach(u => {
      u.transactions.filter(t => t.type === 'vip_upgrade' && t.status === 'pending').forEach(t => {
        const pkg = FALLBACK_PACKAGES.find(p => p.cost === t.amount);
        if (pkg) {
          upgrades.push({ id: t.id, username: u.username, vipLevel: pkg.level, created_at: t.created_at });
        }
      });
    });
    return upgrades;
  }, [allUsers]);

  const handleClaimReward = async (amount: number) => {
    if (!currentUser) return;
    try {
      await supabaseService.processTaskReward(currentUser.id, amount);
      await refreshUser(currentUser.id);
    } catch (e: any) {
      alert(e.message || "Failed to claim reward");
    }
  };

  const handleApproveDeposit = async (txId: string) => {
    const tx = allUsers.flatMap(u => u.transactions).find(t => t.id === txId);
    if (!tx || !tx.user_id) return;
    try {
      await supabaseService.approveDeposit(txId, tx.user_id, tx.amount);
      if (currentUser) refreshUser(currentUser.id);
    } catch (e) { alert("Failed to approve deposit"); }
  };

  const handleApproveUpgrade = async (txId: string) => {
    const tx = allUsers.flatMap(u => u.transactions).find(t => t.id === txId);
    if (!tx || !tx.user_id) return;
    const pkg = FALLBACK_PACKAGES.find(p => p.cost === tx.amount);
    if (!pkg) return;
    
    try {
      await supabaseService.approveVIPUpgrade(txId, tx.user_id, pkg.level);
      if (currentUser) refreshUser(currentUser.id);
    } catch (e) { alert("Failed to approve upgrade"); }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await supabaseService.resetPassword(email);
      return true;
    } catch (err: any) {
      alert(err.message || "Could not send reset link.");
      return false;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b0e11] text-[#f3ba2f] font-bold">BNB YIELD PRO CORE...</div>;

  if (!currentUser) {
    if (currentPage === 'signup') return <SignupPage onSignup={supabaseService.signUp} onNavigate={setCurrentPage} />;
    if (currentPage === 'forgot-password') return <ForgotPasswordPage onNavigate={setCurrentPage} onRequestReset={handleResetPassword} />;
    return <LoginPage onLogin={supabaseService.signIn} onNavigate={setCurrentPage} authError={authError} />;
  }

  const renderPage = () => {
    if (currentUser.isAdmin && currentPage === 'admin') {
      return (
        <AdminPage 
          allUsers={allUsers}
          pendingUpgrades={pendingUpgrades} 
          pendingDeposits={pendingDeposits}
          pendingWithdrawals={pendingWithdrawals}
          onApproveUpgrade={handleApproveUpgrade}
          onApproveDeposit={handleApproveDeposit}
          onApproveWithdrawal={(id) => supabaseService.updateTransactionStatus(id, 'completed').then(() => refreshUser(currentUser.id))}
          onNavigate={setCurrentPage}
          onLogout={supabaseService.signOut}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard': return <Dashboard user={currentUser} vipPackages={FALLBACK_PACKAGES} onNavigate={setCurrentPage} />;
      case 'tasks': return <TaskPage user={currentUser} vipPackages={FALLBACK_PACKAGES} onClaim={handleClaimReward} onNavigate={setCurrentPage} />;
      case 'vip': 
        if (selectedPackage) return <VIPPaymentPage pkg={selectedPackage} onConfirmUpgrade={(p, w) => supabaseService.addTransaction(currentUser.id, { type: 'vip_upgrade', amount: p.cost, address: w }).then(() => { setSelectedPackage(null); refreshUser(currentUser.id); })} onCancel={() => setSelectedPackage(null)} />;
        return <VIPPage user={currentUser} vipPackages={FALLBACK_PACKAGES} onPurchaseVIP={setSelectedPackage} />;
      case 'profile': return <ProfilePage user={currentUser} onLogout={supabaseService.signOut} onNavigate={setCurrentPage} onUpdateUser={(u) => supabaseService.updateProfile(currentUser.id, u).then(() => refreshUser(currentUser.id))} />;
      case 'withdrawal': return <WithdrawalPage user={currentUser} onWithdraw={(amt, add, ref) => supabaseService.addTransaction(currentUser.id, { type: 'withdrawal', amount: amt, address: add, metadata: { is_referral: ref } }).then(() => { refreshUser(currentUser.id); return true; })} />;
      case 'deposit': return <DepositPage user={currentUser} onSubmitRequest={(amt, wal) => supabaseService.addTransaction(currentUser.id, { type: 'deposit', amount: amt, address: wal }).then(() => setCurrentPage('profile'))} onNavigate={setCurrentPage} />;
      case 'referral': return <ReferralPage user={currentUser} onSimulateInvite={() => {}} />;
      default: return <Dashboard user={currentUser} vipPackages={FALLBACK_PACKAGES} onNavigate={setCurrentPage} />;
    }
  };

  return <Layout currentPage={currentPage} onNavigate={setCurrentPage} isAdmin={currentUser.isAdmin}>{renderPage()}</Layout>;
};

export default App;
