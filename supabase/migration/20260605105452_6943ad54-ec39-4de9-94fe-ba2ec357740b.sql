
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.user_plan AS ENUM ('free', 'starter', 'pro', 'unlimited');
CREATE TYPE public.referral_status AS ENUM ('pending', 'signed_up', 'rewarded', 'rejected');

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan public.user_plan NOT NULL DEFAULT 'free',
  cv_credits INTEGER NOT NULL DEFAULT 1,
  interview_credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- =========================================
-- CV USAGE LOG
-- =========================================
CREATE TABLE public.cv_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.cv_usage TO authenticated;
GRANT ALL ON public.cv_usage TO service_role;
ALTER TABLE public.cv_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own usage" ON public.cv_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- =========================================
-- REFERRALS
-- =========================================
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  status public.referral_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  rewarded_at TIMESTAMPTZ,
  UNIQUE (referrer_id, referred_email)
);

GRANT SELECT, INSERT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own referrals" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id);

-- =========================================
-- CREDIT TRANSACTIONS
-- =========================================
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own transactions" ON public.credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- =========================================
-- updated_at trigger
-- =========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================
-- Auto-create profile + reward referrer on signup
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ref_row public.referrals%ROWTYPE;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Reward any pending referral matching this email (first match only)
  SELECT * INTO ref_row FROM public.referrals
    WHERE lower(referred_email) = lower(NEW.email) AND status = 'pending'
    ORDER BY created_at ASC LIMIT 1 FOR UPDATE;

  IF FOUND AND ref_row.referrer_id <> NEW.id THEN
    UPDATE public.referrals SET status = 'rewarded', rewarded_at = now() WHERE id = ref_row.id;
    UPDATE public.profiles SET cv_credits = cv_credits + 1 WHERE id = ref_row.referrer_id;
    INSERT INTO public.credit_transactions (user_id, delta, reason)
    VALUES (ref_row.referrer_id, 1, 'Referral reward: ' || NEW.email);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- Atomic CV credit consumption
-- =========================================
CREATE OR REPLACE FUNCTION public.consume_cv_credit(p_job_title TEXT DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid UUID := auth.uid();
  prof public.profiles%ROWTYPE;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO prof FROM public.profiles WHERE id = uid FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_profile');
  END IF;

  IF prof.plan = 'unlimited' THEN
    INSERT INTO public.cv_usage (user_id, job_title) VALUES (uid, p_job_title);
    RETURN jsonb_build_object('ok', true, 'remaining', 999999, 'plan', prof.plan);
  END IF;

  IF prof.cv_credits <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'limit_reached', 'plan', prof.plan);
  END IF;

  UPDATE public.profiles SET cv_credits = cv_credits - 1 WHERE id = uid;
  INSERT INTO public.cv_usage (user_id, job_title) VALUES (uid, p_job_title);
  INSERT INTO public.credit_transactions (user_id, delta, reason)
  VALUES (uid, -1, 'CV optimization');

  RETURN jsonb_build_object('ok', true, 'remaining', prof.cv_credits - 1, 'plan', prof.plan);
END;
$$;

-- Refund (called only if analysis fails server-side)
CREATE OR REPLACE FUNCTION public.refund_cv_credit()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN; END IF;
  UPDATE public.profiles SET cv_credits = cv_credits + 1 WHERE id = uid AND plan <> 'unlimited';
  INSERT INTO public.credit_transactions (user_id, delta, reason) VALUES (uid, 1, 'CV refund (analysis failed)');
END;
$$;

-- =========================================
-- Create referral with abuse checks
-- =========================================
CREATE OR REPLACE FUNCTION public.create_referral(p_email TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE
  uid UUID := auth.uid();
  my_email TEXT;
  target TEXT := lower(trim(p_email));
  existing_user UUID;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'unauthorized');
  END IF;

  IF target IS NULL OR target = '' OR target !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_email');
  END IF;

  SELECT email INTO my_email FROM auth.users WHERE id = uid;
  IF lower(my_email) = target THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'self_referral');
  END IF;

  SELECT id INTO existing_user FROM auth.users WHERE lower(email) = target LIMIT 1;
  IF existing_user IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'already_registered');
  END IF;

  BEGIN
    INSERT INTO public.referrals (referrer_id, referred_email) VALUES (uid, target);
  EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'duplicate');
  END;

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_cv_credit(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refund_cv_credit() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_referral(TEXT) TO authenticated;
