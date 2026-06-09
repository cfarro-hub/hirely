import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "starter" | "pro" | "unlimited";
  cv_credits: number;
  interview_credits: number;
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,avatar_url,plan,cv_credits,interview_credits")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data ?? null) as Profile | null;
  });

export interface ReferralRow {
  id: string;
  referred_email: string;
  status: "pending" | "signed_up" | "rewarded" | "rejected";
  created_at: string;
  rewarded_at: string | null;
}

export const getMyReferrals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("referrals")
      .select("id,referred_email,status,created_at,rewarded_at")
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as ReferralRow[];
  });

export interface CreditTxn {
  id: string;
  delta: number;
  reason: string;
  created_at: string;
}

export const getMyTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("credit_transactions")
      .select("id,delta,reason,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as CreditTxn[];
  });

export const createReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ email: z.string().email().max(255) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: result, error } = await supabase.rpc("create_referral", { p_email: data.email });
    if (error) throw new Error(error.message);
    return result as { ok: boolean; reason?: string };
  });