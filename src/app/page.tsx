import Link from "next/link";

import { HeaderWithAuth } from "@/components/marketlab/header";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <HeaderWithAuth activePath="home" />

      <main className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col items-center justify-center px-4 py-14 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Cursor Workshop
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          MarketLab is ready.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Welcome to the fake-money prediction market workshop. Browse fictional
          Yes/No markets, explore outcomes, and follow the probability chart on
          each market page.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/markets">Browse markets</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
