"use client";

import { useState } from "react";
import { approveReview, rejectReview, deleteReview } from "@/lib/actions/reviews";
import type { Review, ReviewStatus } from "@/lib/actions/reviews";

const AVATAR_COLORS = ["#6c63ff", "#0ea5e9", "#f59e0b", "#f472b6", "#22c55e", "#8b5cf6"];

const STATUS_BADGE: Record<ReviewStatus, { label: string; bg: string; color: string }> = {
  pending:  { label: "Pending",  bg: "rgba(245,158,11,0.1)",  color: "#d97706" },
  approved: { label: "Approved", bg: "rgba(34,197,94,0.1)",   color: "#16a34a" },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.1)",   color: "#dc2626" },
};

function StarRow({ stars }: { stars: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={12} height={12} viewBox="0 0 24 24"
          fill={i < stars ? "#f59e0b" : "none"}
          stroke={i < stars ? "#f59e0b" : "#d1d5db"}
          strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function ReviewRow({ review, index }: { review: Review; index: number }) {
  const [status, setStatus] = useState<ReviewStatus>(review.status);
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);

  if (removed) return null;

  const badge = STATUS_BADGE[status];

  async function handle(action: "approve" | "reject" | "delete") {
    if (action === "delete" && !confirm(`Permanently delete review by ${review.name}?`)) return;
    setBusy(true);
    if (action === "approve") { await approveReview(review.id); setStatus("approved"); }
    if (action === "reject")  { await rejectReview(review.id);  setStatus("rejected"); }
    if (action === "delete")  { await deleteReview(review.id);  setRemoved(true); }
    setBusy(false);
  }

  const date = new Date(review.created_at).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <tr className="border-b border-gray-100 last:border-0 align-top">
      {/* Avatar + name */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: AVATAR_COLORS[index % AVATAR_COLORS.length],
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "0.75rem", color: "#fff",
          }}>
            {review.initials}
          </div>
          <div>
            <div className="font-semibold text-ink text-sm">{review.name}</div>
            <div className="text-xs text-gray-400">{[review.role, review.company].filter(Boolean).join(" · ") || "—"}</div>
          </div>
        </div>
      </td>

      {/* Quote */}
      <td className="py-4 px-4 max-w-[280px]">
        <p className="text-sm text-gray-600 italic line-clamp-2">&ldquo;{review.quote}&rdquo;</p>
      </td>

      {/* Stars */}
      <td className="py-4 px-4">
        <StarRow stars={review.stars} />
      </td>

      {/* Date */}
      <td className="py-4 px-4 text-xs text-gray-400 whitespace-nowrap">{date}</td>

      {/* Status badge */}
      <td className="py-4 px-4">
        <span style={{ background: badge.bg, color: badge.color, fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: 100, display: "inline-block", textTransform: "capitalize" }}>
          {badge.label}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {status !== "approved" && (
            <button
              onClick={() => handle("approve")}
              disabled={busy}
              className="text-xs font-semibold px-3 py-1.5 rounded-md border border-green-200 text-green-600 hover:bg-green-50 disabled:opacity-50 transition-colors"
            >
              Approve
            </button>
          )}
          {status !== "rejected" && (
            <button
              onClick={() => handle("reject")}
              disabled={busy}
              className="text-xs font-semibold px-3 py-1.5 rounded-md border border-yellow-200 text-yellow-600 hover:bg-yellow-50 disabled:opacity-50 transition-colors"
            >
              Reject
            </button>
          )}
          <button
            onClick={() => handle("delete")}
            disabled={busy}
            className="text-xs font-semibold px-3 py-1.5 rounded-md border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {busy ? "…" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}

type FilterStatus = "all" | ReviewStatus;

export default function ReviewsManager({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);
  const counts = {
    all:      reviews.length,
    pending:  reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
    rejected: reviews.filter(r => r.status === "rejected").length,
  };

  const TABS: { key: FilterStatus; label: string }[] = [
    { key: "all",      label: "All" },
    { key: "pending",  label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
        <p className="text-gray-500 text-sm">No reviews yet. They&apos;ll appear here once customers submit them.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors capitalize ${
              filter === key
                ? "bg-ink text-white border-ink"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {label}
            <span className="ml-1 opacity-60">{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Pending call-out */}
      {counts.pending > 0 && filter !== "rejected" && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#d97706" }}>
          <span>⏳</span>
          <span>{counts.pending} review{counts.pending > 1 ? "s" : ""} waiting for approval</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Customer</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Review</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stars</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Submitted</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <ReviewRow key={r.id} review={r} index={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
