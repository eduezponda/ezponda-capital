import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));
vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(),
}));

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { POST } from "@/app/api/stripe/create-checkout/route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/stripe/create-checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function makeSupabaseMock(user: unknown) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
  };
}

function makeStripeMock(sessionUrl: string | null = "https://checkout.stripe.com/session/abc") {
  return {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: sessionUrl }),
      },
    },
  };
}

describe("POST /api/stripe/create-checkout", () => {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  });

  it("returns 401 when user is not authenticated", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeSupabaseMock(null) as never
    );
    const res = await POST(makeRequest({ priceId: "price_123" }));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Authentication required");
  });

  it("returns 400 when priceId is missing", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeSupabaseMock({ id: "user-1", email: "user@example.com" }) as never
    );
    vi.mocked(getStripe).mockReturnValue(makeStripeMock() as never);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("priceId is required");
  });

  it("returns checkout url on success", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeSupabaseMock({ id: "user-1", email: "user@example.com" }) as never
    );
    vi.mocked(getStripe).mockReturnValue(makeStripeMock() as never);

    const res = await POST(makeRequest({ priceId: "price_abc" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.url).toBe("https://checkout.stripe.com/session/abc");
  });

  it("passes correct metadata and email to stripe", async () => {
    const mockCreate = vi.fn().mockResolvedValue({ url: "https://stripe.com" });
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeSupabaseMock({ id: "user-42", email: "rich@example.com" }) as never
    );
    vi.mocked(getStripe).mockReturnValue({
      checkout: { sessions: { create: mockCreate } },
    } as never);

    await POST(makeRequest({ priceId: "price_gold" }));

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: { user_id: "user-42" },
        customer_email: "rich@example.com",
        mode: "subscription",
      })
    );
  });

  it("includes correct success and cancel URLs", async () => {
    const mockCreate = vi.fn().mockResolvedValue({ url: "https://stripe.com" });
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeSupabaseMock({ id: "user-1", email: "user@example.com" }) as never
    );
    vi.mocked(getStripe).mockReturnValue({
      checkout: { sessions: { create: mockCreate } },
    } as never);

    process.env.NEXT_PUBLIC_APP_URL = "https://myapp.com";
    await POST(makeRequest({ priceId: "price_123" }));

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: "https://myapp.com/theses?checkout=success",
        cancel_url: "https://myapp.com/theses?checkout=canceled",
      })
    );
  });

  it("returns 500 when Stripe throws", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      makeSupabaseMock({ id: "user-1", email: "user@example.com" }) as never
    );
    vi.mocked(getStripe).mockReturnValue({
      checkout: {
        sessions: {
          create: vi.fn().mockRejectedValue(new Error("Stripe error")),
        },
      },
    } as never);

    const res = await POST(makeRequest({ priceId: "price_123" }));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Checkout creation failed");
  });
});
