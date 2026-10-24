# Plan directeur de développement — SaaS de facturation pour entrepreneurs africains

Architecture et feuille de route V1

Notre objectif est de construire une véritable plateforme SaaS de facturation, moderne, rapide, sécurisée et prête à être commercialisée auprès des entrepreneurs, freelances, PME et petites entreprises africaines.

L'application devra être aussi agréable à utiliser qu'un produit fintech premium, tout en restant extrêmement simple pour un entrepreneur qui souhaite créer une facture en quelques minutes.

Je propose une stratégie : concevoir une V1 commercialisable, sans complexité inutile, mais avec une architecture capable d'évoluer vers une plateforme de gestion financière beaucoup plus complète.

## 1. Les décisions fondamentales

Application multi-entreprises

Chaque entreprise possède ses propres clients, factures, paramètres et données financières. L'architecture permet également à un utilisateur de gérer plusieurs entreprises à terme.

Monnaie principale : franc CFA (XOF)

Affichage localisé, calculs fiables, montants sans décimales pour XOF et possibilité d'étendre ultérieurement à XAF, EUR et autres devises.

Facturation conforme au contexte local

TVA paramétrable à 18 % par défaut pour le Sénégal lorsque l'entreprise y est assujettie, identification fiscale, numérotation sécurisée et documents PDF professionnels.

Sécurité dès la conception

Isolation des entreprises avec Supabase Row Level Security, validations serveur, traçabilité financière, contrôles d'accès et sauvegardes.

### Point technique important sur Next.js 14

Tu as demandé Next.js 14 avec App Router. L'architecture proposée est compatible avec ses principes, mais il existe un point important : en octobre 2026, Next.js 14 ne fait plus partie des versions officiellement supportées. Next.js 16 bénéficie du support actif et Next.js 15 du support de maintenance.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://nextjs.org\&sz=32)

The React Framework



Pour un SaaS qui manipule les données financières de vrais clients, je recommande donc Next.js 16 en production, tout en conservant ton choix initial de Next.js 14 comme référence architecturale pour le prototype si nécessaire. Nous éviterons ainsi une migration coûteuse après avoir développé toutes les fonctionnalités.

### Marché initial proposé

Je recommande de commencer par le Sénégal comme pays pilote, avec une architecture extensible aux autres pays d'Afrique francophone.

Ce choix permet de maîtriser les règles de facturation locales avant de généraliser le produit. Au Sénégal, le taux normal de TVA est bien de 18 %, mais il ne doit pas être appliqué automatiquement à toute entreprise ou opération.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.dgid.sn\&sz=32)

DGID Sénégal



Notre moteur de facturation sera donc paramétrable selon le régime fiscal et le pays de l'entreprise.

## 2. Périmètre fonctionnel de la V1

Nous allons organiser l'application en modules indépendants, mais parfaitement connectés entre eux.

### Modules prioritaires

| Module           | Fonctionnalités                                               | Priorité |
| ---------------- | ------------------------------------------------------------- | -------- |
| Dashboard        | Statistiques, montants facturés, paiements, factures récentes | P0       |
| Factures         | Création, modification, aperçu, PDF, envoi, statuts           | P0       |
| Clients          | Ajouter, modifier, consulter, rechercher, archiver            | P0       |
| Paiements        | Enregistrer les règlements, soldes restants                   | P0       |
| Entreprise       | Informations légales, identité, logo, préférences             | P0       |
| Authentification | Inscription, connexion, récupération de compte                | P0       |
| Notifications    | Confirmation d'envoi, rappels de paiement                     | P1       |
| Rapports         | Statistiques par période, clients et factures                 | P1       |
| Devis            | Création, PDF, conversion en facture                          | P1       |
| Équipe           | Collaborateurs et permissions                                 | P2       |
| Abonnements SaaS | Offres, quotas, paiements des abonnements                     | P2       |
| Intégrations     | Mobile Money, comptabilité, API externes                      | P2       |

