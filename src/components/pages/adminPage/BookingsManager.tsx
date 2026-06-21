"use client";

import { useState } from "react";
import { updateBookingStatus, deleteBooking } from "@/lib/actions/bookings";
import type { Booking, BookingStatus } from "@/lib/types/content";

const STATUS_OPTIONS: BookingStatus[] = ["new", "contacted", "scheduled", "closed"];

function BookingRow({ booking }: { booking: Booking }) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);

  if (removed) return null;

  async function handleStatusChange(next: BookingStatus) {
    setStatus(next);
    setBusy(true);
    await updateBookingStatus(booking.id, next);
    setBusy(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete the booking from ${booking.name}? This can't be undone.`)) return;
    setBusy(true);
    const result = await deleteBooking(booking.id);
    setBusy(false);
    if (result.ok) setRemoved(true);
  }

  const createdAt = new Date(booking.created_at).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr className="border-b border-gray-100 last:border-0 align-top">
      <td className="py-3 px-4">
        <div className="font-semibold text-ink text-sm">{booking.name}</div>
        <a href={`mailto:${booking.email}`} className="text-xs text-accent hover:underline">
          {booking.email}
        </a>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{booking.slot}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{booking.company || "—"}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{booking.size || "—"}</td>
      <td className="py-3 px-4 text-sm text-gray-600 max-w-[220px]">
        <span className="line-clamp-2">{booking.goal || "—"}</span>
      </td>
      <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">{createdAt}</td>
      <td className="py-3 px-4">
        <select
          value={status}
          disabled={busy}
          onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
          className="text-xs font-medium rounded-md border border-gray-200 px-2 py-1.5 disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </td>
      <td className="py-3 px-4">
        <button
          onClick={handleDelete}
          disabled={busy}
          className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {busy ? "…" : "Delete"}
        </button>
      </td>
    </tr>
  );
}

export default function BookingsManager({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <p className="text-gray-500 text-sm">No bookings yet. They'll show up here as soon as someone books a demo.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {(["all", ...STATUS_OPTIONS] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors capitalize ${
              filter === opt
                ? "bg-ink text-white border-ink"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {opt}
            {opt !== "all" && (
              <span className="ml-1 opacity-60">
                {bookings.filter((b) => b.status === opt).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Contact</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Slot</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Company</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Size</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Goal</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Booked</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
