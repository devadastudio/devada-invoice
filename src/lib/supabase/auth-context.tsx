"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type CompanySettingsRow = Database["public"]["Tables"]["company_settings"]["Row"];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileRow | null;
  companySettings: CompanySettingsRow | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshAuthData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  companySettings: null,
  isLoading: true,
  signOut: async () => {},
  refreshAuthData: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettingsRow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  const fetchUserData = async (currentUser: User) => {
    try {
      // 1. Récupérer le profil
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (prof) setProfile(prof);

      // 2. Récupérer les paramètres d'entreprise
      const { data: comp } = await supabase
        .from("company_settings")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (comp) setCompanySettings(comp);
    } catch (error) {
      console.error("Erreur lors du chargement des données utilisateur:", error);
    }
  };

  const refreshAuthData = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      setUser(currentUser);
      await fetchUserData(currentUser);
    } else {
      setUser(null);
      setProfile(null);
      setCompanySettings(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchUserData(currentSession.user);
        }
      } catch (err) {
        console.error("Erreur d'initialisation de session Supabase:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // Abonnement aux changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchUserData(newSession.user);
      } else {
        setProfile(null);
        setCompanySettings(null);
      }

      setIsLoading(false);

      if (event === "SIGNED_OUT") {
        startTransition(() => {
          router.push("/auth/login");
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setCompanySettings(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        companySettings,
        isLoading,
        signOut,
        refreshAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider />");
  }
  return context;
}
