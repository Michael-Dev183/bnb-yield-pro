
import { supabase } from '../supabase';
import { UserState, Transaction, VIPLevel, VIPPackage } from '../types';

export const supabaseService = {
  // --- AUTHENTICATION ---
  signUp: async (username: string, email: string, password?: string, refCode?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || '',
      options: {
        data: { username, refCode }
      }
    });
    if (error) throw error;
    return { success: true, message: "Account created successfully" };
  },

  signIn: async (email: string, password?: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || '',
    });
    if (error) throw error;
    return data.user;
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
    return true;
  },

  // --- PROFILE MANAGEMENT ---
  getProfile: async (userId: string): Promise<UserState | null> => {
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (pError || !profile) return null;

    const { data: txs } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      vipLevel: profile.vip_level,
      balance: profile.balance,
      withdrawableBalance: profile.withdrawable_balance,
      referralBalance: profile.referral_balance,
      totalEarnings: profile.total_earnings,
      referralCode: profile.referral_code,
      referredByCode: profile.referred_by_code,
      referralCount: profile.referral_count,
      depositAddress: '0x2f61efe6342849cc50ce4725dc6bcc9a2125eeb3', 
      isAdmin: profile.is_admin,
      lastTaskClaim: profile.last_task_claim,
      mustChangePassword: false,
      passwordResetRequested: false,
      transactions: txs || []
    };
  },

  updateProfile: async (userId: string, updates: any) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
  },

  // --- ADMIN METHODS ---
  getAllUsers: async (): Promise<UserState[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, transactions(*)');
    if (error) throw error;
    
    return data.map(p => ({
      ...p,
      id: p.id,
      username: p.username,
      email: p.email,
      vipLevel: p.vip_level,
      balance: p.balance,
      withdrawableBalance: p.withdrawable_balance,
      referralBalance: p.referral_balance,
      totalEarnings: p.total_earnings,
      referralCode: p.referral_code,
      referralCount: p.referral_count,
      isAdmin: p.is_admin,
      lastTaskClaim: p.last_task_claim,
      mustChangePassword: false,
      passwordResetRequested: false,
      transactions: p.transactions || []
    }));
  },

  updateTransactionStatus: async (txId: string, status: string) => {
    const { error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', txId);
    if (error) throw error;
  },

  approveVIPUpgrade: async (txId: string, userId: string, newLevel: number) => {
    // Start by updating transaction
    const { error: txError } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', txId);
    
    if (txError) throw txError;

    // Then update the user's VIP level
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ vip_level: newLevel })
      .eq('id', userId);
    
    if (profileError) throw profileError;
  },

  approveDeposit: async (txId: string, userId: string, amount: number) => {
    // Update transaction
    const { error: txError } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', txId);
    if (txError) throw txError;

    // Add balance to user
    const { data: profile } = await supabase.from('profiles').select('balance').eq('id', userId).single();
    const { error: pError } = await supabase
      .from('profiles')
      .update({ balance: (profile?.balance || 0) + amount })
      .eq('id', userId);
    if (pError) throw pError;
  },

  // --- TRANSACTIONS ---
  addTransaction: async (userId: string, tx: Partial<Transaction>) => {
    const { data, error } = await supabase.from('transactions').insert([{
      user_id: userId,
      type: tx.type,
      amount: tx.amount,
      status: tx.status || 'pending',
      address: tx.address,
      metadata: tx.metadata
    }]).select().single();
    if (error) throw error;
    return data;
  },

  processTaskReward: async (userId: string, amount: number) => {
    const { error } = await supabase.rpc('process_task_claim', {
      user_uuid: userId,
      reward_amount: amount
    });
    if (error) throw error;
  }
};
