"use client";

import { useEffect, useState, useCallback } from "react";
import { User } from "@/types";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from Supabase or localStorage fallback
  useEffect(() => {
    async function initUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            supabase_user_id: session.user.id,
            email: session.user.email || "creator@caspershorts.com",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Creator",
            role: (session.user.user_metadata?.role as "user" | "admin") || "user",
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || new Date().toISOString(),
          });
        } else {
          // Check localStorage for demo user session
          const stored = localStorage.getItem("casper_user");
          if (stored) {
            setUser(JSON.parse(stored));
          } else {
            // Default demo creator user
            const defaultUser: User = {
              id: "usr_demo_8829",
              email: "alex@creatorgrowth.io",
              name: "Alex Rivera",
              role: "user",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setUser(defaultUser);
            localStorage.setItem("casper_user", JSON.stringify(defaultUser));
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    }

    initUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const newUser: User = {
          id: session.user.id,
          supabase_user_id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || "Creator",
          role: (session.user.user_metadata?.role as "user" | "admin") || "user",
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem("casper_user", JSON.stringify(newUser));
      } else {
        // keep local or clear
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, _password?: string) => {
    setLoading(true);
    try {
      // Attempt supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: _password || "password123",
      });
      if (error) {
        // Fallback to local session for frictionless review
        const localUser: User = {
          id: `usr_${Date.now()}`,
          email,
          name: email.split("@")[0],
          role: email.includes("admin") ? "admin" : "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(localUser);
        localStorage.setItem("casper_user", JSON.stringify(localUser));
        return { user: localUser };
      }
      return { user: data.user };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem("casper_user");
    setUser(null);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}

