interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
  imageCaption?: string;
}

export default function AuthLayout({
  children,
  imageSrc,
  imageCaption,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Form panel */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-20 bg-surface">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Image panel */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt="Macro commodities"
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
            Market Insight
          </p>
          <p className="text-white font-semibold leading-snug mb-2">
            Gold has outperformed every major asset class over the past 5 years.
          </p>
          {imageCaption && (
            <p className="text-[0.75rem] text-outline">{imageCaption}</p>
          )}
        </div>
      </div>
    </div>
  );
}
