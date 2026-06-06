import { describe, expect, it } from "vitest";

import {
  formatCloseDate,
  formatMarketStatus,
  statusBadgeClassName,
} from "@/lib/markets/format";

describe("formatMarketStatus", () => {
  it("maps market statuses to readable labels", () => {
    expect(formatMarketStatus("open")).toBe("Open");
    expect(formatMarketStatus("closed")).toBe("Closed");
    expect(formatMarketStatus("resolved")).toBe("Resolved");
  });
});

describe("formatCloseDate", () => {
  it("returns a friendly label when no close date exists", () => {
    expect(formatCloseDate(null)).toBe("No close date");
  });

  it("formats close dates for display", () => {
    const formatted = formatCloseDate("2026-12-31T18:00:00.000Z");
    expect(formatted).toContain("2026");
  });
});

describe("statusBadgeClassName", () => {
  it("returns distinct classes per status", () => {
    expect(statusBadgeClassName("open")).toContain("emerald");
    expect(statusBadgeClassName("closed")).toContain("amber");
    expect(statusBadgeClassName("resolved")).toContain("sky");
  });
});
