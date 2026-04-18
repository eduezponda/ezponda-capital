import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getStripe } from "@/lib/stripe";

describe("getStripe", () => {
  const originalKey = process.env.STRIPE_SECRET_KEY;

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.STRIPE_SECRET_KEY;
    } else {
      process.env.STRIPE_SECRET_KEY = originalKey;
    }
  });

  it("throws when STRIPE_SECRET_KEY is not set", () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(() => getStripe()).toThrow("STRIPE_SECRET_KEY is not set");
  });

  it("returns a Stripe instance when key is set", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc123fake";
    const stripe = getStripe();
    expect(stripe).toBeDefined();
    expect(typeof stripe.checkout).toBe("object");
    expect(typeof stripe.subscriptions).toBe("object");
  });

  it("returns a new instance on each call", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc123fake";
    const a = getStripe();
    const b = getStripe();
    expect(a).not.toBe(b);
  });
});
