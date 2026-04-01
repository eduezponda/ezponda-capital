"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/auth");

  return (
    <>
      {!isAuth && <Navbar />}
      <main>{children}</main>
      {!isAuth && <Footer />}
    </>
  );
}
