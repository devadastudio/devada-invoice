# Devada Invoice — Documentation Technique & Guide d'Architecture (GEMINI.md)

Ce document constitue la référence exhaustive du projet **Devada Invoice SaaS**. Il est destiné aux développeurs, mainteneurs et futurs modèles d'intelligence artificielle intervenant sur ce référentiel de code.

---

## 1. Vue d'Ensemble & Ce que Fait l'Application

**Devada Invoice** est une plateforme SaaS moderne de facturation professionnelle et de gestion de trésorerie conçue sur mesure pour les entreprises, PME, startups et consultants indépendants opérant en Afrique, avec un ancrage spécifique au **Sénégal** et dans la zone **UEMOA / OHADA**.

L'application permet aux dirigeants et gestionnaires :
- D'émettre des devis et factures conformes aux exigences fiscales locales (DGID, mentions NINEA et RCCM, taux de TVA déterministe à 18%).
- De gérer les encaissements via les moyens de paiement usuels de la sous-région (**Wave**, **Orange Money**, **Virements bancaires**).
- De suivre la santé financière en temps réel via un tableau de bord analytique multi-périodes (facturation, encaissements, soldes dus, impayés).
- D'automatiser les relances clients par **WhatsApp Business** (messages enrichis pré-formatés) et par Email.
- De générer des documents **PDF vectoriels natifs ultra-légers (< 25 KB)**, imprimables et certifiés.
- D'exporter les journaux de vente aux formats **Excel (.xlsx)**, **CSV** et **PDF comptable**.
- De traduire instantanément l'interface et le contenu des factures en plusieurs langues (**Français**, **Anglais**, **Italien**).

---

## 2. Fonctionnalités Implémentées

### 2.1. Tableau de Bord Analytique (`/`)
- **Filtre Période Dynamique & Global** : Sélecteur temporel dans le Header avec granularité fine :
  - *Cumul historique* : `Depuis le début (all-time)`
  - *Année complète* : `Année 2026 (year-2026)`
  - *Semestres* : `S1 2026`, `S2 2026`
  - *Trimestres* : `T1 2026`, `T2 2026`, `T3 2026`, `T4 2026`
  - *Mois par mois* : `Octobre 2026`, `Septembre 2026`, `Août 2026`, etc.
- **Cartes KPI Financières** :
  - *Total Facturé* (FCFA ou devise choisie) avec indicateurs d'évolution.
  - *Total Encaissé* et calcul du taux de recouvrement global.
  - *Solde restant dû* (créances clients à recouvrer).
  - *Factures en retard* (nombre et montant des créances échues).
  - États de chargement fluides avec composants squelettes (*Skeleton UI*).
- **Graphiques Financiers (`RevenueChart`)** :
  - Visualisation comparative mensuelle des montants facturés vs encaissements reçus.
  - Classement du Top Clients générateurs de chiffre d'affaires.
- **Section « Dernières Factures » (`RecentInvoices`)** :
  - Filtrage synchrone branché sur la période sélectionnée dans le Header.
  - Onglets de filtrage par statut (*Toutes*, *Payées*, *Envoyées*, *En retard*, *Brouillons*) avec compteurs dynamiques.
  - Badge interactif permettant de basculer le statut en 1 clic.
  - Actions rapides : marquer comme payée, copier numéro, dupliquer, supprimer, télécharger PDF, relancer par WhatsApp.

### 2.2. Gestion des Factures (`/invoices`)
- **Liste complète avec double vue** :
  - *Desktop* : Tableau structuré multi-colonnes avec tri (numéro, client, date émission, échéance, montant).
  - *Mobile* : Cartes tactiles verticales optimisées sans aucun défilement horizontal.
- **Barre de métriques contextualisée** : Total facturé, total encaissé et solde restant dû recalculés en fonction de la période choisie.
- **Moteur d'Export Comptable** :
  - Export **Excel (.xlsx)** formaté avec styles et formules.
  - Export **CSV standard** (encodage UTF-8 avec BOM pour compatibilité Excel).
  - Export **PDF récapitulatif** de la sélection.

### 2.3. Éditeur de Factures (`/invoices/new` & `/invoices/new?edit=[id]`)
- **Interface Split-View** :
  - Formulaire de saisie dynamique à gauche.
  - Aperçu en direct (*Live Preview*) haute fidélité à droite.
