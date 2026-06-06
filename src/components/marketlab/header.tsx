import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/marketlab/theme-toggle";
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

export function Header({ activePath }: { activePath?: "home" | "markets" }) {
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
          <div
            className="hidden text-xs text-muted-foreground sm:block"
            aria-hidden
          >
            Auth coming soon
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
