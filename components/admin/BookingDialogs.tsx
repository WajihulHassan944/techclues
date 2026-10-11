"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { slotsForDay } from "@/lib/admin/availability";
import type { Booking } from "@/lib/admin/bookings-seed";
import { fmtWhen, initials } from "@/lib/admin/format";
import { addDays, dateKey, fmtKey, fmtTime, monthGrid, monthTitle } from "@/lib/admin/tz";
import { useBookings } from "./BookingsProvider";
import Dialog from "./Dialog";
import { useInbox } from "./InboxProvider";
import { IconCalendar, IconExternal, IconMail, IconVideo } from "./icons";

export const STATUS_LABEL: Record<Booking["status"], string> = { confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled", "no-show": "No-show" };
export const isPast = (b: Booking, now: number) => new Date(b.start).getTime() + b.minutes * 60_000 <= now;
export const effectiveStatus = (b: Booking, now: number) => (b.status === "confirmed" && isPast(b, now) ? "needs-outcome" : b.status);

export function BookingBadge({ b, now }: { b: Booking; now: number }) {
  const s = effectiveStatus(b, now);
  return <span className={`adm-bstatus adm-bstatus-${s}`}>{s === "needs-outcome" ? "Needs outcome" : STATUS_LABEL[b.status]}</span>;
}

export const rangeText = (b: Booking) => `${fmtTime(b.start)}–${fmtTime(new Date(new Date(b.start).getTime() + b.minutes * 60_000))}`;
const longDay = (iso: string) => fmtKey(dateKey(iso), { weekday: "long", day: "numeric", month: "long" });

/* ---------------- side drawer ---------------- */
export function BookingDrawer({ id, now, onClose, onReschedule, onCancel }: { id: string; now: number; onClose: () => void; onReschedule: () => void; onCancel: () => void }) {
  const { get, availability, setStatus, addNote } = useBookings();
  const { state, toast } = useInbox();
  const [note, setNote] = useState("");
  const b = get(id);
  if (!b) return null;
  const past = isPast(b, now);
  const link = b.meetingLink || availability.meetingLink;
  const enquiry = state.enquiries.find((e) => e.email.toLowerCase() === b.email.toLowerCase() && e.folder === "inbox");
  const first = b.name.split(" ")[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast("Meeting link copied");
    } catch {
      toast("Couldn't copy. Select the link and copy it.");
    }
  };

  return (
    <Dialog title="Call details" variant="drawer" onClose={onClose}>
      <div className="adm-bk-head">
        <span className="adm-avatar" aria-hidden="true">
          {initials(b.name)}
        </span>
        <div>
          <h3>{b.name}</h3>
          <p>{b.company ?? "No company given"}</p>
        </div>
        <BookingBadge b={b} now={now} />
      </div>

      <section className="adm-bk-when" aria-label="When">
        <IconCalendar />
        <div>
          <strong>{longDay(b.start)}</strong>
          <span>
            {rangeText(b)} UK time · {b.minutes} minutes
          </span>
        </div>
      </section>

      {b.status === "confirmed" && (
        <div className="adm-bk-actions">
          {past ? (
            <>
              <button type="button" className="adm-btn adm-btn-sm" onClick={() => setStatus(b.id, "completed")}>
                Mark as completed
              </button>
              <button type="button" className="adm-mini" onClick={() => setStatus(b.id, "no-show")}>
                Mark as no-show
              </button>
            </>
          ) : (
            <>
              <button type="button" className="adm-btn adm-btn-sm" onClick={onReschedule}>
                Reschedule
              </button>
              <button type="button" className="adm-mini adm-mini-danger" onClick={onCancel}>
                Cancel call
              </button>
            </>
          )}
        </div>
      )}
      {b.status === "cancelled" && b.cancelReason && <p className="adm-note">Cancelled: {b.cancelReason}</p>}

      <dl className="adm-bk-dl">
        <div>
          <dt>Topic</dt>
          <dd>{b.topic}</dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>
            <span className="adm-inline">
              <IconVideo className="adm-ic adm-ic-xs" /> Video call
            </span>
            <span className="adm-linkrow">
              <a href={link} target="_blank" rel="noopener">
                {link.replace(/^https?:\/\//, "")}
              </a>
              <button type="button" className="adm-mini" onClick={copy}>
                Copy
              </button>
            </span>
          </dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${b.email}`}>{b.email}</a>
          </dd>
        </div>
        {b.phone && (
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a>
            </dd>
          </div>
        )}
        <div>
          <dt>Booked</dt>
          <dd>
            {fmtWhen(b.createdAt, now)} via {b.via}
          </dd>
        </div>
      </dl>

      <div className="adm-bk-links">
        <a className="adm-mini" href={`mailto:${b.email}?subject=${encodeURIComponent(`Our call: ${b.topic}`)}`}>
          <IconMail className="adm-ic adm-ic-xs" /> Email {first}
        </a>
        {enquiry && (
          <Link className="adm-mini" href={`/admin/inbox/${enquiry.id}`}>
            <IconExternal className="adm-ic adm-ic-xs" /> Open their enquiry
          </Link>
        )}
      </div>

      <section className="adm-bk-sec">
        <h4>Private notes</h4>
        {b.notes.length > 0 && (
          <ul className="adm-notes">
            {b.notes.map((n) => (
              <li key={n.id}>
                <p>{n.body}</p>
                <small>{fmtWhen(n.at, now)}</small>
              </li>
            ))}
          </ul>
        )}
        <label className="sr-only" htmlFor="adm-bk-note">
          Add a note
        </label>
        <textarea id="adm-bk-note" className="adm-textarea adm-textarea-sm" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note about this call…" />
        <button
          type="button"
          className="adm-mini"
          disabled={!note.trim()}
          onClick={() => {
            addNote(b.id, note.trim());
            setNote("");
            toast("Note added");
          }}
        >
          Add note
        </button>
      </section>

      <section className="adm-bk-sec">
        <h4>History</h4>
        <ol className="adm-history">
          {[...b.history].reverse().map((h) => (
            <li key={h.id}>
              <span>{h.text}</span>
              <small>{fmtWhen(h.at, now)}</small>
            </li>
          ))}
        </ol>
      </section>
    </Dialog>
  );
}

/* ---------------- reschedule ---------------- */
export function RescheduleDialog({ id, now, onClose }: { id: string; now: number; onClose: () => void }) {
  const { get, bookings, availability, reschedule } = useBookings();
  const b = get(id);
  const today = dateKey(now);
  const startKey = b ? dateKey(b.start) : today;
  const [ym, setYm] = useState(() => ({ y: Number(startKey.slice(0, 4)), m: Number(startKey.slice(5, 7)) }));
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [notify, setNotify] = useState(true);

  const free = useMemo(() => {
    const out = new Map<string, string[]>();
    for (const k of monthGrid(ym.y, ym.m)) if (k) out.set(k, slotsForDay(k, availability, bookings, now, id));
    return out;
  }, [ym, availability, bookings, now, id]);
  if (!b) return null;
  const slots = day ? free.get(day) ?? [] : [];
  const shift = (n: number) => {
    const t = ym.y * 12 + ym.m - 1 + n;
    setYm({ y: Math.floor(t / 12), m: (t % 12) + 1 });
  };
  const canPrev = ym.y * 12 + ym.m - 1 > Number(today.slice(0, 4)) * 12 + Number(today.slice(5, 7)) - 1;
  const lastKey = addDays(today, availability.windowDays);
  const canNext = ym.y * 12 + ym.m - 1 < Number(lastKey.slice(0, 4)) * 12 + Number(lastKey.slice(5, 7)) - 1;

  return (
    <Dialog
      title={`Reschedule ${b.name.split(" ")[0]}'s call`}
      onClose={onClose}
      footer={
        <>
          <label className="adm-check">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} /> Email {b.name.split(" ")[0]} the new time
          </label>
          <span className="adm-dlg-foot-btns">
            <button type="button" className="adm-mini" onClick={onClose}>
              Keep current time
            </button>
            <button
              type="button"
              className="adm-btn adm-btn-sm"
              disabled={!slot}
              onClick={() => {
                reschedule(id, slot!, notify);
                onClose();
              }}
            >
              Move call
            </button>
          </span>
        </>
      }
    >
      <p className="adm-muted adm-dlg-lead">
        Currently {longDay(b.start)}, {rangeText(b)}. Times are UK time and only show slots that are free.
      </p>
      <div className="adm-resched">
        <div>
          <div className="adm-monthnav">
            <strong aria-live="polite">{monthTitle(ym.y, ym.m)}</strong>
            <span>
              <button type="button" className="adm-icon-btn adm-sm" aria-label="Previous month" disabled={!canPrev} onClick={() => shift(-1)}>
                ‹
              </button>
              <button type="button" className="adm-icon-btn adm-sm" aria-label="Next month" disabled={!canNext} onClick={() => shift(1)}>
                ›
              </button>
            </span>
          </div>
          <div className="adm-minical" role="group" aria-label="Choose a day">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className="adm-dow" aria-hidden="true">
                {d}
              </span>
            ))}
            {monthGrid(ym.y, ym.m).map((k, i) => {
              if (!k) return <span key={`b${i}`} />;
              const n = free.get(k)?.length ?? 0;
              return n ? (
                <button key={k} type="button" className="adm-minical-day" aria-pressed={day === k} aria-label={`${fmtKey(k)}, ${n} free ${n === 1 ? "time" : "times"}`} onClick={() => { setDay(k); setSlot(null); }}>
                  {Number(k.slice(8))}
                </button>
              ) : (
                <span key={k} className="adm-minical-off">
                  {Number(k.slice(8))}
                </span>
              );
            })}
          </div>
        </div>
        <div>
          {day ? (
            <>
              <p className="adm-resched-day">{fmtKey(day)}</p>
              <ul className="adm-slots" aria-label="Free times">
                {slots.map((s) => (
                  <li key={s}>
                    <button type="button" className="adm-slot" aria-pressed={slot === s} onClick={() => setSlot(s)}>
                      {fmtTime(s)}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="adm-muted">Pick a day to see free times.</p>
          )}
        </div>
      </div>
    </Dialog>
  );
}

/* ---------------- cancel ---------------- */
const REASONS = ["Visitor asked to cancel", "I'm unavailable", "Not a good fit", "Duplicate booking", "Other"];

export function CancelDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const { get, cancel } = useBookings();
  const b = get(id);
  const [reason, setReason] = useState(REASONS[0]);
  const [detail, setDetail] = useState("");
  const [notify, setNotify] = useState(true);
  if (!b) return null;
  const first = b.name.split(" ")[0];
  return (
    <Dialog
      title={`Cancel ${first}'s call?`}
      onClose={onClose}
      footer={
        <>
          <label className="adm-check">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} /> Email {first} to let them know
          </label>
          <span className="adm-dlg-foot-btns">
            <button type="button" className="adm-mini" onClick={onClose}>
              Keep the call
            </button>
            <button
              type="button"
              className="adm-btn adm-btn-sm adm-btn-danger"
              onClick={() => {
                cancel(id, detail.trim() ? `${reason}: ${detail.trim()}` : reason, notify);
                onClose();
              }}
            >
              Cancel call
            </button>
          </span>
        </>
      }
    >
      <p className="adm-muted adm-dlg-lead">
        {longDay(b.start)}, {rangeText(b)} UK time. The slot becomes free for other visitors.
      </p>
      <div className="adm-field">
        <label htmlFor="adm-reason">Reason</label>
        <select id="adm-reason" className="adm-select adm-select-full" value={reason} onChange={(e) => setReason(e.target.value)}>
          {REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="adm-field">
        <label htmlFor="adm-reason-detail">Message to include (optional)</label>
        <textarea id="adm-reason-detail" className="adm-textarea" rows={3} value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="e.g. Sorry, something has come up on our side." />
      </div>
    </Dialog>
  );
}
