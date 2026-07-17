"use client";

import { useState } from "react";
import { updateBookingStatus, deleteBooking } from "@/lib/actions/bookings";
import type { Booking, BookingStatus } from "@/lib/types/content";
import { Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, RefreshCw, X, Shield, Clock } from "lucide-react";

const STATUS_OPTIONS: BookingStatus[] = ["new", "contacted", "scheduled", "closed"];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function BookingRow({ booking, onStatusUpdate }: { booking: Booking, onStatusUpdate?: () => void }) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);

  if (removed) return null;

  async function handleStatusChange(next: BookingStatus) {
    setStatus(next);
    setBusy(true);
    const result = await updateBookingStatus(booking.id, next);
    setBusy(false);
    if (result.ok && onStatusUpdate) {
      onStatusUpdate();
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete the booking from ${booking.name}? This can't be undone.`)) return;
    setBusy(true);
    const result = await deleteBooking(booking.id);
    setBusy(false);
    if (result.ok) {
      setRemoved(true);
      if (onStatusUpdate) onStatusUpdate();
    }
  }

  const createdAt = new Date(booking.created_at).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr className="border-b border-[var(--border)] last:border-0 align-top hover:bg-[var(--surface-alt)]/50 transition-colors">
      <td className="py-4 px-4">
        <div className="font-semibold text-[var(--text)] text-sm">{booking.name}</div>
        <a href={`mailto:${booking.email}`} className="text-xs text-indigo-500 hover:underline">
          {booking.email}
        </a>
      </td>
      <td className="py-4 px-4 text-sm font-semibold text-[var(--text)]">{booking.slot}</td>
      <td className="py-4 px-4 text-sm text-[var(--text-muted)]">{booking.company || "—"}</td>
      <td className="py-4 px-4 text-sm text-[var(--text-muted)]">{booking.size || "—"}</td>
      <td className="py-4 px-4 text-sm text-[var(--text-muted)] max-w-[240px]">
        <span className="block text-xs line-clamp-3 bg-[var(--surface-alt)] p-2 rounded border border-[var(--border)] text-[var(--text-muted)] whitespace-pre-line">{booking.goal || "—"}</span>
      </td>
      <td className="py-4 px-4 text-xs text-[var(--text-dim)] whitespace-nowrap">{createdAt}</td>
      <td className="py-4 px-4">
        <select
          value={status}
          disabled={busy}
          onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
          className={`text-xs font-bold rounded-full px-3 py-1.5 border appearance-none cursor-pointer transition-all ${
            status === "new" 
              ? "bg-blue-50 text-blue-700 border-blue-200" 
              : status === "contacted" 
                ? "bg-yellow-50 text-yellow-700 border-yellow-200" 
                : status === "scheduled" 
                  ? "bg-purple-50 text-purple-700 border-purple-200 animate-pulse" 
                  : "bg-gray-50 text-gray-700 border-gray-200"
          }`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt.toUpperCase()}
            </option>
          ))}
        </select>
      </td>
      <td className="py-4 px-4 text-right">
        <button
          onClick={handleDelete}
          disabled={busy}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 transition-colors"
        >
          {busy ? "…" : "Delete"}
        </button>
      </td>
    </tr>
  );
}

