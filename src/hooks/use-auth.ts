import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to Supabase auth state. Use anywhere in the app to know if a
 * user is signed in. The root listener handles cache invalidation; this hook
 * just reads.
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
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
    user: session?.user as User | undefined,
    isAuthenticated: !!session,
    loading,
    signOut: () => supabase.auth.signOut(),
  };
}