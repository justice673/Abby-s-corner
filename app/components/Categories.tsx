"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type HomeCategory = {
  label: string;
  href: string;
  area: string;
  image: string;
  subtitle?: string;
  highlightLine?: string;
  bullets?: string[];
  ctaLabel?: string;
};

function CategoryCard({ cat }: { cat: HomeCategory }) {
  return (
    <Link
      href={cat.href}
      className="group relative flex items-end overflow-hidden p-4"
      style={{ gridArea: cat.area }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url(${cat.image})` }}
      />
      <div className="absolute inset-0 bg-black/45 transition-colors duration-500 group-hover:bg-black/35" />
      <div className="relative z-10 flex w-full flex-col gap-1.5 text-white sm:gap-2">
        <span className="text-sm font-semibold leading-snug sm:text-base md:text-lg">
          {cat.label}
        </span>
        {cat.subtitle && (
          <p className="hidden max-w-sm text-[11px] leading-snug text-white/80 sm:block sm:text-xs">
            {cat.subtitle}
          </p>
        )}
        {cat.highlightLine && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
            {cat.highlightLine}
          </p>
        )}
        {cat.bullets && cat.bullets.length > 0 && (
          <ul className="mt-1 hidden list-disc space-y-0.5 pl-4 text-[11px] text-white/80 sm:block">
            {cat.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        {cat.ctaLabel && (
          <span className="mt-1 inline-flex w-fit min-h-[2.1rem] items-center rounded-full bg-white/95 px-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-(--brand-primary) sm:mt-2 sm:text-[11px] sm:tracking-[0.18em]">
            {cat.ctaLabel}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch from actual Category table (categories marked for homepage)
        const res = await fetch("/api/homepage/categories");
        if (res.ok) {
          const data = await res.json();
          if (data.categories) {
            setCategories(data.categories);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-32 animate-pulse rounded bg-black/10 mb-6" />
        <div className="grid gap-3 sm:grid-cols-3" style={{ gridTemplateRows: "260px 180px" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-black/10" />
          ))}
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-xl font-semibold uppercase tracking-[0.18em] text-(--brand-primary)">
        Categories
      </h2>

      {/* Desktop grid */}
      <div
        className="hidden gap-3 sm:grid"
        style={{
          gridTemplateColumns: "2fr 1fr 1fr",
          gridTemplateRows: "260px 180px 180px",
          gridTemplateAreas: `
            "a b f"
            "a c d"
            "e c d"
          `,
        }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.area + cat.href} cat={cat} />
        ))}
      </div>

      {/* Mobile grid */}
      <div
        className="grid gap-3 sm:hidden"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "200px 140px 140px 140px",
          gridTemplateAreas: `
            "a a"
            "b f"
            "c d"
            "e e"
          `,
        }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.area + cat.href} cat={cat} />
        ))}
      </div>
    </section>
  );
}
