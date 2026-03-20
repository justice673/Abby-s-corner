"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LikesHero from "../components/LikesHero";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";
import { formatPriceCFA } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

type LikedProduct = {
  _id: string;
  name: string;
  fullName: string;
  brand: string;
  tags: string[];
  price: number;
  tete?: string;
  coeur?: string;
  fond?: string;
  stockLeft?: number;
  stock?: number;
  image: string;
};

function ProductCard({
  product,
  onRemove,
  onAddToCart,
}: {
  product: LikedProduct;
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div className="group flex flex-col overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md">
      <a href="#" className="relative block overflow-hidden">
        <div className="relative h-48 overflow-hidden bg-black/5">
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
              onRemove();
            }}
            aria-label="Remove from favorites"
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-(--brand-primary) shadow-sm transition hover:bg-white"
          >
            <FiHeart className="h-4 w-4 fill-(--brand-primary) text-(--brand-primary)" />
          </button>
          <span className="absolute bottom-2 right-2 bg-white rounded-full border-2 border-emerald-500 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            {product.stockLeft} left
          </span>
        </div>
      </a>
      <div className="flex flex-col gap-2 p-3">
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
        <div className="space-y-0.5 text-xs text-gray-800">
          <p><span className="font-medium text-(--brand-primary)">Top:</span> {product.tete}</p>
          <p><span className="font-medium text-(--brand-primary)">Heart:</span> {product.coeur}</p>
          <p><span className="font-medium text-(--brand-primary)">Base:</span> {product.fond}</p>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-(--brand-primary)/30 bg-(--brand-light) py-2 text-xs font-semibold text-(--brand-primary) transition hover:bg-(--brand-primary)/5"
        >
          <FiShoppingCart className="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default function LikesPage() {
  const { addItem } = useCart();
  const { likedIds, toggleLike } = useFavorites();
  const [products, setProducts] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (likedIds.size === 0) {
          setProducts([]);
          return;
        }
        const res = await fetch("/api/products?activeOnly=true");
        if (!res.ok) return;
        const data = await res.json();
        const setIds = new Set(likedIds);
        const filtered = (data || []).filter((p: { _id: string }) =>
          setIds.has(p._id)
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to load liked products:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [likedIds]);

  const removeFromLikes = (id: string) => {
    toggleLike(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main>
        <LikesHero />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-sm text-(--brand-primary)/70">
              Loading your favorites…
            </p>
          ) : products.length === 0 ? (
            <p className="text-center text-sm text-(--brand-primary)/70">
              No products in your favorites at the moment.
            </p>
          ) : (
            <>
              <p className="mb-6 text-sm text-(--brand-primary)/70">
                {products.length} item{products.length !== 1 ? "s" : ""} in your favorites
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onRemove={() => removeFromLikes(product.id)}
                    onAddToCart={() => addItem(product.id)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
