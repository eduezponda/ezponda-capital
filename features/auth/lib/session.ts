// Stub session layer — replace with NextAuth.js v5 once integrated

export type Tier = "free" | "premium";

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  tier: Tier;
}

/**
 * Returns the current session, or null if unauthenticated.
 * Future: import { auth } from "@/lib/auth"; return auth();
 */
export async function getSession(): Promise<UserSession | null> {
  // Stub: always unauthenticated until NextAuth is wired
  return null;
}

/**
 * Returns the session or throws a redirect to /auth/login.
 * Use in RSC page.tsx files that require authentication.
 */
export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    const { redirect } = await import("next/navigation");
    redirect("/auth/login");
  }
  return session as UserSession;
}

export async function getSessionTier(): Promise<Tier | null> {
  const session = await getSession();
  return session?.tier ?? null;
}
