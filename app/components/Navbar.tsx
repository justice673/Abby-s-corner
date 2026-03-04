"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
  FiHeart,
  FiChevronDown,
} from "react-icons/fi";

const navLinks = [
  { href: "#marques", label: "Brands", key: "marques" },
  { href: "#parfums", label: "Perfumes" },
  {
    href: "#maison-bien-etre",
    label: "Home & wellness",
    key: "maison",
  },
  { href: "#familles-olfactives", label: "Olfactory families" },
  { href: "#box-sillage", label: "Abby&apos;s Box" },
  { href: "#coffrets", label: "Gift sets" },
  { href: "#offres-exclusives", label: "🎁 Exclusive Offers" },
  { href: "#contact", label: "Contact" },
];

const marquesItems = [
  {
    id: "toutes-marques",
    label: "All brands",
    description:
      "Explore our full range of perfume houses, from the most iconic to new confidential signatures.",
    image: "/images/dropdown-1.webp",
    buttonText: "Discover all brands",
  },
  {
    id: "nouvelles-marques",
    label: "New brands",
    description:
      "New houses join our selection, chosen for their excellence and creativity.",
    image: "/images/dropdown-2.jpg",
    buttonText: "See what's new",
  },
  {
    id: "coups-de-coeur",
    label: "Favorites",
    description:
      "A curated selection of beloved houses, highly rated by our most loyal customers.",
    image: "/images/dropdown-3.webp",
    buttonText: "Discover the selection",
  },
];

const maisonItems = [
  {
    id: "cheveux",
    label: "Hair perfumes",
    description:
      "Delicate mists that fragrance your hair without weighing it down, for a subtle trail with every movement.",
    image: "/images/dropdown-4.webp",
    buttonText: "Discover the mists",
  },
  {
    id: "bougies",
    label: "Candles",
    description:
      "Create a warm atmosphere with our scented candles, inspired by your favorite accords.",
    image: "/images/dropdown-1.webp",
    buttonText: "View candles",
  },
  {
    id: "ambiance",
    label: "Home fragrances",
    description:
      "Diffusers, sprays and home rituals to fragrance every room with elegance.",
    image: "/images/dropdown-3.webp",
    buttonText: "Fragrance your home",
  },
  {
    id: "corps",
    label: "Body care",
    description:
      "Lotions, oils and rituals to extend your perfume on skin and elevate the gesture.",
    image: "/images/dropdown-2.jpg",
    buttonText: "View body care",
  },
];

