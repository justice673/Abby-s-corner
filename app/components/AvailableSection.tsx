"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";
import { formatPriceCFA } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

interface Product {
  _id: string;
  id?: string;
  name: string;
  fullName: string;
  brand: string;
  price: number;
  image: string;
  tags: string[];
  stockLeft?: number;
  stock?: number;
  tete?: string;
  coeur?: string;
  fond?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
}

function ProductCard({
  product,
  isLiked,
  onLike,
  onAddToCart,
}: {
  product: Product;
  isLiked: boolean;
  onLike: () => void;
  onAddToCart: () => void;
}) {
  const productId = product._id || product.id || "";
  const stockLeft = product.stockLeft ?? product.stock ?? 0;
  const topNotes = product.tete || product.topNotes || "";
  const heartNotes = product.coeur || product.heartNotes || "";
  const baseNotes = product.fond || product.baseNotes || "";

  return (
    <Link
      href={`/shop/${productId}`}
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
          {stockLeft} left
        </span>
      </div>
      <div className="flex flex-col gap-1 p-2 sm:p-2.5">
        {/* Tags - oval pills */}
        <div className="flex flex-wrap gap-1">
          {product.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-(--brand-primary)/10 px-2 py-0.5 text-[10px] font-medium text-(--brand-primary) sm:text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="line-clamp-2 text-xs font-semibold uppercase leading-tight text-(--brand-primary) sm:text-sm">
          {product.fullName || product.name}
        </h3>
        <p className="text-[10px] text-(--brand-primary)/70 sm:text-xs">
          {product.brand}
        </p>
        <p className="text-xs font-semibold text-(--brand-primary) sm:text-sm">
          {formatPriceCFA(product.price)}
        </p>
        {/* Scent notes - compact */}
        {(topNotes || heartNotes || baseNotes) && (
          <p className="line-clamp-2 text-[10px] leading-tight text-gray-800 sm:text-xs">
            {topNotes && <><span className="font-medium text-(--brand-primary)">Top:</span> {topNotes} · </>}
            {heartNotes && <><span className="font-medium text-(--brand-primary)">Heart:</span> {heartNotes} · </>}
            {baseNotes && <><span className="font-medium text-(--brand-primary)">Base:</span> {baseNotes}</>}
          </p>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded border border-(--brand-primary)/30 bg-(--brand-light) py-1.5 text-[10px] font-semibold text-(--brand-primary) transition hover:bg-(--brand-primary)/5 sm:py-2 sm:text-xs"
        >
          <FiShoppingCart className="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </Link>
  );
}

export default function AvailableSection() {
  const { addItem } = useCart();
  const { likedIds, toggleLike } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=8");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-40 animate-pulse rounded bg-black/10" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-black/10" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 sm:h-44 md:h-48 rounded bg-black/10" />
              <div className="mt-2 h-4 w-3/4 rounded bg-black/10" />
              <div className="mt-1 h-3 w-1/2 rounded bg-black/10" />
              <div className="mt-1 h-4 w-1/3 rounded bg-black/10" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-(--brand-primary)">
            What we have
          </h2>
          <p className="mt-1 text-sm text-(--brand-primary)/70">
            Discover our selection of perfumes and available products
          </p>
        </div>
        <Link
          href="/shop"
          className="group relative shrink-0 overflow-hidden rounded border-2 border-(--brand-primary) bg-white px-5 py-2.5 text-sm font-semibold text-(--brand-primary) transition-colors"
        >
          <span
            className="absolute inset-x-0 top-0 h-0 bg-(--brand-light) transition-[height] duration-300 ease-out group-hover:h-full"
            aria-hidden
          />
          <span className="relative z-10">See more</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => {
          const productId = product._id || product.id || "";
          return (
            <ProductCard
              key={productId}
              product={product}
              isLiked={likedIds.has(productId)}
              onLike={() => toggleLike(productId)}
              onAddToCart={() => addItem(productId)}
            />
          );
        })}
      </div>
    </section>
  );
}
