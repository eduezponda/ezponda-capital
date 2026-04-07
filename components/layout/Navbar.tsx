"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "./Container";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { label: "Home",        href: "/" },
  { label: "Theses",      href: "/theses" },
  { label: "Commodities", href: "/commodities" },
  { label: "Sovereign",   href: "/sovereign" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const close = () => setMenuOpen(false);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <Container className="py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={close}>
            <span className="text-sm font-bold uppercase tracking-[0.2rem] text-white">
              Ezponda
            </span>
            <span className="text-sm font-bold uppercase tracking-[0.2rem] text-gold">
              Capital
            </span>
          </Link>

          {/* Desktop nav links */}
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

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="text-[0.75rem] uppercase tracking-[0.1rem] font-medium text-on-surface-variant hover:text-white transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 text-on-surface-variant hover:text-white transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20">
          <Container className="py-6 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className={cn(
                    "text-[0.75rem] uppercase tracking-[0.1rem] font-medium py-3 transition-colors",
                    isActive ? "text-tertiary" : "text-outline hover:text-white"
                  )}
                >
                  {label}
                </Link>
              );
            })}

            <div className="h-px bg-outline-variant/20 my-3" />

            <div className="flex flex-col gap-3">
              {user ? (
                <button
                  onClick={() => { close(); handleLogout(); }}
                  className="text-[0.75rem] uppercase tracking-[0.1rem] font-medium text-on-surface-variant hover:text-white transition-colors py-3 text-left"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={close}
                    className="text-[0.75rem] uppercase tracking-[0.1rem] font-medium text-on-surface-variant hover:text-white transition-colors py-3"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={close}
                    className="gold-gradient text-black text-[0.75rem] uppercase tracking-[0.08rem] font-bold px-5 py-3.5 rounded-full text-center hover:shadow-[0_0_24px_rgba(255,224,132,0.3)] transition-all"
                  >
                    Get Access
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}
