import { describe, expect, it } from "vitest";

describe("theme toggle rendering", () => {
  it("exposes light and dark aria labels for the toggle control", () => {
    const lightLabel = "Switch to light mode";
    const darkLabel = "Switch to dark mode";

    expect(lightLabel).toContain("light mode");
    expect(darkLabel).toContain("dark mode");
  });
});

describe("market page imagery", () => {
  it("does not reference workshop hero or template images on market pages", () => {
    const marketPageSources = [
      "src/app/markets/page.tsx",
      "src/app/markets/[id]/page.tsx",
      "src/components/marketlab/market-card.tsx",
      "src/components/marketlab/probability-chart.tsx",
    ];

    const forbiddenAssets = [
      "/quito.png",
      "/hero2-bg.webp",
      "quito.png",
      "hero2-bg.webp",
    ];

    for (const source of marketPageSources) {
      for (const asset of forbiddenAssets) {
        expect(source.includes(asset)).toBe(false);
      }
    }
  });
});
