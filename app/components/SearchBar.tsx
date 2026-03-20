"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiX, FiArrowRight } from "react-icons/fi";

interface Product {
  _id: string;
  name: string;
  fullName?: string;
  brand: string;
  image: string;
  price: number;
  slug?: string;
  tags?: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

interface SearchBarProps {
  variant?: "desktop" | "mobile" | "overlay";
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  variant = "desktop",
  onClose,
  autoFocus = false,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    products: Product[];
    categories: Category[];
  }>({ products: [], categories: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults({ products: [], categories: [] });
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowResults(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
        setShowResults(false);
        if (onClose) onClose();
      }
    },
    [query, router, onClose]
  );

  const handleProductClick = useCallback(() => {
    setShowResults(false);
    setQuery("");
    if (onClose) onClose();
  }, [onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasResults = results.products.length > 0 || results.categories.length > 0;

  // Base styles for different variants
  const inputStyles = {
    desktop:
      "w-full rounded-full border border-black/60 bg-white px-4 py-1.5 pr-16 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/40 focus:border-black/40 focus:outline-none focus:ring-0",
    mobile:
      "w-full bg-transparent text-xs outline-none text-(--brand-primary) placeholder:text-(--brand-primary)/40",
    overlay:
      "w-full bg-transparent text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/40 outline-none",
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        {variant === "desktop" && (
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowResults(true)}
              placeholder="Search perfumes, brands..."
              className={inputStyles.desktop}
              autoFocus={autoFocus}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults({ products: [], categories: [] });
                  inputRef.current?.focus();
                }}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-(--brand-primary)/40 hover:text-(--brand-primary)"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
            {!query && (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.18em] text-(--brand-primary)/40">
                {isLoading ? "..." : "Search"}
              </span>
            )}
          </div>
        )}

        {variant === "mobile" && (
          <div className="relative flex w-full items-center rounded-full border border-black/10 bg-white px-3 py-1.5">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowResults(true)}
              placeholder="Search perfumes, brands..."
              className={inputStyles.mobile}
              autoFocus={autoFocus}
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults({ products: [], categories: [] });
                }}
                className="ml-2 text-(--brand-primary)/40"
              >
                <FiX className="h-4 w-4" />
              </button>
            ) : (
              <FiSearch className="ml-2 h-4 w-4 text-(--brand-primary)/60" />
            )}
          </div>
        )}

        {variant === "overlay" && (
          <div className="relative flex-1 items-center rounded-full bg-white px-3 py-1.5">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowResults(true)}
              placeholder="Search perfumes, brands..."
              className={inputStyles.overlay}
              autoFocus={autoFocus}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white"
            >
              <FiSearch className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </form>

      {/* Results dropdown */}
      {showResults && (query.length >= 2) && (
        <div
          className={`absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl ${
            variant === "overlay" ? "mx-0" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--brand-primary)/20 border-t-(--brand-primary)" />
            </div>
          ) : hasResults ? (
            <div className="max-h-[70vh] overflow-y-auto">
              {/* Categories */}
              {results.categories.length > 0 && (
                <div className="border-b border-black/5 p-3">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-(--brand-primary)/50">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/shop?category=${cat.slug}`}
                        onClick={handleProductClick}
                        className="inline-flex items-center gap-1.5 rounded-full bg-(--brand-primary)/5 px-3 py-1.5 text-sm font-medium text-(--brand-primary) transition hover:bg-(--brand-primary)/10"
                      >
                        {cat.name}
                        <FiArrowRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {results.products.length > 0 && (
                <div className="p-2">
                  <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-(--brand-primary)/50">
                    Products
                  </p>
                  <div className="space-y-1">
                    {results.products.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product.slug || product._id}`}
                        onClick={handleProductClick}
                        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-(--brand-primary)/5"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/5">
                          <Image
                            src={product.image || "/images/product-1.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium uppercase tracking-wider text-(--brand-primary)/50">
                            {product.brand}
                          </p>
                          <p className="truncate text-sm font-medium text-(--brand-primary)">
                            {product.name}
                          </p>
                          <p className="text-sm font-semibold text-(--brand-primary)">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* View all results */}
              <div className="border-t border-black/5 p-2">
                <button
                  onClick={handleSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--brand-primary) py-2.5 text-sm font-medium text-white transition hover:bg-(--brand-primary)/90"
                >
                  View all results for &quot;{query}&quot;
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-(--brand-primary)/60">
                No results found for &quot;{query}&quot;
              </p>
              <p className="mt-1 text-xs text-(--brand-primary)/40">
                Try different keywords or browse categories
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
