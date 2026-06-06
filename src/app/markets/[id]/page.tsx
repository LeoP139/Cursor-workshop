import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketBuyPlaceholder } from "@/components/marketlab/market-buy-placeholder";
import { MarketDetailInfo } from "@/components/marketlab/market-detail-info";
import { MarketOutcomes } from "@/components/marketlab/market-outcomes";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { getMarketById, getMarketProbability } from "@/lib/markets/queries";

type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    return { title: "Market not found | MarketLab" };
  }

  return {
    title: `${market.title} | MarketLab`,
    description: market.description,
  };
}

export default async function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  const probability = await getMarketProbability(market);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <Link
        href="/markets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to markets
      </Link>

      <div className="space-y-5">
        <MarketDetailInfo market={market} />
        <MarketOutcomes probability={probability} />
        <ProbabilityChart
          probability={probability}
          marketCreatedAt={market.created_at}
        />
        <MarketBuyPlaceholder market={market} />
      </div>
    </main>
  );
}
