"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const HIDE_FOOTER_PATHS = ["/login", "/register", "/dashboard", "/auth", "/account", "/setup"];

export default function FooterWrapper() {
  const pathname = usePathname() ?? "";
  const shouldHide = HIDE_FOOTER_PATHS.some((p) => pathname.startsWith(p));

  if (shouldHide) return null;
  return <Footer />;
}
