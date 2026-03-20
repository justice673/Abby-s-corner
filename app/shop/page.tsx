"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import { FiHeart, FiShoppingCart, FiRefreshCw, FiChevronDown } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";
import { formatPriceCFA } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

type ShopProduct = {
  id: string;
  name: string;
  fullName: string;
  brand: string;
  tags: string[];
  condition: string;
  category: string;
  price: number;
  tete: string;
  coeur: string;
  fond: string;
  volume: string;
  stockLeft: number;
  image: string;
  images: string[];
  createdAt?: string;
};

const conditionToId: Record<string, string> = {
  "New with tag": "neuf-etiquette",
  "New without tag": "neuf-sans",
  "Very good condition": "tres-bon",
  "Good condition": "bon",
  "Satisfactory": "satisfaisant",
};

const idToCondition: Record<string, string> = Object.fromEntries(
  Object.entries(conditionToId).map(([k, v]) => [v, k])
);

const sortOptions = [
  { value: "recent", label: "Most recent" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function ProductCard({
  product,
  isLiked,
  onLike,
  onAddToCart,
}: {
  product: ShopProduct;
  isLiked: boolean;
  onLike: () => void;
  onAddToCart: () => void;
}) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-32 overflow-hidden bg-black/5 sm:h-44 md:h-48">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onLike();
          }}
          aria-label="Add to favorites"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-(--brand-primary) shadow-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white"
        >
          <FiHeart
            className={`h-4 w-4 ${isLiked ? "fill-(--brand-primary) text-(--brand-primary)" : ""}`}
          />
        </button>
        <span className="absolute bottom-2 right-2 bg-white rounded-full border-2 border-emerald-500 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          {product.stockLeft} left
        </span>
      </div>
      <div className="flex flex-col gap-2 p-2.5 sm:p-3">
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-(--brand-primary)/10 px-2.5 py-0.5 text-xs font-medium text-(--brand-primary)"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-(--brand-primary)">
          {product.fullName}
        </h3>
        <p className="text-xs font-medium text-(--brand-primary)/70">
          {product.brand}
        </p>
        <p className="text-sm font-semibold text-(--brand-primary)">
          {formatPriceCFA(product.price)}
        </p>
        {(product.tete || product.coeur || product.fond) && (
          <div className="space-y-0.5 text-xs text-gray-800">
            {product.tete && <p><span className="font-medium text-(--brand-primary)">Top:</span> {product.tete}</p>}
            {product.coeur && <p><span className="font-medium text-(--brand-primary)">Heart:</span> {product.coeur}</p>}
            {product.fond && <p><span className="font-medium text-(--brand-primary)">Base:</span> {product.fond}</p>}
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart();
          }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-(--brand-primary)/30 bg-(--brand-light) py-2 text-xs font-semibold text-(--brand-primary) transition hover:bg-(--brand-primary)/5 sm:mt-3"
        >
          <FiShoppingCart className="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </Link>
  );
}

