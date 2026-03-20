"use client";

import { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Arrival {
  name: string;
  description: string;
  price: string;
  image: string;
  link?: string;
}

export default function NewArrivalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [title, setTitle] = useState("New arrivals");
  const [subtitle, setSubtitle] = useState("The latest items added to our collection");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        // Fetch from actual Product table (newest products)
        const res = await fetch("/api/homepage/new-arrivals?limit=8");
        if (res.ok) {
          const data = await res.json();
          if (data.arrivals) {
            setArrivals(data.arrivals);
          }
        }
      } catch (error) {
        console.error("Failed to fetch arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArrivals();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;
      requestAnimationFrame(() => {
        setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < maxScroll - 1);
      });
    };

    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [arrivals]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="h-8 w-40 animate-pulse rounded bg-black/10" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-black/10" />
        </div>
        <div className="flex gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[220px] shrink-0">
              <div className="h-44 animate-pulse rounded bg-black/10" />
              <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-black/10" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-black/10" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!arrivals.length) return null;

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
            {title}
          </h2>
          <p className="mt-1 text-sm text-(--brand-primary)/70">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--brand-primary)/20 bg-white text-(--brand-primary) transition hover:bg-(--brand-light) disabled:opacity-40 disabled:hover:bg-white"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next"
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
          {arrivals.map((item, index) => (
            <a
              key={index}
              href={item.link || "#"}
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
