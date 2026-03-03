import { use } from "react";
import ProductDetailClient from "./ProductDetailClient";
import Navbar from "@/app/components/Navbar";
import { getProductById } from "@/lib/products";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">Produit introuvable</h1>
          <a
            href="/shop"
            className="mt-4 inline-block text-(--brand-primary) hover:underline"
          >
            Retour à la boutique
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
