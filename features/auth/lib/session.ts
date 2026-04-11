import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Tier = "free" | "premium";
export type Role = "free" | "subscriber" | "superadmin";

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  role: Role;
  tier: Tier;
}

export async function getSession(): Promise<UserSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role: Role =
    profile?.role === "superadmin"
      ? "superadmin"
      : profile?.role === "subscriber"
        ? "subscriber"
        : "free";

  const tier: Tier =
    role === "superadmin" || role === "subscriber" ? "premium" : "free";

  return {
    id: user.id,
    email: user.email ?? "",
    name: profile?.full_name ?? undefined,
    role,
    tier,
  };
}

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
