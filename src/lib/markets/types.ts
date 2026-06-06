import type { Tables } from "@/lib/supabase/database.types";

export type Market = Tables<"markets">;

export type MarketStatus = Market["status"];

export type ProbabilityPoint = {
  timestamp: string;
  yesChance: number;
};

export type MarketProbabilityData = {
  yesChance: number;
  isNeutralBaseline: boolean;
  points: ProbabilityPoint[];
  isFlatFallback: boolean;
};
