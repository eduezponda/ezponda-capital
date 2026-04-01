import { cn } from "@/lib/utils";

type CardVariant = "data" | "image" | "glass";

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  data:
    "bg-surface-container rounded-lg border border-outline-variant/10 " +
    "hover:bg-surface-bright transition-colors duration-200",
  image:
    "relative overflow-hidden rounded-lg group",
  glass:
    "glass-panel border border-white/5 rounded-lg " +
    "shadow-[0_40px_100px_rgba(0,0,0,0.5)]",
};

export default function Card({ variant = "data", className, children }: CardProps) {
  return (
    <div className={cn(variantStyles[variant], className)}>
      {children}
    </div>
  );
}
