import { Suspense } from "react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Login — Ezponda Capital",
  description: "Login to access your investment research terminal.",
};

export default function LoginPage() {
  return (
    <AuthLayout imageCaption="Q1 2025 Macro Outlook">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
