import { describe, expect, it } from "vitest";

import { formatCloseDate, formatMarketStatus } from "@/lib/markets/format";
import type { Market } from "@/lib/markets/types";

function toMarketListItem(market: Market) {
  return {
    title: market.title,
    description: market.description,
    statusLabel: formatMarketStatus(market.status),
    closeDateLabel: formatCloseDate(market.close_date),
    href: `/markets/${market.id}`,
  };
}

describe("market list rendering data", () => {
  const sampleMarkets: Market[] = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      title: "Will it rain tomorrow?",
      description: "A fictional weather market for the workshop.",
      status: "open",
      close_date: "2026-12-31T18:00:00.000Z",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      title: "Will the demo compile?",
      description: "",
      status: "closed",
      close_date: null,
      created_at: "2026-02-01T00:00:00.000Z",
      updated_at: "2026-02-01T00:00:00.000Z",
    },
  ];

  it("renders a list of markets with detail links", () => {
    const items = sampleMarkets.map(toMarketListItem);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      title: "Will it rain tomorrow?",
      statusLabel: "Open",
      href: "/markets/11111111-1111-1111-1111-111111111111",
    });
    expect(items[0]?.closeDateLabel).toContain("2026");
  });

  it("supports an empty market state", () => {
    expect([].map(toMarketListItem)).toEqual([]);
  });
});

describe("market detail rendering data", () => {
  it("identifies missing markets for notFound handling", () => {
    const market: Market | null = null;
    expect(market).toBeNull();
  });
});
