"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function FloatingCartButton() {
  const { count, subtotal } = useCart();

  if (count === 0) return null;

  return (
    <Link
      href="/cart"
      className="fab-3d animate-fade-up fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-primary py-3 pl-4 pr-5 text-white sm:bottom-8 sm:right-8"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
        <ShoppingCart size={18} />
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-primary-dark">
          {count}
        </span>
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-xs text-white/70">View cart</span>
        <span className="text-sm font-semibold">Rs. {subtotal.toLocaleString()}</span>
      </span>
    </Link>
  );
}
