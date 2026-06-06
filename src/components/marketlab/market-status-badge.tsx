import { formatMarketStatus, statusBadgeClassName } from "@/lib/markets/format";
import type { MarketStatus } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

export function MarketStatusBadge({ status }: { status: MarketStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusBadgeClassName(status),
      )}
    >
      {formatMarketStatus(status)}
    </span>
  );
}
