import Link from "next/link";
import Container from "./Container";

const FOOTER_LINKS = [
  { label: "About",    href: "#" },
  { label: "Theses",   href: "/theses" },
  { label: "Contact",  href: "#" },
  { label: "Legal",    href: "#" },
  { label: "Privacy",  href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 py-16">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-[0.2rem] text-white">
                Ezponda
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.2rem] text-gold">
                Capital
              </span>
            </div>
            <p className="text-[0.6875rem] text-outline max-w-xs">
              High-conviction commodity investment research. Gold, copper, and macro cycles.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6">
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline hover:text-tertiary transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Twitter"
              className="w-9 h-9 rounded-full border border-outline-variant/40 flex items-center justify-center text-outline hover:text-tertiary hover:border-tertiary/40 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full border border-outline-variant/40 flex items-center justify-center text-outline hover:text-tertiary hover:border-tertiary/40 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant/20">
          <p className="text-[0.625rem] text-outline/60 uppercase tracking-[0.05rem]">
            © {new Date().getFullYear()} Ezponda Capital. All rights reserved. Not financial advice.
          </p>
        </div>
      </Container>
    </footer>
  );
}
