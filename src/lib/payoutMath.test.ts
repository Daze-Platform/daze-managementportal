import { describe, it, expect } from "vitest";
import {
  formatMoney,
  mapStatus,
  serviceFeeCents,
  accruedServiceFeeCents,
} from "./payoutMath";

describe("formatMoney", () => {
  it("formats whole and fractional dollars", () => {
    expect(formatMoney(0)).toBe("$0.00");
    expect(formatMoney(5)).toBe("$0.05");
    expect(formatMoney(1234)).toBe("$12.34");
  });
  it("adds thousands separators", () => {
    expect(formatMoney(100000)).toBe("$1,000.00");
    expect(formatMoney(123456789)).toBe("$1,234,567.89");
  });
});

describe("mapStatus", () => {
  it("maps completed/delivered to Succeeded (case-insensitive)", () => {
    expect(mapStatus("completed")).toBe("Succeeded");
    expect(mapStatus("delivered")).toBe("Succeeded");
    expect(mapStatus("DELIVERED")).toBe("Succeeded");
  });
  it("maps cancelled/canceled/failed to Failed", () => {
    expect(mapStatus("cancelled")).toBe("Failed");
    expect(mapStatus("canceled")).toBe("Failed");
    expect(mapStatus("failed")).toBe("Failed");
  });
  it("defaults everything else to Pending", () => {
    expect(mapStatus("pending")).toBe("Pending");
    expect(mapStatus("preparing")).toBe("Pending");
    expect(mapStatus("")).toBe("Pending");
  });
});

describe("serviceFeeCents", () => {
  it("uses the recorded platform fee when present", () => {
    expect(serviceFeeCents({ platform_fee_cents: 250, subtotal_cents: 1000 })).toBe(250);
  });

  // The money-correctness guard: a recorded fee of 0 is a REAL $0 fee. Using `||`
  // here instead of `??` would wrongly fall back to 10% and over-invoice.
  it("keeps a recorded fee of 0 — does NOT fall back to 10%", () => {
    expect(serviceFeeCents({ platform_fee_cents: 0, subtotal_cents: 1000 })).toBe(0);
  });

  it("falls back to 10% of subtotal only when the fee is missing (legacy orders)", () => {
    expect(serviceFeeCents({ platform_fee_cents: null, subtotal_cents: 2000 })).toBe(200);
    // 1995 * 0.10 = 199.5, rounds to 200
    expect(serviceFeeCents({ platform_fee_cents: null, subtotal_cents: 1995 })).toBe(200);
  });

  it("treats a missing subtotal as 0", () => {
    expect(serviceFeeCents({ platform_fee_cents: null, subtotal_cents: null })).toBe(0);
  });
});

describe("accruedServiceFeeCents", () => {
  it("sums the per-order fees into the invoice amount (incl. a $0 order)", () => {
    expect(accruedServiceFeeCents([100, 250, 0, 75])).toBe(425);
  });
  it("is 0 when there are no paid orders", () => {
    expect(accruedServiceFeeCents([])).toBe(0);
  });
});
