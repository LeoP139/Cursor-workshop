import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/marketlab/sign-out-button";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { getBalanceDisplayLabel } from "@/lib/auth/format";
import { getCurrentUserProfile } from "@/lib/auth/queries";
import { getAuthUser } from "@/lib/auth/session";
import type { Profile } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

type HeaderProps = {
  activePath?: "home" | "markets";
  userEmail?: string | null;
  profile?: Profile | null;
};

export function Header({ activePath, userEmail, profile }: HeaderProps) {
  const isSignedIn = Boolean(userEmail);
  const balanceLabel = getBalanceDisplayLabel(profile ?? null);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            MarketLab
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-1">
            <NavLink href="/markets" active={activePath === "markets"}>
              Markets
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <div className="rounded-lg border border-border bg-muted/40 px-2 py-1.5 text-xs sm:px-3 sm:text-sm">
                <span className="text-muted-foreground">Balance</span>{" "}
                <span className="font-medium text-foreground">
                  {balanceLabel}
                </span>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ButtonLink href="/login" variant="ghost">
                Sign in
              </ButtonLink>
              <ButtonLink href="/signup">Sign up</ButtonLink>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function ButtonLink({
  href,
  children,
  variant = "default",
}: {
  href: string;
  children: ReactNode;
  variant?: "default" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        variant === "ghost"
          ? "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50"
          : "bg-primary text-primary-foreground hover:bg-primary/80",
      )}
    >
      {children}
    </Link>
  );
}

export async function HeaderWithAuth({
  activePath,
}: {
  activePath?: "home" | "markets";
}) {
  const user = await getAuthUser();
  const profile = user ? await getCurrentUserProfile() : null;

  return (
    <Header
      activePath={activePath}
      userEmail={user?.email ?? null}
      profile={profile}
    />
  );
}