P0 : nécessaire à la première version exploitable. P1 : amélioration commerciale. P2 : évolution ultérieure.

Je conseille de préparer la structure technique pour les modules P1 et P2 sans les développer immédiatement.

## 3. Définition détaillée des écrans

### 3.1 Dashboard principal

Le dashboard sera le centre de contrôle financier de l'utilisateur.

## Tableau de bord

Exemple illustratif avec données fictives

Montant facturé

# 8 450 000

FCFA

Montant encaissé

# 5 230 000

FCFA

En attente

# 3 220 000

FCFA

Factures émises

# 48

factures

Facturation mensuelle

Facturé

Encaissé

06000001,2 Mln1,8 Mln2,4 MlnMaiJuinJuilAoûtSeptOct

Données de démonstration

Fonctionnalités prévues :

- Cartes de statistiques principales avec filtre de période.
- Graphiques de facturation et d'encaissement.
- Liste des factures récentes.
- Factures en retard nécessitant une action.
- Top clients par chiffre d'affaires.
- Bouton principal « Nouvelle facture ».
- État vide avec accompagnement lorsque l'utilisateur débute.

Les statistiques devront être calculées à partir des factures réellement émises et des paiements enregistrés, sans confondre facturation et encaissement.

### 3.2 Gestion des factures

Page `/invoices`

Cette page permettra de rechercher, filtrer et gérer toutes les factures d'une entreprise.

Colonnes principales : numéro, client, date d'émission, échéance, montant TTC, montant restant, statut et actions.

Les filtres comprendront la période, le client, le statut et le montant. La recherche et la pagination seront prévues dès le départ.

Actions : consulter, modifier un brouillon, dupliquer, télécharger en PDF, envoyer, enregistrer un paiement, annuler conformément aux règles de facturation.

### 3.3 Création d'une facture

Page `/invoices/new`

Ta première capture d'écran représente précisément le type d'expérience que nous pouvons rechercher.

