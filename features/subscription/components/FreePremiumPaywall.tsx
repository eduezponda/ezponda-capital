import { getTranslations } from "next-intl/server";
import SubscribeButton from "./SubscribeButton";

interface FreePremiumPaywallProps {
  previewContent?: React.ReactNode;
}

export default async function FreePremiumPaywall({ previewContent }: FreePremiumPaywallProps) {
  const t = await getTranslations("subscription");

  return (
    <div className="relative">
      {previewContent && (
        <div className="pointer-events-none select-none blur-sm opacity-40 overflow-hidden max-h-64">
          {previewContent}
        </div>
      )}

      <div className="relative mt-6 flex flex-col items-center gap-6 text-center">
        <div className="w-14 h-14 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-tertiary"
            style={{ fontSize: 22, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
            aria-hidden="true"
          >
            workspace_premium
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white">{t("premiumHeadline")}</h3>
          <p className="text-[0.875rem] text-outline max-w-sm">{t("premiumBody")}</p>
        </div>

        <div className="w-full max-w-md">
          <SubscribeButton priceId="price_1TJXvzKe83gRrUXhfkaTgFXt" label={t("ctaLabel")} />
        </div>
      </div>
    </div>
  );
}
