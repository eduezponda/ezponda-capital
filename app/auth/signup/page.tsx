import { getTranslations } from "next-intl/server";
import AuthLayout from "@/features/auth/components/AuthLayout";
import SignupForm from "@/features/auth/components/SignupForm";

export async function generateMetadata() {
  const t = await getTranslations("auth.signup");
  return { title: t("title"), description: t("description") };
}

export default async function SignupPage() {
  const t = await getTranslations("auth.signup");
  return (
    <AuthLayout imageCaption={t("imageCaption")}>
      <SignupForm />
    </AuthLayout>
  );
}