function ShopPageInner() {
  const { addItem } = useCart();
  const { likedIds, toggleLike } = useFavorites();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilters, setCategoryFilters] = useState<Set<string>>(new Set());
  const [conditionFilters, setConditionFilters] = useState<Set<string>>(new Set());
  const [volumeFilters, setVolumeFilters] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState("recent");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        const mapped: ShopProduct[] = (data || []).map((p: { _id: string; name?: string; fullName?: string; brand?: string; tags?: string[]; condition?: string; category?: string; price?: number; tete?: string; coeur?: string; fond?: string; volume?: string; stockLeft?: number; image?: string; images?: string[]; createdAt?: string }) => ({
          id: p._id,
          name: p.name ?? "",
          fullName: p.fullName ?? p.name ?? "",
          brand: p.brand ?? "",
          tags: p.tags ?? [],
          condition: p.condition ?? "New with tag",
          category: p.category ?? "",
          price: p.price ?? 0,
          tete: p.tete ?? "",
          coeur: p.coeur ?? "",
          fond: p.fond ?? "",
          volume: p.volume ?? "",
          stockLeft: p.stockLeft ?? 0,
          image: p.image ?? "/images/product-1.jpg",
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image ?? "/images/product-1.jpg"],
          createdAt: p.createdAt,
        }));
        setProducts(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Initialize filters from URL params (?category=...&brand=...&search=...)
  useEffect(() => {
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");

    if (category) {
      setCategoryFilters(new Set([category]));
    } else {
      setCategoryFilters(new Set());
    }

    // Brand is handled via products filtering below
  }, [searchParams]);

  const toggleFilter = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetFilters = () => {
    setCategoryFilters(new Set());
    setConditionFilters(new Set());
    setVolumeFilters(new Set());
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort().map((id) => ({ id, label: id }));

  const conditions = [
    { id: "neuf-etiquette", label: "New with tag" },
    { id: "neuf-sans", label: "New without tag" },
    { id: "tres-bon", label: "Very good condition" },
    { id: "bon", label: "Good condition" },
    { id: "satisfaisant", label: "Satisfactory" },
  ];

  const volumes = Array.from(
    new Set(products.map((p) => p.volume).filter(Boolean))
  ).sort();

  const urlBrand = searchParams.get("brand");
  const urlSearch = searchParams.get("search")?.toLowerCase().trim() || "";

  const filteredProducts = products.filter((p) => {
    if (urlBrand && p.brand.toLowerCase() !== urlBrand.toLowerCase()) return false;
    if (urlSearch) {
      const haystack = `${p.name} ${p.fullName} ${p.brand} ${(p.tags || []).join(" ")}`.toLowerCase();
      if (!haystack.includes(urlSearch)) return false;
    }
    if (categoryFilters.size && !categoryFilters.has(p.category)) return false;
    if (conditionFilters.size) {
      const condId = conditionToId[p.condition] ?? "satisfaisant";
      if (!conditionFilters.has(condId)) return false;
    }
    if (volumeFilters.size && !volumeFilters.has(p.volume)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "recent" && a.createdAt && b.createdAt) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main className="mx-auto max-w-[100rem] px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-(--brand-primary)/70">
          <Link href="/" className="hover:text-(--brand-primary)">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-(--brand-primary)">Products</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filter sidebar - 1/4 */}
          <aside className="w-full shrink-0 lg:w-1/4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-(--brand-primary)">
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-sm font-medium text-(--brand-primary) hover:underline"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  Reset filters
                </button>
              </div>

              {/* Categories */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-(--brand-primary)">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-(--brand-primary)/90 hover:text-(--brand-primary)">
                        <input
                          type="checkbox"
                          checked={categoryFilters.has(cat.id)}
                          onChange={() => toggleFilter(setCategoryFilters, cat.id)}
                          className="h-4 w-4 rounded border-(--brand-primary)/30 text-(--brand-primary)"
                        />
                        {cat.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Condition */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-(--brand-primary)">
                  Condition
                </h3>
                <ul className="space-y-2">
                  {conditions.map((cond) => (
                    <li key={cond.id}>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-(--brand-primary)/90 hover:text-(--brand-primary)">
                        <input
                          type="checkbox"
                          checked={conditionFilters.has(cond.id)}
                          onChange={() => toggleFilter(setConditionFilters, cond.id)}
                          className="h-4 w-4 rounded border-(--brand-primary)/30 text-(--brand-primary)"
                        />
                        {cond.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Volume */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-(--brand-primary)">
                  Volume
                </h3>
                <div className="flex flex-wrap gap-2">
                  {volumes.map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => toggleFilter(setVolumeFilters, vol)}
                      className={`px-3 py-1.5 text-xs font-medium transition ${
                        volumeFilters.has(vol)
                          ? "bg-(--brand-primary) text-(--brand-light)"
                          : "bg-white text-(--brand-primary) ring-1 ring-(--brand-primary)/20 hover:ring-(--brand-primary)/40"
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-(--brand-primary)">
                  Price (FCFA)
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full rounded border border-(--brand-primary)/30 bg-white px-3 py-2 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/50 focus:border-(--brand-primary) focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full rounded border border-(--brand-primary)/30 bg-white px-3 py-2 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/50 focus:border-(--brand-primary) focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid - 3/4 */}
          <div className="min-w-0 flex-1 lg:w-3/4">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-(--brand-primary)/70">
                {sortedProducts.length} item{sortedProducts.length !== 1 ? "s" : ""}
              </p>
              <div className="relative flex items-center gap-2">
                <span className="text-sm font-medium text-(--brand-primary)">
                  Sort:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-auto min-w-0 appearance-none rounded-full border border-(--brand-primary)/30 bg-white py-2 pl-4 pr-7 text-sm text-(--brand-primary) focus:border-(--brand-primary) focus:outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-(--brand-primary)" />
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="flex items-center gap-2 text-(--brand-primary)/70">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading products…</span>
                </div>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-(--brand-primary)/10 bg-white/50 py-12 text-center">
                <p className="font-medium text-(--brand-primary)">No products match your filters.</p>
                <p className="mt-1 text-sm text-(--brand-primary)/70">
                  Try resetting filters or check back later.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-full bg-(--brand-primary) px-4 py-2 text-sm font-medium text-white hover:bg-(--brand-primary)/90"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isLiked={likedIds.has(product.id)}
                    onLike={() => toggleLike(product.id)}
                    onAddToCart={() => addItem(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
          <Navbar />
          <main className="mx-auto max-w-[100rem] px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-sm text-(--brand-primary)/70">Loading products…</div>
          </main>
        </div>
      }
    >
      <ShopPageInner />
    </Suspense>
  );
}
