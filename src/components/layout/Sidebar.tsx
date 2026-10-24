"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Users,
  HelpCircle,
  Settings,
  Moon,
  Sun,
  Sparkles,
  ChevronRight,
  ChevronsUpDown,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENT_USER, getStoredInvoices } from "@/lib/mock-data";
import { getStoredLanguage, getPlatformTranslations, AppLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/supabase/auth-context";
import { fetchInvoices, fetchClients } from "@/lib/supabase/db";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onNewInvoice?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, companySettings, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [invoicesCount, setInvoicesCount] = useState<number>(0);
  const [clientsCount, setClientsCount] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    company: string;
    avatarImageData?: string;
  }>({
    name: "",
    company: "",
    avatarImageData: "",
  });

  const [currentLang, setCurrentLang] = useState<AppLanguage>("fr");

  // Initialize theme and language from localStorage
  useEffect(() => {
    setCurrentLang(getStoredLanguage());
    const handleLangUpdate = () => {
      setCurrentLang(getStoredLanguage());
    };
    window.addEventListener("language_updated", handleLangUpdate);
    window.addEventListener("settings_updated", handleLangUpdate);
    return () => {
      window.removeEventListener("language_updated", handleLangUpdate);
      window.removeEventListener("settings_updated", handleLangUpdate);
    };
  }, []);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("devada_theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else if (savedTheme === "light") {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      } else {
        const prefersDark =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        }
      }
    } catch (e) {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    }

    // Dynamic invoices and clients counter sync
    const updateCount = async () => {
      if (user?.id) {
        try {
          const [dbInvs, dbClients] = await Promise.all([
            fetchInvoices(user.id),
            fetchClients(user.id),
          ]);
          setInvoicesCount(dbInvs ? dbInvs.length : 0);
          setClientsCount(dbClients ? dbClients.length : 0);
          return;
        } catch {}
      }
      setInvoicesCount(0);
      setClientsCount(0);
    };
    updateCount();

    // Dynamic user profile sync
    const updateProfile = () => {
      let storedProfile: any = null;
      try {
        const stored = localStorage.getItem("devada_user_profile");
        if (stored) storedProfile = JSON.parse(stored);
      } catch {}

      const name =
        profile?.full_name ||
        user?.user_metadata?.full_name ||
        storedProfile?.name ||
        (user?.email ? user.email.split("@")[0] : "");
      const company =
        companySettings?.company_name ||
        user?.user_metadata?.company_name ||
        storedProfile?.company ||
        "";
      const avatar =
        profile?.avatar_url ||
        storedProfile?.avatarImageData ||
        storedProfile?.avatarUrl ||
        companySettings?.company_logo ||
        "";

      setUserProfile({
        name: name || "Mon Compte",
        company: company || "Mon Entreprise",
        avatarImageData: avatar,
      });
    };
    updateProfile();

    const handleStorage = () => {
      updateCount();
      updateProfile();
    };

    window.addEventListener("invoices_updated", updateCount);
    window.addEventListener("clients_updated", updateCount);
    window.addEventListener("user_profile_updated", updateProfile);
    window.addEventListener("settings_updated", updateProfile);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("invoices_updated", updateCount);
      window.removeEventListener("clients_updated", updateCount);
      window.removeEventListener("user_profile_updated", updateProfile);
      window.removeEventListener("settings_updated", updateProfile);
      window.removeEventListener("storage", handleStorage);
    };
  }, [user?.id, profile, companySettings]);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("devada_theme", "dark");
      } catch (e) {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("devada_theme", "light");
      } catch (e) {}
    }
  };

  const t = getPlatformTranslations(currentLang);

  const navItems = [
    {
      title: t.nav.dashboard,
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/" || pathname === "/dashboard",
    },
    {
      title: t.nav.invoices,
      href: "/invoices",
      icon: Receipt,
      active: pathname?.startsWith("/invoices"),
      badge: String(invoicesCount),
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    },
    {
      title: t.nav.clients,
      href: "/clients",
      icon: Users,
      active: pathname === "/clients",
      badge: String(clientsCount),
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
  ];

  const bottomItems = [
    {
      title: t.nav.settings,
      href: "/settings",
      icon: Settings,
      active: pathname?.startsWith("/settings"),
    },
    {
      title: t.nav.help,
      href: "/help",
      icon: HelpCircle,
      active: pathname === "/help",
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-[#F8F9FA] dark:bg-[#0D121F] text-slate-700 dark:text-slate-300 p-4 select-none">
      {/* Top Part: Logo, Search, Menu */}
      <div className="space-y-6">
        {/* Brand Header: Devada Invoice */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Standard Devada Invoice Official Logo Image */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200 ring-1 ring-emerald-500/30">
              <img
                src="/images/devada-logo.png"
                alt="Devada Invoice"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                devada<span className="text-emerald-600 dark:text-emerald-400">invoice</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                PRO
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Menu
          </p>

          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    item.active
                      ? "bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-soft border border-slate-200/70 dark:border-slate-700/60 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        item.active
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs font-semibold rounded-full",
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Part: Support, Settings, Dark Mode, Profile */}
      <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  item.active
                    ? "bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-soft border border-slate-200/70 dark:border-slate-700/60"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/40"
                )}
              >
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                <span>{item.title}</span>
              </Link>
            );
          })}

          {/* Dark Mode Toggle Switch */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-400" />
              )}
              <span>Mode sombre</span>
            </div>

            <button
              type="button"
              onClick={toggleDarkMode}
              className={cn(
                "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isDarkMode ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              )}
              role="switch"
              aria-checked={isDarkMode}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  isDarkMode ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* User Profile Card & Logout Button at the same height */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/profile"
            onClick={onMobileClose}
            className={cn(
              "flex-1 min-w-0 p-2 rounded-2xl border transition-all group cursor-pointer shadow-soft",
              pathname === "/profile"
                ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700/80 ring-2 ring-blue-500/20"
                : "bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
            )}
            title="Gérer mon profil, mot de passe et sécurité"
          >
            <div className="flex items-center justify-between gap-1.5 p-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative flex-shrink-0">
                  {profile?.avatar_url || userProfile.avatarImageData ? (
                    <img
                      src={profile?.avatar_url || userProfile.avatarImageData}
                      alt={profile?.full_name || userProfile.name}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-black/10 dark:ring-white/10 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                      {profile?.full_name
                        ? profile.full_name
                            .split(" ")
                            .map((s) => s[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : user?.email
                        ? user.email.slice(0, 2).toUpperCase()
                        : CURRENT_USER.initials}
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {profile?.full_name || user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0] : userProfile.name)}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {companySettings?.company_name ||
                      user?.user_metadata?.company_name ||
                      (userProfile.company !== CURRENT_USER.company
                        ? userProfile.company
                        : user
                        ? "Mon Entreprise"
                        : CURRENT_USER.company)}
                  </p>
                </div>
              </div>

              <div className="p-0.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 rounded-lg transition-colors flex-shrink-0">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>

          {/* Bouton de déconnexion officiel Supabase */}
          <button
            type="button"
            onClick={async () => {
              if (onMobileClose) onMobileClose();
              await signOut();
            }}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all shadow-soft active:scale-95 group"
            title="Se déconnecter de votre compte"
            aria-label="Se déconnecter"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] h-screen fixed inset-y-0 left-0 z-30 border-r border-slate-200/80 dark:border-slate-800/80">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />

          {/* Drawer */}
          <div className="relative flex-1 flex flex-col max-w-[280px] w-full bg-white dark:bg-slate-900 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
