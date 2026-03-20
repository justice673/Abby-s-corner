"use client";

import Navbar from "@/app/components/Navbar";
import FooterWrapper from "@/app/components/FooterWrapper";

export default function LegalInformationPage() {
  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-(--brand-primary)/60">
            Legal
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-(--brand-primary) sm:text-4xl">
            Legal information
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-(--brand-primary)/80 sm:text-base">
            This page summarizes key information about Abby&apos;s Corner, our activity and how we
            handle your orders in Cameroon.
          </p>
        </section>
      </main>
      <FooterWrapper />
    </div>
  );
}

