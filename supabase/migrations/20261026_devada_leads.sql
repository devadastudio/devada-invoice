-- Migration: Devada Leads V2
-- Tables: lead_searches, leads, lead_messages + colonnes company_settings

-- 1. Ajout des colonnes métier dans company_settings
ALTER TABLE public.company_settings
ADD COLUMN IF NOT EXISTS business_sector TEXT,
ADD COLUMN IF NOT EXISTS prospecting_pitch TEXT;

-- 2. Table des recherches de prospects (Apify runs)
CREATE TABLE IF NOT EXISTS public.lead_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    city TEXT NOT NULL,
    sender_sector TEXT,
    max_results INTEGER NOT NULL DEFAULT 50,
    apify_run_id TEXT,
    apify_dataset_id TEXT,
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'succeeded', 'failed')),
    results_count INTEGER NOT NULL DEFAULT 0,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Table des prospects (leads)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    search_id UUID REFERENCES public.lead_searches(id) ON DELETE CASCADE,
    place_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    address TEXT,
    city TEXT,
    phone TEXT,
    website TEXT,
    rating NUMERIC(3,2),
    reviews_count INTEGER DEFAULT 0,
    maps_url TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'replied', 'converted', 'ignored')),
    notes TEXT,
    converted_client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT leads_user_place_unique UNIQUE (user_id, place_id)
);

-- 4. Table des messages générés par IA
CREATE TABLE IF NOT EXISTS public.lead_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    channel TEXT NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'email', 'sms')),
    tone TEXT NOT NULL DEFAULT 'professional' CHECK (tone IN ('professional', 'warm', 'direct')),
    subject TEXT,
    content TEXT NOT NULL,
    model TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Index de performance
CREATE INDEX IF NOT EXISTS idx_lead_searches_user_id ON public.lead_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_searches_created_at ON public.lead_searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_search_id ON public.leads(search_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_messages_lead_id ON public.lead_messages(lead_id);

-- 6. Activation de Row Level Security (RLS)
ALTER TABLE public.lead_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_messages ENABLE ROW LEVEL SECURITY;

-- 7. Politiques de sécurité (RLS)
DROP POLICY IF EXISTS "Users can manage their own lead searches" ON public.lead_searches;
CREATE POLICY "Users can manage their own lead searches"
    ON public.lead_searches
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own leads" ON public.leads;
CREATE POLICY "Users can manage their own leads"
    ON public.leads
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own lead messages" ON public.lead_messages;
CREATE POLICY "Users can manage their own lead messages"
    ON public.lead_messages
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
