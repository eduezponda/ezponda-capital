import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Container from "@/components/layout/Container";
import SubscribeButton from "@/features/subscription/components/SubscribeButton";
import { getSession } from "@/features/auth/lib/session";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const t = await getTranslations("profile");

  const planLabel =
    session.role === "superadmin"
      ? t("planSuperadmin")
      : session.tier === "premium"
        ? t("planPremium")
        : t("planFree");

  return (
    <div className="pt-28 pb-20 bg-surface min-h-screen">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-10">
          {t("title")}
        </h1>

        <div className="flex flex-col gap-6">
          {/* Info card */}
          <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-8 flex flex-col gap-5">
            {session.name && (
              <div>
                <p className="text-[0.6875rem] uppercase tracking-[0.1rem] text-outline mb-1">
                  {t("name")}
                </p>
                <p className="text-white font-medium">{session.name}</p>
              </div>
            )}
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.1rem] text-outline mb-1">
                {t("email")}
              </p>
              <p className="text-white font-medium">{session.email}</p>
            </div>
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.1rem] text-outline mb-1">
                {t("plan")}
              </p>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${session.tier === "premium" ? "text-tertiary" : "text-white"}`}>
                  {planLabel}
                </span>
                {session.tier === "premium" && (
                  <span
                    className="material-symbols-outlined text-tertiary"
                    style={{ fontSize: 20, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                    aria-hidden="true"
                  >
                    verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Upgrade CTA for free users */}
          {session.tier === "free" && (
            <div className="glass-panel border border-tertiary/15 rounded-lg p-8 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-tertiary"
                  style={{ fontSize: 18, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                  aria-hidden="true"
                >
                  workspace_premium
                </span>
                <span className="text-[0.6875rem] uppercase tracking-[0.15rem] font-bold text-tertiary">
                  Premium
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{t("upgradeHeadline")}</h2>
              <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">
                {t("upgradeBody")}
              </p>
              <SubscribeButton
                priceId="price_1TJXvzKe83gRrUXhfkaTgFXt"
                label={t("upgradeCta")}
              />
            </div>
          )}

          {/* Premium active message */}
          {session.tier === "premium" && session.role !== "superadmin" && (
            <div className="bg-surface-container rounded-lg border border-tertiary/10 p-8">
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-tertiary mt-0.5"
                  style={{ fontSize: 20, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                  aria-hidden="true"
                >
                  check_circle
                </span>
                <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">
                  {t("premiumActive")}
                </p>
              </div>
            </div>
          )}

          {/* Superadmin note */}
          {session.role === "superadmin" && (
            <div className="bg-surface-container rounded-lg border border-tertiary/10 p-8">
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-tertiary mt-0.5"
                  style={{ fontSize: 20, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                  aria-hidden="true"
                >
                  admin_panel_settings
                </span>
                <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">
                  {t("superadminNote")}
                </p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
