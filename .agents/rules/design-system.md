# Règle de Design System — Devada Invoice SaaS

Cette règle régit de manière stricte et obligatoire la création et la modification de toutes les pages, composants et fonctionnalités de l'application **Devada Invoice**.
Elle garantit une cohérence visuelle, ergonomique et technique de classe mondiale (standard Dribbble / Awwwards), identique à la page Dashboard.

---

## 1. Identité de Marque & Localisation

- **Nom officiel** : `Devada Invoice`
  - Affichage logo : `devada`<span className="text-emerald-600 dark:text-emerald-400">invoice</span> avec badge `PRO`.
  - Emblème : Trèfle géométrique en dégradé émeraude (`from-emerald-600 to-teal-500`) avec point central blanc.
- **Monnaie obligatoire** : **FCFA (XOF)**
  - Tous les montants sans exception doivent être formatés via la fonction utilitaire `formatFCFA(amount)` (ex: `250 000 FCFA`, `8 450 000 FCFA`). Pas de symbole `$` ni `€`, ni de décimales en FCFA.
- **Format de date obligatoire** : **`jour/mois/année`** (ex: `24/10/2026`) via la fonction `formatDate(dateString)`.
- **Règles fiscales locales (Sénégal)** :
  - Taux standard de TVA : **18 %**.
  - Mentions légales d'entreprise : NINEA, RCCM, adresse à Dakar.
  - Moyens de paiement locaux : **Wave**, **Orange Money**, **Virements bancaires**.

---

## 2. Palette de Couleurs & Tokens CSS

| Élément | Mode Clair | Mode Sombre (`dark`) |
| :--- | :--- | :--- |
| **Fond d'application** | `#F8FAFC` (`bg-[#F8FAFC]`) | `#090D16` (`dark:bg-[#090D16]`) |
| **Surfaces / Cartes** | `#FFFFFF` (`bg-white`) | `#111827` (`dark:bg-slate-900`) |
| **Fond Sidebar** | `#F8F9FA` (`bg-[#F8F9FA]`) | `#0D121F` (`dark:bg-[#0D121F]`) |
| **Bordures** | `border-slate-200/80` | `dark:border-slate-800` |
| **Texte principal** | `text-slate-900` | `dark:text-white` |
| **Texte secondaire** | `text-slate-500` | `dark:text-slate-400` |
| **Action Principale (CTA)** | Bleu Cobalt `bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25` |
| **Succès / Encaissements** | Vert Émeraude `text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40` |

### Badges de statut obligatoires (Factures & Documents)
- 🟢 **Payée** (`paid`) : `bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400` avec puce `bg-emerald-500`.
- 🟠 **Envoyée** (`sent`) : `bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-400` avec puce `bg-orange-500`.
- 🔴 **En retard** (`overdue`) : `bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400` avec puce `bg-rose-500`.
- ⚪ **Brouillon** (`draft`) : `bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300` avec puce `bg-slate-400`.

---

## 3. Typographie, Rayons de Courbure & Ombres

- **Typographie** : Geist Sans (`var(--font-geist-sans)`), Inter, sans-serif. Poids : 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold pour les montants & avatars).
- **Montants & Numéros** : Police monospace soignée (`font-mono font-bold`).
- **Arrondis** :
  - Cartes et conteneurs : `rounded-2xl`
  - Modales et grands panneaux : `rounded-3xl`
  - Boutons d'action, barres d'inputs, sélecteurs : `rounded-xl`
  - Badges, puces et pillules : `rounded-full` ou `rounded-lg`
- **Ombres** :
  - `shadow-soft` : `0 2px 10px rgba(0, 0, 0, 0.04)`
  - Survol interactif : `hover:shadow-md transition-all duration-200`
  - Boutons actifs : `active:scale-[0.98]`

---

## 4. Structure de Layout Obligatoire

Chaque nouvelle page (`/invoices`, `/invoices/new`, `/clients`, `/wallet`, `/quotes`, `/reports`, `/settings`) doit obligatoirement s'insérer dans l'architecture suivante :

