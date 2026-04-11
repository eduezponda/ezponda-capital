import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface GuestWallProps {
  previewContent?: React.ReactNode;
}

export default async function GuestWall({ previewContent }: GuestWallProps) {
  const t = await getTranslations("guestWall");

  return (
    <div className="relative">
      {previewContent && (
        <div className="pointer-events-none select-none blur-md opacity-30 overflow-hidden max-h-72">
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
            person_add
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white">{t("headline")}</h3>
          <p className="text-[0.875rem] text-outline max-w-sm">{t("body")}</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/auth/signup"
            className="gold-gradient text-black font-bold text-[0.75rem] uppercase tracking-[0.08rem] px-7 py-3.5 rounded-xl inline-flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,224,132,0.25)] active:scale-95 transition-all"
          >
            {t("signupFree")}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 400" }}
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </Link>
          <Link
            href="/auth/login"
            className="glass-panel border border-outline-variant/30 text-white font-medium text-[0.75rem] uppercase tracking-[0.08rem] px-7 py-3.5 rounded-xl hover:bg-surface-container-high/60 transition-all"
          >
            {t("login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
