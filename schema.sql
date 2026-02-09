
-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  vip_level INTEGER DEFAULT 0,
  balance DECIMAL(12,2) DEFAULT 0.00,
  withdrawable_balance DECIMAL(12,2) DEFAULT 0.00,
  referral_balance DECIMAL(12,2) DEFAULT 0.00,
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  referral_code TEXT UNIQUE,
  referred_by_code TEXT,
  referral_count INTEGER DEFAULT 0,
  last_task_claim TIMESTAMPTZ,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. TRANSACTIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'reward', 'referral_bonus'
  amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  address TEXT, -- Wallet address
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. RLS POLICIES (Security)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin Policies
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR ALL USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- ==========================================
-- 4. AUTH TRIGGER (Auto-create Profile)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, referral_code, referred_by_code)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.email,
    upper(substring(md5(random()::text) from 1 for 8)),
    new.raw_user_meta_data->>'refCode'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 5. SECURE TASK CLAIM RPC
-- ==========================================
CREATE OR REPLACE FUNCTION public.process_task_claim(user_uuid UUID, reward_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  -- 1. Check if user already claimed in the last 24 hours
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid 
    AND (last_task_claim IS NULL OR last_task_claim < NOW() - INTERVAL '24 hours')
  ) THEN
    -- 2. Update balances
    UPDATE public.profiles
    SET 
      balance = balance + reward_amount,
      withdrawable_balance = withdrawable_balance + reward_amount,
      total_earnings = total_earnings + reward_amount,
      last_task_claim = NOW()
    WHERE id = user_uuid;
    
    -- 3. Record transaction
    INSERT INTO public.transactions (user_id, type, amount, status)
    VALUES (user_uuid, 'reward', reward_amount, 'completed');
  ELSE
    RAISE EXCEPTION 'Task already completed or on cooldown.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
