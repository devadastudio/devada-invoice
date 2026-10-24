"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CURRENT_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  User,
  Shield,
  KeyRound,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  Briefcase,
  Laptop,
  Globe,
  LogOut,
  Bell,
  Sparkles,
  Save,
  Clock,
  MapPin,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";

interface UserProfileState {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  city: string;
  country: string;
  ninea: string;
  rccm: string;
  bio: string;
  avatarImageData?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: "sms" | "app";
  twoFactorPhone: string;
  emailAlertsOnLogin: boolean;
  sessionTimeout: string;
  language: string;
  timezone: string;
}

const STORAGE_KEY = "devada_user_profile";

export default function ProfilePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "privacy" | "preferences">("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile data state
  const [profile, setProfile] = useState<UserProfileState>({
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    phone: CURRENT_USER.phone,
    company: CURRENT_USER.company,
    role: CURRENT_USER.role,
    city: CURRENT_USER.city,
    country: CURRENT_USER.country,
    ninea: CURRENT_USER.ninea,
    rccm: CURRENT_USER.rccm,
    bio: "Dirigeant d'entreprise et responsable des opérations financières chez Dakar Digital Agency.",
    avatarImageData: CURRENT_USER.avatarUrl || "",
    twoFactorEnabled: true,
    twoFactorMethod: "sms",
    twoFactorPhone: "+221 77 845 22 10",
    emailAlertsOnLogin: true,
    sessionTimeout: "30",
    language: "fr",
    timezone: "Africa/Dakar",
  });

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Active sessions mock
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      device: "Navigateur Chrome (Windows 11)",
      location: "Dakar - Plateau, Sénégal 🇸🇳",
      ip: "154.124.78.14",
      lastActive: "Actuellement connecté",
      isCurrent: true,
    },
    {
      id: "sess-2",
      device: "Application Mobile (iPhone 15 Pro)",
      location: "Dakar - Almadies, Sénégal 🇸🇳",
      ip: "154.124.89.210",
      lastActive: "Il y a 3 heures",
      isCurrent: false,
    },
    {
      id: "sess-3",
      device: "Navigateur Firefox (macOS)",
      location: "Saint-Louis, Sénégal 🇸🇳",
      ip: "41.82.112.5",
      lastActive: "Le 20/10/2026",
      isCurrent: false,
    },
  ]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile((prev) => ({
          ...prev,
          ...parsed,
          avatarImageData:
            parsed.avatarImageData || parsed.avatarUrl || CURRENT_USER.avatarUrl || "",
        }));
      }
    } catch {
      // fallback to initial profile
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La taille de l'image ne doit pas dépasser 5 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const updated = { ...profile, avatarImageData: base64 };
      setProfile(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("user_profile_updated"));
        showToast("Photo de profil mise à jour et enregistrée !");
      } catch {
        showToast("Photo de profil appliquée.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveAvatar = () => {
    const updated = { ...profile, avatarImageData: "" };
    setProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("user_profile_updated"));
      showToast("Photo de profil supprimée.");
    } catch {}
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      window.dispatchEvent(new Event("user_profile_updated"));
      showToast("Profil et paramètres personnels enregistrés avec succès !");
    } catch {
      showToast("Erreur lors de la sauvegarde du profil.");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      alert("Veuillez renseigner votre mot de passe actuel.");
      return;
    }
    if (newPassword.length < 8) {
      alert("Le nouveau mot de passe doit comporter au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Votre mot de passe a été mis à jour avec succès !");
  };

  const handleDisconnectOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    showToast("Toutes les autres sessions distantes ont été déconnectées.");
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: "", color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 25, label: "Faible", color: "bg-rose-500 text-rose-500" };
    if (score === 2) return { level: 50, label: "Moyen", color: "bg-amber-500 text-amber-500" };
    if (score === 3) return { level: 75, label: "Fort", color: "bg-blue-600 text-blue-600" };
    return { level: 100, label: "Excellent", color: "bg-emerald-500 text-emerald-500" };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex w-full max-w-full overflow-x-clip">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200 animate-in slide-in-from-bottom-5 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
        <Header
          onMenuToggle={() => setMobileMenuOpen(true)}
          title="Mon Profil & Sécurité"
          subtitle="Gérez vos données personnelles, identifiants, authentification et sessions actives"
          breadcrumb="Compte / Profil"
          showPeriodSelector={false}
          showExportButton={false}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-5xl w-full mx-auto overflow-hidden">
          {/* Profile Overview Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group flex-shrink-0">
                {profile.avatarImageData ? (
                  <img
                    src={profile.avatarImageData}
                    alt={profile.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-100 dark:ring-blue-950/60 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md ring-4 ring-blue-100 dark:ring-blue-950/60">
                    {profile.name
                      .split(" ")
                      .map((s) => s[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/50 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity backdrop-blur-xs cursor-pointer shadow-inner"
                  title="Changer la photo de profil"
                >
                  <Camera className="w-5 h-5 drop-shadow" />
                  <span className="text-[9px] font-bold mt-0.5">Modifier</span>
                </button>
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"
                  title="Compte vérifié actif"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {profile.name}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800">
                    Propriétaire (Owner)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {profile.role} • {profile.company}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {profile.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {profile.city}, {profile.country}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                ID Compte : <strong className="font-mono text-slate-900 dark:text-white">USR-2026-004</strong>
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: "profile", label: "Informations personnelles", icon: User },
              { id: "security", label: "Sécurité & Mot de passe", icon: KeyRound },
              { id: "privacy", label: "Confidentialité & Sessions", icon: Shield },
              { id: "preferences", label: "Préférences de compte", icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-2 py-3 px-3.5 border-b-2 font-semibold text-xs whitespace-nowrap transition-all",
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Profile Info */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Photo de profil de l'utilisateur */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-soft space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Photo de profil de l&apos;utilisateur</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Téléversez une photo de profil personnalisée pour votre compte dirigeant.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                  <div className="relative flex-shrink-0">
                    {profile.avatarImageData ? (
                      <img
                        src={profile.avatarImageData}
                        alt={profile.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-100 dark:ring-blue-950/60 shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md ring-4 ring-blue-100 dark:ring-blue-950/60">
                        {profile.name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{profile.avatarImageData ? "Changer la photo" : "Ajouter une photo"}</span>
                      </button>

                      {profile.avatarImageData && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer la photo</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Formats autorisés : PNG, JPG, JPEG ou WEBP (taille max. 5 Mo).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-soft space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Coordonnées du dirigeant & identité
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Téléphone mobile professionnel (+221)
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+221 77 000 00 00"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Fonction / Poste
                    </label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      placeholder="Ex: Directeur Général, Gérant"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Ville de rattachement
                    </label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pays
                    </label>
                    <input
                      type="text"
                      value={profile.country}
                      onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Courte biographie professionnelle
                  </label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les informations</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Security & Password */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Modifier le mot de passe
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Assurez-vous d&apos;utiliser un mot de passe sécurisé comportant majuscules, chiffres et symboles.
                    </p>
                  </div>
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="space-y-3 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mot de passe actuel *
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nouveau mot de passe *
                      </label>
                      {newPassword && (
                        <span className={`text-[11px] font-bold ${strength.color}`}>
                          Force : {strength.label}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Au moins 8 caractères"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Strength Bar */}
                    {newPassword && (
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${strength.level}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Confirmer le nouveau mot de passe *
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retapez le mot de passe"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all"
                  >
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </form>

              {/* Two-Factor Authentication 2FA */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Authentification à deux facteurs (2FA)
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                          Recommandé
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Recevez un code de validation SMS ou via application à chaque nouvelle connexion.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = !profile.twoFactorEnabled;
                      setProfile({ ...profile, twoFactorEnabled: updated });
                      showToast(updated ? "2FA activé avec succès." : "2FA désactivé.");
                    }}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500",
                      profile.twoFactorEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        profile.twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {profile.twoFactorEnabled && (
                  <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl space-y-2 text-xs">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                      Méthode active : SMS au {profile.twoFactorPhone}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Chaque tentative de connexion suspecte ou depuis un nouvel appareil nécessitera un code OTP à 6 chiffres.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Privacy & Active Sessions */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              {/* Active Sessions */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-soft space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Sessions actives ({sessions.length})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Appareils actuellement connectés à votre compte Devada Invoice.
                    </p>
                  </div>

                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={handleDisconnectOtherSessions}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-semibold transition-colors self-start sm:self-auto"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Déconnecter les autres sessions</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {sess.device}
                            </p>
                            {sess.isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60">
                                Cet appareil
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {sess.location} • IP: <span className="font-mono">{sess.ip}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-slate-500 font-medium pl-12 sm:pl-0">
                        {sess.lastActive}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data & Privacy Rules */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-soft space-y-3 text-xs">
                <div className="flex items-center gap-2 text-blue-600">
                  <Shield className="w-4 h-4" />
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Protection des données & Confidentialité
                  </h4>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Conformément aux normes OHADA et aux règlements de la CDP Sénégal (Commission de Protection des Données Personnelles), vos données bancaires et coordonnées d&apos;entreprise ne sont jamais partagées à des tiers ni utilisées à des fins publicitaires.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Preferences */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-soft space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Préférences régionales & système
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Fuseau horaire officiel
                    </label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="Africa/Dakar">Dakar (GMT+00:00) — Heure légale Sénégal</option>
                      <option value="Africa/Abidjan">Abidjan (GMT+00:00)</option>
                      <option value="Africa/Bamako">Bamako (GMT+00:00)</option>
                      <option value="Europe/Paris">Paris (GMT+01:00 / +02:00)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Langue d&apos;interface
                    </label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="fr">Français (Sénégal & UEMOA)</option>
                      <option value="en">English (International)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Alertes de connexion par email
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Recevoir un email d&apos;alerte lors de toute connexion suspecte
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, emailAlertsOnLogin: !profile.emailAlertsOnLogin })}
                      className={cn(
                        "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                        profile.emailAlertsOnLogin ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          profile.emailAlertsOnLogin ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
                    showToast("Préférences sauvegardées avec succès !");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all"
                >
                  Enregistrer les préférences
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
