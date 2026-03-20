"use client";

import Navbar from "@/app/components/Navbar";
import FooterWrapper from "@/app/components/FooterWrapper";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-(--brand-primary)/60">
            About
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-(--brand-primary) sm:text-4xl">
            Abby&apos;s Perfumery in Cameroon
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-(--brand-primary)/80 sm:text-base">
            Abby&apos;s Perfumery was created to bring authentic, carefully curated fragrances
            closer to perfume lovers in Cameroon. From French classics to niche Arabic blends and
            home fragrances, we focus on real stock, transparent communication and a smooth
            WhatsApp-first ordering experience that our customers can trust.
          </p>
        </section>

        <section className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-(--brand-primary)">
              What we stand for
            </h2>
            <ul className="space-y-2 text-sm text-(--brand-primary)/80">
              <li>• Authentic fragrances sourced from trusted partners.</li>
              <li>• Clear communication on availability, prices and promotions.</li>
              <li>• A human, WhatsApp-based checkout that feels personal and safe.</li>
              <li>• Education and guidance to help you find your signature scent.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-(--brand-primary)">
              Where to find us
            </h2>
            <p className="text-sm text-(--brand-primary)/80">
              We currently serve customers across Cameroon, with a focus on Douala and Yaoundé.
              Orders are placed online and confirmed over WhatsApp, with delivery options adapted
              to your city.
            </p>
          </div>
        </section>
      </main>
      <FooterWrapper />
    </div>
  );
}

