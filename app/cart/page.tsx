"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { lines, updateQty, removeItem, subtotal, requiresPrescription } =
    useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-display text-2xl text-primary">Your cart is empty</h1>
        <p className="mt-2 text-foreground/60">
          Add products from the shop to see them here.
        </p>
        <Link
          href="/products"
          className="btn-3d mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-3xl text-primary">Your cart</h1>

      <div className="surface-3d mt-6 divide-y divide-sage rounded-2xl border border-sage bg-white">
        {lines.map((line) => (
          <div key={line.id} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sage-light">
              <Image src={line.image} alt={line.name} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{line.name}</p>
              <p className="text-xs text-foreground/50">
                Rs. {line.price.toLocaleString()}
                {line.requiresPrescription && (
                  <span className="ml-2 text-urgent">Rx required</span>
                )}
              </p>
            </div>
            <div className="flex items-center rounded-full border border-sage">
              <button
                onClick={() => updateQty(line.id, line.qty - 1)}
                className="p-2 hover:text-primary"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-5 text-center text-sm">{line.qty}</span>
              <button
                onClick={() => updateQty(line.id, line.qty + 1)}
                className="p-2 hover:text-primary"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <p className="w-20 text-right text-sm font-medium">
              Rs. {(line.price * line.qty).toLocaleString()}
            </p>
            <button
              onClick={() => removeItem(line.id)}
              className="text-foreground/40 hover:text-urgent"
              aria-label={`Remove ${line.name}`}
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      {requiresPrescription && (
        <p className="mt-4 rounded-xl bg-sage-light p-3 text-sm text-foreground/70">
          Your cart includes prescription items. You&apos;ll upload a
          prescription photo at checkout.
        </p>
      )}

      <div className="mt-6 flex items-center justify-between surface-3d rounded-2xl border border-sage bg-white p-4">
        <span className="font-medium">Subtotal</span>
        <span className="font-display text-xl text-primary">
          Rs. {subtotal.toLocaleString()}
        </span>
      </div>

      <Link
        href="/checkout"
        className="btn-3d mt-6 block rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
