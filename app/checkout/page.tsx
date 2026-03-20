"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useCart } from "@/app/context/CartContext";
import { formatPriceCFA } from "@/lib/utils";
import {
  FiShoppingCart,
  FiDollarSign,
  FiSmartphone,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER =
  typeof process.env.NEXT_PUBLIC_WHATSAPP_NUMBER === "string" &&
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.trim() !== ""
    ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(/\D/g, "")
    : "237670123456";

const PAYMENT_OPTIONS = [
  {
    value: "mtn-momo",
    label: "MTN Mobile Money",
    icon: "MTN",
    color: "bg-[#FFCC00] text-black",
  },
  {
    value: "orange-money",
    label: "Orange Money",
    icon: "OM",
    color: "bg-[#FF6600] text-white",
  },
  { value: "cash", label: "Cash", icon: "Cash", color: "bg-(--brand-primary) text-white" },
] as const;

const inputClass =
  "mt-2 w-full rounded-lg border border-(--brand-primary)/20 bg-transparent px-3 py-2.5 text-sm text-(--brand-primary) outline-none transition placeholder:text-(--brand-primary)/50 focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20";
const labelClass = "text-sm font-medium text-(--brand-primary)";

function buildWhatsAppMessage(
  form: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    deliveryNotes: string;
  },
  paymentLabel: string,
  items: { productId: string; quantity: number }[],
  totalPrice: number,
  orderRef: string | undefined,
  getProduct: (productId: string) => { fullName: string; price: number } | undefined
): string {
  const lines = [
    "🛒 *New order from Abby's Perfumery*",
    orderRef ? `📋 *Order Ref: ${orderRef}*` : null,
    "",
    "*Contact*",
    `Name: ${form.fullName}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    "",
    "*Delivery*",
    `Address: ${form.address}`,
    `City: ${form.city}`,
    form.deliveryNotes ? `Notes: ${form.deliveryNotes}` : null,
    "",
    "*Order*",
  ];
  for (const { productId, quantity } of items) {
    const product = getProduct(productId);
    if (!product) continue;
    const lineTotal = product.price * quantity;
    lines.push(
      `• ${product.fullName} x${quantity} — ${formatPriceCFA(lineTotal)}`
    );
  }
  lines.push(
    "",
    `*Subtotal: ${formatPriceCFA(totalPrice)}*`,
    `*Payment: ${paymentLabel}*`,
    "",
    "Please confirm availability and delivery."
  );
  return lines.filter(Boolean).join("\n");
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, getProduct } = useCart();
  const [payment, setPayment] = React.useState("");
  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    deliveryNotes: "",
  });
  const [orderRef, setOrderRef] = React.useState<string | null>(null);
  const [generatingRef, setGeneratingRef] = React.useState(false);

  const paymentLabel =
    PAYMENT_OPTIONS.find((p) => p.value === payment)?.label ?? payment;
  const canSend =
    Boolean(form.fullName.trim()) &&
    Boolean(form.phone.trim()) &&
    Boolean(form.address.trim()) &&
    Boolean(form.city.trim()) &&
    Boolean(payment);

  const generateOrderRef = async () => {
    try {
      setGeneratingRef(true);
      const res = await fetch("/api/orders/generate-ref", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: { name: form.fullName, phone: form.phone },
          total: totalPrice,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrderRef(data.orderRef);
        return data.orderRef;
      }
    } catch (error) {
      console.error("Failed to generate order ref:", error);
    } finally {
      setGeneratingRef(false);
    }
    return null;
  };

  const sendToWhatsApp = async () => {
    let ref = orderRef;
    if (!ref) {
      ref = await generateOrderRef();
    }
    const text = encodeURIComponent(
      buildWhatsAppMessage(form, paymentLabel, items, totalPrice, ref || undefined, getProduct)
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
        <Navbar />
        <main className="min-h-screen pt-20">
          <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-dashed border-(--brand-primary)/20 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-(--brand-primary)/10 text-(--brand-primary)">
                <FiShoppingCart className="h-8 w-8" />
              </div>
              <h1 className="mt-4 font-heading text-xl font-semibold text-(--brand-primary)">
                Your cart is empty
              </h1>
              <p className="mt-2 text-sm text-(--brand-primary)/70">
                Add items from the shop, then come back here to checkout.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-block rounded-full bg-(--brand-primary) px-8 py-3 font-semibold text-white transition hover:bg-(--brand-primary)/90"
              >
                Go to shop
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-heading text-2xl font-bold text-(--brand-primary)">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-(--brand-primary)/70">
            Enter your details and send your order to us via WhatsApp.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <section className="rounded-xl border border-(--brand-primary)/10 p-6">
                <h2 className="font-semibold text-(--brand-primary)">
                  Contact & shipping
                </h2>
                <p className="mt-1 text-sm text-(--brand-primary)/70">
                  We&apos;ll use this to confirm your order and arrange delivery.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className={labelClass}>
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, fullName: e.target.value }))
                      }
                      placeholder="e.g. Jean Mbarga"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="e.g. +237 6XX XXX XXX"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className={labelClass}>
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={form.address}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, address: e.target.value }))
                      }
                      placeholder="Street, quarter"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className={labelClass}>
                      City / Area
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, city: e.target.value }))
                      }
                      placeholder="e.g. Yaoundé, Simbock"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="deliveryNotes" className={labelClass}>
                      Delivery notes (optional)
                    </label>
                    <textarea
                      id="deliveryNotes"
                      value={form.deliveryNotes}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, deliveryNotes: e.target.value }))
                      }
                      placeholder="Preferred time, landmarks, etc."
                      rows={4}
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-(--brand-primary)/10 p-6">
                <h2 className="font-semibold text-(--brand-primary)">
                  Payment method
                </h2>
                <p className="mt-1 text-sm text-(--brand-primary)/70">
                  How do you want to pay?
                </p>
                <select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  className={`${inputClass} mt-4 cursor-pointer appearance-none bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235b1722'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  }}
                >
                  <option value="">Select payment method</option>
                  {PAYMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {payment && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {payment === "mtn-momo" && (
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#FFCC00] px-3 py-1.5 text-xs font-bold text-black">
                        <FiSmartphone className="h-4 w-4" /> MTN Mobile Money
                      </span>
                    )}
                    {payment === "orange-money" && (
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#FF6600] px-3 py-1.5 text-xs font-bold text-white">
                        <FiSmartphone className="h-4 w-4" /> Orange Money
                      </span>
                    )}
                    {payment === "cash" && (
                      <span className="inline-flex items-center gap-2 rounded-lg bg-(--brand-primary) px-3 py-1.5 text-xs font-bold text-white">
                        <FiDollarSign className="h-4 w-4" /> Cash
                      </span>
                    )}
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-28 rounded-xl border border-(--brand-primary)/10 p-6">
                <h2 className="font-semibold text-(--brand-primary)">
                  Order summary
                </h2>
                <ul className="mt-4 space-y-3 border-b border-(--brand-primary)/10 pb-4">
                  {items.map(({ productId, quantity }) => {
                    const product = getProduct(productId);
                    if (!product) return null;
                    const lineTotal = product.price * quantity;
                    return (
                      <li
                        key={productId}
                        className="flex gap-3 text-sm"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-(--brand-light)">
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-(--brand-primary)">
                            {product.fullName}
                          </p>
                          <p className="text-(--brand-primary)/70">
                            {quantity} × {formatPriceCFA(product.price)}
                          </p>
                        </div>
                        <p className="shrink-0 font-semibold text-(--brand-primary)">
                          {formatPriceCFA(lineTotal)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex justify-between py-3 text-base font-semibold text-(--brand-primary)">
                  <span>Total</span>
                  <span>{formatPriceCFA(totalPrice)}</span>
                </div>
                <p className="text-xs text-(--brand-primary)/70">
                  Delivery and payment details will be confirmed via WhatsApp.
                </p>
                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 font-semibold text-white transition hover:bg-[#20BD5A] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canSend || generatingRef}
                  onClick={sendToWhatsApp}
                >
                  <FaWhatsapp className="h-5 w-5" />
                  {generatingRef ? "Preparing order..." : "Send order to WhatsApp"}
                </button>
                {orderRef && (
                  <p className="mt-2 text-center text-xs font-medium text-(--brand-primary)">
                    Your order reference: <span className="font-mono font-bold">{orderRef}</span>
                  </p>
                )}
                <p className="mt-3 text-center text-xs text-(--brand-primary)/70">
                  We&apos;ll reply to discuss payment and delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
