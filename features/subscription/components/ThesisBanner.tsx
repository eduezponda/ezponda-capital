import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import SubscribeButton from "./SubscribeButton";

interface ThesisBannerProps {
  priceId?: string;
}

export default async function ThesisBanner({
  priceId = "price_1TJXvzKe83gRrUXhfkaTgFXt",
}: ThesisBannerProps) {
  const [session, t] = await Promise.all([
    getSession(),
    getTranslations("thesisBanner"),
  ]);

  if (session?.tier === "premium") return null;

  const isGuest = !session;
  const icon = isGuest ? "person_add" : "workspace_premium";
  const headline = isGuest ? t("guestHeadline") : t("freeHeadline");
  const body = isGuest ? t("guestBody") : t("freeBody");

  return (
    <div className="glass-panel border border-tertiary/15 rounded-lg p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 shrink-0 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-tertiary"
            style={{ fontSize: 22, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
            aria-hidden="true"
          >
            {icon}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-bold text-white leading-tight">{headline}</h3>
          <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">
            {body}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 md:shrink-0 md:self-center">
        {isGuest ? (
          <>
            <Link
              href="/auth/signup"
              className="gold-gradient text-black font-bold text-[0.75rem] uppercase tracking-[0.08rem] px-7 py-3.5 rounded-xl inline-flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,224,132,0.25)] active:scale-95 transition-all"
            >
              {t("guestPrimaryCta")}
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 16,
                  fontVariationSettings: "'FILL' 0, 'wght' 400",
                }}
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </Link>
            <Link
              href="/auth/login"
              className="glass-panel border border-outline-variant/30 text-white font-medium text-[0.75rem] uppercase tracking-[0.08rem] px-7 py-3.5 rounded-xl hover:bg-surface-container-high/60 transition-all inline-flex items-center"
            >
              {t("guestSecondaryCta")}
            </Link>
          </>
        ) : (
          <SubscribeButton priceId={priceId} label={t("freeCta")} />
        )}
      </div>
    </div>
  );
}
