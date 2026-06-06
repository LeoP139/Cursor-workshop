import { EmptyMarkets } from "@/components/marketlab/empty-markets";
import { MarketCard } from "@/components/marketlab/market-card";
import { getMarkets } from "@/lib/markets/queries";

export const metadata = {
  title: "Markets | MarketLab",
  description: "Browse fictional Yes/No markets using fake money.",
};

export default async function MarketsPage() {
  const markets = await getMarkets();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Markets</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Browse fictional Yes/No markets using fake money. Pick a market to see
          details, outcomes, and the current Yes probability chart.
        </p>
      </div>

      {markets.length === 0 ? (
        <EmptyMarkets />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </main>
  );
}
