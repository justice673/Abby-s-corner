"use client";

import { CartProvider as CartProviderInner } from "@/app/context/CartContext";
import CartSheet from "@/app/components/CartSheet";

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProviderInner>
      {children}
      <CartSheet />
    </CartProviderInner>
  );
}
