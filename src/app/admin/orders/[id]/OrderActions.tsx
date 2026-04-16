"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;
type OrderStatus = (typeof statuses)[number];

export default function OrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Failed to update status.");
        return;
      }
      router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to update status.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function cancelOrder() {
    if (!confirm("Cancel this order?")) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Failed to cancel.");
        return;
      }
      setStatus("cancelled");
      router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to cancel.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
      <div className="flex items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-brand-yellow/50"
        >
          {statuses.map((s) => (
            <option key={s} value={s} className="text-black">
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={updateStatus}
          disabled={loading}
          className="rounded-xl bg-brand-yellow px-5 py-3 font-bold text-brand-black hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>

      <button
        onClick={cancelOrder}
        disabled={loading}
        className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-bold text-red-200 hover:bg-red-500/15 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Cancel order
      </button>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}

