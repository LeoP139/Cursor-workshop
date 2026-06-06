import type { MarketStatus } from "@/lib/markets/types";

const STATUS_LABELS: Record<MarketStatus, string> = {
  open: "Open",
  closed: "Closed",
  resolved: "Resolved",
};

export function formatMarketStatus(status: MarketStatus): string {
  return STATUS_LABELS[status];
}

export function formatCloseDate(closeDate: string | null): string {
  if (!closeDate) {
    return "No close date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(closeDate));
}

export function statusBadgeClassName(status: MarketStatus): string {
  switch (status) {
    case "open":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "closed":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "resolved":
      return "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  }
}
