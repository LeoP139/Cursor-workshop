import type { MarketProbabilityData } from "@/lib/markets/types";

export function MarketOutcomes({
  probability,
}: {
  probability: MarketProbabilityData;
}) {
  const noChance = 100 - probability.yesChance;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-card-foreground">Outcomes</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Current market balance across Yes and No shares.
        {probability.isNeutralBaseline
          ? " Using a neutral 50% baseline because no market-wide activity is available yet."
          : null}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <OutcomeCard
          label="Yes"
          chance={probability.yesChance}
          accentClassName="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        />
        <OutcomeCard
          label="No"
          chance={noChance}
          accentClassName="border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
        />
      </div>
    </section>
  );
}

function OutcomeCard({
  label,
  chance,
  accentClassName,
}: {
  label: string;
  chance: number;
  accentClassName: string;
}) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${accentClassName}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">
        {chance.toFixed(1)}%
      </p>
    </div>
  );
}