- **Sélecteur de Client Intelligent** :
  - Liste déroulante des clients existants avec recherche rapide.
  - Fiche détaillée du client sélectionné affichée en miroir de l'émetteur (Raison sociale, NINEA, RCCM, Adresse, Téléphone, Email), omettant automatiquement les champs non renseignés.
- **Lignes de Prestations & Traduction en Temps Réel** :
  - Ajout, modification et suppression de lignes avec calcul automatique des totaux HT.
  - Boutons de traduction instantanée par ligne (**FR**, **EN**, **IT**) avec état actif stylisé en bleu cobalt.
- **Fiscalité, Remises & Multidevise** :
  - TVA automatique à 18% (ou taux paramétré dans les réglages), avec bascule pour exonération (0%).
  - Gestion des remises globales ou par ligne.
  - Conversion multidevise (**FCFA**, **EUR**, **USD**, **GBP**) avec taux de change certifié affiché sur la facture.
- **Conditions de Paiement & Notes Dynamiques** :
  - Traduction instantanée des mentions de paiement lors de la saisie ou lors du changement de langue.
  - Prise en compte du texte légal défini par défaut dans les paramètres.
- **Signature & Pied de Page Institutionnel** :
  - Signature autorisée manuscrite (image) ou calligraphiée (texte).
  - Pied de page d'entreprise légal (NINEA, RCCM, Adresse, Tél, Email, Web) synchronisé.

### 2.4. Fiche Détail Facture (`/invoices/[id]`)
- Document officiel prêt à l'impression ou au téléchargement.
- Changement de statut instantané depuis le Header.
- Boutons d'action : Téléchargement PDF natif, Impression directe, Partage WhatsApp Business, Envoi Email, Duplication, Suppression.
- Pied de page institutionnel de l'entreprise sous la signature.

### 2.5. Répertoire Clients (`/clients`)
- Gestion du portefeuille de clients sénégalais et internationaux.
- Suivi du total facturé, encaissé et de l'encours restant pour chaque client.
- Modale de création et de modification avec validation des données.

### 2.6. Centre d'Aide & Support (`/help`)
- Recherche interactive dans la FAQ dédiée à la facturation et aux règles fiscales sénégalaises.
- Coordonnées de contact rapide (Hotline Dakar, Email, WhatsApp).
- Formulaire d'envoi de ticket de support.

### 2.7. Paramètres & Configuration Entreprise (`/settings`)
- **Profil Entreprise** : Raison sociale, Forme juridique (SARL, SAS, SA, SUARL, EI), NINEA, RCCM, Adresse, Ville, Téléphone, Email, Site Web.
- **Fiscalité & Facturation** : Taux de TVA par défaut (18%), assujettissement TVA, devise par défaut, conditions de paiement et mentions légales par défaut.
- **Moyens de Paiement** : Numéros marchands Wave Business et Orange Money, Coordonnées bancaires complètes (IBAN / BIC).
- **Signature Officielle** : Importation d'image (PNG/JPG) ou saisie du nom pour signature calligraphique.

### 2.8. Profil Dirigeant & Sécurité du Mot de Passe (`/profile`)
- **Structure épurée à 2 onglets exclusifs** :
  - *Informations personnelles* : Coordonnées du dirigeant, nom, fonction, email, téléphone, ville, pays, biographie professionnelle et gestion de la photo de profil avec persistance Supabase (`profiles` et `company_settings`).
  - *Sécurité & Mot de passe* : Formulaire de changement de mot de passe sécurisé.
- **Contrôle strict et déterministe du mot de passe actuel** :
  - Vérification préalable obligatoire auprès de Supabase Auth (`supabase.auth.signInWithPassword`) avant toute modification.
  - Rejet immédiat avec message d'erreur si le mot de passe actuel saisi est erroné.
  - Mise à jour du nouveau mot de passe (`supabase.auth.updateUser`) uniquement si le contrôle initial est validé.
- **Sections désactivées pour cette version** : Authentification à deux facteurs (2FA), Confidentialité & Sessions, et Préférences de compte ont été intégralement retirées pour simplifier l'expérience utilisateur.

