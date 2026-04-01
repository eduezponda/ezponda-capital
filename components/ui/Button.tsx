import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "filter";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  active?: boolean;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "gold-gradient text-black font-bold rounded-xl px-8 py-4 " +
    "hover:shadow-[0_0_40px_rgba(255,224,132,0.25)] active:scale-95 " +
    "transition-all duration-200",
  secondary:
    "glass-panel border border-outline-variant/30 text-white font-medium rounded-xl px-8 py-4 " +
    "hover:bg-surface-container-high/60 active:scale-95 transition-all duration-200",
  tertiary:
    "bg-[#f8d056] text-black font-bold rounded-full px-6 py-2.5 " +
    "hover:shadow-[0_0_24px_rgba(248,208,86,0.3)] active:scale-95 " +
    "transition-all duration-200",
  filter:
    "rounded-full px-6 py-2.5 text-[0.75rem] uppercase tracking-[0.05rem] font-medium " +
    "border transition-all duration-150 active:scale-95",
};

export default function Button({
  variant = "primary",
  active = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const filterActive =
    variant === "filter" && active
      ? "gold-gradient text-black border-transparent"
      : variant === "filter"
      ? "bg-surface-container-low text-on-surface border-white/5 hover:bg-surface-container-high"
      : "";

  return (
    <button
      className={cn(variantStyles[variant], filterActive, className)}
      {...props}
    >
      {children}
    </button>
  );
}
