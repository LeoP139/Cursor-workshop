"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  AuthCard,
  AuthField,
  AuthMessage,
} from "@/components/marketlab/auth-form";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <AuthCard
      title="Sign in"
      description="Use your workshop email and password to access your fake balance."
      footer={
        <>
          Need an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        {state?.error ? (
          <AuthMessage tone="error">{state.error}</AuthMessage>
        ) : null}

        <AuthField
          id="login-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
        />
        <AuthField
          id="login-password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
