CREATE TABLE IF NOT EXISTS pos_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  store_slug TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'omnivore',
  location_id TEXT,
  api_key TEXT,
  account_id TEXT,
  ordering_api_base TEXT,
  env TEXT NOT NULL DEFAULT 'sandbox' CHECK (env IN ('sandbox', 'production')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, store_slug)
);

ALTER TABLE pos_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_access" ON pos_configs
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()
    )
  );

-- Anon policy so dev/staging works without full auth
CREATE POLICY "pos_configs_anon_select" ON pos_configs
  FOR SELECT TO anon USING (true);

-- Seed Piazza Pizza sandbox config
INSERT INTO pos_configs (tenant_id, store_slug, provider, location_id, api_key, account_id, ordering_api_base, env)
SELECT 
  id as tenant_id,
  'piazza-pizza' as store_slug,
  'omnivore' as provider,
  'cgX7Lndi' as location_id,
  '8a4ff5cff50a4afba41c2b1b4e7cd78a' as api_key,
  'AixdjR9i' as account_id,
  'https://daze-piazza-pizza.vercel.app' as ordering_api_base,
  'sandbox' as env
FROM tenants WHERE slug = 'innisfree-hotels'
ON CONFLICT (tenant_id, store_slug) DO NOTHING;
