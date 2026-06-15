import { c as createServerRpc } from "./createServerRpc-DAKQrgTG.js";
import { a as createServerFn } from "./server-2xF5ZQvo.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-CaKyJUqS.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@supabase/supabase-js";
const getMyProfile_createServerFn_handler = createServerRpc({
  id: "7137c45c66e2762097026ceecb6dd952f95d83288f96d03621061209a6008b8a",
  name: "getMyProfile",
  filename: "src/lib/account.functions.ts"
}, (opts) => getMyProfile.__executeServer(opts));
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyProfile_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("profiles").select("id,email,full_name,avatar_url,plan,cv_credits,interview_credits").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
});
const getMyReferrals_createServerFn_handler = createServerRpc({
  id: "1da968383aad119d0e38bf4d221e85e0e9f258b117beee8caefd18063cd15e8a",
  name: "getMyReferrals",
  filename: "src/lib/account.functions.ts"
}, (opts) => getMyReferrals.__executeServer(opts));
const getMyReferrals = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyReferrals_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("referrals").select("id,referred_email,status,created_at,rewarded_at").eq("referrer_id", userId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getMyTransactions_createServerFn_handler = createServerRpc({
  id: "7b2bbf0c0abb60c97dae6f7f2218aa7697bb34c9b673e066a9c47dd7a5b3dd0a",
  name: "getMyTransactions",
  filename: "src/lib/account.functions.ts"
}, (opts) => getMyTransactions.__executeServer(opts));
const getMyTransactions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyTransactions_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("credit_transactions").select("id,delta,reason,created_at").eq("user_id", userId).order("created_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const createReferral_createServerFn_handler = createServerRpc({
  id: "c4e11a26640794d496da09a8d43691a5d36874ff29192b4af7da35146487023c",
  name: "createReferral",
  filename: "src/lib/account.functions.ts"
}, (opts) => createReferral.__executeServer(opts));
const createReferral = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  email: z.string().email().max(255)
}).parse(d)).handler(createReferral_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: result,
    error
  } = await supabase.rpc("create_referral", {
    p_email: data.email
  });
  if (error) throw new Error(error.message);
  return result;
});
export {
  createReferral_createServerFn_handler,
  getMyProfile_createServerFn_handler,
  getMyReferrals_createServerFn_handler,
  getMyTransactions_createServerFn_handler
};
