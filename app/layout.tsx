import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./components/Providers";
import FooterWrapper from "./components/FooterWrapper";
import ScrollToTop from "./components/ScrollToTop";
import CartProvider from "./components/CartProvider";
import { WhatsAppButton } from "./components/WhatsAppButton";

const headingFont = localFont({
  src: [
    {
      path: "../public/fonts/Cormorant_Garamond/static/CormorantGaramond-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Cormorant_Garamond/static/CormorantGaramond-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Cormorant_Garamond/static/CormorantGaramond-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Cormorant_Garamond/static/CormorantGaramond-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = localFont({
  src: [
    {
      path: "../public/fonts/Quicksand/Quicksand-VariableFont_wght.ttf",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abby's Corner",
  description: "Perfumes and scent rituals by Abby's Corner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        <Providers>
          <CartProvider>
            {children}
            <FooterWrapper />
            <ScrollToTop />
            <WhatsAppButton />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
