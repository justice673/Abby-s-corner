"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import LikesHero from "../components/LikesHero";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";
import { formatPriceCFA } from "@/lib/utils";

const likedProducts = [
  {
    id: "1",
    name: "Terre d'Hermès",
    fullName: "TERRE D'HERMÈS - EAU DE PARFUM",
    brand: "HERMÈS",
    tags: ["Boisé", "Épicé"],
    price: 55800,
    tete: "Pamplemousse",
    coeur: "Épices",
    fond: "Bois de cèdre",
    stockLeft: 14,
    image: "/images/product-1.jpg",
  },
  {
    id: "2",
    name: "Black Orchid",
    fullName: "BLACK ORCHID - EAU DE PARFUM",
    brand: "TOM FORD",
    tags: ["Oriental", "Fleuri"],
    price: 78720,
    tete: "Truffe noire",
    coeur: "Orchidée",
    fond: "Patchouli",
    stockLeft: 8,
    image: "/images/product-2.jpg",
  },
  {
    id: "3",
    name: "N°5",
    fullName: "N°5 - EAU DE PARFUM",
    brand: "CHANEL",
    tags: ["Fleuri", "Aldéhydé"],
    price: 62320,
    tete: "Aldéhydes",
    coeur: "Iris",
    fond: "Vanille",
    stockLeft: 22,
    image: "/images/product-3.jpg",
  },
  {
    id: "4",
    name: "Santal 33",
    fullName: "SANTAL 33 - EAU DE PARFUM",
    brand: "LE LABO",
    tags: ["Boisé", "Cuir"],
    price: 108240,
    tete: "Cardamome",
    coeur: "Iris",
    fond: "Santal",
    stockLeft: 3,
    image: "/images/product-7.jpg",
  },
];

function ProductCard({
  product,
  onRemove,
  onAddToCart,
}: {
  product: (typeof likedProducts)[0];
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
            aria-label="Retirer des favoris"
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-(--brand-primary) shadow-sm transition hover:bg-white"
          >
            <FiHeart className="h-4 w-4 fill-(--brand-primary) text-(--brand-primary)" />
          </button>
          <span className="absolute bottom-2 right-2 bg-white rounded-full border-2 border-emerald-500 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            {product.stockLeft} restant{product.stockLeft > 1 ? "s" : ""}
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
          <p><span className="font-medium text-(--brand-primary)">Tête:</span> {product.tete}</p>
          <p><span className="font-medium text-(--brand-primary)">Coeur:</span> {product.coeur}</p>
          <p><span className="font-medium text-(--brand-primary)">Fond:</span> {product.fond}</p>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-(--brand-primary)/30 bg-(--brand-light) py-2 text-xs font-semibold text-(--brand-primary) transition hover:bg-(--brand-primary)/5"
        >
          <FiShoppingCart className="h-4 w-4" />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default function LikesPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState(likedProducts);

  const removeFromLikes = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main>
        <LikesHero />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <p className="text-center text-sm text-(--brand-primary)/70">
              Aucun produit dans vos favoris pour le moment.
            </p>
          ) : (
            <>
              <p className="mb-6 text-sm text-(--brand-primary)/70">
                {products.length} article{products.length !== 1 ? "s" : ""} dans vos favoris
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
