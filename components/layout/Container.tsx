import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24",
        className
      )}
    >
      {children}
    </Tag>
  );
}
