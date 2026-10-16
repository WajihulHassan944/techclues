"use client";

import { AdminContentSkeleton } from "./AdminSkeleton";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { preload } from "@/lib/admin/prefetch";
import type { Availability } from "@/lib/admin/availability";
import type { Booking, BookingStatus } from "@/lib/admin/bookings-types";
import { fmtKey, dateKey, fmtTime } from "@/lib/admin/tz";
import { useInbox } from "./InboxProvider";

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
  deleteByEmail: (email: string) => void;
  blockDay: (date: string, reason: string) => void;
  unblockDay: (date: string) => void;
  refresh: () => void;
};

const BookingsCtx = createContext<Ctx | null>(null);
export const useBookings = () => {
  const c = useContext(BookingsCtx);
  if (!c) throw new Error("useBookings must be used inside BookingsProvider");
  return c;
};

const whenText = (iso: string) => `${fmtKey(dateKey(iso), { weekday: "short", day: "numeric", month: "short" })}, ${fmtTime(iso)}`;

type ApiBooking = Omit<Booking, "id" | "notes" | "history"> & {
  _id: string;
  notes: { _id: string; at: string; body: string }[];
  history: { _id: string; at: string; text: string }[];
};

function mapBooking(b: ApiBooking): Booking {
  return {
    ...b,
    id: b._id,
    notes: b.notes.map((n) => ({ id: n._id, at: n.at, body: n.body })),
    history: b.history.map((h) => ({ id: h._id, at: h.at, text: h.text })),
  };
}

export function preloadBookings(force = false) {
  return preload(
    "admin-bookings",
    () =>
      Promise.all([
        api.get<{ items: ApiBooking[] }>("/api/admin/bookings?pageSize=500"),
        api.get<Availability>("/api/admin/bookings/availability"),
      ]),
    force,
  );
}

export default function BookingsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [state, setState] = useState<State | null>(null);

  const load = useCallback(async (force = false) => {
    const [list, av] = await preloadBookings(force);
    setState({ bookings: list.items.map(mapBooking), availability: av });
  }, []);

  useEffect(() => {
    load().catch(() => setState({ bookings: [], availability: { slotMinutes: 30, bufferMinutes: 0, noticeHours: 4, windowDays: 21, meetingLink: "", days: [], blocked: [] } }));
  }, [load]);

  const ctx = useMemo<Ctx | null>(() => {
    if (!state) return null;
    const patch = (id: string, fn: (b: Booking) => Booking) => setState((s) => (s ? { ...s, bookings: s.bookings.map((b) => (b.id === id ? fn(b) : b)) } : s));
    const now = () => new Date().toISOString();
    const refresh = () => load(true).catch(() => toast("Couldn't refresh bookings"));
    return {
      bookings: state.bookings,
      availability: state.availability,
      get: (id) => state.bookings.find((b) => b.id === id),
      reschedule: (id, startIso, notify) => {
        const old = state.bookings.find((b) => b.id === id);
        patch(id, (b) => ({ ...b, start: startIso, history: [...b.history, { id: `h-${Date.now()}`, at: now(), text: `Moved from ${whenText(b.start)} to ${whenText(startIso)}${notify ? " (visitor emailed)" : ""}` }] }));
        toast(`${old?.name.split(" ")[0] ?? "Call"} moved to ${whenText(startIso)}${notify ? ", visitor emailed" : ""}`);
        api.patch(`/api/admin/bookings/${id}/reschedule`, { start: startIso, notify }).catch(() => {
          toast("Couldn't reschedule — please try again");
          refresh();
        });
      },
      cancel: (id, reason, notify) => {
        patch(id, (b) => ({ ...b, status: "cancelled", cancelReason: reason, history: [...b.history, { id: `h-${Date.now()}`, at: now(), text: `Cancelled: ${reason}${notify ? " (visitor emailed)" : ""}` }] }));
        toast(notify ? "Call cancelled, visitor emailed" : "Call cancelled");
        api.patch(`/api/admin/bookings/${id}/cancel`, { reason, notify }).catch(() => {
          toast("Couldn't cancel — please try again");
          refresh();
        });
      },
      setStatus: (id, status) => {
        patch(id, (b) => ({ ...b, status, history: [...b.history, { id: `h-${Date.now()}`, at: now(), text: status === "completed" ? "Marked as completed" : status === "no-show" ? "Marked as no-show" : `Status set to ${status}` }] }));
        toast(status === "completed" ? "Marked as completed" : status === "no-show" ? "Marked as no-show" : `Marked as ${status}`);
        api.patch(`/api/admin/bookings/${id}/status`, { status }).catch(() => {
          toast("Couldn't update status");
          refresh();
        });
      },
      addNote: (id, body) => {
        patch(id, (b) => ({ ...b, notes: [...b.notes, { id: `bn-${Date.now()}`, at: now(), body }] }));
        api.post(`/api/admin/bookings/${id}/notes`, { body }).catch(() => toast("Couldn't save the note"));
      },
      deleteByEmail: (email) => {
        setState((s) => (s ? { ...s, bookings: s.bookings.filter((b) => b.email.toLowerCase() !== email.toLowerCase()) } : s));
        api.post("/api/admin/bookings/delete-by-email", { email }).catch(() => {
          toast("Couldn't delete bookings for that email");
          refresh();
        });
      },
      saveAvailability: (av) => {
        setState((s) => (s ? { ...s, availability: av } : s));
        toast("Availability saved");
        const { slotMinutes, bufferMinutes, noticeHours, windowDays, meetingLink, days } = av;
        api
          .patch("/api/admin/bookings/availability", {
            slotMinutes,
            bufferMinutes,
            noticeHours,
            windowDays,
            meetingLink,
            days,
          })
          .catch(() => {
            toast("Couldn't save availability");
            refresh();
          });
      },
      blockDay: (date, reason) => {
        setState((s) => (s ? { ...s, availability: { ...s.availability, blocked: [...s.availability.blocked.filter((x) => x.date !== date), { date, reason }].sort((a, b) => a.date.localeCompare(b.date)) } } : s));
        toast(`${fmtKey(date, { weekday: "short", day: "numeric", month: "short" })} blocked`);
        api.post("/api/admin/bookings/availability/block", { date, reason }).catch(() => {
          toast("Couldn't block that day");
          refresh();
        });
      },
      unblockDay: (date) => {
        setState((s) => (s ? { ...s, availability: { ...s.availability, blocked: s.availability.blocked.filter((x) => x.date !== date) } } : s));
        toast(`${fmtKey(date, { weekday: "short", day: "numeric", month: "short" })} is open again`);
        api.post("/api/admin/bookings/availability/unblock", { date }).catch(() => {
          toast("Couldn't reopen that day");
          refresh();
        });
      },
      refresh,
    };
  }, [state, toast, load]);

  if (!ctx) return <AdminContentSkeleton />;
  return <BookingsCtx.Provider value={ctx}>{children}</BookingsCtx.Provider>;
}
