"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  showPasswordToggle?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

export default function Input({
  label,
  className,
  id,
  type,
  showPasswordToggle = false,
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  ...props
}: InputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isPasswordField = type === "password";
  const toggleEnabled = showPasswordToggle && isPasswordField;
  const resolvedType = toggleEnabled && isVisible ? "text" : type;

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
      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          className={cn(
            "w-full bg-surface-container-highest text-on-surface placeholder:text-outline/50",
            "px-6 py-4 rounded outline-none border border-transparent",
            "focus:ring-1 focus:ring-tertiary focus:bg-surface-bright",
            "transition-all duration-150",
            toggleEnabled && "pr-12",
            className
          )}
          {...props}
        />
        {toggleEnabled && (
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? hidePasswordLabel : showPasswordLabel}
            aria-pressed={isVisible}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-tertiary"
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
