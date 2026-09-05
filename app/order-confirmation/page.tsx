import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <CheckCircle2 className="mx-auto text-primary" size={48} />
      <h1 className="mt-4 font-display text-3xl text-primary">
        Order placed
      </h1>
      <p className="mt-2 text-foreground/60">
        Thanks — we&apos;ve received your order. If it includes a
        prescription item, we&apos;ll verify it before confirming. You&apos;ll
        get a call or WhatsApp message shortly.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Continue shopping
      </Link>
    </div>
  );
}
