import UpgradeCTA from "./UpgradeCTA";

interface PaywallProps {
  previewContent?: React.ReactNode;
}

export default function Paywall({ previewContent }: PaywallProps) {
  return (
    <div className="relative">
      {/* Blurred preview */}
      {previewContent && (
        <div className="pointer-events-none select-none blur-sm opacity-40 overflow-hidden max-h-64">
          {previewContent}
        </div>
      )}

      {/* Lock overlay */}
      <div className="relative mt-6 flex flex-col items-center gap-6 text-center">
        <div className="w-14 h-14 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-tertiary"
            style={{ fontSize: 22, fontVariationSettings: "'FILL' 1, 'wght' 400" }}
            aria-hidden="true"
          >
            lock
          </span>
        </div>
        <p className="text-[0.875rem] text-outline max-w-sm">
          This thesis is available to premium subscribers only.
        </p>

        <div className="w-full max-w-md">
          <UpgradeCTA compact />
        </div>
      </div>
    </div>
  );
}
