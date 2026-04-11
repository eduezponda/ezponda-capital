import { getSession } from "@/features/auth/lib/session";
import { hasAccess } from "@/features/subscription/lib/entitlements";
import FreePremiumPaywall from "./FreePremiumPaywall";
import GuestWall from "./GuestWall";

interface PremiumGateProps {
  children: React.ReactNode;
  preview?: React.ReactNode;
}

export default async function PremiumGate({ children, preview }: PremiumGateProps) {
  const session = await getSession();

  if (!session) {
    return <GuestWall previewContent={preview} />;
  }

  if (hasAccess(session, "premium")) return <>{children}</>;

  return <FreePremiumPaywall previewContent={preview} />;
}
