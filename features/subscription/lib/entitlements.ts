import type { UserSession, Tier } from "@/features/auth/lib/session";

/**
 * Returns true if the session grants access to the requested tier.
 * Tier hierarchy: premium > free
 */
export function hasAccess(
  session: UserSession | null,
  requiredTier: Tier
): boolean {
  if (!session) return false;
  if (requiredTier === "free") return true;
  return session.tier === "premium";
}

export function getTier(session: UserSession | null): Tier | null {
  return session?.tier ?? null;
}
