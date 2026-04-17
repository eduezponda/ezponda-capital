import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SessionProvider } from "@/features/auth/components/SessionProvider";
import { getSession } from "@/features/auth/lib/session";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ezponda Capital — Commodity Investment Research",
  description:
    "High-conviction investment ideas in gold, copper, and macro cycles. Premium research for serious investors.",
  icons: { icon: "/logo.webp" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await getSession();
  const clientSession = session
    ? { id: session.id, email: session.email, name: session.name, role: session.role, tier: session.tier }
    : null;

  return (
    <html lang={locale} className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <SessionProvider session={clientSession}>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