### 2.9. Moteur PDF Vectoriel Haute Précision (`src/lib/pdf-generator.ts`)
- Moteur 100% natif basé sur **jsPDF** (aucun rendu canvas pixélisé, poids plume < 25 KB).
- Intégration du logo officiel du projet (`/images/devada-logo.png`).
- Alignement géométrique précis : bloc des totaux décalé (`x = 105 mm`) pour garantir l'absence de chevauchement entre le texte "Total TTC (Net à payer)" et les montants en FCFA.
- Pied de page d'entreprise institutionnel placé au bas (`footerY = 282 mm`).

### 2.10. Partage WhatsApp Business (`src/lib/whatsapp-utils.tsx`)
- Modale de prévisualisation du message avant expédition.
- Message formaté avec emojis professionnels, numéro de facture, nom du client, montant en FCFA, date d'échéance et instructions de règlement Wave / Orange Money.

---

## 3. Structure des Fichiers du Projet

```
izi-facture-saas/
├── AGENTS.md                  # Charte d'UI/UX, design system et règles obligatoires
├── GEMINI.md                  # Document de référence architectural et guide de maintenance (ce fichier)
├── dev-plan.md                # Spécifications détaillées et plan d'implémentation
├── package.json               # Dépendances du projet (Next.js 14, Tailwind, jsPDF, Lucide)
├── tailwind.config.ts         # Configuration Tailwind CSS (thèmes clair/sombre, couleurs, polices)
├── tsconfig.json              # Configuration TypeScript avec alias de chemins (@/* -> ./src/*)
├── public/
│   ├── favicon.ico
│   └── images/
│       └── devada-logo.png    # Logo officiel de Devada Invoice (icône trèfle émeraude)
└── src/
    ├── app/
    │   ├── layout.tsx         # RootLayout Next.js avec script anti-flicker pour devada_theme
    │   ├── page.tsx           # Page Tableau de Bord principal (/)
    │   ├── globals.css        # Styles globaux, variables CSS et utilitaires no-scrollbar
    │   ├── clients/
    │   │   └── page.tsx       # Répertoire des clients (/clients)
    │   ├── help/
    │   │   └── page.tsx       # Centre d'aide, FAQ et tickets (/help)
    │   ├── invoices/
    │   │   ├── page.tsx       # Liste et gestion des factures (/invoices)
    │   │   ├── new/
    │   │   │   └── page.tsx   # Création & édition en split-view (/invoices/new)
    │   │   └── [id]/
    │   │       └── page.tsx   # Fiche de visualisation détaillée (/invoices/[id])
    │   ├── landing/
    │   │   └── page.tsx       # Page d'accueil marketing (/landing)
    │   ├── profile/
    │   │   └── page.tsx       # Profil utilisateur
    │   └── settings/
    │       └── page.tsx       # Paramètres généraux, fiscaux et bancaires (/settings)
    ├── components/
    │   ├── dashboard/
    │   │   ├── RecentInvoices.tsx # Tableau & cartes mobiles des dernières factures avec filtre période
    │   │   ├── RevenueChart.tsx   # Graphique financier et classement Top Clients
    │   │   └── StatCards.tsx      # Cartes KPI avec squelettes de chargement
    │   ├── invoices/
    │   │   ├── CreateInvoiceModal.tsx # Modale rapide de création de facture
    │   │   └── InvoicePreviewModal.tsx# Modale d'aperçu de facture complet avec pied de page
    │   ├── layout/
    │   │   ├── Header.tsx         # Barre supérieure avec sélecteur de période, notifications, langue et profil
    │   │   └── Sidebar.tsx        # Barre latérale de navigation (desktop fixe & mobile slide-over)
    │   ├── notifications/
    │   │   ├── AllNotificationsModal.tsx    # Modale listant l'ensemble des notifications
    │   │   ├── NotificationDetailModal.tsx  # Détail d'une notification
    │   │   ├── NotificationsDrawer.tsx      # Tiroir latéral de notifications
    │   │   └── NotificationsPopover.tsx     # Menu déroulant sous la cloche
    │   └── ui/
    │       ├── ClientSelectDropdown.tsx     # Sélecteur client avec recherche intégrée
    │       ├── ConfirmModal.tsx             # Modale générique de confirmation d'action critique
    │       ├── DatePicker.tsx               # Sélecteur de date personnalisé
    │       ├── Pagination.tsx               # Composant de pagination accessible
    │       ├── Skeleton.tsx                 # Placeholders d'attente animés
    │       └── SuccessModal.tsx             # Modale de félicitations post-création/mise à jour
    └── lib/
        ├── export-utils.ts    # Moteurs d'export Excel, CSV et PDF de synthèse
        ├── i18n.ts            # Dictionnaire et moteur de traduction multilingue (FR, EN, IT)
        ├── mock-data.ts       # Données initiales, types TypeScript et helpers localStorage
        ├── pdf-generator.ts   # Générateur de facture PDF vectoriel jsPDF haute performance
        ├── period-metrics.ts  # Données et logique de filtrage par période (isInvoiceInPeriod)
        ├── utils.ts           # Formatage FCFA, formatage de dates (JJ/MM/AAAA) et fusion de classes cn()
        └── whatsapp-utils.tsx # Générateur d'URL WhatsApp Business et modale de partage
```

