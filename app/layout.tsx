import type { Metadata } from "next";
import { Inter, Material_Symbols_Outlined } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const materialSymbols = Material_Symbols_Outlined({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-material-symbols",
});

export const metadata: Metadata = {
  title: "Ezponda Capital — Commodity Investment Research",
  description:
    "High-conviction investment ideas in gold, copper, and macro cycles. Premium research for serious investors.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} ${materialSymbols.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
