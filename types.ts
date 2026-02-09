
export enum VIPLevel {
  NONE = 0,
  VIP1 = 1,
  VIP2 = 2,
  VIP3 = 3,
  VIP4 = 4,
  VIP5 = 5
}

export interface VIPPackage {
  level: VIPLevel;
  name: string;
  cost: number;
  daily_return: number;
}

export interface Transaction {
  id: string;
  user_id?: string;
  type: 'deposit' | 'withdrawal' | 'reward' | 'referral_bonus' | 'vip_upgrade' | 'password_reset';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  address?: string;
  created_at: string; // ISO string from Supabase
  username?: string; // UI helper
  // Added metadata field to store structured JSON data from Supabase
  metadata?: {
    is_referral?: boolean;
    [key: string]: any;
  };
}

export interface UserState {
  id: string;
  username: string;
  email: string;
  vipLevel: VIPLevel;
  balance: number;
  withdrawableBalance: number;
  referralBalance: number;
  totalEarnings: number;
  referralCode: string;
  referredByCode?: string;
  referralCount: number;
  depositAddress: string;
  withdrawalAddress?: string;
  lastTaskClaim: string | null; // ISO string
  mustChangePassword: boolean;
  // Added missing property for Admin dashboard logic
  passwordResetRequested: boolean;
  isAdmin: boolean;
  transactions: Transaction[];
  // Added password field to support updates and mock auth logic
  password?: string;
}

export interface UpgradeRequest {
  id: string;
  username: string;
  vipLevel: VIPLevel;
  created_at: string;
}

export interface DepositRequest {
  id: string;
  username: string;
  amount: number;
  userWallet: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  username: string;
  amount: number;
  address: string;
  created_at: string;
  type: 'task' | 'referral';
}

export type Page = 'dashboard' | 'tasks' | 'vip' | 'profile' | 'withdrawal' | 'deposit' | 'referral' | 'login' | 'signup' | 'admin' | 'change-password' | 'forgot-password';
