interface ImagePlaceholderProps {
  label: string;
}

export default function ImagePlaceholder({ label }: ImagePlaceholderProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-outline-variant my-8 py-14 px-6 flex flex-col items-center justify-center gap-3 [background:linear-gradient(135deg,#1c1b1b_0%,#2a2a2a_100%)]">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_50%,rgba(255,224,132,0.04)_0%,transparent_70%)]" />
      <span className="material-symbols-outlined text-xl text-outline-variant">
        bar_chart
      </span>
      <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-outline font-medium text-center">
        {label}
      </span>
      <span className="text-[0.625rem] text-outline-variant tracking-[0.05em]">
        IMAGE PLACEHOLDER
      </span>
    </div>
  );
}
