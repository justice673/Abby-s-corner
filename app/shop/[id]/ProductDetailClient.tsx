"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiShoppingCart, FiShare2, FiShield } from "react-icons/fi";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { formatPriceCFA } from "@/lib/utils";
import {
  getSimilarProducts,
  categoryLabels,
  type Product,
} from "@/lib/products";

const dummyReviews = [
  { author: "Marie D.", rating: 5, date: "15 janv. 2025", text: "Parfum magnifique, livraison rapide. Je recommande !" },
  { author: "Jean K.", rating: 4, date: "8 janv. 2025", text: "Très satisfait du produit. Emballage soigné." },
  { author: "Sophie L.", rating: 5, date: "2 janv. 2025", text: "Exactement comme décrit. Parfum authentique." },
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <IoStar key={`f-${i}`} className="h-4 w-4 text-amber-400" />
      ))}
      {hasHalf && <IoStar className="h-4 w-4 text-amber-400/80" />}
      {Array.from({ length: empty }).map((_, i) => (
        <IoStarOutline key={`e-${i}`} className="h-4 w-4 text-(--brand-primary)/30" />
      ))}
    </div>
  );
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const categoryLabel = categoryLabels[product.category] ?? product.category;
  const similarProducts = getSimilarProducts(product.id);
  const images = product.images ?? [product.image];
  const mainImage = images[selectedImageIndex] ?? product.image;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-(--brand-primary)/70">
        <Link href="/" className="hover:text-(--brand-primary)">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-(--brand-primary)">
          Produits
        </Link>
        <span className="mx-2">/</span>
        <span className="text-(--brand-primary)">{categoryLabel}</span>
        <span className="mx-2">/</span>
        <span className="text-(--brand-primary)">{product.brand}</span>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Left: Product images */}
        <div className="flex flex-col gap-4 lg:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-black/5">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImageIndex(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden bg-black/5 sm:h-20 sm:w-20 ${
                  selectedImageIndex === i
                    ? "ring-2 ring-(--brand-primary) ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${product.name} vue ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product details */}
        <div className="flex-1 lg:w-1/2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-(--brand-primary) sm:text-3xl font-heading">
                {product.fullName}
              </h1>
              <p className="mt-1 text-sm font-medium text-(--brand-primary)/70">
                {product.brand}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Ajouter aux favoris"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-(--brand-primary)/20 text-(--brand-primary) transition hover:bg-(--brand-primary)/5"
                onClick={() => setIsLiked(!isLiked)}
              >
                <FiHeart
                  className={`h-5 w-5 ${isLiked ? "fill-(--brand-primary)" : ""}`}
                />
              </button>
              <button
                type="button"
                aria-label="Partager"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-(--brand-primary)/20 text-(--brand-primary) transition hover:bg-(--brand-primary)/5"
              >
                <FiShare2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-sm text-(--brand-primary)/70">
              {product.reviewCount} avis
            </span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-2xl font-bold text-(--brand-primary) sm:text-3xl">
              {formatPriceCFA(product.price)}
            </p>
            <p className="mt-1 text-sm font-medium text-emerald-600">
              {formatPriceCFA(product.price)} frais de port inclus
            </p>
          </div>

          {/* Specs */}
          <dl className="mt-6 space-y-3 border-t border-(--brand-primary)/10 pt-6">
            <div className="flex justify-between text-sm">
              <dt className="text-(--brand-primary)/70">Marque</dt>
              <dd className="font-medium">{product.brand}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-(--brand-primary)/70">État</dt>
              <dd className="font-medium">{product.condition}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-(--brand-primary)/70">Volume</dt>
              <dd className="font-medium">{product.volume}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-(--brand-primary)/70">Catégorie</dt>
              <dd className="font-medium">{categoryLabel}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-(--brand-primary)/70">Notes</dt>
              <dd className="font-medium text-gray-800">
                <span className="text-(--brand-primary)">Tête:</span> {product.tete} · <span className="text-(--brand-primary)">Cœur:</span> {product.coeur} · <span className="text-(--brand-primary)">Fond:</span> {product.fond}
              </dd>
            </div>
          </dl>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-(--brand-primary)">
              Description
            </h2>
            <p className="mt-2 text-sm text-(--brand-primary)/80 leading-relaxed">
              {product.description ??
                `${product.fullName} de ${product.brand}. Une fragrance d'exception.`}
            </p>
          </div>

          {/* Buyer protection */}
          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-(--brand-primary)/10 p-4 sm:flex-row sm:items-center">
            <FiShield className="h-8 w-8 shrink-0 text-(--brand-primary)" />
            <div className="min-w-0">
              <p className="font-semibold text-(--brand-primary)">
                Protection acheteur
              </p>
              <p className="mt-0.5 text-sm text-(--brand-primary)/70">
                Paiement sécurisé et remboursement garanti
              </p>
            </div>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            className="mt-6 w-full rounded-full bg-emerald-600 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-700 sm:w-auto sm:px-10"
          >
            <span className="flex items-center justify-center gap-2">
              <FiShoppingCart className="h-5 w-5" />
              Ajouter au panier
            </span>
          </button>
        </div>
      </div>

      {/* Reviews section */}
      <section className="mt-16 border-t border-(--brand-primary)/10 pt-12">
        <h2 className="text-xl font-bold text-(--brand-primary)">
          Avis clients
        </h2>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="shrink-0 space-y-2">
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-sm font-semibold text-(--brand-primary)">
                {product.rating}
              </span>
            </div>
            <p className="text-sm text-(--brand-primary)/70">
              {product.reviewCount} avis
            </p>
            <button
              type="button"
              className="rounded-full border border-(--brand-primary)/30 px-4 py-2 text-sm font-medium text-(--brand-primary) transition hover:bg-(--brand-primary)/5"
            >
              Tous ({product.reviewCount})
            </button>
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            {dummyReviews.map((review, i) => (
              <div
                key={i}
                className="rounded-lg border border-(--brand-primary)/10 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-(--brand-primary)/60">
                    {review.date}
                  </span>
                </div>
                <p className="mt-2 font-medium text-(--brand-primary)">
                  {review.author}
                </p>
                <p className="mt-1 text-sm text-(--brand-primary)/80">
                  {review.text}
                </p>
              </div>
            ))}
            <div className="rounded-lg border border-(--brand-primary)/10 p-8 text-center">
              <p className="text-(--brand-primary)/70">
                Connecte-toi pour laisser un avis
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Similar products */}
      <section className="mt-12 border-t border-(--brand-primary)/10 pt-8 sm:mt-16 sm:pt-12">
        <h2 className="text-xl font-bold text-(--brand-primary)">
          Articles similaires
        </h2>
        {similarProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similarProducts.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-black/5">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-(--brand-primary)">
                    {p.fullName}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-(--brand-primary)">
                    {formatPriceCFA(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-(--brand-primary)/60">
            Aucun article similaire pour le moment
          </p>
        )}
      </section>
    </main>
  );
}
