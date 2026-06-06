import { BarChart3 } from "lucide-react";

export function EmptyMarkets() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-3 text-muted-foreground">
        <BarChart3 className="size-6" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-card-foreground">
        No markets yet
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Browse fictional Yes/No markets using fake money. Markets will appear
        here once they are added through the database setup.
      </p>
    </div>
  );
}
