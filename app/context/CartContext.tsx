"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartProduct = {
  id: string;
  name: string;
  fullName: string;
  price: number;
  image: string;
  volume?: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
  getProduct: (productId: string) => CartProduct | undefined;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Record<string, CartProduct>>({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products?activeOnly=false");
        if (!res.ok) return;
        const data = await res.json();
        const map: Record<string, CartProduct> = {};
        for (const p of data) {
          map[p._id] = {
            id: p._id,
            name: p.name ?? "",
            fullName: p.fullName ?? p.name ?? "",
            price: p.price ?? 0,
            image: p.image ?? "/images/product-1.jpg",
            volume: p.volume ?? "",
          };
        }
        setProducts(map);
      } catch (error) {
        console.error("Failed to load cart products:", error);
      }
    };

    loadProducts();
  }, []);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const p = products[i.productId];
    return sum + (p ? p.price * i.quantity : 0);
  }, 0);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    totalItems,
    totalPrice,
    getProduct: (productId: string) => products[productId],
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
