# Plan d'intégration : Devada Leads (version 2)

Module de prospection B2B intelligente et génération de messages commerciaux IA pour **Devada Invoice**.

---

## 1. Vue d'Ensemble

- **Scraping géographique B2B** : Recherche d'entreprises locales (restaurants, boutiques, pharmacies, cliniques, etc.) par ville (Dakar, Thiès, Saint-Louis, Abidjan...) via Apify Google Maps Places Scraper.
- **Enrichissement & Filtrage** : Détection des opportunités (absence de site web, avis Google, note moyenne, numéro de téléphone normalisé pour WhatsApp).
- **Génération IA de messages personnalisés** : OpenAI génère un message d'approche hyper-personnalisé selon le secteur du prospect et l'offre de l'utilisateur (WhatsApp, Email ou SMS).
- **Conversion en 1 clic** : Transformation immédiate d'un lead prospecté en client officiel dans le carnet d'adresses Devada avec possibilité d'émettre sa première facture.
- **Export Comptable & Commercial** : Export CSV UTF-8 prêt pour Excel.

---

## 2. Base de Données Supabase

### 2.1. Nouvelles colonnes dans `company_settings`
- `business_sector` (text) : secteur d'activité de l'utilisateur.
- `prospecting_pitch` (text) : argumentaire de vente court / offre de l'utilisateur.

### 2.2. Table `lead_searches`
- `id` (uuid, PK)
- `user_id` (uuid, FK auth.users)
- `query` (text)
- `city` (text)
- `sender_sector` (text)
- `max_results` (integer)
- `apify_run_id` (text)
- `apify_dataset_id` (text)
- `status` (text: 'running', 'succeeded', 'failed')
- `results_count` (integer)
- `error` (text)
- `created_at` (timestamptz)

### 2.3. Table `leads`
- `id` (uuid, PK)
- `user_id` (uuid, FK auth.users)
- `search_id` (uuid, FK lead_searches ON DELETE CASCADE)
- `place_id` (text)
- `name` (text)
- `category` (text)
- `address` (text)
- `city` (text)
- `phone` (text)
- `website` (text)
- `rating` (numeric)
- `reviews_count` (integer)
- `maps_url` (text)
- `status` (text: 'new', 'contacted', 'replied', 'converted', 'ignored')
- `notes` (text)
- `converted_client_id` (uuid, FK clients ON DELETE SET NULL)
- `created_at` (timestamptz)
- Contrainte d'unicité : `UNIQUE (user_id, place_id)`

### 2.4. Table `lead_messages`
- `id` (uuid, PK)
- `user_id` (uuid, FK auth.users)
- `lead_id` (uuid, FK leads ON DELETE CASCADE)
- `channel` (text: 'whatsapp', 'email', 'sms')
- `tone` (text: 'professional', 'warm', 'direct')
- `subject` (text)
- `content` (text)
- `model` (text)
- `created_at` (timestamptz)

### 2.5. Sécurité Row Level Security (RLS)
- RLS activé sur 100% des tables avec `auth.uid() = user_id`.

---

## 3. Architecture des Fichiers

```
src/
├── app/
│   ├── api/
│   │   └── leads/
│   │       ├── search/
│   │       │   ├── route.ts          # POST (lancer recherche Apify)
│   │       │   └── [id]/
│   │       │       └── route.ts      # GET (statut et import des leads)
│   │       └── generate/
│   │           └── route.ts          # POST (génération OpenAI de messages)
│   └── leads/
│       └── page.tsx                  # Page principale /leads
├── components/
│   └── leads/
│       ├── LeadSearchForm.tsx        # Formulaire de recherche
│       ├── LeadStatsCards.tsx        # Métriques KPI des prospects
│       ├── LeadFilterTabs.tsx        # Filtres par statut
│       ├── LeadsTable.tsx            # Tableau complet desktop
│       ├── LeadMobileCards.tsx       # Cartes tactiles mobile
│       ├── LeadActionsMenu.tsx       # Menu contextuel 3-points
│       ├── LeadMessageModal.tsx      # Modale de génération / envoi WhatsApp
│       ├── LeadStatusBadge.tsx       # Badges de statut colorés
│       ├── LeadSearchHistoryModal.tsx# Historique des recherches
│       └── BatchActionsBar.tsx       # Barre d'actions groupées
└── lib/
    ├── leads/
    │   ├── apify.ts                  # Client REST Apify Google Maps Places
    │   └── openai.ts                 # Générateur de messages OpenAI structurés
    └── export-utils.ts               # exportLeadsToCSV
```
