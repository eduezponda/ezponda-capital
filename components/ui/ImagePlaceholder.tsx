interface ImagePlaceholderProps {
  label: string;
}

export default function ImagePlaceholder({ label }: ImagePlaceholderProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1c1b1b 0%, #2a2a2a 100%)",
        border: "1px dashed #474747",
        borderRadius: "12px",
        padding: "56px 24px",
        margin: "32px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        color: "#ffe084",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255, 224, 132, 0.04) 0%, transparent 70%)",
        }}
      />
      <span
        style={{
          fontSize: "1.25rem",
          color: "#474747",
        }}
        className="material-symbols-outlined"
      >
        bar_chart
      </span>
      <span
        style={{
          fontSize: "0.6875rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#919191",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.625rem",
          color: "#474747",
          letterSpacing: "0.05em",
        }}
      >
        IMAGE PLACEHOLDER
      </span>
    </div>
  );
}
