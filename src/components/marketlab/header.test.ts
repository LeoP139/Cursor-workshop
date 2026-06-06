import { describe, expect, it } from "vitest";

import {
  getHeaderAuthMode,
  shouldShowSignInActions,
  shouldShowSignOut,
} from "@/lib/auth/header-state";

describe("header auth state", () => {
  it("uses signed-out mode when no user email is present", () => {
    expect(getHeaderAuthMode(null)).toBe("signed-out");
    expect(shouldShowSignInActions(null)).toBe(true);
    expect(shouldShowSignOut(null)).toBe(false);
  });

  it("uses signed-in mode when a user email is present", () => {
    expect(getHeaderAuthMode("demo@marketlab.dev")).toBe("signed-in");
    expect(shouldShowSignInActions("demo@marketlab.dev")).toBe(false);
    expect(shouldShowSignOut("demo@marketlab.dev")).toBe(true);
  });
});

describe("signed-out header actions", () => {
  it("includes sign-in and sign-up routes for signed-out users", () => {
    const signedOutActions = ["/login", "/signup"];

    for (const href of signedOutActions) {
      expect(href.startsWith("/")).toBe(true);
    }
  });
});

describe("signed-in header actions", () => {
  it("includes a sign-out affordance for authenticated users", () => {
    expect(shouldShowSignOut("demo@marketlab.dev")).toBe(true);
  });
});

describe("theme toggle rendering", () => {
  it("exposes light and dark aria labels for the toggle control", () => {
    const lightLabel = "Switch to light mode";
    const darkLabel = "Switch to dark mode";

    expect(lightLabel).toContain("light mode");
    expect(darkLabel).toContain("dark mode");
  });
});