[Create Invoice UI | SaaS, CRM by Muhammad Salim on Dribbble](https://images.openai.com/static-rsc-4/m2iTDCMTjDjdsLBLs-1g7BoybWIR6vS9n4dh9ShKnerL0hV0Zmo7nE7iM7ZQA8r8PdcjG6Jdt5NfiIs1kwuAhVaI68it_USTYNOtKhPhiK1j4_wdpq0SN6v6ZeFCQsjNmkhP02wETjwZI6md9mZdWqnnW9jR5NPKmJ7rhRDfSSk?purpose=inline)

[Invoice & Task Dashboard SaaS Product by Airzon Agency on Muzli](https://images.openai.com/static-rsc-4/upapi1Ola7_KjV-BQaAqKyTjKQXeZB-xyZ14UJ_BMap1Dx1ZzGeg6ApHCsSgAgI2JV_RF7ciUXM6vAEYgr1s3vvKCP9wiAl_k13mb6O3q0_I7opTqL5zUVjC5bj2G3Q_BYTD7nBiA7X_XJtj9n5Do7pxIzi41O6W73tJoUB2PS8?purpose=inline)

[Free Wireframe Template for Invoice app](https://images.openai.com/static-rsc-4/Yl2Yd43HGAM4_sIu9uKW_kI6Cy4EZiVgYhMyl14fKJOZaO1TVTFlB75RLFEqjtb004B0aHeJmHBqvCXfSV0htR5b_TidNQERXvJ29P2GVsKrEXuA_qO0qjGrPAs7vzDHToDUs4aIL811INEeEbOCgx1gwLf1h65Gho9iKQizBgc?purpose=inline)

14

Références complémentaires de composition ; les captures que tu fourniras resteront prioritaires pour l'identité visuelle.

Je retiens de la capture déjà transmise un principe particulièrement intéressant : un formulaire à gauche et un aperçu de la facture à droite, actualisé automatiquement.

Éditeur de facture avec aperçu en direct

FORMULAIRE

Informations facture

Client · Dates · Référence

Lignes de facturation

Description · Quantité · Prix

Taxes et remises

TVA · Réduction · Total

FACTURE

FACT-2026-0001

Désignation

Montant

Prestations

100 000

TVA 18 %

18 000

118 000 FCFA

Structure fonctionnelle indicative, non définitive.

Le formulaire comprendra les groupes suivants :

Informations générales : entreprise émettrice, client, numéro de facture, dates d'émission et d'échéance, référence de commande facultative, devise.

Lignes de facturation : description, quantité décimale possible, unité, prix unitaire hors taxe ou TTC selon le mode choisi, taux de taxe, montant calculé. Les lignes seront dynamiques, réordonnables et supprimables.

Totaux : sous-total HT, remises, base taxable, TVA, total TTC, paiements déjà effectués, solde restant dû.

Informations complémentaires : conditions de paiement, coordonnées bancaires ou Mobile Money, notes et pied de page personnalisable.

Actions : enregistrer comme brouillon, prévisualiser, émettre, télécharger et envoyer la facture.

Sur mobile, le formulaire et l'aperçu utiliseront deux vues adaptées plutôt que de réduire excessivement une interface à deux colonnes.

### 3.4 Gestion des clients

Page `/clients`

Chaque client possédera une fiche comprenant :

- Nom ou raison sociale, personne de contact.
- Email, numéro de téléphone et indicatif international.
- Adresse, ville, pays et identifiants fiscaux facultatifs.
- Historique des factures.
- Total facturé, total payé et solde restant.
- Notes internes.

Les informations client seront réutilisables dans le formulaire de création d'une facture.

Important : les factures déjà émises conserveront une copie des informations du client au moment de leur émission. Modifier ultérieurement son adresse ne doit pas réécrire l'historique.

### 3.5 Paramètres de l'entreprise

Page `/settings/company`

Cette page permettra de configurer le nom commercial, la raison sociale, le logo, le pays, le téléphone, l'email, l'adresse, le NINEA et le RCCM pour les entreprises sénégalaises concernées.

D'autres paramètres comprendront la devise par défaut, le taux de TVA applicable, la numérotation, les délais de règlement, les coordonnées de paiement et la personnalisation des documents.

Pour le Sénégal, la conception devra notamment tenir compte des mentions de facturation prévues par le cadre fiscal et commercial, avec validation juridique avant commercialisation.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.finances.gouv.sn\&sz=32)

Ministry of Finance and Budget - Senegal

+1



## 4. Moteur de facturation et règles métier

C'est le composant le plus important du SaaS.

Nous créerons un module métier indépendant de l'interface, utilisé simultanément pour les calculs du formulaire, les validations serveur, les factures sauvegardées et la génération des PDF.

### 4.1 Règles de calcul

Exemple pour une prestation de 100 000 FCFA HT :

Simulation interactive des calculs

Prix HT (FCFA)

Quantité

TVA (%)

Sous-total HT

100 000 FCFA

TVA

18 000 FCFA

Total TTC

# 118 000 FCFA

Cette simulation utilise un arrondi simple. L'implémentation de production disposera d'une politique d'arrondi explicite et de calculs décimaux déterministes.

Nous devons absolument éviter les problèmes classiques de facturation liés aux nombres à virgule flottante.

Décisions techniques :

- Calculs à précision décimale avec une bibliothèque comme `decimal.js`.
- Stockage des montants finaux en unités monétaires entières pour le FCFA.
- Définition d'une politique d'arrondi unique, testée et reproductible.
- Remises appliquées dans un ordre documenté avant calcul des taxes.
- Contrôle des quantités et des prix négatifs.
- Vérification serveur de tous les totaux.
- Même moteur de calcul pour le front, le back et les PDF.

### 4.2 Numérotation des factures

Format initial configurable, par exemple :

`FAC-2026-000001`

Le numéro définitif sera attribué uniquement lorsque le brouillon devient une facture émise.

Une transaction PostgreSQL empêchera que deux factures reçoivent le même numéro, même si plusieurs collaborateurs les émettent simultanément.

Il faudra également préserver la continuité et la traçabilité des numéros, selon les exigences du pays concerné.

### 4.3 Gestion des statuts

Nous séparerons le cycle de vie de la facture, son envoi et son règlement. Cela évite les ambiguïtés que provoquerait un seul champ de statut.

Cycle de vie principal

Brouillon

Émise

Réglée

Une facture émise peut être non envoyée, envoyée, partiellement payée, intégralement payée ou en retard.

Une facture en retard est détectée à partir de son échéance et de son solde, sans modifier artificiellement son statut financier.

Une facture finalisée ne pourra pas être modifiée librement comme un brouillon. Nous prévoirons une procédure d'annulation ou d'avoir, avec référence au document original, selon la réglementation applicable.

### 4.4 Paiements

La V1 permettra d'enregistrer manuellement des paiements reçus par espèces, virement, Mobile Money ou autre moyen.

Le système prendra en charge les paiements partiels, les paiements multiples, les références de transaction et le montant encore dû.

Les intégrations réelles aux opérateurs de paiement viendront ensuite, avec vérification des webhooks et gestion des transactions répétées.

## 5. Architecture technique complète

Frontend Next.js + Tailwind CSS

Pages, composants, formulaires et aperçu en direct

Couche applicative sécurisée

Server Actions · Route Handlers · Services métier · Validation

PostgreSQL

Données et RLS

Supabase Auth

Comptes et sessions

Supabase Storage

Logos et PDF

Services externes via intégrations serveur

Email transactionnel · Génération PDF · Tâches planifiées

### Stack complémentaire proposée

| Domaine                | Technologie                                     |
| ---------------------- | ----------------------------------------------- |
| Application            | Next.js App Router + TypeScript                 |
| UI                     | Tailwind CSS                                    |
| Composants accessibles | shadcn/ui + Radix UI                            |
| Icônes                 | Lucide React                                    |
| Formulaires            | React Hook Form + Zod                           |
| Base de données        | Supabase PostgreSQL                             |
| Authentification       | Supabase Auth + `@supabase/ssr`                 |
| Gestion locale d'état  | React state, Zustand si nécessaire              |
| Tables                 | TanStack Table                                  |
| Graphiques             | Recharts                                        |
| Calculs financiers     | decimal.js                                      |
| Documents              | Génération PDF côté serveur                     |
| Emails                 | Resend ou fournisseur transactionnel équivalent |
| Tests unitaires        | Vitest                                          |
| Tests end-to-end       | Playwright                                      |
| Tests base de données  | pgTAP                                           |
| Hébergement            | Vercel                                          |
| CI/CD                  | GitHub Actions                                  |

Nous utiliserons autant que possible les Server Components pour les pages de consultation et réserverons les Client Components aux éléments interactifs.

Les opérations sensibles passeront par une couche de services métier, sans faire confiance aux calculs ou aux permissions envoyés par le navigateur.

### Structure du projet

```
src/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── invoices/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   ├── clients/
│   │   ├── payments/
│   │   ├── reports/
│   │   └── settings/
│   └── api/
│       ├── invoices/
│       │   └── [id]/
│       │       ├── pdf/
│       │       └── send/
│       ├── auth/
│       │   └── callback/
│       └── cron/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── invoices/
│   ├── clients/
│   └── forms/
│
├── features/
│   ├── invoicing/
│   │   ├── domain/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── repositories/
│   ├── clients/
│   ├── payments/
│   └── organizations/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── currency.ts
│   ├── permissions.ts
│   └── utils.ts
│
├── types/
└── tests/

supabase/
├── migrations/
├── seed.sql
└── tests/

middleware.ts
```

La structure est indicative. Avec Next.js 16, nous adapterons notamment le mécanisme de session à `proxy.ts` ; avec Next.js 14, il reste `middleware.ts`. Cette différence est documentée par Supabase.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://supabase.com\&sz=32)

Supabase Docs



## 6. Modèle de données Supabase

Je propose les tables suivantes pour disposer d'une structure relationnelle fiable et extensible.

| Table                  | Responsabilité                           |
| ---------------------- | ---------------------------------------- |
| `profiles`             | Profil lié à l'utilisateur authentifié   |
| `organizations`        | Entreprises utilisant le SaaS            |
| `organization_members` | Utilisateurs et rôles par entreprise     |
| `clients`              | Carnet d'adresses clients                |
| `invoices`             | En-têtes, statuts et totaux des factures |
| `invoice_items`        | Lignes de chaque facture                 |
| `invoice_sequences`    | Numérotation par entreprise et période   |
| `payments`             | Règlements reçus et enregistrés          |
| `tax_settings`         | Paramètres fiscaux applicables           |
| `invoice_events`       | Historique métier des factures           |
| `email_deliveries`     | Historique des envois et erreurs         |
| `documents`            | Références des fichiers PDF stockés      |
| `audit_logs`           | Journal des opérations importantes       |

Chaque table liée à une entreprise comportera un `organization_id`, avec des contraintes de cohérence pour interdire les références croisées vers une autre entreprise.

### Relations principales

\#chatgpt-mermaid-\_r_13m\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(13, 13, 13);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_13m\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_13m\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_13m\_ .error-icon{fill:rgb(243, 243, 243);}#chatgpt-mermaid-\_r_13m\_ .error-text{fill:rgb(13, 13, 13);stroke:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_13m\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_13m\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_13m\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_13m\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_13m\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_13m\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_13m\_ .marker{fill:rgb(143, 143, 143);stroke:rgb(143, 143, 143);}#chatgpt-mermaid-\_r_13m\_ .marker.cross{stroke:rgb(143, 143, 143);}#chatgpt-mermaid-\_r_13m\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_13m\_ p{margin:0;}#chatgpt-mermaid-\_r_13m\_ .entityBox{fill:rgb(222, 234, 251);stroke:rgb(83, 154, 248);}#chatgpt-mermaid-\_r_13m\_ .relationshipLabelBox{fill:rgb(243, 243, 243);opacity:0.7;background-color:rgb(243, 243, 243);}#chatgpt-mermaid-\_r_13m\_ .relationshipLabelBox rect{opacity:0.5;}#chatgpt-mermaid-\_r_13m\_ .labelBkg{background-color:rgba(243, 243, 243, 0.5);}#chatgpt-mermaid-\_r_13m\_ .edgeLabel{background-color:rgb(252, 252, 252);}#chatgpt-mermaid-\_r_13m\_ .edgeLabel .label rect{fill:rgb(252, 252, 252);}#chatgpt-mermaid-\_r_13m\_ .edgeLabel .label text{fill:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_13m\_ .edgeLabel .label{fill:rgb(83, 154, 248);font-size:14px;}#chatgpt-mermaid-\_r_13m\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(13, 13, 13);}#chatgpt-mermaid-\_r_13m\_ .edge-pattern-dashed{stroke-dasharray:8,8;}#chatgpt-mermaid-\_r_13m\_ .node rect,#chatgpt-mermaid-\_r_13m\_ .node circle,#chatgpt-mermaid-\_r_13m\_ .node ellipse,#chatgpt-mermaid-\_r_13m\_ .node polygon{fill:rgb(222, 234, 251);stroke:rgb(83, 154, 248);stroke-width:1px;}#chatgpt-mermaid-\_r_13m\_ .relationshipLine{stroke:rgb(143, 143, 143);stroke-width:1px;fill:none;}#chatgpt-mermaid-\_r_13m\_ .marker{fill:none!important;stroke:rgb(143, 143, 143)!important;stroke-width:1;}#chatgpt-mermaid-\_r_13m\_ [data-look=neo].labelBkg{background-color:rgba(243, 243, 243, 0.5);}#chatgpt-mermaid-\_r_13m\_ .node .neo-node{stroke:rgb(83, 154, 248);}#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_13m\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_13m\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].node .neo-line path{stroke:rgb(83, 154, 248);filter:none;}#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_13m\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_13m\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_13m\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_13m\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_13m\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}PROFILESORGANIZATION_MEMBERSORGANIZATIONSCLIENTSINVOICESINVOICE_SEQUENCESTAX_SETTINGSINVOICE_ITEMSPAYMENTSINVOICE_EVENTSDOCUMENTSEMAIL_DELIVERIESbelongshasownsownsnumbersdefinesbilledcontainsreceivestracksproducessends

Nous définirons aussi les types PostgreSQL, les clés étrangères, les index, les contraintes `CHECK`, les politiques RLS et les migrations versionnées.

### Point architectural essentiel : le multi-tenant

Nous ne devons pas simplement filtrer les factures avec un identifiant utilisateur dans le frontend.

Pour chaque accès, le backend doit vérifier que l'utilisateur est membre de l'entreprise concernée, avec les permissions nécessaires. PostgreSQL devra également appliquer cette restriction directement au niveau de chaque ligne.

Supabase recommande précisément RLS pour ce type d'isolation de données.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://supabase.com\&sz=32)

Supabase Docs



## 7. Sécurité et gestion des accès

Le modèle de permissions initial comprendra trois rôles :

| Action                            | Owner | Admin            | Collaborateur    |
| --------------------------------- | ----- | ---------------- | ---------------- |
| Voir les factures                 | Oui   | Oui              | Oui              |
| Créer une facture                 | Oui   | Oui              | Oui              |
| Enregistrer un paiement           | Oui   | Oui              | Selon permission |
| Gérer les clients                 | Oui   | Oui              | Selon permission |
| Modifier les informations légales | Oui   | Oui              | Non              |
| Gérer les membres                 | Oui   | Selon permission | Non              |
| Supprimer l'entreprise            | Oui   | Non              | Non              |

Dans la première version, une seule personne pourra utiliser son entreprise sans gestion d'équipe visible. La structure de permissions sera néanmoins déjà compatible avec de futurs collaborateurs.

### Mesures obligatoires avant production

- Authentification serveur : vérification de la session à chaque opération sensible.
- RLS sur toutes les tables exposées : aucun accès aux données des autres organisations.
- Validation Zod serveur : types, limites, formats et cohérence des montants.
- Secrets : aucune clé Supabase privilégiée exposée au navigateur.
- Fichiers : buckets privés pour les factures, téléchargement autorisé ou via liens contrôlés.
- Journal d'audit : traçabilité des émissions, annulations, modifications autorisées et paiements.
- Protection contre les abus : limitation du débit, validation des fichiers et des destinataires email.
- Sauvegardes : stratégie documentée de restauration PostgreSQL et des documents.
- Vie privée : information sur le traitement, durée de conservation, droits des utilisateurs et hébergement des données selon les pays desservis.

Pour les liens de téléchargement externes, nous privilégierons un contrôle applicatif et des durées de validité adaptées. Les URL signées Supabase sont possibles, mais leur révocation immédiate doit être étudiée avant de les considérer comme un mécanisme de partage durable.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://supabase.com\&sz=32)

Supabase Docs



## 8. Plan d'implémentation par étapes

Voici l'ordre de réalisation que je recommande. Il reprend ton workflow en six phases tout en ajoutant les critères de validation indispensables.

## 01

Design et fondations du frontend

Captures d'écran → design system → écrans statiques

Analyser chaque capture et construire une bibliothèque de composants harmonisée : navigation latérale, boutons, tableaux, cartes, formulaires, modales, notifications, états vides et responsive.

Livrable : toutes les pages principales navigables, conformes aux références visuelles, sans dépendance à Supabase.

## 02

Interactions et données locales

Navigation réelle → mocks → calculs → scénarios

Mettre en place les routes, jeux de données réalistes, formulaires contrôlés, validations, calculs de facturation, recherche, filtres et notifications UI. Utiliser un adaptateur local pour que le raccordement à Supabase ne nécessite pas de réécrire les composants.

Livrable : un prototype entièrement interactif dont les parcours principaux fonctionnent avec des données simulées.

## 03

Base de données et logique métier persistante

PostgreSQL → migrations → RLS → opérations

Créer le schéma, les contraintes et les politiques RLS. Brancher les repositories Supabase, puis tester la création, la modification des brouillons, l'émission, les paiements, les statuts et la génération documentaire.

Livrable : fonctionnement réel sur une base de développement isolée, avec migrations reproductibles et tests d'intégrité.

## 04

Authentification et onboarding

Supabase Auth → sessions → permissions → entreprises

Ajouter inscription par email et mot de passe, vérification email, connexion, récupération de compte, déconnexion, puis éventuellement Google. Mettre en place la création de l'entreprise au premier accès, le middleware de session et les protections de toutes les routes.

Livrable : chaque utilisateur retrouve ses données après connexion, sans pouvoir consulter celles d'un autre compte.

## 05

Landing page commerciale

Présentation produit → acquisition → inscription

Concevoir une page marketing présentant le produit, ses bénéfices, les fonctionnalités principales, des captures, une FAQ et des appels à l'action. Prévoir la structure des futures offres tarifaires sans activer une facturation d'abonnement inachevée.

Livrable : un parcours clair depuis la découverte du produit jusqu'à la création de la première facture.

## 06

Validation, déploiement et tests de production

Tests automatisés → audit → Vercel → vérification

Exécuter les tests fonctionnels, RLS, PDF, calculs, authentification et performances. Effectuer la revue de sécurité, activer les sauvegardes, vérifier la configuration des domaines et emails, puis déployer via Vercel.

Livrable : une V1 validée de bout en bout, observable et exploitable en conditions réelles.

Précaution sur l'ordre de réalisation : l'authentification peut être raccordée à l'étape 4 comme prévu, mais les règles d'autorisation et le modèle multi-entreprises doivent être conçus dès l'étape 3. Les données financières réelles ne seront jamais exposées par un prototype sans protection.

## 9. Stratégie de tests

Un SaaS de facturation doit être testé différemment d'un simple site vitrine.

| Domaine      | Scénario essentiel                 | Résultat attendu                   |
| ------------ | ---------------------------------- | ---------------------------------- |
| Facturation  | Facture 100 000 FCFA HT, TVA 18 %  | Total 118 000 FCFA                 |
| Facturation  | Remise et plusieurs taux fiscaux   | Total conforme aux règles définies |
| Numérotation | Deux factures émises simultanément | Aucun doublon                      |
| Paiement     | Deux règlements partiels           | Solde correctement mis à jour      |
| Statut       | Échéance dépassée, solde positif   | Facture affichée en retard         |
| Client       | Changement d'adresse               | Factures historiques inchangées    |
| Sécurité     | Entreprise A tente de lire B       | Accès refusé                       |
| PDF          | Téléchargement d'une facture émise | Montants et informations inchangés |
| Emails       | Échec d'envoi                      | Facture conservée, erreur traçable |
| Auth         | Session expirée ou révoquée        | Accès privé bloqué                 |
| Mobile       | Création sur petit écran           | Parcours entièrement réalisable    |

À cela s'ajouteront des tests de concurrence, d'idempotence, de gestion des fuseaux horaires et des dates d'échéance.

Les tests RLS seront réalisés notamment avec pgTAP, selon l'approche documentée par Supabase.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://supabase.com\&sz=32)

Supabase Docs



### Définition de « prêt pour la production »

Une fonctionnalité sera considérée comme terminée uniquement lorsqu'elle possède :

1. Une interface validée sur ordinateur et mobile.
2. Des validations côté navigateur et serveur.
3. Des états de chargement, d'erreur, de succès et de données absentes.
4. Des autorisations et des règles de données vérifiées.
5. Les tests automatisés pertinents.
6. Une expérience fonctionnelle sur l'environnement de préproduction.

## 10. Services automatisés et documents

### Génération des PDF

La génération des documents sera réalisée côté serveur, à partir des valeurs validées et figées de la facture.

Nous prévoirons un template principal avec logo, coordonnées, numérotation, lignes détaillées, taxes, total et informations de paiement.

Les documents officiels émis seront conservés sous forme de versions non modifiables, avec contrôles d'accès.

### Envoi par email

L'envoi d'une facture utilisera une file logique d'opérations avec statuts d'envoi, tentatives de reprise et identifiants d'idempotence.

Nous distinguerons l'émission juridique d'une facture de la réussite technique de l'envoi email.

### Rappels

Les rappels pourront être déclenchés automatiquement avant ou après une échéance, selon les préférences de l'entreprise et les règles de communication applicables.

Pour un lancement simple, une tâche quotidienne est suffisante. Vercel permet les Cron Jobs, mais ses plans présentent des contraintes de fréquence et de précision, notamment sur Hobby.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://vercel.com\&sz=32)

Vercel



## 11. Ce que nous excluons volontairement de la première version

Afin de limiter le risque technique et d'accélérer l'obtention d'un produit utilisable, nous ne construirons pas immédiatement une suite comptable complète.

Les rapprochements bancaires automatiques, la comptabilité générale OHADA, les déclarations fiscales automatisées, les intégrations Mobile Money complètes, les abonnements clients récurrents complexes et l'intelligence artificielle seront envisagés après validation de la V1.

Il reste néanmoins pertinent de prévoir les bons modèles de données pour accueillir ces évolutions.

Nous pourrons notamment développer ensuite un système de devis, un catalogue de services, une gestion des dépenses, des rapports de trésorerie et des abonnements SaaS.

## 12. Les premières captures à traiter

Pour préserver la cohérence visuelle, chaque capture reçue sera analysée comme une référence fonctionnelle et graphique, non comme un écran isolé à copier.

Voici l'ordre que je propose.

Checklist des écrans à valider

0 / 7

1\. Dashboard

Structure générale, KPI, navigation et tableaux de bord

2\. Liste des factures

Tableau, filtres, statuts et actions

3\. Création de facture

Formulaire à deux panneaux et prévisualisation

4\. Détail d'une facture

Aperçu, PDF, paiements et historique

5\. Clients

Liste et fiche client

6\. Paramètres entreprise

Identité légale, TVA, logo et préférences

7\. Authentification

Connexion, inscription et onboarding

Commencer la phase design&#x20;

La capture de création de facture déjà reçue constitue notre première référence. Il ne sera pas nécessaire de la renvoyer.

## 13. Résultat final attendu

À la fin de cette feuille de route, notre SaaS devra permettre le parcours complet suivant :

Création du compte

Inscription sécurisée

Configuration de l'entreprise

Identité, fiscalité et coordonnées

Création d'un client

Coordonnées et informations commerciales

Création et émission d'une facture

Calcul automatique, contrôle et PDF

Envoi au client

Email, document et historique

Enregistrement du paiement

Règlement partiel ou total

Dashboard actualisé

Revenus facturés, montants encaissés, créances et statistiques

Ce parcours représente notre principal critère de succès : un entrepreneur doit pouvoir partir d'un compte vierge, configurer son entreprise, créer sa première facture, l'envoyer, enregistrer son règlement et retrouver des statistiques exactes.