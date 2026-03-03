"use client";

import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import { EmptyStateLottie } from "@/app/components/EmptyStateLottie";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/app/components/ui/sheet";
import { useCart } from "@/app/context/CartContext";
import { getProductById } from "@/lib/products";
import { formatPriceCFA } from "@/lib/utils";

export default function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader className="border-b border-black/5">
          <SheetTitle>Panier</SheetTitle>
          {totalItems > 0 && (
            <p className="text-sm text-(--brand-primary)/70">
              {totalItems} article{totalItems > 1 ? "s" : ""}
            </p>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
              <div className="w-40 h-40 shrink-0">
                <EmptyStateLottie />
              </div>
              <p className="text-center text-sm font-medium text-(--brand-primary)/80">
                Votre panier est vide.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ productId, quantity }) => {
                const product = getProductById(productId);
                if (!product) return null;
                return (
                  <li
                    key={productId}
                    className="flex gap-3 rounded-xl border border-black/5 bg-(--brand-light)/30 p-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-(--brand-primary)">
                        {product.name}
                      </p>
                      <p className="text-xs text-(--brand-primary)/70">
                        {product.volume}
                      </p>
                      <p className="mt-1 font-semibold text-(--brand-primary)">
                        {formatPriceCFA(product.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-full border border-(--brand-primary)/20 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(productId, quantity - 1)
                            }
                            className="rounded-l-full px-2 py-1 text-(--brand-primary) hover:bg-(--brand-light)"
                          >
                            −
                          </button>
                          <span className="min-w-[1.5rem] text-center text-sm font-medium text-(--brand-primary)">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(productId, quantity + 1)
                            }
                            className="rounded-r-full px-2 py-1 text-(--brand-primary) hover:bg-(--brand-light)"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(productId)}
                          aria-label="Supprimer"
                          className="rounded-full p-1.5 text-(--brand-primary)/70 transition hover:bg-(--brand-light) hover:text-(--brand-primary)"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-row gap-2 border-t border-black/5 p-4">
            <div className="flex w-full flex-col gap-3">
              <div className="flex justify-between text-sm font-semibold text-(--brand-primary)">
                <span>Total</span>
                <span>{formatPriceCFA(totalPrice)}</span>
              </div>
              <button
                type="button"
                className="w-full rounded-full bg-(--brand-primary) py-3 font-semibold uppercase tracking-[0.18em] text-(--brand-light) transition hover:bg-[#4a101a]"
              >
                Commander
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