```tsx
<div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex w-full max-w-full overflow-x-hidden">
  {/* Sidebar de navigation : 260px desktop, drawer slide-over mobile */}
  <Sidebar
    mobileOpen={mobileMenuOpen}
    onMobileClose={() => setMobileMenuOpen(false)}
    onNewInvoice={() => ...}
  />

  {/* Zone de contenu principale décalée de 260px sur desktop */}
  <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
    {/* En-tête avec fil d'Ariane, titre, sélecteur de période et actions */}
    <Header
      onMenuToggle={() => setMobileMenuOpen(true)}
      onNewInvoice={() => ...}
    />

    {/* Corps de page délimité */}
    <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto overflow-hidden">
      {/* Contenu spécifique de la page */}
    </main>

    {/* Pied de page standardisé */}
    <footer className="border-t border-slate-200/60 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500">
      <p>Devada Invoice SaaS © 2026 — Plateforme de facturation et gestion financière pour entrepreneurs africains.</p>
    </footer>
  </div>
</div>
```

---

## 5. Règle d'Or Mobile : Zéro Débordement Horizontal

Pour garantir une expérience mobile sans faille sur smartphones (320px à 430px) :
1. **Double affichage des listes de données** :
   - Sur Desktop (`hidden md:block`) : Tableau complet structuré avec colonnes, tri et alignements monétaires à droite.
   - Sur Mobile (`block md:hidden`) : **Cartes verticales tactiles** avec disposition claire (numéro, badge de statut, client, montant TTC en FCFA, échéance et bouton d'action).
2. **Conteneurs stricts** : Tout composant de page doit inclure `w-full max-w-full overflow-hidden`.
3. **Onglets de filtrage** : Doivent posséder `overflow-x-auto no-scrollbar flex-shrink-0` contenus dans leur propre bande sans élargir la page.
4. **Cibles tactiles** : Minimum 36px de hauteur avec retour tactile `active:scale-[0.98]`.

---

## 6. Contraste Obligatoire des Avatars & Icônes

Tous les avatars de clients ou utilisateurs doivent obligatoirement utiliser la palette haute visibilité WCAG AAA pour empêcher tout texte illisible :
```tsx
const CLIENT_AVATARS_PALETTE = [
  { bg: "bg-blue-600", text: "text-white" },
  { bg: "bg-emerald-600", text: "text-white" },
  { bg: "bg-violet-600", text: "text-white" },
  { bg: "bg-rose-600", text: "text-white" },
  { bg: "bg-indigo-600", text: "text-white" },
  { bg: "bg-amber-600", text: "text-white" },
  { bg: "bg-teal-600", text: "text-white" },
];
```
Chaque pastille d'initiale doit être stylée avec :
`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm ring-1 ring-black/10 dark:ring-white/10 ${bg} ${text}`.

---

## 7. Composants d'Interactions Obligatoires

1. **Menu Pop-up Contextuel à 3 points (`MoreVertical`)** :
   - Présent sur toutes les lignes ou cartes d'éléments.
   - Contient : Voir l'aperçu, Modifier, Enregistrer paiement (si applicable), Dupliquer, Relancer par email, Télécharger PDF, Supprimer (en rouge).
   - Fermeture automatique au clic extérieur (*click-outside*).
2. **Notifications Toast** :
   - Notification discrète et élégante en bas à droite (`fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200`) pour confirmer toute action utilisateur (enregistrement, duplication, suppression).
3. **Modales de Prévisualisation & Éditeurs** :
   - Flou d'arrière-plan `bg-slate-900/60 backdrop-blur-sm`.
   - Carte `rounded-3xl shadow-2xl overflow-hidden`.
   - Calculs financiers réactifs : Sous-total HT, TVA 18%, Total TTC et Reste dû.

---

## 8. Persistance du Thème & Arborescence Menu

- **Persistance Mode Sombre / Clair** : Le choix utilisateur est sauvegardé dans `localStorage` sous la clé `devada_theme` (`"dark"` ou `"light"`). Un script inline dans `<head>` de `RootLayout` applique la classe `dark` avant le rendu pour éviter tout scintillement ou réinitialisation lors des navigations.
- **Menu Latéral Exclusif** :
  - 📊 **Tableau de bord** (`/`) : Métriques financières en FCFA, graphiques de facturation/encaissement et top clients.
  - 🧾 **Factures** (`/invoices`) : Liste, statuts, recherche, création en split-view (`/invoices/new`) et détail interactif (`/invoices/[id]`).
  - 👥 **Clients** (`/clients`) : Annuaire des clients sénégalais, modale d'ajout/modification et soldes dus.
  - ❓ **Aide & Support** (`/help`) : Centre de support, recherche FAQ interactive, hotline Dakar et formulaire de ticket.
  - ⚙️ **Paramètres** (`/settings`) : Informations légales (NINEA, RCCM, adresse), TVA 18%, et coordonnées Wave/Orange Money/Banque.

