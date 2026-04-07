import Link from "next/link";
import AuthLayout from "@/features/auth/components/AuthLayout";

export const metadata = {
  title: "Check Your Email — Ezponda Capital",
  description: "Confirm your email address to complete registration.",
};

export default function ConfirmEmailPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span className="text-sm font-bold uppercase tracking-[0.2rem] text-white">Ezponda</span>
            <span className="text-sm font-bold uppercase tracking-[0.2rem] text-gold">Capital</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Check your email</h1>
          <p className="text-[0.875rem] text-outline mt-1">
            We sent a confirmation link to your inbox.
          </p>
        </div>

        <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">
          Click the link in your email to verify your account before logging in.
          If you don&apos;t see it, check your spam folder.
        </p>

        <Link
          href="/auth/login"
          className="text-[0.8125rem] text-tertiary hover:underline self-start"
        >
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
