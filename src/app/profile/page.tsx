"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CURRENT_USER } from "@/lib/mock-data";
import { useAuth } from "@/lib/supabase/auth-context";
import { createClient } from "@/lib/supabase/client";
import { uploadCompanyAsset } from "@/lib/supabase/db";
import { cn } from "@/lib/utils";
import {
  User,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Mail,
  Save,
  MapPin,
  Camera,
  Upload,
  Trash2,
  Loader2,
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
}

const STORAGE_KEY = "devada_user_profile";

export default function ProfilePage() {
  const { user, refreshAuthData } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
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
  });

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      let currentUserId = user?.id;
      if (!currentUserId) {
        const { data: authData } = await supabase.auth.getUser();
        currentUserId = authData.user?.id;
      }

      if (currentUserId) {
        try {
          const [{ data: dbProfile }, { data: dbSettings }] = await Promise.all([
            supabase
              .from("profiles")
              .select("*")
              .eq("id", currentUserId)
              .maybeSingle(),
            supabase
              .from("company_settings")
              .select("*")
              .eq("user_id", currentUserId)
              .maybeSingle(),
          ]);

          if (dbProfile || dbSettings) {
            setProfile((prev) => ({
              ...prev,
              name: dbProfile?.full_name || user?.user_metadata?.full_name || prev.name,
              email: dbProfile?.email || user?.email || prev.email,
              phone: dbProfile?.phone || user?.user_metadata?.phone || prev.phone,
              company: dbSettings?.company_name || user?.user_metadata?.company_name || prev.company,
              role: dbProfile?.role || user?.user_metadata?.role || prev.role,
              avatarImageData: dbProfile?.avatar_url || user?.user_metadata?.avatar_url || prev.avatarImageData,
              ninea: dbSettings?.ninea || prev.ninea,
              rccm: dbSettings?.rccm || prev.rccm,
              city: dbProfile?.city || dbSettings?.city || prev.city,
              country: dbSettings?.country || prev.country,
              bio: dbProfile?.bio || prev.bio,
            }));
            return;
          } else if (user?.user_metadata) {
            setProfile((prev) => ({
              ...prev,
              name: user.user_metadata.full_name || prev.name,
              email: user.email || prev.email,
              phone: user.user_metadata.phone || prev.phone,
              company: user.user_metadata.company_name || prev.company,
              role: user.user_metadata.role || prev.role,
              city: user.user_metadata.city || prev.city,
              avatarImageData: user.user_metadata.avatar_url || prev.avatarImageData,
            }));
          }
        } catch (err) {
          console.error("Erreur chargement profil Supabase:", err);
        }
      }

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
    };

    loadProfile();
  }, [user?.id]);

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
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      let finalAvatarUrl = base64;

      const supabase = createClient();
      let currentUserId = user?.id;
      if (!currentUserId) {
        const { data: authData } = await supabase.auth.getUser();
        currentUserId = authData.user?.id;
      }

      if (currentUserId) {
        const uploadRes = await uploadCompanyAsset(file, currentUserId, "avatars");
        if (uploadRes.url) {
          finalAvatarUrl = uploadRes.url;
          await supabase
            .from("profiles")
            .update({ avatar_url: finalAvatarUrl, updated_at: new Date().toISOString() })
            .eq("id", currentUserId);
          await supabase.auth.updateUser({
            data: { avatar_url: finalAvatarUrl },
          });
          await refreshAuthData();
        }
      }

      const updated = { ...profile, avatarImageData: finalAvatarUrl };
      setProfile(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("user_profile_updated"));
        showToast("Photo de profil mise à jour et enregistrée sur le serveur !");
      } catch {
        showToast("Photo de profil appliquée.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveAvatar = async () => {
    const updated = { ...profile, avatarImageData: "" };
    setProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      const supabase = createClient();
      let currentUserId = user?.id;
      if (!currentUserId) {
        const { data: authData } = await supabase.auth.getUser();
        currentUserId = authData.user?.id;
      }
      if (currentUserId) {
        await supabase
          .from("profiles")
          .update({ avatar_url: null, updated_at: new Date().toISOString() })
          .eq("id", currentUserId);
        await supabase.auth.updateUser({
          data: { avatar_url: null },
        });
        await refreshAuthData();
      }
      window.dispatchEvent(new Event("user_profile_updated"));
      showToast("Photo de profil supprimée.");
    } catch {}
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = createClient();
      let currentUserId = user?.id;
      if (!currentUserId) {
        const { data: authData } = await supabase.auth.getUser();
        currentUserId = authData.user?.id;
      }

      if (!currentUserId) {
        showToast("Session utilisateur introuvable. Veuillez vous reconnecter.");
        return;
      }

      // 1. Sauvegarder dans profiles (nom, email, téléphone, fonction, ville, bio, avatar)
      const { error: profErr } = await supabase.from("profiles").upsert({
        id: currentUserId,
        email: profile.email.trim(),
        full_name: profile.name.trim(),
        phone: profile.phone.trim() || null,
        role: profile.role.trim() || null,
        city: profile.city.trim() || null,
        bio: profile.bio.trim() || null,
        avatar_url: profile.avatarImageData || null,
        updated_at: new Date().toISOString(),
      });

      if (profErr) {
        console.error("Erreur upsert profiles:", profErr);
        showToast(`Erreur profil : ${profErr.message}`);
        return;
      }

      // 2. Mettre à jour company_settings (raison sociale, ville, pays, téléphone, email, NINEA, RCCM)
      const { error: setErr } = await supabase
        .from("company_settings")
        .upsert(
          {
            user_id: currentUserId,
            company_name: profile.company.trim(),
            ninea: profile.ninea.trim() || null,
            rccm: profile.rccm.trim() || null,
            city: profile.city.trim() || null,
            country: profile.country.trim() || null,
            phone: profile.phone.trim() || null,
            email: profile.email.trim() || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (setErr) {
        console.error("Erreur upsert company_settings:", setErr);
      }

      // 3. Mettre à jour metadata utilisateur Supabase Auth
      await supabase.auth.updateUser({
        data: {
          full_name: profile.name.trim(),
          phone: profile.phone.trim(),
          role: profile.role.trim(),
          city: profile.city.trim(),
          company_name: profile.company.trim(),
          avatar_url: profile.avatarImageData || null,
        },
      });

      await refreshAuthData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      window.dispatchEvent(new Event("user_profile_updated"));
      window.dispatchEvent(new Event("settings_updated"));
      showToast("Profil et coordonnées professionnelles enregistrés avec succès !");
    } catch (err: any) {
      console.error("Erreur handleSaveProfile:", err);
      showToast(`Erreur lors de la sauvegarde : ${err?.message || "inconnue"}`);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Veuillez saisir votre mot de passe actuel.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Le nouveau mot de passe doit comporter au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError("Le nouveau mot de passe doit être différent du mot de passe actuel.");
      return;
    }

    setPasswordLoading(true);

    try {
      const supabase = createClient();

      // Obtenir l'email de l'utilisateur connecté
      let userEmail = user?.email;
      if (!userEmail) {
        const { data: authData } = await supabase.auth.getUser();
        userEmail = authData.user?.email;
      }

      if (!userEmail) {
        setPasswordError("Session utilisateur introuvable. Veuillez vous reconnecter.");
        setPasswordLoading(false);
        return;
      }

      // CONTRÔLE STRICT DU MOT DE PASSE ACTUEL : Vérifier auprès de Supabase Auth
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (verifyError) {
        setPasswordError("Le mot de passe actuel saisi est incorrect. Veuillez vérifier et réessayer.");
        setPasswordLoading(false);
        return;
      }

      // Le mot de passe actuel est exact, on procède à la mise à jour
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPasswordError(`Erreur lors de la mise à jour du mot de passe : ${updateError.message}`);
        setPasswordLoading(false);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError(null);
      showToast("Votre mot de passe a été mis à jour avec succès !");
    } catch (err: any) {
      console.error("Erreur handleChangePassword:", err);
      setPasswordError(`Une erreur inattendue est survenue : ${err?.message || "inconnue"}`);
    } finally {
      setPasswordLoading(false);
    }
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
          subtitle="Gérez vos données personnelles, coordonnées professionnelles et mot de passe"
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

          {/* Navigation Tabs (Only 2 tabs for this version) */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: "profile", label: "Informations personnelles", icon: User },
              { id: "security", label: "Sécurité & Mot de passe", icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    setPasswordError(null);
                  }}
                  className={cn(
                    "flex items-center gap-2 py-3 px-3.5 border-b-2 font-semibold text-xs whitespace-nowrap transition-all cursor-pointer",
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
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
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
                      Vérification préalable obligatoire de votre mot de passe actuel avant validation.
                    </p>
                  </div>
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>

                {passwordError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-400 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="space-y-3 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mot de passe actuel *
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (passwordError) setPasswordError(null);
                      }}
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
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
                    disabled={passwordLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Vérification du mot de passe...</span>
                      </>
                    ) : (
                      <span>Mettre à jour le mot de passe</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
