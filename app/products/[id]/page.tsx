import { getProduct, getRelated, products } from "@/lib/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Check, Truck, ShieldCheck } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const related = getRelated(product);

  const discount = product.originalPrice
    ? Math.round(100 - (product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <nav className="mb-6 text-xs text-foreground/50">
        <Link href="/products" className="hover:text-primary">Products</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/products?category=${product.category}`} className="capitalize hover:text-primary">
          {product.category.replace("-", " ")}
        </Link>
      </nav>

      <div className="grid gap-10 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-sage bg-sage-light">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 500px"
            priority
          />
          {product.bestseller && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              Bestseller
            </span>
          )}
        </div>

        <div>
          {product.requiresPrescription && (
            <span className="inline-block rounded-full bg-clay px-3 py-1 text-xs font-semibold text-white">
              Prescription required
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl text-foreground text-balance">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-accent">
              <Star size={14} className="fill-accent" />
              <span className="font-medium text-foreground">{product.rating}</span>
            </div>
            <span className="text-foreground/40">({product.reviewCount} reviews)</span>
            <span className="text-foreground/30">·</span>
            <span className="text-foreground/50">{product.unit}</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <p className="font-display text-3xl text-primary">
              Rs. {product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <>
                <p className="text-foreground/40 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </p>
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent-dark">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-foreground/70">{product.description}</p>

          <ul className="mt-4 space-y-1.5">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-foreground/70">
                <Check size={15} className="mt-0.5 shrink-0 text-primary" />
                {d}
              </li>
            ))}
          </ul>

          {product.requiresPrescription && (
            <p className="mt-4 rounded-xl bg-clay-light p-3 text-sm text-foreground/70">
              You&apos;ll be asked to upload a valid prescription at checkout.
              Our pharmacist verifies it before the order is confirmed.
            </p>
          )}

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-sage pt-5 text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-primary" />
              Same-day delivery on orders placed before 8pm
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              Sourced from licensed suppliers
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-primary">You may also need</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
