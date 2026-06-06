import { buildMarketProbabilityData } from "@/lib/markets/probability";
import type { Market, MarketProbabilityData } from "@/lib/markets/types";
import type { Tables } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type PositionRow = Pick<
  Tables<"positions">,
  "yes_shares_cents" | "no_shares_cents"
>;

type LedgerRow = Pick<
  Tables<"ledger_entries">,
  "amount_cents" | "created_at" | "description" | "entry_type" | "market_id"
>;

export async function getMarkets(): Promise<Market[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load markets: ${error.message}`);
  }

  return data ?? [];
}

export async function getMarketById(id: string): Promise<Market | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load market: ${error.message}`);
  }

  return data;
}

/**
 * Market-wide position totals require reading every participant's row.
 * Current RLS only allows authenticated users to read their own positions,
 * so the publishable client cannot produce a market aggregate here.
 */
export async function getMarketPositionTotals(
  _marketId: string,
): Promise<{ positions: PositionRow[]; available: boolean }> {
  return { positions: [], available: false };
}

/**
 * Market-level ledger history requires aggregate access to every participant's
 * entries. Current RLS only exposes a user's own ledger rows to that user.
 */
export async function getMarketLedgerEntries(
  _marketId: string,
): Promise<LedgerRow[]> {
  return [];
}

export async function getMarketProbability(
  market: Market,
): Promise<MarketProbabilityData> {
  const [{ positions, available }, ledgerEntries] = await Promise.all([
    getMarketPositionTotals(market.id),
    getMarketLedgerEntries(market.id),
  ]);

  return buildMarketProbabilityData({
    positions,
    positionsAvailable: available,
    ledgerEntries,
    marketCreatedAt: market.created_at,
  });
}
