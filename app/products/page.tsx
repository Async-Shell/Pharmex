import { categories, products, Category } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const activeCategory = category as Category | undefined;

  let filtered = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-3xl text-primary">
        {q ? `Results for "${q}"` : "All products"}
      </h1>
      <p className="mt-1 text-sm text-foreground/50">{filtered.length} products</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full border px-4 py-1.5 text-sm ${
            !activeCategory
              ? "border-primary bg-primary text-white"
              : "border-sage text-foreground/70 hover:border-primary"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.id}`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              activeCategory === c.id
                ? "border-primary bg-primary text-white"
                : "border-sage text-foreground/70 hover:border-primary"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <SearchX size={32} className="text-foreground/30" />
          <p className="mt-3 text-foreground/60">
            No products match {q ? `"${q}"` : "this category"} yet.
          </p>
          <Link href="/products" className="mt-3 text-sm font-medium text-primary hover:underline">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
