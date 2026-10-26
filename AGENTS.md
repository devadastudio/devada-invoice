# Devada Invoice — Directives & Design System pour le Développement des Pages

Ce document définit les règles de développement et le Design System obligatoire pour toutes les pages de l'application SaaS **Devada Invoice**.
Chaque nouvelle page ou composant créé dans ce projet DOIT respecter l'ensemble des directives ci-dessous.

---

## 1. Identité de Marque & Contexte Financier

- **Nom officiel** : `Devada Invoice`
- **Logo** : Trèfle géométrique émeraude (`from-emerald-600 to-teal-500`) avec typographie `devada`<span className="text-emerald-600 dark:text-emerald-400">invoice</span> et badge `PRO`.
- **Devise monétaire exclusive** : **FCFA (XOF)**
  - Tous les montants sans exception doivent être formatés avec `formatFCFA(amount)` défini dans `@/lib/utils` (ex: `250 000 FCFA`, `1 850 000 FCFA`). Pas de symbole `$` ni `€`, aucun affichage avec centimes pour le FCFA.
- **Dates** : Obligatoirement formatées en **`jour/mois/année`** (ex: `24/10/2026`) via `formatDate(dateString)` dans `@/lib/utils`.
- **Fiscalité locale (Sénégal)** : Taux standard de TVA à **18%**, calculs automatiques HT / TVA / TTC déterministes. Moyens de paiement locaux : **Wave**, **Orange Money**, **Virements bancaires**.

---

## 2. Palette de Couleurs & Thème (Clair & Sombre)

- **Fond d'application** : `bg-[#F8FAFC]` (clair) / `dark:bg-[#090D16]` (sombre).
- **Cartes & Conteneurs** : `bg-white` (clair) / `dark:bg-slate-900` (sombre).
- **Fond Sidebar** : `bg-[#F8F9FA]` (clair) / `dark:bg-[#0D121F]` (sombre).
- **Bordures** : `border-slate-200/80` (clair) / `dark:border-slate-800` (sombre).
- **Bouton d'Action Principale (CTA)** : Bleu cobalt royal `bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm shadow-blue-500/25 rounded-xl`.
- **Badges de statut obligatoires** :
  - 🟢 **Payée** (`paid`) : Vert (`bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400` avec point `bg-emerald-500`).
  - 🟠 **Envoyée** (`sent`) : Orange (`bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-400` avec point `bg-orange-500`).
  - 🔴 **En retard** (`overdue`) : Rouge (`bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400` avec point `bg-rose-500`).
  - ⚪ **Brouillon** (`draft`) : Gris (`bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300` avec point `bg-slate-400`).

---

## 3. Typographie, Rayons de Courbure & Ombres

- **Polices** : Geist Sans (`var(--font-geist-sans)`), Inter, sans-serif.
- **Montants & Numéros** : Police monospace soignée (`font-mono font-bold`).
- **Arrondis** : Cartes en `rounded-2xl`, modales en `rounded-3xl`, boutons/inputs en `rounded-xl`, badges en `rounded-full`.
- **Ombres** : `shadow-soft` (`0 2px 10px rgba(0, 0, 0, 0.04)`) avec élévation au survol `hover:shadow-md transition-all duration-200`.

---

## 4. Structure de Layout Universelle

Chaque page de l'application doit adopter la structure standardisée :

```tsx
<div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex w-full max-w-full overflow-x-clip">
  <Sidebar
    mobileOpen={mobileMenuOpen}
    onMobileClose={() => setMobileMenuOpen(false)}
    onNewInvoice={() => ...}
  />

  <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
    <Header
      onMenuToggle={() => setMobileMenuOpen(true)}
      onNewInvoice={() => ...}
    />

    <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto overflow-hidden">
      {/* Contenu spécifique de la page */}
    </main>

    <footer className="border-t border-slate-200/60 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500">
      <p>Devada Invoice SaaS © 2026 — Plateforme de facturation et gestion financière pour entrepreneurs africains.</p>
    </footer>
  </div>
</div>
```

---

## 5. Règle Mobile : Zéro Scroll Horizontal

1. **Tableaux & Listes** :
   - Desktop (`hidden md:block`) : Tableau complet structuré multi-colonnes.
   - Mobile (`block md:hidden`) : **Cartes tactiles verticales** affichant numéro, statut, nom du client, montant TTC en FCFA, date et bouton d'action.
2. **Conteneurs** : Toujours appliquer `w-full max-w-full overflow-hidden`.
3. **Onglets de filtrage** : Utiliser `overflow-x-auto no-scrollbar` circonscrit sans déborder.

---

## 6. Contraste Élevé pour les Avatars

Tous les avatars de clients ou d'entreprises doivent utiliser la palette saturée à fort contraste avec texte blanc pur extra-gras et anneau de bordure :
`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm ring-1 ring-black/10 dark:ring-white/10 ${bg} text-white`.
Couleurs autorisées : `bg-blue-600`, `bg-emerald-600`, `bg-violet-600`, `bg-rose-600`, `bg-indigo-600`, `bg-amber-600`, `bg-teal-600`.

---

## 7. Composants d'Interactions & Feedback

- **Menu 3 points (`MoreVertical`)** : Pop-up contextuel interactif avec fermeture au clic extérieur et actions adaptées à l'entité (Voir, Modifier, Enregistrer paiement, Dupliquer, Relancer, Télécharger PDF, Supprimer).
- **Notifications Toast** : Notification flottante en bas à droite confirmant les actions effectuées.
- **Modales d'aperçu / formulaires** : Fond flouté (`backdrop-blur-sm`), header fixe, corps défilant, actions de validation claires.

---

## 8. Persistance du Thème & Arborescence Menu

- **Persistance Mode Sombre / Clair** : Le choix utilisateur est sauvegardé dans `localStorage` sous la clé `devada_theme` (`"dark"` ou `"light"`). Un script inline dans `<head>` de `RootLayout` applique la classe `dark` avant le rendu pour éviter tout scintillement ou réinitialisation lors des navigations.
- **Menu Latéral Exclusif** :
  - 📊 **Tableau de bord** (`/`) : Métriques financières en FCFA, graphiques de facturation/encaissement et top clients.
  - 🧾 **Factures** (`/invoices`) : Liste, statuts, recherche, création en split-view (`/invoices/new`) et détail interactif (`/invoices/[id]`).
  - 👥 **Clients** (`/clients`) : Annuaire des clients sénégalais, modale d'ajout/modification et soldes dus.
  - 🎯 **Devada Leads** (`/leads`) : Module de prospection B2B, scraping Google Maps et génération de messages commerciaux IA.
  - ❓ **Aide & Support** (`/help`) : Centre de support, recherche FAQ interactive, hotline Dakar et formulaire de ticket.
  - ⚙️ **Paramètres** (`/settings`) : Informations légales (NINEA, RCCM, adresse), TVA 18%, et coordonnées Wave/Orange Money/Banque.

