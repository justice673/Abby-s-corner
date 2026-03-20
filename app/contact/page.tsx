"use client";

import Navbar from "@/app/components/Navbar";
import FooterWrapper from "@/app/components/FooterWrapper";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-(--brand-primary)/60">
            Contact
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-(--brand-primary) sm:text-4xl">
            Get in touch with Abby&apos;s Corner
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-(--brand-primary)/80 sm:text-base">
            If you have a question about a perfume, want a recommendation, or need help with an
            order, you can reach us easily via WhatsApp or the contact details below.
          </p>
        </section>

        <section className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-(--brand-primary)">
              WhatsApp & phone
            </h2>
            <p className="text-sm text-(--brand-primary)/80">
              The fastest way to place an order or ask a question is to message us on WhatsApp.
            </p>
            <div className="space-y-1 rounded-2xl border border-(--brand-primary)/15 bg-white p-4 text-sm">
              <p className="font-medium text-(--brand-primary)">WhatsApp / Call</p>
              <p className="text-(--brand-primary)/80">+237 670-123-456</p>
              <p className="text-xs text-(--brand-primary)/60">
                Available every day from 10:00 AM to 8:30 PM.
              </p>
              <a
                href="https://wa.me/237670123456?text=Hi%20Abby%27s%20Corner%2C%20I%27d%20like%20to%20book%20a%20fragrance%20bar%20session."
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-(--brand-primary) px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--brand-light) transition hover:bg-black"
              >
                Book a fragrance bar session
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-(--brand-primary)">
              Email
            </h2>
            <p className="text-sm text-(--brand-primary)/80">
              For partnerships, bulk orders or other requests, you can also contact us by email.
            </p>
            <div className="space-y-1 rounded-2xl border border-(--brand-primary)/15 bg-white p-4 text-sm">
              <p className="font-medium text-(--brand-primary)">Email</p>
              <p className="text-(--brand-primary)/80">hello@abbyscorner.cm</p>
            </div>
          </div>
        </section>
      </main>
      <FooterWrapper />
    </div>
  );
}

