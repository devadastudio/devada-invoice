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

      if (comp) {
        setCompanySettings(comp);
      } else if (currentUser.user_metadata?.company_name) {
        setCompanySettings({
          user_id: currentUser.id,
          company_name: currentUser.user_metadata.company_name,
          legal_form: currentUser.user_metadata.legal_form || "SARL",
          ninea: currentUser.user_metadata.ninea || "",
          rccm: currentUser.user_metadata.rccm || "",
          address: currentUser.user_metadata.address || "",
          city: currentUser.user_metadata.city || "Dakar",
          country: currentUser.user_metadata.country || "Sénégal",
          phone: currentUser.user_metadata.phone || "",
          email: currentUser.user_metadata.company_email || currentUser.email || "",
          website: "",
          currency: "FCFA",
          default_tax_rate: 18,
          tax_applicable: true,
          bank_name: "",
          bank_rib: "",
          bank_iban: "",
          bank_bic: "",
          wave_number: currentUser.user_metadata.wave_number || "",
          om_number: "",
          payment_terms: "",
          legal_notice: "",
          default_language: "fr",
          show_exchange_rate_on_invoices: false,
          logo_url: "",
          signature_url: "",
          signature_type: "name",
          email_pec: currentUser.user_metadata.email_pec || "",
          whatsapp_number: currentUser.user_metadata.whatsapp || "",
          whatsapp_template_fr: "",
          whatsapp_template_en: "",
          whatsapp_template_it: "",
          whatsapp_default_language: "fr",
          email_notifications: true,
          auto_payment_reminder: true,
          reminder_days_before_due: 3,
          stripe_enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as unknown as CompanySettingsRow);
      }
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

    const handleExternalSettingsUpdate = () => {
      supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
        if (currentUser) {
          fetchUserData(currentUser);
        }
      });
    };

    window.addEventListener("settings_updated", handleExternalSettingsUpdate);
    window.addEventListener("company_settings_updated", handleExternalSettingsUpdate);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener("settings_updated", handleExternalSettingsUpdate);
      window.removeEventListener("company_settings_updated", handleExternalSettingsUpdate);
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
