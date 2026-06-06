import { describe, expect, it } from "vitest";

import {
  aggregatePositionTotals,
  buildChartPath,
  buildFlatCurrentStatePoints,
  buildLedgerHistoryPoints,
  buildMarketProbabilityData,
  calculateYesChance,
  filterPointsByRange,
  NEUTRAL_YES_CHANCE,
  parseLedgerSide,
  resolveYesChanceFromTotals,
} from "@/lib/markets/probability";

describe("calculateYesChance", () => {
  it("computes Yes chance from aggregate position totals", () => {
    expect(calculateYesChance(7000, 3000)).toBe(70);
    expect(calculateYesChance(2500, 7500)).toBe(25);
  });

  it("returns null when there is no activity", () => {
    expect(calculateYesChance(0, 0)).toBeNull();
  });
});

describe("resolveYesChanceFromTotals", () => {
  it("uses the neutral 50% baseline when totals are unavailable", () => {
    expect(
      resolveYesChanceFromTotals({ yesTotal: 0, noTotal: 0 }, false),
    ).toEqual({
      yesChance: NEUTRAL_YES_CHANCE,
      isNeutralBaseline: true,
    });
  });

  it("uses aggregate totals when they are available", () => {
    expect(
      resolveYesChanceFromTotals({ yesTotal: 6000, noTotal: 4000 }, true),
    ).toEqual({
      yesChance: 60,
      isNeutralBaseline: false,
    });
  });
});

describe("buildMarketProbabilityData", () => {
  const marketCreatedAt = "2026-01-01T00:00:00.000Z";
  const now = "2026-06-01T00:00:00.000Z";

  it("falls back to a flat current-state line without ledger history", () => {
    const result = buildMarketProbabilityData({
      positions: [],
      positionsAvailable: false,
      ledgerEntries: [],
      marketCreatedAt,
      now,
    });

    expect(result.yesChance).toBe(NEUTRAL_YES_CHANCE);
    expect(result.isNeutralBaseline).toBe(true);
    expect(result.isFlatFallback).toBe(true);
    expect(result.points).toEqual([
      { timestamp: marketCreatedAt, yesChance: NEUTRAL_YES_CHANCE },
      { timestamp: now, yesChance: NEUTRAL_YES_CHANCE },
    ]);
  });

  it("uses aggregate positions when they are available", () => {
    const result = buildMarketProbabilityData({
      positions: [
        { yes_shares_cents: 8000, no_shares_cents: 2000 },
        { yes_shares_cents: 1000, no_shares_cents: 1000 },
      ],
      positionsAvailable: true,
      ledgerEntries: [],
      marketCreatedAt,
      now,
    });

    expect(result.yesChance).toBe(75);
    expect(result.isNeutralBaseline).toBe(false);
    expect(result.isFlatFallback).toBe(true);
  });

  it("builds ledger history when enough side information exists", () => {
    const result = buildMarketProbabilityData({
      positions: [{ yes_shares_cents: 5000, no_shares_cents: 5000 }],
      positionsAvailable: true,
      ledgerEntries: [
        {
          amount_cents: 3000,
          created_at: "2026-02-01T00:00:00.000Z",
          description: "Buy Yes shares",
          entry_type: "buy_yes",
          market_id: "market-1",
        },
        {
          amount_cents: 1000,
          created_at: "2026-03-01T00:00:00.000Z",
          description: "Buy No shares",
          entry_type: "buy_no",
          market_id: "market-1",
        },
      ],
      marketCreatedAt,
      now,
    });

    expect(result.isFlatFallback).toBe(false);
    expect(result.points.length).toBeGreaterThan(2);
    expect(result.points.at(-1)?.yesChance).toBe(50);
  });
});

describe("parseLedgerSide", () => {
  it("detects Yes and No activity from entry metadata", () => {
    expect(
      parseLedgerSide({
        entry_type: "buy_yes",
        description: "Market purchase",
      }),
    ).toBe("yes");
    expect(
      parseLedgerSide({ entry_type: "trade", description: "Buy no shares" }),
    ).toBe("no");
    expect(
      parseLedgerSide({ entry_type: "deposit", description: "Funding" }),
    ).toBeNull();
  });
});

describe("buildLedgerHistoryPoints", () => {
  it("returns null when there is not enough ledger history", () => {
    expect(
      buildLedgerHistoryPoints(
        [
          {
            amount_cents: 1000,
            created_at: "2026-02-01T00:00:00.000Z",
            description: "Buy Yes",
            entry_type: "buy_yes",
            market_id: "market-1",
          },
        ],
        "2026-01-01T00:00:00.000Z",
      ),
    ).toBeNull();
  });
});

describe("buildFlatCurrentStatePoints", () => {
  it("creates a stable flat line between market creation and now", () => {
    expect(
      buildFlatCurrentStatePoints(
        "2026-01-01T00:00:00.000Z",
        42,
        "2026-06-01T00:00:00.000Z",
      ),
    ).toEqual([
      { timestamp: "2026-01-01T00:00:00.000Z", yesChance: 42 },
      { timestamp: "2026-06-01T00:00:00.000Z", yesChance: 42 },
    ]);
  });
});

describe("aggregatePositionTotals", () => {
  it("sums yes and no share totals across positions", () => {
    expect(
      aggregatePositionTotals([
        { yes_shares_cents: 1000, no_shares_cents: 500 },
        { yes_shares_cents: 2500, no_shares_cents: 1500 },
      ]),
    ).toEqual({ yesTotal: 3500, noTotal: 2000 });
  });
});

describe("filterPointsByRange", () => {
  const points = [
    { timestamp: "2026-01-01T00:00:00.000Z", yesChance: 50 },
    { timestamp: "2026-05-01T00:00:00.000Z", yesChance: 60 },
    { timestamp: "2026-06-01T00:00:00.000Z", yesChance: 65 },
  ];

  it("keeps all points for the all range", () => {
    expect(
      filterPointsByRange(
        points,
        "all",
        Date.parse("2026-06-15T00:00:00.000Z"),
      ),
    ).toEqual(points);
  });
});

describe("buildChartPath", () => {
  it("renders a non-empty SVG path for chart points", () => {
    const path = buildChartPath(
      buildFlatCurrentStatePoints(
        "2026-01-01T00:00:00.000Z",
        50,
        "2026-06-01T00:00:00.000Z",
      ),
      640,
      220,
    );

    expect(path.startsWith("M")).toBe(true);
    expect(path).toContain("L");
  });
});
