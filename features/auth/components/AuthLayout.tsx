import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
  imageCaption?: string;
}

export default async function AuthLayout({
  children,
  imageSrc,
  imageCaption,
}: AuthLayoutProps) {
  const t = await getTranslations("auth.layout");

  return (
    <div className="min-h-screen flex">
      {/* Form panel */}
      <div className="w-full lg:w-[45%] flex flex-col px-6 pt-8 pb-20 bg-surface">
        <Link
          href="/"
          className="text-[0.6875rem] uppercase tracking-[0.2rem] text-outline hover:text-on-surface-variant transition-colors self-start"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1 align-[-1px]"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>{t("home")}
        </Link>
        <div className="flex-1 flex items-center justify-center mt-8 md:mt-0">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Image panel */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={t("imageAlt")}
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-surface-container-lowest" />
        )}

        {/* Floating macro card */}
        <div className="absolute bottom-16 right-12 glass-panel border border-white/5 rounded-lg p-8 max-w-xs shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <p className="text-[0.6875rem] uppercase tracking-[0.2rem] text-tertiary font-medium mb-3">
            {t("marketInsightLabel")}
          </p>
          <p className="text-white font-semibold leading-snug mb-2">
            {t("marketInsightText")}
          </p>
          {imageCaption && (
            <p className="text-[0.75rem] text-outline">{imageCaption}</p>
          )}
        </div>
      </div>
    </div>
  );
}
