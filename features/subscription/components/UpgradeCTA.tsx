import Link from "next/link";

interface UpgradeCTAProps {
  headline?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  compact?: boolean;
}

export default function UpgradeCTA({
  headline = "Unlock Full Access",
  body = "Subscribe to read complete investment theses, access live macro data, and join a community of serious commodity investors.",
  ctaLabel = "Get Premium",
  ctaHref = "/auth/signup",
  compact = false,
}: UpgradeCTAProps) {
  return (
    <div className="glass-panel border border-tertiary/15 rounded-lg p-8 md:p-10 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-outlined text-tertiary"
          style={{ fontSize: 18, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
          aria-hidden="true"
        >
          workspace_premium
        </span>
        <span className="text-[0.6875rem] uppercase tracking-[0.15rem] font-bold text-tertiary">
          Premium Research
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className={compact ? "text-xl font-bold text-white" : "text-2xl font-bold text-white"}>
          {headline}
        </h3>
        {!compact && (
          <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">{body}</p>
        )}
      </div>

      <Link
        href={ctaHref}
        className="gold-gradient text-black font-bold text-[0.75rem] uppercase tracking-[0.08rem] px-7 py-3.5 rounded-xl inline-flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,224,132,0.25)] active:scale-95 transition-all self-start"
      >
        {ctaLabel}
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 400" }}
          aria-hidden="true"
        >
          arrow_forward
        </span>
      </Link>
    </div>
  );
}
