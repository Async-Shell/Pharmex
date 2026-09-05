"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Product } from "./products";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  unit: string;
  requiresPrescription: boolean;
  image: string;
  qty: number;
};

type CartContextType = {
  lines: CartLine[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  requiresPrescription: boolean;
  count: number;
  toast: string | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "pharmex-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLines(JSON.parse(saved));
      } catch {
        // ignore corrupted cart data
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    }
  }, [lines, hydrated]);

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }

  function addItem(product: Product, qty = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.id === product.id ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          requiresPrescription: product.requiresPrescription,
          image: product.image,
          qty,
        },
      ];
    });
    showToast(`Added ${product.name} to cart`);
  }

  function removeItem(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l)));
  }

  function clearCart() {
    setLines([]);
  }

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [lines]
  );
  const requiresPrescription = useMemo(
    () => lines.some((l) => l.requiresPrescription),
    [lines]
  );
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  return (
    <CartContext.Provider
      value={{
        lines,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        subtotal,
        requiresPrescription,
        count,
        toast,
      }}
    >
      {children}
      {toast && (
        <div
          role="status"
          className="animate-toast fixed left-1/2 top-4 z-[100] -translate-x-1/2 rounded-full bg-primary-dark px-5 py-2.5 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
