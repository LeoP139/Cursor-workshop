"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  AuthCard,
  AuthField,
  AuthMessage,
} from "@/components/marketlab/auth-form";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth/actions";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, null);

  if (state?.needsEmailConfirmation) {
    return (
      <AuthCard
        title="Check your email"
        description="We sent a confirmation link to finish creating your account."
        footer={
          <>
            Already confirmed?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </>
        }
      >
        <AuthMessage tone="success">
          Confirm your email, then sign in to see your fake balance in the
          header.
        </AuthMessage>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create account"
      description="Sign up with your name so MarketLab can create your profile and starting balance."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        {state?.error ? (
          <AuthMessage tone="error">{state.error}</AuthMessage>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            id="signup-first-name"
            label="First name"
            name="first_name"
            autoComplete="given-name"
          />
          <AuthField
            id="signup-last-name"
            label="Last name"
            name="last_name"
            autoComplete="family-name"
          />
        </div>
        <AuthField
          id="signup-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
        />
        <AuthField
          id="signup-password"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </AuthCard>
  );
}
