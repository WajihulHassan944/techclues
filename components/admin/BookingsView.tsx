"use client";

import { useMemo, useState } from "react";
import { isBlocked } from "@/lib/admin/availability";
import { initials } from "@/lib/admin/format";
import { addDays, dateKey, fmtKey, monthGrid, monthTitle } from "@/lib/admin/tz";
import AvailabilityPanel from "./AvailabilityPanel";
import { BookingBadge, BookingDrawer, CancelDialog, RescheduleDialog, effectiveStatus, isPast, rangeText } from "./BookingDialogs";
import { useBookings } from "./BookingsProvider";
import { IconCalendar, IconSearch, IconVideo } from "./icons";
import type { Booking } from "@/lib/admin/bookings-seed";

type Sub = "upcoming" | "past" | "cancelled";

function dayHeading(key: string, today: string) {
  if (key === today) return `Today · ${fmtKey(key, { day: "numeric", month: "long" })}`;
  if (key === addDays(today, 1)) return `Tomorrow · ${fmtKey(key, { day: "numeric", month: "long" })}`;
  return fmtKey(key);
}

function CallRow({ b, now, onOpen }: { b: Booking; now: number; onOpen: () => void }) {
  return (
    <li>
      <button type="button" className="adm-call" onClick={onOpen} aria-label={`${b.name}, ${rangeText(b)}, ${b.topic}`}>
        <span className="adm-call-time">
          <strong>{rangeText(b).split("–")[0]}</strong>
          <small>{b.minutes} min</small>
        </span>
        <span className="adm-avatar adm-avatar-sm" aria-hidden="true">
          {initials(b.name)}
        </span>
        <span className="adm-call-main">
          <strong>{b.name}</strong>
          <span>
            {b.topic}
            {b.company ? ` · ${b.company}` : ""}
          </span>
        </span>
        <span className="adm-call-meta">
          <BookingBadge b={b} now={now} />
          <small>
            <IconVideo className="adm-ic adm-ic-xs" /> {b.via}
          </small>
        </span>
      </button>
    </li>
  );
}

