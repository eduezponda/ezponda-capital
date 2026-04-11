import { getSession } from "@/features/auth/lib/session";
import { hasAccess } from "@/features/subscription/lib/entitlements";
import type { Tier } from "@/features/auth/lib/session";
import FreePremiumPaywall from "./FreePremiumPaywall";
import GuestWall from "./GuestWall";

interface ContentGateProps {
  requiredTier: Tier;
  children: React.ReactNode;
  preview?: React.ReactNode;
}

export default async function ContentGate({
  requiredTier,
  children,
  preview,
}: ContentGateProps) {
  const session = await getSession();

  if (!session) {
    return <GuestWall previewContent={preview} />;
  }

  if (hasAccess(session, requiredTier)) {
    return <>{children}</>;
  }

  return <FreePremiumPaywall previewContent={preview} />;
}
