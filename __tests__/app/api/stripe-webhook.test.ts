import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(),
}));
vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

import { getStripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { POST } from "@/app/api/stripe/webhook/route";

function makeRequest(body: string, sig: string | null = "valid-sig") {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sig !== null) headers["stripe-signature"] = sig;
  return new NextRequest("http://localhost/api/stripe/webhook", {
    method: "POST",
    body,
    headers,
  });
}

/** Builds a minimal thenable chain that handles: .update().eq(), .select().eq().limit() */
function makeSupabaseMock({
  selectRows = [] as unknown[],
} = {}) {
  const limitResult = { data: selectRows, error: null };
  const eqResult = { data: null, error: null };

  const afterEq: Record<string, unknown> = {
    limit: vi.fn().mockResolvedValue(limitResult),
  };
  // Make afterEq thenable so `await supabase.from().update().eq()` resolves
  afterEq.then = (
    resolve: (v: unknown) => unknown,
    reject?: (e: unknown) => unknown
  ) => Promise.resolve(eqResult).then(resolve, reject);
  afterEq.catch = (fn: (e: unknown) => unknown) =>
    Promise.resolve(eqResult).catch(fn);
  afterEq.finally = (fn: () => void) =>
    Promise.resolve(eqResult).finally(fn);

  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue(afterEq),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue(afterEq),
      }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    }),
  };
}

const mockSub = {
  id: "sub_123",
  status: "active" as const,
  items: { data: [{ price: { id: "price_abc" } }] },
  current_period_start: 1700000000,
  current_period_end: 1702592000,
};

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_fake";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_fake";
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    vi.mocked(getStripe).mockReturnValue({
      webhooks: { constructEvent: vi.fn() },
    } as never);
    const res = await POST(makeRequest("{}", null));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Missing stripe-signature header");
  });

  it("returns 400 when signature verification fails", async () => {
    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockImplementation(() => {
          throw new Error("Signature mismatch");
        }),
      },
    } as never);
    const res = await POST(makeRequest("{}", "bad-sig"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid signature");
  });

  it("returns { received: true } for unknown event types", async () => {
    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: "some.unknown.event",
          data: { object: {} },
        }),
      },
    } as never);
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock() as never
    );

    const res = await POST(makeRequest("{}", "valid-sig"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });

  it("handles checkout.session.completed — promotes user and upserts subscription", async () => {
    const mockSupabase = makeSupabaseMock();
    vi.mocked(createSupabaseAdminClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: "checkout.session.completed",
          data: {
            object: {
              metadata: { user_id: "user-1" },
              subscription: "sub_123",
              customer: "cus_abc",
            },
          },
        }),
      },
      subscriptions: {
        retrieve: vi.fn().mockResolvedValue(mockSub),
      },
    } as never);

    const res = await POST(makeRequest("{}", "valid-sig"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);

    // profiles.update was called to promote the user
    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
    // subscriptions.upsert was called
    expect(mockSupabase.from).toHaveBeenCalledWith("subscriptions");
  });

  it("handles checkout.session.completed with missing userId/subscriptionId gracefully", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock() as never
    );
    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: "checkout.session.completed",
          data: {
            object: {
              metadata: {},
              subscription: null,
              customer: null,
            },
          },
        }),
      },
      subscriptions: { retrieve: vi.fn() },
    } as never);

    const res = await POST(makeRequest("{}", "valid-sig"));
    expect(res.status).toBe(200);
    expect((await res.json()).received).toBe(true);
  });

  it("handles customer.subscription.updated — updates subscription record", async () => {
    const mockSupabase = makeSupabaseMock();
    vi.mocked(createSupabaseAdminClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: "customer.subscription.updated",
          data: { object: mockSub },
        }),
      },
    } as never);

    const res = await POST(makeRequest("{}", "valid-sig"));
    expect(res.status).toBe(200);
    expect((await res.json()).received).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith("subscriptions");
  });

  it("handles customer.subscription.deleted — cancels subscription and downgrades user", async () => {
    const mockSupabase = makeSupabaseMock({
      selectRows: [{ user_id: "user-1" }],
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue(mockSupabase as never);
    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: "customer.subscription.deleted",
          data: { object: mockSub },
        }),
      },
    } as never);

    const res = await POST(makeRequest("{}", "valid-sig"));
    expect(res.status).toBe(200);
    expect((await res.json()).received).toBe(true);
    // profiles.update for downgrade
    expect(mockSupabase.from).toHaveBeenCalledWith("profiles");
  });

  it("always returns 200 even when DB throws during event handling", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockRejectedValue(new Error("DB crash")),
        }),
        upsert: vi.fn().mockRejectedValue(new Error("DB crash")),
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockRejectedValue(new Error("DB crash")),
          }),
        }),
      }),
    } as never);
    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: "customer.subscription.updated",
          data: { object: mockSub },
        }),
      },
    } as never);

    const res = await POST(makeRequest("{}", "valid-sig"));
    expect(res.status).toBe(200);
    expect((await res.json()).received).toBe(true);
  });
});
