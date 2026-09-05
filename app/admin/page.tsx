"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  items: { name: string; price: number; qty: number }[];
  total: number;
  payment_method: string;
  payment_reference?: string;
  requires_prescription: boolean;
  prescription_url?: string;
  receipt_url?: string;
  status: "pending" | "confirmed" | "rejected" | "fulfilled";
  created_at: string;
};

const statusColors: Record<Order["status"], string> = {
  pending: "bg-accent/20 text-accent-dark",
  confirmed: "bg-primary/10 text-primary",
  rejected: "bg-urgent/10 text-urgent",
  fulfilled: "bg-sage text-primary-dark",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("pharmex-admin-pw");
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function fetchOrders() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-password": password },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders);
    } catch {
      setError("Wrong password or failed to load orders.");
      setAuthed(false);
      sessionStorage.removeItem("pharmex-admin-pw");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: Order["status"]) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("pharmex-admin-pw", password);
    setAuthed(true);
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-5 py-24">
        <h1 className="font-display text-2xl text-primary">Admin login</h1>
        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-sage px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Log in
          </button>
          {error && <p className="text-sm text-urgent">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-primary">Orders</h1>
        <button
          onClick={fetchOrders}
          className="rounded-full border border-sage px-4 py-2 text-sm hover:border-primary"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="mt-6 text-foreground/50">Loading…</p>}

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-sage bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{order.customer_name} — {order.phone}</p>
                <p className="text-sm text-foreground/60">{order.address}, {order.city}</p>
                <p className="mt-1 text-xs text-foreground/40">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>

            <ul className="mt-3 space-y-1 text-sm text-foreground/70">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.qty} × {item.name} — Rs. {(item.price * item.qty).toLocaleString()}
                </li>
              ))}
            </ul>

            <p className="mt-2 font-medium">Total: Rs. {order.total.toLocaleString()}</p>
            <p className="text-sm text-foreground/60">
              Payment: {order.payment_method}
              {order.payment_reference ? ` (ref: ${order.payment_reference})` : ""}
            </p>

            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              {order.receipt_url && (
                <a href={order.receipt_url} target="_blank" className="text-primary underline">
                  View payment screenshot
                </a>
              )}
              {order.prescription_url && (
                <a href={order.prescription_url} target="_blank" className="text-urgent underline">
                  View prescription
                </a>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => updateStatus(order.id, "confirmed")}
                className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
              >
                Confirm
              </button>
              <button
                onClick={() => updateStatus(order.id, "fulfilled")}
                className="rounded-full bg-sage px-4 py-1.5 text-xs font-semibold text-primary-dark hover:bg-sage/80"
              >
                Mark fulfilled
              </button>
              <button
                onClick={() => updateStatus(order.id, "rejected")}
                className="rounded-full bg-urgent/10 px-4 py-1.5 text-xs font-semibold text-urgent hover:bg-urgent/20"
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {!loading && orders.length === 0 && (
          <p className="text-foreground/50">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
