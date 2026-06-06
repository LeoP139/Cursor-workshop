import { Header } from "@/components/marketlab/header";

export default function MarketsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header activePath="markets" />
      {children}
    </div>
  );
}
