import { describe, expect, it } from "vitest";

import {
  formatFakeBalance,
  formatFakeBalanceCents,
  getBalanceDisplayLabel,
} from "@/lib/auth/format";

describe("formatFakeBalance", () => {
  it("formats cents as fake dollars", () => {
    expect(formatFakeBalance(1000)).toBe("$10.00 fake");
    expect(formatFakeBalance(1000000)).toBe("$10,000.00 fake");
  });
});

describe("formatFakeBalanceCents", () => {
  it("formats raw cents with a fake cents suffix", () => {
    expect(formatFakeBalanceCents(1000)).toBe("1,000 fake cents");
  });
});

describe("getBalanceDisplayLabel", () => {
  it("shows a friendly unavailable label when profile is missing", () => {
    expect(getBalanceDisplayLabel(null)).toBe("Balance unavailable");
  });

  it("shows formatted fake balance when profile exists", () => {
    expect(getBalanceDisplayLabel({ balance_cents: 1000000 })).toBe(
      "$10,000.00 fake",
    );
  });
});
