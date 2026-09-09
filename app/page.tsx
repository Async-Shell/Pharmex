import Link from "next/link";
import Image from "next/image";
import { categories, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import {
  ShieldCheck,
  Wallet,
  Clock3,
  ArrowRight,
  Star,
  FileCheck2,
  PackageCheck,
  Truck,
} from "lucide-react";

const steps = [
  {
    icon: FileCheck2,
    title: "Order or upload a prescription",
    body: "Browse the shop, or snap a photo of your prescription at checkout.",
  },
  {
    icon: PackageCheck,
    title: "Our pharmacist checks it",
    body: "Every medicine order is reviewed before it's packed.",
  },
  {
    icon: Truck,
    title: "Delivered same day",
    body: "Order before 8pm and it's at your door the same evening.",
  },
];

const testimonials = [
  {
    name: "Ayesha K.",
    area: "Gulberg, Lahore",
    quote:
      "Ordered my mother's BP medicine at night and it was delivered by morning. The pharmacist even called to confirm the dosage.",
  },
  {
    name: "Bilal R.",
    area: "DHA, Karachi",
    quote:
      "I use Pharmex for the monthly grocery run now — rice, oil, atta, all in one order alongside the vitamins.",
  },
  {
    name: "Sana M.",
    area: "F-10, Islamabad",
    quote: "Easypaisa checkout was painless, and support replied on WhatsApp within minutes.",
  },
];

export default function Home() {
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sage bg-primary text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-24 md:grid-cols-2 md:items-center">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              <Star size={12} className="fill-primary-light text-primary-light" />
              Rated 4.8 by 2,000+ households
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl leading-[1.08] sm:text-5xl">
              Medicine and groceries, from one trusted counter.
            </h1>
            <p className="mt-4 max-w-md text-white/80">
              Order what your household needs — from paracetamol to rice —
              and get it delivered the same day. Prescription items are
              checked by our pharmacist before dispatch.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="btn-3d-light inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary-dark hover:bg-sage-light"
              >
                Browse products <ArrowRight size={16} />
              </Link>
              <Link
                href="/products?category=pharmacy"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Upload a prescription
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1000"
              alt="Pharmacist preparing an order"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 500px"
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-white/95 p-3 text-primary-dark shadow-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                <ShieldCheck size={16} />
              </span>
              <div>
                <p className="text-xs font-semibold">Pharmacist-verified orders</p>
                <p className="text-[11px] text-primary-dark/60">Checked before every dispatch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="font-display text-2xl text-primary">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.id}`}
              className="surface-3d group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl"
            >
              <Image
                src={c.image}
                alt={c.label}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/10 to-transparent" />
              <div className="relative p-4 text-white">
                <p className="font-display text-lg">{c.label}</p>
                <p className="text-xs text-white/75">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="border-t border-sage bg-sage-light">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl text-primary">Bestsellers this week</h2>
              <p className="mt-1 text-sm text-foreground/60">What your neighbours are ordering most.</p>
            </div>
            <Link href="/products" className="hidden text-sm font-medium text-primary hover:underline sm:block">
              View all
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl text-primary">How Pharmex works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="surface-3d relative rounded-2xl border border-sage bg-white p-6">
              <span className="font-display text-4xl text-sage">{`0${i + 1}`}</span>
              <step.icon className="mt-3 text-primary" size={22} />
              <p className="mt-3 font-display text-lg text-foreground">{step.title}</p>
              <p className="mt-1 text-sm text-foreground/60">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-sage bg-primary text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <ShieldCheck size={22} className="shrink-0 text-accent" />
            <div>
              <p className="font-display text-lg">Pharmacist-verified</p>
              <p className="mt-1 text-sm text-white/70">
                Every prescription order is checked before it leaves the store.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wallet size={22} className="shrink-0 text-accent" />
            <div>
              <p className="font-display text-lg">Local payments</p>
              <p className="mt-1 text-sm text-white/70">
                Pay with JazzCash, Easypaisa, or cash on delivery.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock3 size={22} className="shrink-0 text-accent" />
            <div>
              <p className="font-display text-lg">Same-day delivery</p>
              <p className="mt-1 text-sm text-white/70">
                Order before 8pm and get it the same evening, locally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl text-primary">What customers say</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="surface-3d rounded-2xl border border-sage bg-white p-6">
              <div className="flex gap-0.5 text-primary-light">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-primary-light" />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground/70">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-medium">{t.name}</p>
              <p className="text-xs text-foreground/50">{t.area}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="surface-3d flex flex-col items-start gap-4 rounded-3xl border border-sage bg-white px-8 py-10 text-primary-dark sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl">Need something today?</p>
            <p className="mt-1 text-sm text-primary-dark/70">
              Browse the full shop or send us your prescription to get started.
            </p>
          </div>
          <Link
            href="/products"
            className="btn-3d inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Start shopping <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
