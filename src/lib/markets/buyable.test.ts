import { describe, expect, it } from "vitest";

import { isMarketBuyable } from "@/lib/markets/buyable";

describe("isMarketBuyable", () => {
  it("returns true for open markets without a close date", () => {
    expect(isMarketBuyable({ status: "open", close_date: null })).toBe(true);
  });

  it("returns true for open markets with a future close date", () => {
    const future = new Date(Date.now() + 86_400_000).toISOString();
    expect(isMarketBuyable({ status: "open", close_date: future })).toBe(true);
  });

  it("returns false for closed or resolved markets", () => {
    expect(isMarketBuyable({ status: "closed", close_date: null })).toBe(false);
    expect(isMarketBuyable({ status: "resolved", close_date: null })).toBe(
      false,
    );
  });

  it("returns false when the close date has passed", () => {
    const past = new Date(Date.now() - 86_400_000).toISOString();
    expect(isMarketBuyable({ status: "open", close_date: past })).toBe(false);
  });
});
