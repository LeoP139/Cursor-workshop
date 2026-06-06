import { Calendar } from "lucide-react";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { formatCloseDate } from "@/lib/markets/format";
import type { Market } from "@/lib/markets/types";

export function MarketDetailInfo({ market }: { market: Market }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <MarketStatusBadge status={market.status} />
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="size-4" aria-hidden />
          <span>Closes {formatCloseDate(market.close_date)}</span>
        </p>
      </div>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
        {market.title}
      </h1>

      <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
        {market.description || "No description provided."}
      </p>
    </section>
  );
}
