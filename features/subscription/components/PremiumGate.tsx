import { getSession } from "@/features/auth/lib/session";
import { hasAccess } from "@/features/subscription/lib/entitlements";
import Paywall from "./Paywall";

interface PremiumGateProps {
  children: React.ReactNode;
  preview?: React.ReactNode;
}

/**
 * Server component — reads session, renders children or Paywall.
 */
export default async function PremiumGate({ children, preview }: PremiumGateProps) {
  const session = await getSession();
  const allowed = hasAccess(session, "premium");

  if (allowed) return <>{children}</>;

  return <Paywall previewContent={preview} />;
}
