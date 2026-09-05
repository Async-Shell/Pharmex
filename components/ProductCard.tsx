"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Plus } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round(100 - (product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-sage bg-white transition hover:border-primary/40 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-sage-light">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.requiresPrescription && (
            <span className="rounded-full bg-clay px-2 py-1 text-[10px] font-semibold text-white">
              Rx required
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-semibold text-primary-dark">
              {discount}% off
            </span>
          )}
        </div>
        {product.bestseller && (
          <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-white">
            Bestseller
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link href={`/products/${product.id}`}>
          <p className="text-sm font-medium leading-snug text-foreground line-clamp-2">
            {product.name}
          </p>
        </Link>
        <p className="text-xs text-foreground/50">{product.unit}</p>

        <div className="flex items-center gap-1 text-xs text-foreground/60">
          <Star size={12} className="fill-accent text-accent" />
          <span>{product.rating}</span>
          <span className="text-foreground/30">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-display text-lg leading-none text-primary">
              Rs. {product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-foreground/40 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, 1);
            }}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
