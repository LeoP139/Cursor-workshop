"use server";

import { redirect } from "next/navigation";

import type { AuthActionState } from "@/lib/auth/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function readRequiredField(formData: FormData, name: string): string | null {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function signIn(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readRequiredField(formData, "email");
  const password = readRequiredField(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/markets");
}

export async function signUp(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readRequiredField(formData, "email");
  const password = readRequiredField(formData, "password");
  const firstName = readRequiredField(formData, "first_name");
  const lastName = readRequiredField(formData, "last_name");

  if (!email || !password || !firstName || !lastName) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    redirect("/markets");
  }

  return { needsEmailConfirmation: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  await supabase.auth.signOut();
  redirect("/");
}
