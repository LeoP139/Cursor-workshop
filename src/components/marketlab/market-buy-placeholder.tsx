import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isMarketBuyable } from "@/lib/markets/buyable";
import type { Market } from "@/lib/markets/types";

export function MarketBuyPlaceholder({ market }: { market: Market }) {
  const buyable = isMarketBuyable(market);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-card-foreground">
        Place a trade
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Buying and selling will be enabled in a later workshop step.
      </p>

      {buyable ? (
        <Button className="mt-4" disabled>
          Buy Yes / No (coming soon)
        </Button>
      ) : (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>Buying is unavailable while this market is closed or resolved.</p>
        </div>
      )}
    </section>
  );
}
