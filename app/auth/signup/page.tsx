import AuthLayout from "@/features/auth/components/AuthLayout";
import SignupForm from "@/features/auth/components/SignupForm";

export const metadata = {
  title: "Request Access — Ezponda Capital",
  description: "Join a curated group of commodity-focused investors.",
};

export default function SignupPage() {
  return (
    <AuthLayout imageCaption="Gold bull case — 10-year structural view">
      <SignupForm />
    </AuthLayout>
  );
}
