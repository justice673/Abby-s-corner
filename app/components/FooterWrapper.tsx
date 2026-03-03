"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const AUTH_PATHS = ["/login", "/register"];

export default function FooterWrapper() {
  const pathname = usePathname() ?? "";
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) return null;
  return <Footer />;
}
