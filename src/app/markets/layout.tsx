import { HeaderWithAuth } from "@/components/marketlab/header";

export default async function MarketsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <HeaderWithAuth activePath="markets" />
      {children}
    </div>
  );
}