---

## 4. Technologies & Dépendances Utilisées

| Technologie / Librairie | Version | Rôle & Usage |
| :--- | :--- | :--- |
| **Next.js** | `14.2.35` | Framework React avec App Router, Server Components & Client Components |
| **React** & **React DOM** | `18.x` | Librairie d'interface utilisateur réactive |
| **TypeScript** | `5.x` | Typage statique strict sur l'ensemble de l'application |
| **Tailwind CSS** | `3.4.1` | Moteur CSS utilitaire avec support complet du dark mode (`class`) |
| **Lucide React** | `1.61.0` | Bibliothèque officielle d'icônes vectorielles cohérentes |
| **jsPDF** | `4.2.1` | Moteur de génération de documents PDF vectoriels natifs |
| **html2canvas** | `1.4.1` | Outil de capture de secours pour captures d'écran complexes |
| **clsx** / **tailwind-merge** | `2.1.1` / `3.7.0` | Utilitaire `cn()` de fusion de classes conditionnelles sans conflit |

---

## 5. Décisions de Design & Conventions UI/UX

### 5.1. Règle Fondamentale : Zéro Scroll Horizontal sur Mobile
Sur les écrans de smartphones (`< 768px`), aucun tableau ne doit dépasser de la largeur d'écran :
- **Pattern Responsive** :
  - Sur Desktop (`hidden md:block`) : Tableau complet multi-colonnes.
  - Sur Mobile (`block md:hidden`) : **Cartes tactiles verticales** regroupant le numéro, le statut, les coordonnées du client, le montant TTC en FCFA, l'échéance et les actions rapides.
- Les conteneurs principaux appliquent systématiquement `w-full max-w-full overflow-hidden` ou `overflow-x-clip`.
- Les barres d'onglets de filtres horizontales utilisent `overflow-x-auto no-scrollbar` circonscrit sans déborder.

