"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { logActivity } from "@/lib/admin/activity";
import { DEFAULT_AVAILABILITY, type Availability } from "@/lib/admin/availability";
import { seedBookings, type Booking, type BookingStatus } from "@/lib/admin/bookings-seed";
import { fmtKey, dateKey, fmtTime } from "@/lib/admin/tz";
import { useInbox } from "./InboxProvider";

const KEY = "techclues-admin-bookings-v1";
type State = { bookings: Booking[]; availability: Availability };

type Ctx = {
  bookings: Booking[];
  availability: Availability;
  get: (id: string) => Booking | undefined;
  reschedule: (id: string, startIso: string, notify: boolean) => void;
  cancel: (id: string, reason: string, notify: boolean) => void;
  setStatus: (id: string, status: BookingStatus) => void;
  addNote: (id: string, body: string) => void;
  saveAvailability: (av: Availability) => void;
  deleteByEmail: (email: string) => number;
  blockDay: (date: string, reason: string) => void;
  unblockDay: (date: string) => void;
  reset: () => void;
};

const BookingsCtx = createContext<Ctx | null>(null);
export const useBookings = () => {
  const c = useContext(BookingsCtx);
  if (!c) throw new Error("useBookings must be used inside BookingsProvider");
  return c;
};

const whenText = (iso: string) => `${fmtKey(dateKey(iso), { weekday: "short", day: "numeric", month: "short" })}, ${fmtTime(iso)}`;

export default function BookingsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    let loaded: State | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw) as State;
    } catch {
      loaded = null;
    }
    setState(loaded && Array.isArray(loaded.bookings) && loaded.availability ? loaded : { bookings: seedBookings(Date.now()), availability: DEFAULT_AVAILABILITY });
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const api = useMemo<Ctx | null>(() => {
    if (!state) return null;
    const patch = (id: string, fn: (b: Booking) => Booking) => setState((s) => (s ? { ...s, bookings: s.bookings.map((b) => (b.id === id ? fn(b) : b)) } : s));
    const now = () => new Date().toISOString();
    return {
      bookings: state.bookings,
      availability: state.availability,
      get: (id) => state.bookings.find((b) => b.id === id),
      reschedule: (id, startIso, notify) => {
        const old = state.bookings.find((b) => b.id === id);
        patch(id, (b) => ({ ...b, start: startIso, history: [...b.history, { id: `h-${Date.now()}`, at: now(), text: `Moved from ${whenText(b.start)} to ${whenText(startIso)}${notify ? " (visitor emailed)" : ""}` }] }));
        toast(`${old?.name.split(" ")[0] ?? "Call"} moved to ${whenText(startIso)}${notify ? ", visitor emailed" : ""}`);
        logActivity("bookings", `Moved ${old?.name ?? "a"} call to ${whenText(startIso)}`);
      },
      cancel: (id, reason, notify) => {
        patch(id, (b) => ({ ...b, status: "cancelled", cancelReason: reason, history: [...b.history, { id: `h-${Date.now()}`, at: now(), text: `Cancelled: ${reason}${notify ? " (visitor emailed)" : ""}` }] }));
        toast(notify ? "Call cancelled, visitor emailed" : "Call cancelled");
        logActivity("bookings", `Cancelled ${state.bookings.find((b) => b.id === id)?.name ?? "a"} call: ${reason}`);
      },
      setStatus: (id, status) => {
        patch(id, (b) => ({ ...b, status, history: [...b.history, { id: `h-${Date.now()}`, at: now(), text: status === "completed" ? "Marked as completed" : status === "no-show" ? "Marked as no-show" : `Status set to ${status}` }] }));
        toast(status === "completed" ? "Marked as completed" : status === "no-show" ? "Marked as no-show" : `Marked as ${status}`);
        logActivity("bookings", `Marked ${state.bookings.find((b) => b.id === id)?.name ?? "a"} call as ${status}`);
      },
      addNote: (id, body) => patch(id, (b) => ({ ...b, notes: [...b.notes, { id: `bn-${Date.now()}`, at: now(), body }] })),
      deleteByEmail: (email) => {
        const n = state.bookings.filter((b) => b.email.toLowerCase() === email.toLowerCase()).length;
        if (n) setState((s) => (s ? { ...s, bookings: s.bookings.filter((b) => b.email.toLowerCase() !== email.toLowerCase()) } : s));
        return n;
      },
      saveAvailability: (av) => {
        setState((s) => (s ? { ...s, availability: av } : s));
        toast("Availability saved");
        logActivity("bookings", "Updated the availability settings");
      },
      blockDay: (date, reason) => {
        setState((s) => (s ? { ...s, availability: { ...s.availability, blocked: [...s.availability.blocked.filter((x) => x.date !== date), { date, reason }].sort((a, b) => a.date.localeCompare(b.date)) } } : s));
        toast(`${fmtKey(date, { weekday: "short", day: "numeric", month: "short" })} blocked`);
        logActivity("bookings", `Blocked ${fmtKey(date, { weekday: "short", day: "numeric", month: "short" })}: ${reason}`);
      },
      unblockDay: (date) => {
        setState((s) => (s ? { ...s, availability: { ...s.availability, blocked: s.availability.blocked.filter((x) => x.date !== date) } } : s));
        toast(`${fmtKey(date, { weekday: "short", day: "numeric", month: "short" })} is open again`);
      },
      reset: () => {
        setState({ bookings: seedBookings(Date.now()), availability: DEFAULT_AVAILABILITY });
        toast("Sample bookings restored");
      },
    };
  }, [state, toast]);

  if (!api) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return <BookingsCtx.Provider value={api}>{children}</BookingsCtx.Provider>;
}
