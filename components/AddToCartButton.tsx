"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/products";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-full border border-sage">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="p-2.5 hover:text-primary"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center text-sm">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="p-2.5 hover:text-primary"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        onClick={handleAdd}
        className="btn-3d flex-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark sm:flex-none"
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
