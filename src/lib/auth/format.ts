export function formatFakeBalance(balanceCents: number): string {
  const dollars = balanceCents / 100;

  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars)} fake`;
}

export function formatFakeBalanceCents(balanceCents: number): string {
  return `${new Intl.NumberFormat("en-US").format(balanceCents)} fake cents`;
}

export function getBalanceDisplayLabel(
  profile: { balance_cents: number } | null,
): string {
  if (!profile) {
    return "Balance unavailable";
  }

  return formatFakeBalance(profile.balance_cents);
}
