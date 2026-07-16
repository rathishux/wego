import type { User } from "@supabase/supabase-js";
import * as React from "react";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextValue {
  cloudEnabled: boolean;
  user: User | null;
  loading: boolean;
  sendCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(isSupabaseConfigured);

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const sendCode = React.useCallback(async (email: string) => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) throw new Error(error.message);
  }, []);

  const verifyCode = React.useCallback(async (email: string, code: string) => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) throw new Error(error.message);
  }, []);

  const signOut = React.useCallback(async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
  }, []);

  const value: AuthContextValue = {
    cloudEnabled: isSupabaseConfigured,
    user,
    loading,
    sendCode,
    verifyCode,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
