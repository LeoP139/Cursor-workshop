import type { Tables } from "@/lib/supabase/database.types";

export type Profile = Tables<"profiles">;

export type AuthActionState = {
  error?: string;
  needsEmailConfirmation?: boolean;
};