### 5.2. Monnaie Exclusive & Formatage des Nombres
- La devise exclusive est le **FCFA (XOF)** :
  - Tout montant monétaire doit être formaté via `formatFCFA(amount)` défini dans `@/lib/utils`.
  - Exemple : `250 000 FCFA`, `1 850 000 FCFA` (aucun centime n'est affiché pour le FCFA).
  - Pour les devises internationales converties (EUR, USD, GBP), utiliser `formatAmountWithCurrency(amount, currency)`.
- Les montants et numéros de pièces utilisent la typographie monospace `font-mono font-bold`.

### 5.3. Formatage Strict des Dates
- Toutes les dates sont impérativement formatées selon la norme sénégalaise et francophone : **`jour/mois/année`** (ex. `24/10/2026`) via `formatDate(dateString)` dans `@/lib/utils`.

### 5.4. Palette de Couleurs & Thème
- **Fonds d'application** : `bg-[#F8FAFC]` (mode clair) / `dark:bg-[#090D16]` (mode sombre).
- **Conteneurs & Cartes** : `bg-white` (mode clair) / `dark:bg-slate-900` (mode sombre).
- **Bordures** : `border-slate-200/80` (mode clair) / `dark:border-slate-800` (mode sombre).
- **CTA Principal** : Bleu cobalt royal `bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm shadow-blue-500/25 rounded-xl`.
- **Badges de Statut Facture** :
  - 🟢 **Payée** (`paid`) : Vert émeraude (`bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400` avec pastille `bg-emerald-500`).
  - 🟠 **Envoyée** (`sent`) : Orange ambré (`bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-400` avec pastille `bg-orange-500`).
  - 🔴 **En retard** (`overdue`) : Rouge framboise (`bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400` avec pastille `bg-rose-500`).
  - ⚪ **Brouillon** (`draft`) : Ardoise neutre (`bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300` avec pastille `bg-slate-400`).

### 5.5. Contraste Élevé pour les Avatars Clients
Tous les avatars utilisent une palette saturée à fort contraste garantissant une lisibilité maximale :
`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm ring-1 ring-black/10 dark:ring-white/10 ${bg} text-white`.

### 5.6. Persistance du Thème
- La préférence du thème est enregistrée sous la clé `devada_theme` (`"dark"` ou `"light"`).
- Un script inline exécuté immédiatement dans le `<head>` de `RootLayout` (`src/app/layout.tsx`) applique la classe `dark` au document HTML avant le premier rendu graphique pour éliminer tout effet de scintillement (*flash of unstyled content*).

---

## 6. Architecture Backend Full-Stack Supabase

L'application est 100% Full-Stack et connectée à **Supabase** (PostgreSQL 17, région `eu-west-3`) avec une synchronisation locale transparente :

### 6.1. Modèle de Données & Tables PostgreSQL
- **`profiles`** : Identité utilisateur (nom complet, email, téléphone, rôle, avatar, horodatages). Lié directement à `auth.users(id) ON DELETE CASCADE`.
- **`company_settings`** : Profil d'entreprise complet (raison sociale, forme SARL/SAS/SA/EI, NINEA, RCCM, adresse, ville, devises, taux TVA 18%, coordonnées Wave / Orange Money / Banque, logo et signature).
- **`clients`** : Portefeuille client sénégalais et international (raison sociale, email, téléphone, WhatsApp, ville, NINEA, RCCM, avatar).
- **`invoices`** : Factures émises (numéro séquentiel, montants HT/TVA/TTC en FCFA, statuts `paid`/`sent`/`overdue`/`draft`, devises, langue, conditions).
- **`invoice_items`** : Lignes de prestations vectorielles (désignation, quantité, prix unitaire, TVA 18%, total).
- **`notifications`** : Flux de notifications et alertes temps réel.

### 6.2. Sécurité & Row Level Security (RLS)
- **100% des tables ont RLS activé** (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
- Politiques strictes basées sur `auth.uid() = user_id` : chaque utilisateur ne peut lire, insérer, modifier ou supprimer que ses propres données.
- Fonctions triggers durcies avec `SET search_path = public`.

### 6.3. Authentification & Onboarding Obligatoire en 3 Étapes
- **Écran de Connexion (`/auth/login`)** : Authentification par email/mot de passe avec gestion de session SSR. Lien direct et opérationnel vers la récupération de mot de passe, interface 100% responsive sur mobile.
- **Récupération de Mot de Passe (`/auth/forgot-password` & `/auth/reset-password`)** :
  - Saisie de l'adresse email et expédition sécurisée du lien de réinitialisation via Supabase Auth.
  - Page de définition du nouveau mot de passe avec validation et confirmation.
- **Onboarding Obligatoire en 3 Étapes (`/auth/register`)** :
  - *Étape 1 : Identifiants du dirigeant* (Nom & Prénom, Fonction / Rôle, Email de connexion, Téléphone, Mot de passe).
  - *Étape 2 : Configuration légale de l'entreprise* :
    - Libellés clairs et concis : **Identifiant fiscal** et **Registre du commerce**, chacun équipé d'un bouton d'information interactif (`InfoTooltip`) expliquant en détail les équivalents par pays (NINEA, NIF, SIREN, CIF, TIN / RCCM, RCS, CBE, etc.).
    - Champ **Ville** vide par défaut avec placeholder suggestif.
    - Sélecteur de **Pays de domiciliation** sans présélection par défaut (option initiale neutre `-- Sélectionnez votre pays --`) répertoriant les **195 pays du monde** avec drapeaux emojis (`src/lib/countries.ts`).
  - *Étape 3 : Coordonnées officielles de l'entreprise* (Email de facturation professionnel, Email PEC / Certifié optionnel, Téléphone de l'entreprise, Numéro WhatsApp professionnel).
  - Un trigger PostgreSQL `on_auth_user_created` alimente automatiquement `profiles` et `company_settings` dès la validation.
- **Protection des Routes (`middleware.ts`)** :
  - Redirection automatique vers `/auth/login` pour tout utilisateur non connecté tentant d'accéder à l'application.
  - Rafraîchissement automatique des JWT tokens côté serveur via `@supabase/ssr`.

### 6.4. Supabase Storage (`company-assets`)
- Bucket public `company-assets` sécurisé par 4 politiques RLS pour l'hébergement des logos d'entreprise et signatures officielles.

### 6.5. Couche d'Accès aux Données (`src/lib/supabase/db.ts`) 100% Directe
- Fonctions CRUD typées : `fetchInvoices`, `saveInvoice`, `updateInvoiceStatus`, `deleteInvoice`, `fetchClients`, `saveClient`, `deleteClient`, `fetchCompanySettings`, `saveCompanySettings`, `uploadCompanyAsset`.
- **Zéro donnée statique / mock pour les utilisateurs authentifiés** :
  - Suppression totale des fallbacks mock (`MOCK_INVOICES`, `MOCK_CLIENTS`).
  - Neutralisation de `seedDemoDataIfEmpty` : aucune fausse facture ou faux client d'exemple n'est injecté dans les comptes utilisateurs réels.
  - Tout nouvel utilisateur commence avec son propre tableau de bord à zéro facture et zéro client, avec des états vides (*empty states*) élégants et des actions claires pour créer son premier client ou sa première facture.
  - Synchronisation dynamique du profil utilisateur (`Sidebar.tsx`, `Header.tsx`) directement depuis `profiles` et `company_settings` Supabase.

---

## 7. Instructions Essentielles pour un Futur Modèle d'IA

Lors de toute intervention sur ce référentiel de code, le modèle d'IA DOIT se conformer strictement aux directives suivantes :

1. **Données Réelles Supabase Uniquement** :
   - Ne jamais réintroduire de fallbacks vers `MOCK_INVOICES` ou `MOCK_CLIENTS` pour les utilisateurs authentifiés.
   - Ne jamais réactiver le seed de fausses données dans `seedDemoDataIfEmpty`.
   - Si la base de données retourne un tableau vide (`[]`), afficher proprement l'état vide avec invitation à créer le premier enregistrement.

2. **Préservation du Format Monétaire** :
   - N'utiliser **aucun symbole `$` ou `€`** pour les montants sénégalais.
   - Ne jamais afficher de centimes pour les montants en FCFA (ex. écrire `1 500 000 FCFA` et jamais `1 500 000,00 FCFA`).
   - Toujours employer `formatFCFA(amount)` ou `formatAmountWithCurrency(amount, currency)`.

3. **Format des Dates** :
   - Toute date visible pour l'utilisateur doit être formatée en **`JJ/MM/AAAA`** via `formatDate()`. Ne jamais afficher de dates au format ISO brut (`2026-10-24`).

4. **Génération de PDF (`pdf-generator.ts`)** :
   - Conserver impérativement l'approche **vectorielle native jsPDF** (ne pas la remplacer par `html2canvas`).
   - Le logo `/images/devada-logo.png` est un flux JPEG interne sous extension `.png` : toujours l'insérer avec le format `"JPEG"` dans `doc.addImage()`.
   - Le bloc des totaux doit rester calé à `x = 105 mm` avec une largeur suffisante jusqu'à `x = 196 mm` pour éviter tout chevauchement entre les libellés ("Total TTC (Net à payer)") et les sommes en FCFA.
   - Maintenir le pied de page institutionnel d'entreprise au bas de page (`footerY = 282 mm`).

5. **Filtrage par Période** :
   - Toute section présentant des factures ou des métriques temporelles doit utiliser `isInvoiceInPeriod(issueDate, periodId)` depuis `@/lib/period-metrics`.
   - Quand `selectedPeriodId` change, réinitialiser la pagination à la page 1 (`setCurrentPage(1)`).

6. **Aperçu et Fiche Facture** :
   - Toujours conserver le pied de page d'entreprise (Dénomination, Forme, NINEA, RCCM, Adresse, Ville, Tél, Email, Web) dans :
     - La page de détail `src/app/invoices/[id]/page.tsx`
     - La modale d'aperçu `src/components/invoices/InvoicePreviewModal.tsx`
     - Le Live Preview de création `src/app/invoices/new/page.tsx`

7. **Validation TypeScript Obligatoire** :
   - Avant de conclure toute tâche, exécuter `npx tsc --noEmit` et s'assurer qu'aucune erreur de compilation n'est levée.
