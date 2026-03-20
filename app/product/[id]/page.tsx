"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import ProductDetailClient from "@/app/shop/[id]/ProductDetailClient";
import type { Product as DummyProductType } from "@/lib/products";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product, setProduct] = useState<DummyProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          setError("Product not found");
          return;
        }
        const data = await res.json();

        const adapted: DummyProductType = {
          id: data._id,
          name: data.name,
          fullName: data.fullName,
          brand: data.brand,
          tags: data.tags || [],
          condition: data.condition || "New with tag",
          category: data.category,
          price: data.price,
          tete: data.tete || "",
          coeur: data.coeur || "",
          fond: data.fond || "",
          volume: data.volume || "",
          stockLeft: data.stockLeft ?? 0,
          image: data.image || "/images/product-1.jpg",
          images: data.images && data.images.length > 0 ? data.images : [data.image || "/images/product-1.jpg"],
          rating: data.rating ?? 0,
          reviewCount: data.reviewCount ?? 0,
          description: data.description,
        };

        setProduct(adapted);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
        <Navbar />
        <main className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16">
          <p className="text-sm text-(--brand-primary)/70">Loading product…</p>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">Product not found</h1>
          <a
            href="/shop"
            className="mt-4 inline-block text-(--brand-primary) hover:underline"
          >
            Back to store
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <ProductDetailClient product={product} />
    </div>
  );
}

