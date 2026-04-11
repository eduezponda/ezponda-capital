import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import AuthLayout from "@/features/auth/components/AuthLayout";
import LoginForm from "@/features/auth/components/LoginForm";

export async function generateMetadata() {
  const t = await getTranslations("auth.login");
  return { title: t("title"), description: t("description") };
}

export default async function LoginPage() {
  const t = await getTranslations("auth.login");
  return (
    <AuthLayout imageCaption={t("imageCaption")}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
