CREATE OR REPLACE FUNCTION get_revenue_report(
    p_store_ids INT[],
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS TABLE(
    period TEXT,
    total_revenue NUMERIC,
    total_orders BIGINT,
    average_order_value NUMERIC
) AS $$
BEGIN
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
    WHERE
        (p_store_ids IS NULL OR o.store_id = ANY(p_store_ids)) AND
        o.created_at >= p_start_date AND
        o.created_at <= p_end_date
    GROUP BY
        DATE(o.created_at)
    ORDER BY
        DATE(o.created_at);
END;
$$ LANGUAGE plpgsql;