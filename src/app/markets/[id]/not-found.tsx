import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MarketNotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-4xl flex-col items-start justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        Market not found
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
        That market does not exist or may have been removed. Return to the
        market list to keep browsing fictional Yes/No markets.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/markets">
          <ArrowLeft data-icon="inline-start" />
          Back to markets
        </Link>
      </Button>
    </main>
  );
}
