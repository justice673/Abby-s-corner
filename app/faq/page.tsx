"use client";

import Navbar from "@/app/components/Navbar";
import FooterWrapper from "@/app/components/FooterWrapper";

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-(--brand-primary)/60">
            Help
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-(--brand-primary) sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-(--brand-primary)/80 sm:text-base">
            A quick overview of how ordering, delivery and payments work with Abby&apos;s Corner.
          </p>
        </section>

        <section className="mt-10 space-y-6 text-sm text-(--brand-primary)/85">
          <div>
            <h2 className="font-semibold text-(--brand-primary)">How do I place an order?</h2>
            <p className="mt-2">
              Browse the shop, add items to your cart and then go to checkout. Your order will be
              confirmed and finalized via WhatsApp with our team.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-(--brand-primary)">Which cities do you deliver to?</h2>
            <p className="mt-2">
              We mainly serve Douala and Yaoundé, but we can arrange delivery to other cities in
              Cameroon on request. Details are confirmed during the WhatsApp conversation.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-(--brand-primary)">Which payment methods are available?</h2>
            <p className="mt-2">
              We support MTN Mobile Money, Orange Money and cash when appropriate. The exact method
              is agreed with you for each order.
            </p>
          </div>
        </section>
      </main>
      <FooterWrapper />
    </div>
  );
}

