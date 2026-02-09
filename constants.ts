
import { VIPLevel, VIPPackage, UserState } from './types';

export const VIP_PACKAGES: VIPPackage[] = [
  { level: VIPLevel.VIP1, name: 'VIP 1', cost: 20, daily_return: 5 },
  { level: VIPLevel.VIP2, name: 'VIP 2', cost: 50, daily_return: 5 },
  { level: VIPLevel.VIP3, name: 'VIP 3', cost: 70, daily_return: 5 },
  { level: VIPLevel.VIP4, name: 'VIP 4', cost: 90, daily_return: 5 },
  { level: VIPLevel.VIP5, name: 'VIP 5', cost: 100, daily_return: 5 },
];

export const REFERRAL_BONUS = 2; // $2 flat bonus
export const MAX_INVITES = 5; // Maximum number of invites per user

// Fixed: Added missing required properties id, isAdmin, and passwordResetRequested
export const INITIAL_USER_STATE: UserState = {
  id: '',
  username: '',
  email: '',
  balance: 0,
  withdrawableBalance: 0,
  referralBalance: 0,
  totalEarnings: 0,
  vipLevel: VIPLevel.NONE,
  referralCode: '',
  referralCount: 0,
  depositAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  mustChangePassword: false,
  passwordResetRequested: false,
  isAdmin: false,
  lastTaskClaim: null,
  transactions: []
};

// Added missing admin credentials constant
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'adminpassword123'
};

export const DAILY_RETURN_PERCENTAGE = 0.05; // 5% daily ROI
