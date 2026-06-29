/**
 * Pure money math for the Payouts page — extracted so it is unit-testable.
 *
 * The number that matters: what Daze invoices a merchant = the platform service
 * fee actually COLLECTED on PAID orders. The Payouts query already filters to
 * payment_status='paid'; these helpers compute the per-order fee and the total.
 */

export type PayoutStatus = "Succeeded" | "Pending" | "Failed";

/** Format integer cents as a USD string. 1234 -> "$12.34". */
export function formatMoney(cents: number): string {
  return (
    "$" +
    (cents / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/** Map a Daze order fulfillment status to the payout display status. */
export function mapStatus(status: string): PayoutStatus {
  const s = (status ?? "").toLowerCase();
  if (s === "completed" || s === "delivered") return "Succeeded";
  if (s === "cancelled" || s === "canceled" || s === "failed") return "Failed";
  return "Pending";
}

export interface FeeRow {
  platform_fee_cents: number | null;
  subtotal_cents: number | null;
}

/**
 * The service fee Daze collected on a single order. Uses the ACTUAL recorded
 * `platform_fee_cents` (source of truth — set by route-order-to-square, honors
 * per-tenant rate), falling back to a flat 10% of subtotal ONLY for legacy paid
 * orders that predate the field.
 *
 * Note the `??`: a recorded fee of 0 is a real $0 fee and is kept as-is — it must
 * NOT trigger the 10% fallback (which `||` would wrongly do).
 */
export function serviceFeeCents(row: FeeRow): number {
  return row.platform_fee_cents ?? Math.round((row.subtotal_cents ?? 0) * 0.1);
}

/**
 * The accrued total to invoice = sum of the per-order service fees.
 * Callers pass the fees of already-paid orders; unpaid orders collected no fee
 * and must never be included.
 */
export function accruedServiceFeeCents(feeCents: number[]): number {
  return feeCents.reduce((sum, c) => sum + c, 0);
}
