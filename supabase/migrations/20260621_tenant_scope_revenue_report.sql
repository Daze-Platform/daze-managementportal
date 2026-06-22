-- Tenant-scope the get_revenue_report RPC.
--
-- Why: the previous signature accepted only p_store_ids + date range and trusted the caller
-- to pass tenant-scoped store ids. With the publishable anon key bundled in every Mgmt Hub
-- deploy, a curious authenticated user could call the RPC with any store_id and read other
-- tenants' revenue. This adds an explicit tenant authorization check + filters at the
-- DB layer regardless of what the caller passes.
--
-- This is a Tier 3 change per /daze-repair taxonomy (touches RLS-adjacent SQL on the shared
-- kzdmxwggbwmmhwjahrdy Supabase project). Apply ONLY after Angelo's explicit per-message yes.
--
-- Backward compatibility: this DROPS the old signature and creates a new one. The frontend
-- (src/hooks/useReportsData.ts) is updated in the same PR to pass p_tenant_id. Any other
-- callsites of the old signature will BREAK after this migration applies — verify none exist
-- before applying.

BEGIN;

-- Drop the old, tenant-blind signature.
DROP FUNCTION IF EXISTS public.get_revenue_report(int[], timestamptz, timestamptz);

-- Create the tenant-aware version. SECURITY DEFINER so the authorization check runs as the
-- function owner; the function itself enforces tenant access via the user_tenants check.
CREATE OR REPLACE FUNCTION public.get_revenue_report(
    p_tenant_id uuid,
    p_store_ids int[],
    p_start_date timestamptz,
    p_end_date timestamptz
)
RETURNS TABLE(
    period text,
    total_revenue numeric,
    total_orders bigint,
    average_order_value numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Authorization: caller must be a member of the tenant they're asking about.
    IF NOT EXISTS (
        SELECT 1 FROM public.user_tenants
        WHERE user_id = auth.uid()
          AND tenant_id = p_tenant_id
    ) THEN
        RAISE EXCEPTION 'unauthorized: user is not a member of tenant %', p_tenant_id
            USING ERRCODE = '42501';
    END IF;

    RETURN QUERY
    SELECT
        TO_CHAR(DATE(o.created_at), 'YYYY-MM-DD') AS period,
        SUM(o.total) AS total_revenue,
        COUNT(o.id) AS total_orders,
        CASE
            WHEN COUNT(o.id) > 0 THEN SUM(o.total) / COUNT(o.id)
            ELSE 0
        END AS average_order_value
    FROM
        public.orders o
    INNER JOIN
        public.stores s ON o.store_id = s.id
    WHERE
        s.tenant_id = p_tenant_id                              -- DB-layer tenant filter (defense in depth)
        AND (p_store_ids IS NULL OR o.store_id = ANY(p_store_ids))
        AND o.created_at >= p_start_date
        AND o.created_at <= p_end_date
    GROUP BY
        DATE(o.created_at)
    ORDER BY
        DATE(o.created_at);
END;
$$;

COMMENT ON FUNCTION public.get_revenue_report(uuid, int[], timestamptz, timestamptz) IS
    'Tenant-scoped revenue report. Caller must be a member of p_tenant_id (verified via user_tenants). Orders are filtered to stores belonging to that tenant, regardless of what p_store_ids contains. Replaces the prior tenant-blind signature on 2026-06-21.';

-- Grant execute to the authenticated role (RPC default).
GRANT EXECUTE ON FUNCTION public.get_revenue_report(uuid, int[], timestamptz, timestamptz)
    TO authenticated;

COMMIT;

-- POST-APPLY VERIFICATION (run manually after commit):
--
-- 1. As an Émera-tenant user: should return only Émera revenue.
-- 2. As an Innisfree-tenant user: should return only Innisfree revenue.
-- 3. As an Émera user passing an Innisfree tenant_id: should ERROR with 'unauthorized'.
-- 4. Without any user_tenants row: should ERROR.
--
-- ROLLBACK (only if applied breaks production):
--
-- BEGIN;
-- DROP FUNCTION IF EXISTS public.get_revenue_report(uuid, int[], timestamptz, timestamptz);
-- -- Re-create the old signature exactly as it was in 20260315_get_revenue_report.sql
-- CREATE OR REPLACE FUNCTION public.get_revenue_report(p_store_ids int[], p_start_date timestamptz, p_end_date timestamptz)
-- RETURNS TABLE(period text, total_revenue numeric, total_orders bigint, average_order_value numeric)
-- AS $$
-- BEGIN
--     RETURN QUERY
--     SELECT TO_CHAR(DATE(o.created_at), 'YYYY-MM-DD'),
--            SUM(o.total),
--            COUNT(o.id),
--            CASE WHEN COUNT(o.id) > 0 THEN SUM(o.total) / COUNT(o.id) ELSE 0 END
--     FROM public.orders o
--     WHERE (p_store_ids IS NULL OR o.store_id = ANY(p_store_ids))
--       AND o.created_at >= p_start_date AND o.created_at <= p_end_date
--     GROUP BY DATE(o.created_at) ORDER BY DATE(o.created_at);
-- END;
-- $$ LANGUAGE plpgsql;
-- COMMIT;
--
-- AND rollback the frontend change in src/hooks/useReportsData.ts to remove the p_tenant_id arg.

-- SEPARATE FOLLOW-UP NEEDED (NOT FIXED IN THIS MIGRATION):
--
-- The frontend src/hooks/useReportsData.ts also calls three RPCs that DO NOT have migration
-- files in this repo: get_product_mix_report, get_customer_analytics_report, get_payment_types_report.
-- These likely exist in production Supabase via schema drift, OR they error silently.
--
-- BEFORE marking reports surface "tenant-safe", Angelo should:
--   a) Query the prod schema for these functions via Supabase MCP:
--      SELECT proname, pg_get_function_identity_arguments(oid) FROM pg_proc WHERE proname LIKE 'get_%_report';
--   b) Capture their current source via pg_get_functiondef()
--   c) Apply the same tenant-scoping pattern to each in a follow-up migration
--
-- Until then, those three reports are still tenant-blind in prod. Document this gap in the
-- operator demo handoff.
