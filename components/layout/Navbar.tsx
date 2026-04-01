"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Container from "./Container";

const NAV_LINKS = [
  { label: "Home",        href: "/" },
  { label: "Theses",      href: "/theses" },
  { label: "Commodities", href: "/commodities" },
  { label: "Sovereign",   href: "/sovereign" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <Container className="py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.2rem] text-white">
              Ezponda
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.2rem] text-gold">
              Capital
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-[0.75rem] uppercase tracking-[0.1rem] font-medium transition-colors",
                    isActive
                      ? "text-white border-b border-tertiary pb-0.5"
                      : "text-outline hover:text-white"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-[0.75rem] uppercase tracking-[0.1rem] font-medium text-on-surface-variant hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="gold-gradient text-black text-[0.75rem] uppercase tracking-[0.08rem] font-bold px-5 py-2 rounded-full hover:shadow-[0_0_24px_rgba(255,224,132,0.3)] transition-all"
            >
              Get Access
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}
