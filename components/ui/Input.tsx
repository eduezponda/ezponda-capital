import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export default function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-[0.6875rem] uppercase tracking-[0.05rem] font-medium text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full bg-surface-container-highest text-on-surface placeholder:text-outline/50",
          "px-6 py-4 rounded outline-none border border-transparent",
          "focus:ring-1 focus:ring-tertiary focus:bg-surface-bright",
          "transition-all duration-150",
          className
        )}
        {...props}
      />
    </div>
  );
}
