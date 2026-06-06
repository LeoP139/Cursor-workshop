import type { Profile } from "@/lib/auth/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, balance_cents, first_name, last_name, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load profile", error.message);
    return null;
  }

  return data;
}
