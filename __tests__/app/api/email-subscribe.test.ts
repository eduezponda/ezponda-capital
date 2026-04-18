import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { POST } from "@/app/api/email-list/subscribe/route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/email-list/subscribe", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function makeSupabaseMock(error: unknown = null) {
  return {
    from: vi.fn().mockReturnValue({
      upsert: vi.fn().mockResolvedValue({ error }),
    }),
  };
}

describe("POST /api/email-list/subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid email address");
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid email address");
  });

  it("returns 400 for email with spaces only", async () => {
    const res = await POST(makeRequest({ email: "   " }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for email missing domain", async () => {
    const res = await POST(makeRequest({ email: "user@" }));
    expect(res.status).toBe(400);
  });

  it("returns ok:true on successful subscription", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock() as never
    );
    const res = await POST(makeRequest({ email: "user@example.com" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it("normalizes email to lowercase and trimmed", async () => {
    let capturedData: unknown;
    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockImplementation((data: unknown) => {
          capturedData = data;
          return Promise.resolve({ error: null });
        }),
      }),
    } as never);

    await POST(makeRequest({ email: "  UPPER@EXAMPLE.COM  " }));
    expect((capturedData as { email: string }).email).toBe(
      "upper@example.com"
    );
  });

  it("passes source field to upsert when provided", async () => {
    let capturedData: unknown;
    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockImplementation((data: unknown) => {
          capturedData = data;
          return Promise.resolve({ error: null });
        }),
      }),
    } as never);

    await POST(makeRequest({ email: "user@example.com", source: "homepage" }));
    expect((capturedData as { source: string }).source).toBe("homepage");
  });

  it("returns 500 on DB error", async () => {
    vi.mocked(createSupabaseAdminClient).mockReturnValue(
      makeSupabaseMock(new Error("DB failure")) as never
    );
    const res = await POST(makeRequest({ email: "user@example.com" }));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Subscription failed");
  });
});
