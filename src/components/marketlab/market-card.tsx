import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { Button } from "@/components/ui/button";
import { formatCloseDate } from "@/lib/markets/format";
import type { Market } from "@/lib/markets/types";

export function MarketCard({ market }: { market: Market }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <MarketStatusBadge status={market.status} />
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3.5" aria-hidden />
          <span>Closes {formatCloseDate(market.close_date)}</span>
        </p>
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-card-foreground">
        <Link href={`/markets/${market.id}`} className="hover:underline">
          {market.title}
        </Link>
      </h2>

      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
        {market.description || "No description provided."}
      </p>

      <div className="mt-5">
        <Button asChild variant="outline" size="sm">
          <Link href={`/markets/${market.id}`}>
            View market
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
