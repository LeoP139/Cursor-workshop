"use client";

import { useMemo, useState } from "react";

import {
  buildChartPath,
  type ChartRange,
  filterPointsByRange,
} from "@/lib/markets/probability";
import type { MarketProbabilityData } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

const RANGES: { label: string; value: ChartRange }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "All", value: "all" },
];

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;

export function ProbabilityChart({
  probability,
  marketCreatedAt,
}: {
  probability: MarketProbabilityData;
  marketCreatedAt: string;
}) {
  const [range, setRange] = useState<ChartRange>("all");

  const visiblePoints = useMemo(
    () => filterPointsByRange(probability.points, range),
    [probability.points, range],
  );

  const path = useMemo(
    () => buildChartPath(visiblePoints, CHART_WIDTH, CHART_HEIGHT),
    [visiblePoints],
  );

  const startLabel = formatAxisDate(
    visiblePoints[0]?.timestamp ?? marketCreatedAt,
  );
  const endLabel = formatAxisDate(
    visiblePoints.at(-1)?.timestamp ?? new Date().toISOString(),
  );

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-card-foreground">
            Yes probability
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {probability.isFlatFallback
              ? "Current market balance shown as a flat line because historical ledger activity is not available yet."
              : "Historical Yes chance reconstructed from ledger activity."}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {RANGES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                range === item.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label={`Yes probability chart at ${probability.yesChance.toFixed(1)} percent`}
          className="h-auto w-full min-w-[280px] text-foreground"
        >
          <title>Yes probability over time</title>
          {[0, 25, 50, 75, 100].map((tick) => {
            const y =
              12 + (CHART_HEIGHT - 40) - (tick / 100) * (CHART_HEIGHT - 40);
            return (
              <g key={tick}>
                <line
                  x1={36}
                  x2={CHART_WIDTH - 12}
                  y1={y}
                  y2={y}
                  className="stroke-border"
                  strokeWidth={1}
                  strokeDasharray={tick === 50 ? "0" : "4 4"}
                />
                <text
                  x={30}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px]"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          <path
            d={path}
            fill="none"
            className="stroke-emerald-500 dark:stroke-emerald-400"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text
            x={36}
            y={CHART_HEIGHT - 8}
            className="fill-muted-foreground text-[10px]"
          >
            {startLabel}
          </text>
          <text
            x={CHART_WIDTH - 12}
            y={CHART_HEIGHT - 8}
            textAnchor="end"
            className="fill-muted-foreground text-[10px]"
          >
            {endLabel}
          </text>
        </svg>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Current Yes chance:{" "}
        <span className="font-medium text-foreground tabular-nums">
          {probability.yesChance.toFixed(1)}%
        </span>
        {probability.isNeutralBaseline ? " (neutral baseline)" : null}
      </p>
    </section>
  );
}

function formatAxisDate(timestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}