export default function Navbar() {
  const { openCart, totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<"marques" | "maison" | null>(
    null,
  );
  const [hoveredMarquesId, setHoveredMarquesId] = useState<string | null>(
    marquesItems[0]?.id ?? null,
  );
  const [hoveredMaisonId, setHoveredMaisonId] = useState<string | null>(
    maisonItems[0]?.id ?? null,
  );

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-(--brand-light)/80 backdrop-blur-md">
      <nav className="relative mx-auto max-w-6xl px-4 py-2 md:px-6 lg:px-8">
        {/* Top bar: logo + icons */}
        <div className="flex items-center justify-between gap-4 py-1">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-9 w-38 sm:h-10 sm:w-40">
              <Image
                src="/images/logo.png"
                alt="Abby's Corner logo"
                fill
                className="object-contain text-(--brand-primary)"
                priority
              />
            </div>
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/likes"
              aria-label="Favorites"
              className="rounded-full border border-(--brand-primary)/15 p-2 text-(--brand-primary) transition hover:border-(--brand-primary)/40 hover:bg-white"
            >
              <FiHeart className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label="Cart"
              onClick={openCart}
              className="relative rounded-full border border-(--brand-primary)/15 p-2 text-(--brand-primary) transition hover:border-(--brand-primary)/40 hover:bg-white"
            >
              <FiShoppingBag className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--brand-primary) text-[10px] font-bold text-(--brand-light)">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <Link
              href="/login"
              aria-label="My account"
              className="rounded-full border border-(--brand-primary)/15 p-2 text-(--brand-primary) transition hover:border-(--brand-primary)/40 hover:bg-white"
            >
              <FiUser className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setIsOpen((open) => !open)}
              className="ml-1 inline-flex items-center justify-center rounded-full border border-(--brand-primary)/15 bg-white/80 p-2 text-(--brand-primary) transition hover:border-(--brand-primary)/40 hover:bg-white md:hidden"
            >
              {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Bottom bar: main navigation links */}
        <div className="mt-1 hidden border-t border-black/5 pt-2 md:block">
          <ul className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium uppercase tracking-[0.18em] text-(--brand-primary)/80">
            {navLinks.map((link) => {
              const isMega =
                link.key === "marques" || link.key === "maison";

              if (!isMega) {
                return (
                  <li key={link.href} className="group relative">
                    <a
                      href={link.href}
                      className="relative pb-1 transition-colors hover:text-(--brand-primary)"
                    >
                      <span>{link.label}</span>
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center scale-x-0 bg-(--brand-primary) transition-transform duration-200 group-hover:scale-x-100" />
                    </a>
                  </li>
                );
              }

              const isOpen =
                (link.key === "marques" && openMegaMenu === "marques") ||
                (link.key === "maison" && openMegaMenu === "maison");

              return (
                <li
                  key={link.href}
                  className="group relative"
                  onMouseEnter={() =>
                    setOpenMegaMenu(link.key as "marques" | "maison")
                  }
                  onMouseLeave={() => setOpenMegaMenu(null)}
                >
                  <button
                    type="button"
                    className="relative flex items-center gap-1 pb-1 transition-colors hover:text-(--brand-primary)"
                  >
                    <span>{link.label}</span>
                    <FiChevronDown className="h-3 w-3" />
                    <span
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center bg-(--brand-primary) transition-transform duration-200 ${
                        isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </button>

                  {/* Marques mega menu */}
                  {link.key === "marques" && openMegaMenu === "marques" && (
                    <div
                      className="fixed left-1/2 z-50 mt-3 w-[min(60rem,92vw)] -translate-x-1/2 pt-2"
                      style={{ top: "4.75rem" }}
                    >
                      <div className="min-h-[280px] bg-white/95 py-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
                        <div className="flex h-full divide-x divide-black/5">
                          {/* Left column: list */}
                          <div className="w-[40%] p-4">
                            <div className="space-y-1">
                              {marquesItems.map((item) => {
                                const isActive =
                                  hoveredMarquesId === item.id;
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onMouseEnter={() =>
                                      setHoveredMarquesId(item.id)
                                    }
                                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-left transition-colors ${
                                      isActive
                                        ? "bg-(--brand-light) text-(--brand-primary)"
                                        : "text-(--brand-primary)/80 hover:bg-(--brand-light)/70 hover:text-(--brand-primary)"
                                    }`}
                                  >
                                    <span>{item.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Right column: preview card */}
                          <div className="w-[60%] p-6">
                            {(() => {
                              const current =
                                marquesItems.find(
                                  (i) => i.id === hoveredMarquesId,
                                ) ?? marquesItems[0];
                              return (
                                <div className="flex min-h-[200px] flex-col gap-4 sm:flex-row sm:items-start">
                                  <div className="relative h-48 w-48 overflow-hidden rounded-xl bg-black/5">
                                    <img
                                      src={current.image}
                                      alt={current.label}
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                  <div className="flex flex-1 flex-col gap-3">
                                    <div>
                                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-(--brand-primary)">
                                        {current.label}
                                      </h3>
                                      <p className="mt-2 text-sm leading-relaxed text-(--brand-primary)/80">
                                        {current.description}
                                      </p>
                                    </div>
                                    <div className="mt-auto flex justify-end">
                                      <button
                                        type="button"
                                        className="group inline-flex items-center gap-2 rounded-full bg-(--brand-primary) px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-light) transition hover:bg-[#4a101a]"
                                      >
                                        <span>{current.buttonText}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Maison & bien etre mega menu */}
                  {link.key === "maison" && openMegaMenu === "maison" && (
                    <div
                      className="fixed left-1/2 z-50 mt-3 w-[min(60rem,92vw)] -translate-x-1/2 pt-2"
                      style={{ top: "4.75rem" }}
                    >
                      <div className="min-h-[280px] bg-white/95 py-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
                        <div className="flex h-full divide-x divide-black/5">
                          {/* Left column: list */}
                          <div className="w-[40%] p-4">
                            <div className="space-y-1">
                              {maisonItems.map((item) => {
                                const isActive =
                                  hoveredMaisonId === item.id;
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onMouseEnter={() =>
                                      setHoveredMaisonId(item.id)
                                    }
                                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-left transition-colors ${
                                      isActive
                                        ? "bg-(--brand-light) text-(--brand-primary)"
                                        : "text-(--brand-primary)/80 hover:bg-(--brand-light)/70 hover:text-(--brand-primary)"
                                    }`}
                                  >
                                    <span>{item.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Right column: preview card */}
                          <div className="w-[60%] p-6">
                            {(() => {
                              const current =
                                maisonItems.find(
                                  (i) => i.id === hoveredMaisonId,
                                ) ?? maisonItems[0];
                              return (
                                <div className="flex min-h-[200px] flex-col gap-4 sm:flex-row sm:items-start">
                                  <div className="relative h-48 w-48 overflow-hidden rounded-xl bg-black/5">
                                    <img
                                      src={current.image}
                                      alt={current.label}
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                  <div className="flex flex-1 flex-col gap-3">
                                    <div>
                                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-(--brand-primary)">
                                        {current.label}
                                      </h3>
                                      <p className="mt-2 text-sm leading-relaxed text-(--brand-primary)/80">
                                        {current.description}
                                      </p>
                                    </div>
                                    <div className="mt-auto flex justify-end">
                                      <button
                                        type="button"
                                        className="group inline-flex items-center gap-2 rounded-full bg-(--brand-primary) px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-light) transition hover:bg-[#4a101a]"
                                      >
                                        <span>{current.buttonText}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile bottom bar (collapsible) */}
        {isOpen && (
          <div className="mt-1 border-t border-black/5 pt-2 md:hidden">
            <ul className="flex flex-col gap-2 pb-2 text-sm font-medium text-(--brand-primary)/90">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block py-1.5 transition-colors hover:text-(--brand-primary)"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

