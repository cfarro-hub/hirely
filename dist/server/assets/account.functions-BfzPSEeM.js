import { useState, useEffect } from "react";
import { s as supabase } from "./client-BHmQHd0X.js";
import { c as createSsrRpc } from "./createSsrRpc-DSJIU2Sn.js";
import { a as createServerFn } from "./server-2xF5ZQvo.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-CaKyJUqS.js";
function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  return {
    session,
    user: session?.user,
    isAuthenticated: !!session,
    loading,
    signOut: () => supabase.auth.signOut()
  };
}
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7137c45c66e2762097026ceecb6dd952f95d83288f96d03621061209a6008b8a"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("1da968383aad119d0e38bf4d221e85e0e9f258b117beee8caefd18063cd15e8a"));
const getMyTransactions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7b2bbf0c0abb60c97dae6f7f2218aa7697bb34c9b673e066a9c47dd7a5b3dd0a"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  email: z.string().email().max(255)
}).parse(d)).handler(createSsrRpc("c4e11a26640794d496da09a8d43691a5d36874ff29192b4af7da35146487023c"));
export {
  getMyTransactions as a,
  getMyProfile as g,
  useAuth as u
};
