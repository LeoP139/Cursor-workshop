import type {
  MarketProbabilityData,
  ProbabilityPoint,
} from "@/lib/markets/types";
import type { Tables } from "@/lib/supabase/database.types";

/** Neutral baseline when market-wide Yes/No activity is unavailable. */
export const NEUTRAL_YES_CHANCE = 50;

type PositionRow = Pick<
  Tables<"positions">,
  "yes_shares_cents" | "no_shares_cents"
>;

type LedgerRow = Pick<
  Tables<"ledger_entries">,
  "amount_cents" | "created_at" | "description" | "entry_type" | "market_id"
>;

export function aggregatePositionTotals(positions: PositionRow[]) {
  return positions.reduce(
    (totals, position) => ({
      yesTotal: totals.yesTotal + position.yes_shares_cents,
      noTotal: totals.noTotal + position.no_shares_cents,
    }),
    { yesTotal: 0, noTotal: 0 },
  );
}

export function calculateYesChance(
  yesTotal: number,
  noTotal: number,
): number | null {
  const combined = yesTotal + noTotal;
  if (combined <= 0) {
    return null;
  }

  return (yesTotal / combined) * 100;
}

export function resolveYesChanceFromTotals(
  totals: { yesTotal: number; noTotal: number },
  available: boolean,
): { yesChance: number; isNeutralBaseline: boolean } {
  if (!available) {
    return { yesChance: NEUTRAL_YES_CHANCE, isNeutralBaseline: true };
  }

  const computed = calculateYesChance(totals.yesTotal, totals.noTotal);
  if (computed === null) {
    return { yesChance: NEUTRAL_YES_CHANCE, isNeutralBaseline: true };
  }

  return { yesChance: computed, isNeutralBaseline: false };
}

export function parseLedgerSide(
  entry: Pick<LedgerRow, "entry_type" | "description">,
): "yes" | "no" | null {
  const entryType = entry.entry_type.toLowerCase();
  const description = (entry.description ?? "").toLowerCase();

  const mentionsYes =
    entryType.includes("yes") ||
    /\byes\b/.test(description) ||
    description.includes("yes shares");
  const mentionsNo =
    entryType.includes("no") ||
    /\bno\b/.test(description) ||
    description.includes("no shares");

  if (mentionsYes && !mentionsNo) {
    return "yes";
  }

  if (mentionsNo && !mentionsYes) {
    return "no";
  }

  return null;
}

export function buildLedgerHistoryPoints(
  entries: LedgerRow[],
  marketCreatedAt: string,
): ProbabilityPoint[] | null {
  const marketEntries = entries
    .filter((entry) => entry.market_id !== null)
    .map((entry) => ({ entry, side: parseLedgerSide(entry) }))
    .filter(
      (
        item,
      ): item is {
        entry: LedgerRow;
        side: "yes" | "no";
      } => item.side !== null,
    )
    .sort(
      (left, right) =>
        new Date(left.entry.created_at).getTime() -
        new Date(right.entry.created_at).getTime(),
    );

  if (marketEntries.length < 2) {
    return null;
  }

  let yesTotal = 0;
  let noTotal = 0;
  const points: ProbabilityPoint[] = [
    {
      timestamp: marketCreatedAt,
      yesChance: NEUTRAL_YES_CHANCE,
    },
  ];

  for (const { entry, side } of marketEntries) {
    const amount = Math.abs(entry.amount_cents);
    if (side === "yes") {
      yesTotal += amount;
    } else {
      noTotal += amount;
    }

    const yesChance =
      calculateYesChance(yesTotal, noTotal) ?? NEUTRAL_YES_CHANCE;
    points.push({
      timestamp: entry.created_at,
      yesChance,
    });
  }

  return points;
}

export function buildFlatCurrentStatePoints(
  marketCreatedAt: string,
  yesChance: number,
  endTimestamp = new Date().toISOString(),
): ProbabilityPoint[] {
  return [
    { timestamp: marketCreatedAt, yesChance },
    { timestamp: endTimestamp, yesChance },
  ];
}

export function buildMarketProbabilityData(input: {
  positions: PositionRow[];
  positionsAvailable: boolean;
  ledgerEntries: LedgerRow[];
  marketCreatedAt: string;
  now?: string;
}): MarketProbabilityData {
  const totals = aggregatePositionTotals(input.positions);
  const { yesChance, isNeutralBaseline } = resolveYesChanceFromTotals(
    totals,
    input.positionsAvailable,
  );

  const ledgerPoints = buildLedgerHistoryPoints(
    input.ledgerEntries,
    input.marketCreatedAt,
  );

  if (ledgerPoints) {
    const lastPoint = ledgerPoints.at(-1);
    if (lastPoint) {
      lastPoint.yesChance = yesChance;
    }

    return {
      yesChance,
      isNeutralBaseline,
      points: ledgerPoints,
      isFlatFallback: false,
    };
  }

  return {
    yesChance,
    isNeutralBaseline,
    points: buildFlatCurrentStatePoints(
      input.marketCreatedAt,
      yesChance,
      input.now,
    ),
    isFlatFallback: true,
  };
}

export type ChartRange = "7d" | "30d" | "all";

export function filterPointsByRange(
  points: ProbabilityPoint[],
  range: ChartRange,
  now = Date.now(),
): ProbabilityPoint[] {
  if (range === "all" || points.length === 0) {
    return points;
  }

  const rangeMs =
    range === "7d" ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const cutoff = now - rangeMs;

  const filtered = points.filter(
    (point) => new Date(point.timestamp).getTime() >= cutoff,
  );

  if (filtered.length >= 2) {
    return filtered;
  }

  return points;
}

export function buildChartPath(
  points: ProbabilityPoint[],
  width: number,
  height: number,
  padding = { top: 12, right: 12, bottom: 28, left: 36 },
): string {
  if (points.length === 0) {
    return "";
  }

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const timestamps = points.map((point) => new Date(point.timestamp).getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  const timeSpan = Math.max(maxTime - minTime, 1);

  const coordinates = points.map((point, index) => {
    const time = new Date(point.timestamp).getTime();
    const x = padding.left + ((time - minTime) / timeSpan) * plotWidth;
    const y = padding.top + plotHeight - (point.yesChance / 100) * plotHeight;

    return { x, y, index };
  });

  return coordinates
    .map((coordinate, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${coordinate.x.toFixed(2)},${coordinate.y.toFixed(2)}`;
    })
    .join(" ");
}