export default function BookingsManager({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar"); // Default to Calendar view for better UX
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    // Default to the first future booking month or current month
    if (bookings.length > 0) {
      return new Date();
    }
    return new Date();
  });
  
  const [selectedCalendarDayStr, setSelectedCalendarDayStr] = useState<string | null>(null);

  // Helper to format calendar day to slot match (e.g., "Sat, Jul 18")
  const getFormattedMatchStr = (y: number, m: number, dNum: number) => {
    const d = new Date(y, m, dNum);
    const dayName = DAYS_OF_WEEK[d.getDay()];
    const monthName = MONTHS_SHORT[d.getMonth()];
    return `${dayName}, ${monthName} ${dNum}`;
  };

  // Filter bookings based on status AND selected calendar day (if any)
  const filtered = bookings.filter((b) => {
    const matchesStatus = filter === "all" ? true : b.status === filter;
    const matchesCalendarDay = selectedCalendarDayStr 
      ? b.slot && b.slot.includes(selectedCalendarDayStr) 
      : true;
    return matchesStatus && matchesCalendarDay;
  });

  // Calendar parameters
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y: number, m: number) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const firstDayIdx = getFirstDayIndex(year, month);

  const blankCells = Array(firstDayIdx).fill(null);
  const dayCells = Array.from({ length: totalDays }, (_, i) => i + 1);
  const allCells = [...blankCells, ...dayCells];

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const handleDayClick = (dayNum: number) => {
    const dayMatchStr = getFormattedMatchStr(year, month, dayNum);
    if (selectedCalendarDayStr === dayMatchStr) {
      // Toggle off if clicked again
      setSelectedCalendarDayStr(null);
    } else {
      setSelectedCalendarDayStr(dayMatchStr);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
        
        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", ...STATUS_OPTIONS] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all capitalize ${
                filter === opt
                  ? "bg-[var(--text)] text-[var(--surface)] border-[var(--text)] shadow-sm"
                  : "bg-[var(--surface-alt)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--glass-bg)]"
              }`}
            >
              {opt}
              {opt !== "all" && (
                <span className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${
                  filter === opt ? "bg-[var(--surface)]/20 text-[var(--surface)]" : "bg-[var(--border)] text-[var(--text-muted)]"
                }`}>
                  {bookings.filter((b) => b.status === opt).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View Mode & Actions Toggle */}
        <div className="flex items-center gap-2">
          {selectedCalendarDayStr && (
            <button
              onClick={() => setSelectedCalendarDayStr(null)}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition-all dark:bg-red-950/40 dark:text-red-400 dark:border-red-500/25"
            >
              <X className="w-3.5 h-3.5" /> Clear Date Filter ({selectedCalendarDayStr})
            </button>
          )}

          <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-1">
            <button
              onClick={() => setViewMode("calendar")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "calendar" 
                  ? "bg-[var(--surface)] text-[var(--text)] shadow-sm border border-[var(--border)]" 
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Calendar View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list" 
                  ? "bg-[var(--surface)] text-[var(--text)] shadow-sm border border-[var(--border)]" 
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              <List className="w-3.5 h-3.5" /> List View
            </button>
          </div>
        </div>
      </div>

      {/* RENDER INTERACTIVE CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Calendar Grid Box (Left 7-columns) */}
          <div className="lg:col-span-7 bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--divider)]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-[var(--text)] tracking-tight text-base">
                  {MONTHS_FULL[month]} {year}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Week Labels */}
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {DAYS_OF_WEEK.map(d => (
                <span key={d} className="text-xs font-bold text-[var(--text-dim)] py-1 uppercase">{d}</span>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-2">
              {allCells.map((dayNum, cellIdx) => {
                const dayMatchStr = dayNum ? getFormattedMatchStr(year, month, dayNum) : "";
                
                // Fetch bookings matching this day
                const dayBookings = dayNum 
                    ? bookings.filter(b => b.slot && b.slot.includes(dayMatchStr)) 
                    : [];
                  
                const isSelected = selectedCalendarDayStr === dayMatchStr;
                const hasBookings = dayBookings.length > 0;

                return (
                  <div key={cellIdx} className="aspect-square relative">
                    {dayNum !== null ? (
                      <button
                        type="button"
                        onClick={() => handleDayClick(dayNum)}
                        className={`w-full h-full rounded-xl flex flex-col items-center justify-between p-1.5 border transition-all text-left ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-400 text-indigo-900 ring-2 ring-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-500/50 dark:text-indigo-200"
                            : hasBookings
                              ? "bg-[var(--surface-alt)] border-indigo-200 text-[var(--text)] hover:bg-indigo-50/40 dark:border-indigo-500/20"
                              : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:bg-[var(--surface-alt)]"
                        }`}
                      >
                        <span className={`text-xs font-extrabold ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-[var(--text)]"}`}>
                          {dayNum}
                        </span>
                        
                        {hasBookings && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md text-center w-full leading-none truncate ${
                            isSelected 
                              ? "bg-indigo-600 text-white" 
                              : "bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-500/20"
                          }`}>
                            {dayBookings.length} {dayBookings.length === 1 ? "call" : "calls"}
                          </span>
                        )}
                      </button>
                    ) : (
                      <div className="w-full h-full bg-[var(--surface-alt)]/30 rounded-xl" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day details or active selection dashboard (Right 5-columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl border border-indigo-950 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <Shield className="w-8 h-8 text-indigo-400 mb-3" />
              <h4 className="font-extrabold text-base tracking-tight mb-1">Double-Booking Safeguard</h4>
              <p className="text-xs text-indigo-200 leading-relaxed">
                The booking engine blocks slots in real-time. If a timeslot is booked on a date, it automatically becomes greyed-out and unavailable for future callers.
              </p>
            </div>

            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-3 border-b border-[var(--divider)] pb-3">
                  <Clock className="w-4 h-4 text-[var(--text-dim)]" />
                  <h4 className="font-bold text-[var(--text)] text-sm">
                    {selectedCalendarDayStr ? `Bookings for ${selectedCalendarDayStr}` : "All Active Bookings"}
                  </h4>
                </div>
                
                {filtered.length === 0 ? (
                  <p className="text-[var(--text-dim)] text-xs py-8 text-center bg-[var(--surface-alt)]/50 rounded-xl border border-dashed border-[var(--border)]">
                    No bookings found matching this selection.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {filtered.slice(0, 5).map((b) => (
                      <div key={b.id} className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] flex items-center justify-between text-xs hover:border-[var(--accent)] transition-colors">
                        <div>
                          <strong className="block text-[var(--text)]">{b.name}</strong>
                          <span className="text-[var(--text-muted)] block truncate max-w-[180px]">{b.company || "No Company"}</span>
                        </div>
                        <span className="font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-500/20 shrink-0 text-[10px]">
                          {b.slot.split(" @ ")[1]}
                        </span>
                      </div>
                    ))}
                    {filtered.length > 5 && (
                      <p className="text-[10px] text-center text-[var(--text-dim)] font-bold">and {filtered.length - 5} more...</p>
                    )}
                  </div>
                )}
              </div>

              {selectedCalendarDayStr && (
                <button
                  onClick={() => setSelectedCalendarDayStr(null)}
                  className="w-full text-center text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--surface-alt)] hover:bg-[var(--glass-bg)] border border-[var(--border)] py-2.5 rounded-xl transition-all mt-4"
                >
                  Show All Dates
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* BOOKINGS TABLE LIST */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
        <div className="p-4 bg-[var(--surface-alt)] border-b border-[var(--border)] flex items-center justify-between">
          <h4 className="font-bold text-[var(--text)] text-xs uppercase tracking-wider">
            {selectedCalendarDayStr ? `Filtered Slots: ${selectedCalendarDayStr}` : "All Records"} ({filtered.length})
          </h4>
          <span className="text-[var(--text-dim)] text-xs font-semibold">Indian Standard Time</span>
        </div>
        
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[var(--surface)]">
            <p className="text-[var(--text-muted)] text-sm">No bookings match the filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-[var(--border)] text-left bg-[var(--surface-alt)]/40">
                  <th className="py-3.5 px-4 text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">Contact</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">Slot</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">Company</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">Size</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">Goal</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">Booked</th>
                  <th className="py-3.5 px-4 text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <BookingRow key={b.id} booking={b} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
