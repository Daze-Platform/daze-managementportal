-- =============================================
-- TENANTS: Company entities (Innisfree Hotels, PBR, etc.)
-- =============================================
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  logo text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- USER_TENANTS: Maps auth users to their tenant
-- =============================================
CREATE TABLE IF NOT EXISTS user_tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role text DEFAULT 'manager',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

-- =============================================
-- Add tenant_id to resorts (which company owns which resort)
-- =============================================
ALTER TABLE resorts ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id);

-- =============================================
-- Add tenant_id to stores (which company owns which store)
-- =============================================
ALTER TABLE stores ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id);

-- =============================================
-- STORE_RESORT_LINKS: Many-to-many — which stores serve which resorts
-- A store like Piazza Pizza (standalone) can serve multiple resorts
-- =============================================
CREATE TABLE IF NOT EXISTS store_resort_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id integer NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  resort_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(store_id, resort_id)
);

-- Enable RLS (but keep policies permissive for now)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_resort_links ENABLE ROW LEVEL SECURITY;

-- Permissive policies for authenticated users (will tighten later)
CREATE POLICY "tenants_select" ON tenants FOR SELECT TO authenticated USING (true);
CREATE POLICY "tenants_all" ON tenants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "user_tenants_select" ON user_tenants FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_tenants_all" ON user_tenants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "store_resort_links_select" ON store_resort_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "store_resort_links_all" ON store_resort_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also add anon policies so the app works without auth in dev
CREATE POLICY "tenants_anon_select" ON tenants FOR SELECT TO anon USING (true);
CREATE POLICY "user_tenants_anon_select" ON user_tenants FOR SELECT TO anon USING (true);
CREATE POLICY "store_resort_links_anon_select" ON store_resort_links FOR SELECT TO anon USING (true);
