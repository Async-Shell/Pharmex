"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const { count } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-sage bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5">
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo.svg" alt="Pharmex" width={160} height={48} priority className="h-10 w-auto" />
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden flex-1 items-center gap-2 rounded-full border border-sage bg-white px-4 py-2 md:flex"
        >
          <Search size={16} className="text-foreground/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine, groceries, and more"
            className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
          />
        </form>

        <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
          <Link href="/products?category=pharmacy" className="hover:text-primary">
            Pharmacy
          </Link>
          <Link href="/products?category=grocery" className="hover:text-primary">
            Grocery
          </Link>
        </nav>

        <Link
          href="/cart"
          className="btn-3d relative flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary-dark">
              {count}
            </span>
          )}
        </Link>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="shrink-0 rounded-full border border-sage p-2.5 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-sage bg-background px-5 py-4 md:hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-full border border-sage bg-white px-4 py-2.5">
            <Search size={16} className="text-foreground/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
            />
          </form>
          <div className="mt-4 flex flex-col gap-3 text-sm font-medium">
            <Link href="/products" onClick={() => setMenuOpen(false)}>All products</Link>
            <Link href="/products?category=pharmacy" onClick={() => setMenuOpen(false)}>Pharmacy</Link>
            <Link href="/products?category=grocery" onClick={() => setMenuOpen(false)}>Grocery</Link>
            <Link href="/products?category=personal-care" onClick={() => setMenuOpen(false)}>Personal care</Link>
            <Link href="/products?category=household" onClick={() => setMenuOpen(false)}>Household</Link>
          </div>
        </div>
      )}
    </header>
  );
}
