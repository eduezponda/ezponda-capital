import { describe, it, expect } from "vitest";
import {
  hasAccess,
  getTier,
} from "@/features/subscription/lib/entitlements";
import type { UserSession } from "@/features/auth/lib/session";

const freeSession: UserSession = {
  id: "user-1",
  email: "free@example.com",
  role: "free",
  tier: "free",
};

const premiumSession: UserSession = {
  id: "user-2",
  email: "premium@example.com",
  role: "subscriber",
  tier: "premium",
};

const superadminSession: UserSession = {
  id: "user-3",
  email: "admin@example.com",
  role: "superadmin",
  tier: "premium",
};

describe("hasAccess", () => {
  it("returns false for null session regardless of tier", () => {
    expect(hasAccess(null, "free")).toBe(false);
    expect(hasAccess(null, "premium")).toBe(false);
  });

  it("any logged-in user can access free content", () => {
    expect(hasAccess(freeSession, "free")).toBe(true);
    expect(hasAccess(premiumSession, "free")).toBe(true);
    expect(hasAccess(superadminSession, "free")).toBe(true);
  });

  it("free user cannot access premium content", () => {
    expect(hasAccess(freeSession, "premium")).toBe(false);
  });

  it("subscriber can access premium content", () => {
    expect(hasAccess(premiumSession, "premium")).toBe(true);
  });

  it("superadmin can access premium content", () => {
    expect(hasAccess(superadminSession, "premium")).toBe(true);
  });
});

describe("getTier", () => {
  it("returns null for null session", () => {
    expect(getTier(null)).toBeNull();
  });

  it("returns free tier from free session", () => {
    expect(getTier(freeSession)).toBe("free");
  });

  it("returns premium tier from subscriber session", () => {
    expect(getTier(premiumSession)).toBe("premium");
  });

  it("returns premium tier from superadmin session", () => {
    expect(getTier(superadminSession)).toBe("premium");
  });
});
