"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

type PaymentMethod = "jazzcash" | "easypaisa" | "cod";

export default function CheckoutPage() {
  const { lines, subtotal, requiresPrescription, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("jazzcash");
  const [reference, setReference] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [prescription, setPrescription] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (method !== "cod" && !receipt) {
      setError("Please upload a screenshot of your payment before placing the order.");
      return;
    }
    if (requiresPrescription && !prescription) {
      setError("Please upload your prescription for the medicine items in your cart.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("customer_name", name);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("payment_method", method);
      formData.append("payment_reference", reference);
      formData.append("requires_prescription", String(requiresPrescription));
      formData.append("total", String(subtotal));
      formData.append("items", JSON.stringify(lines));
      if (receipt) formData.append("receipt", receipt);
      if (prescription) formData.append("prescription", prescription);

      const res = await fetch("/api/orders", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to place order");

      clearCart();
      router.push("/order-confirmation");
    } catch {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-foreground/60">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-display text-3xl text-primary">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="rounded-2xl border border-sage bg-white p-5">
          <h2 className="font-display text-lg text-foreground">Delivery details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-sage px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              required
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-sage px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              required
              placeholder="Delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-xl border border-sage px-4 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2"
            />
            <input
              required
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border border-sage px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {requiresPrescription && (
          <div className="rounded-2xl border border-urgent/40 bg-white p-5">
            <h2 className="font-display text-lg text-foreground">Prescription</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Required for the medicine items in your cart. Our pharmacist
              verifies it before your order is confirmed.
            </p>
            <input
              required
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setPrescription(e.target.files?.[0] ?? null)}
              className="mt-3 text-sm"
            />
          </div>
        )}

        <div className="rounded-2xl border border-sage bg-white p-5">
          <h2 className="font-display text-lg text-foreground">Payment</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(
              [
                { id: "jazzcash", label: "JazzCash" },
                { id: "easypaisa", label: "Easypaisa" },
                { id: "cod", label: "Cash on delivery" },
              ] as { id: PaymentMethod; label: string }[]
            ).map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setMethod(opt.id)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
                  method === opt.id
                    ? "border-primary bg-primary text-white"
                    : "border-sage text-foreground/70"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {method !== "cod" && (
            <div className="mt-4 space-y-3 rounded-xl bg-sage-light p-4 text-sm">
              <p>
                Send <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>{" "}
                to our {method === "jazzcash" ? "JazzCash" : "Easypaisa"} account:
              </p>
              <p className="font-display text-lg text-primary">0300-0000000 (Pharmex Store)</p>
              <p className="text-foreground/60">
                Then upload a screenshot of the payment and, if you like, the
                transaction ID below. We&apos;ll confirm your order once verified.
              </p>
              <input
                placeholder="Transaction ID (optional)"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full rounded-lg border border-sage bg-white px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                className="text-sm"
              />
            </div>
          )}

          {method === "cod" && (
            <p className="mt-4 text-sm text-foreground/60">
              Pay in cash when your order is delivered.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-sage bg-white p-5">
          <span className="font-medium">Total</span>
          <span className="font-display text-2xl text-primary">
            Rs. {subtotal.toLocaleString()}
          </span>
        </div>

        {error && (
          <p className="rounded-xl bg-urgent/10 p-3 text-sm text-urgent">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-3d w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
