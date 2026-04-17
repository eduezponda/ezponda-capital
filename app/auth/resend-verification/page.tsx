import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import AuthLayout from "@/features/auth/components/AuthLayout";
import ResendVerificationForm from "@/features/auth/components/ResendVerificationForm";

export async function generateMetadata() {
  const t = await getTranslations("auth.resendVerification");
  return { title: t("title"), description: t("description") };
}

export default async function ResendVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) redirect("/auth/signup");

  return (
    <AuthLayout>
      <ResendVerificationForm email={email} />
    </AuthLayout>
  );
}
