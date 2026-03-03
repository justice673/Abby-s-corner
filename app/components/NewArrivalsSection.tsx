"use client";

import { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const arrivals = [
  {
    id: "1",
    name: "Eau de parfum — Signature",
    description: "Floral ambré",
    price: "À partir de 29 520 FCFA",
    image: "/images/new-arrivals-1.jpg",
  },
  {
    id: "2",
    name: "Eau de parfum — Lumière",
    description: "Notes fraîches",
    price: "À partir de 27 552 FCFA",
    image: "/images/new-arrivals-2.webp",
  },
  {
    id: "3",
    name: "Eau de parfum — Sillage",
    description: "Bois et musc",
    price: "À partir de 31 488 FCFA",
    image: "/images/product-1.jpg",
  },
  {
    id: "4",
    name: "Bougie parfumée — Jardin",
    description: "Fleurs blanches",
    price: "18 368 FCFA",
    image: "/images/product-2.jpg",
  },
  {
    id: "5",
    name: "Brume cheveux — Douceur",
    description: "Sillage subtil",
    price: "14 432 FCFA",
    image: "/images/product-3.png",
  },
  {
    id: "6",
    name: "Coffret découverte",
    description: "3 miniatures",
    price: "22 960 FCFA",
    image: "/images/product-4.jpg",
  },
];

export default function NewArrivalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScroll - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-(--brand-primary)">
            Nouveautés
          </h2>
          <p className="mt-1 text-sm text-(--brand-primary)/70">
            Les derniers articles ajoutés à notre collection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Précédent"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--brand-primary)/20 bg-white text-(--brand-primary) transition hover:bg-(--brand-light) disabled:opacity-40 disabled:hover:bg-white"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Suivant"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--brand-primary)/20 bg-white text-(--brand-primary) transition hover:bg-(--brand-light) disabled:opacity-40 disabled:hover:bg-white"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="-mx-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-6 sm:gap-8">
          {arrivals.map((item) => (
            <a
              key={item.id}
              href="#"
              className="group flex w-[220px] shrink-0 flex-col overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 overflow-hidden bg-black/5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-1 p-4">
                <h3 className="text-sm font-semibold text-(--brand-primary)">
                  {item.name}
                </h3>
                <p className="text-xs text-(--brand-primary)/70">
                  {item.description}
                </p>
                <p className="mt-1 text-sm font-medium text-(--brand-primary)">
                  {item.price}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div className="mt-6 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-(--brand-primary)/15">
          <div
            className="h-full rounded-full bg-(--brand-primary) transition-all duration-200"
            style={{ width: `${(scrollProgress + 0.01) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