export default function BookingsView() {
  const { bookings, availability, blockDay, unblockDay, reset } = useBookings();
  const [now] = useState(() => Date.now());
  const today = dateKey(now);
  const [top, setTop] = useState<"calls" | "availability">("calls");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [sub, setSub] = useState<Sub>("upcoming");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [dialog, setDialog] = useState<null | { kind: "reschedule" | "cancel"; id: string }>(null);
  const [ym, setYm] = useState(() => ({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) }));
  const [picked, setPicked] = useState(today);
  const [reason, setReason] = useState("");

  const groups = useMemo(() => {
    const upcoming = bookings.filter((b) => b.status === "confirmed" && !isPast(b, now));
    const past = bookings.filter((b) => b.status === "completed" || b.status === "no-show" || (b.status === "confirmed" && isPast(b, now)));
    const cancelled = bookings.filter((b) => b.status === "cancelled");
    return { upcoming, past, cancelled };
  }, [bookings, now]);

  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    const list = groups[sub].filter((b) => !q || `${b.name} ${b.company ?? ""} ${b.topic} ${b.email}`.toLowerCase().includes(q));
    return list.sort((a, b) => (sub === "upcoming" ? a.start.localeCompare(b.start) : b.start.localeCompare(a.start)));
  }, [groups, sub, q]);

  const byDay = useMemo(() => {
    const m = new Map<string, Booking[]>();
    for (const b of rows) {
      const k = dateKey(b.start);
      m.set(k, [...(m.get(k) ?? []), b]);
    }
    return [...m.entries()];
  }, [rows]);

  const calendarMap = useMemo(() => {
    const m = new Map<string, Booking[]>();
    for (const b of bookings) {
      if (b.status === "cancelled") continue;
      const k = dateKey(b.start);
      m.set(k, [...(m.get(k) ?? []), b].sort((a, c) => a.start.localeCompare(c.start)));
    }
    return m;
  }, [bookings]);

  const shift = (n: number) => {
    const t = ym.y * 12 + ym.m - 1 + n;
    setYm({ y: Math.floor(t / 12), m: (t % 12) + 1 });
  };
  const dayItems = calendarMap.get(picked) ?? [];
  const blocked = isBlocked(availability, picked);
  const dayOn = availability.days[(new Date(`${picked}T12:00:00Z`).getUTCDay() + 6) % 7].on;

  return (
    <div className="adm-stack">
      <div className="adm-seg" role="tablist" aria-label="Bookings sections">
        <button type="button" role="tab" className="adm-seg-btn" aria-selected={top === "calls"} onClick={() => setTop("calls")}>
          Calls
          <span className="adm-tab-n">{groups.upcoming.length}</span>
        </button>
        <button type="button" role="tab" className="adm-seg-btn" aria-selected={top === "availability"} onClick={() => setTop("availability")}>
          Availability
        </button>
      </div>

      {top === "availability" ? (
        <AvailabilityPanel now={now} />
      ) : (
        <>
          <div className="adm-filters">
            {view === "list" && (
              <label className="adm-search adm-search-wide">
                <span className="sr-only">Search calls</span>
                <IconSearch />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, company or topic…" />
              </label>
            )}
            <div className="adm-seg adm-seg-right" role="group" aria-label="View">
              <button type="button" className="adm-seg-btn" aria-pressed={view === "list"} onClick={() => setView("list")}>
                List
              </button>
              <button type="button" className="adm-seg-btn" aria-pressed={view === "calendar"} onClick={() => setView("calendar")}>
                Calendar
              </button>
            </div>
          </div>

          {view === "list" ? (
            <>
              <div className="adm-tabs" role="tablist" aria-label="Filter calls">
                {([["upcoming", "Upcoming"], ["past", "Past"], ["cancelled", "Cancelled"]] as [Sub, string][]).map(([k, label]) => (
                  <button key={k} role="tab" type="button" className="adm-tab" aria-selected={sub === k} onClick={() => setSub(k)}>
                    {label}
                    <span className="adm-tab-n">{groups[k].length}</span>
                  </button>
                ))}
              </div>
              <div className="adm-table">
                {byDay.length === 0 ? (
                  <div className="adm-empty">
                    <IconCalendar />
                    <h3>{groups[sub].length === 0 ? (sub === "upcoming" ? "No upcoming calls" : `No ${sub} calls`) : "No calls match"}</h3>
                    <p>{groups[sub].length === 0 ? "Calls booked on the website will appear here." : "Try a different search."}</p>
                  </div>
                ) : (
                  byDay.map(([k, list]) => (
                    <section key={k} className="adm-daygroup" aria-label={dayHeading(k, today)}>
                      <h3>{dayHeading(k, today)}</h3>
                      <ul>
                        {list.map((b) => (
                          <CallRow key={b.id} b={b} now={now} onOpen={() => setOpen(b.id)} />
                        ))}
                      </ul>
                    </section>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="adm-calwrap">
              <section className="adm-panel adm-cal" aria-label="Calendar">
                <div className="adm-monthnav adm-monthnav-lg">
                  <h3 aria-live="polite">{monthTitle(ym.y, ym.m)}</h3>
                  <span>
                    <button type="button" className="adm-mini" onClick={() => { setYm({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) }); setPicked(today); }}>
                      Today
                    </button>
                    <button type="button" className="adm-icon-btn adm-sm" aria-label="Previous month" onClick={() => shift(-1)}>
                      ‹
                    </button>
                    <button type="button" className="adm-icon-btn adm-sm" aria-label="Next month" onClick={() => shift(1)}>
                      ›
                    </button>
                  </span>
                </div>
                <div className="adm-calgrid" role="grid" aria-label={monthTitle(ym.y, ym.m)}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <span key={d} className="adm-dow" role="columnheader">
                      {d}
                    </span>
                  ))}
                  {monthGrid(ym.y, ym.m).map((k, i) => {
                    if (!k) return <span key={`b${i}`} className="adm-calcell adm-calcell-blank" />;
                    const items = calendarMap.get(k) ?? [];
                    const blockedDay = isBlocked(availability, k);
                    const wd = (new Date(`${k}T12:00:00Z`).getUTCDay() + 6) % 7;
                    return (
                      <button key={k} type="button" role="gridcell" className="adm-calcell" data-today={k === today} data-picked={k === picked} data-closed={!availability.days[wd].on} data-blocked={!!blockedDay} aria-label={`${fmtKey(k)}${items.length ? `, ${items.length} ${items.length === 1 ? "call" : "calls"}` : ""}${blockedDay ? ", blocked" : ""}`} aria-pressed={k === picked} onClick={() => setPicked(k)}>
                        <b>{Number(k.slice(8))}</b>
                        {items.length > 0 && !blockedDay && <u className="adm-dotmark" aria-hidden="true">{items.length}</u>}
                        {blockedDay ? (
                          <em>Blocked</em>
                        ) : (
                          <>
                            {items.slice(0, 2).map((b) => (
                              <span key={b.id} className={`adm-chip-call adm-bstatus-${effectiveStatus(b, now)}`}>
                                {rangeText(b).split("–")[0]} {b.name.split(" ")[0]}
                              </span>
                            ))}
                            {items.length > 2 && <i>+{items.length - 2} more</i>}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
              <aside className="adm-panel adm-agenda" aria-label="Day agenda">
                <h3>{fmtKey(picked)}</h3>
                {blocked ? (
                  <p className="adm-note adm-note-warn">Blocked: {blocked.reason}</p>
                ) : !dayOn ? (
                  <p className="adm-muted">Not a working day.</p>
                ) : dayItems.length === 0 ? (
                  <p className="adm-muted">No calls this day.</p>
                ) : (
                  <ul className="adm-agenda-list">
                    {dayItems.map((b) => (
                      <CallRow key={b.id} b={b} now={now} onOpen={() => setOpen(b.id)} />
                    ))}
                  </ul>
                )}
                {picked >= today && (
                  <div className="adm-agenda-foot">
                    {blocked ? (
                      <button type="button" className="adm-mini" onClick={() => unblockDay(picked)}>
                        Unblock this day
                      </button>
                    ) : (
                      <>
                        <label className="sr-only" htmlFor="adm-block-reason">
                          Reason for blocking
                        </label>
                        <input id="adm-block-reason" className="adm-input adm-input-sm" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" />
                        <button type="button" className="adm-mini" onClick={() => { blockDay(picked, reason.trim() || "Unavailable"); setReason(""); }}>
                          Block this day
                        </button>
                      </>
                    )}
                  </div>
                )}
              </aside>
            </div>
          )}
          <p className="adm-muted adm-reset">
            Times are UK time. Showing sample data.{" "}
            <button type="button" className="adm-text-btn" onClick={reset}>
              Restore the sample bookings
            </button>
          </p>
        </>
      )}

      {open && !dialog && <BookingDrawer id={open} now={now} onClose={() => setOpen(null)} onReschedule={() => setDialog({ kind: "reschedule", id: open })} onCancel={() => setDialog({ kind: "cancel", id: open })} />}
      {dialog?.kind === "reschedule" && <RescheduleDialog id={dialog.id} now={now} onClose={() => setDialog(null)} />}
      {dialog?.kind === "cancel" && <CancelDialog id={dialog.id} onClose={() => { setDialog(null); }} />}
    </div>
  );
}
