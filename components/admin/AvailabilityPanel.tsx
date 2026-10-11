"use client";

import { useMemo, useState } from "react";
import { nextSlots, type Availability } from "@/lib/admin/availability";
import { dateKey, fmtKey, fmtTime, hhmm, toMin } from "@/lib/admin/tz";
import { useBookings } from "./BookingsProvider";
import { IconPlus } from "./icons";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = Array.from({ length: 33 }, (_, i) => hhmm(6 * 60 + i * 30)); // 06:00 to 22:00

export default function AvailabilityPanel({ now }: { now: number }) {
  const { availability, bookings, saveAvailability } = useBookings();
  const [draft, setDraft] = useState<Availability>(availability);
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const dirty = JSON.stringify(draft) !== JSON.stringify(availability);

  const set = <K extends keyof Availability>(k: K, v: Availability[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const setDay = (i: number, patch: Partial<Availability["days"][number]>) => setDraft((d) => ({ ...d, days: d.days.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));

  const errors = draft.days.map((d) => (d.on && toMin(d.to) - toMin(d.from) < draft.slotMinutes ? "Too short for one call" : ""));
  const invalid = errors.some(Boolean);
  const preview = useMemo(() => nextSlots(draft, bookings, now, 6), [draft, bookings, now]);
  const today = dateKey(now);

  const addBlock = () => {
    if (!blockDate || blockDate < today || draft.blocked.some((b) => b.date === blockDate)) return;
    set("blocked", [...draft.blocked, { date: blockDate, reason: blockReason.trim() || "Unavailable" }].sort((a, b) => a.date.localeCompare(b.date)));
    setBlockDate("");
    setBlockReason("");
  };

  return (
    <div className="adm-avail">
      <p className="adm-note">The public booking page currently uses fixed hours of its own. Once the panel is connected, these settings decide which times visitors can book.</p>

      <div className="adm-avail-grid">
        <section className="adm-panel" aria-labelledby="av-h1">
          <h3 id="av-h1">Weekly hours</h3>
          <p className="adm-muted">UK time. Visitors can book a call that starts and ends inside these hours.</p>
          <ul className="adm-hours">
            {DAYS.map((name, i) => {
              const d = draft.days[i];
              return (
                <li key={name} data-off={!d.on}>
                  <label className="adm-switch">
                    <input type="checkbox" role="switch" checked={d.on} onChange={(e) => setDay(i, { on: e.target.checked })} aria-label={`${name} available`} />
                    <span aria-hidden="true" />
                    <b>{name}</b>
                  </label>
                  {d.on ? (
                    <span className="adm-hours-range">
                      <label className="adm-select-wrap">
                        <span className="sr-only">{name} from</span>
                        <select className="adm-select adm-select-mini" value={d.from} onChange={(e) => setDay(i, { from: e.target.value })}>
                          {TIMES.slice(0, -1).map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </label>
                      <span aria-hidden="true">to</span>
                      <label className="adm-select-wrap">
                        <span className="sr-only">{name} until</span>
                        <select className="adm-select adm-select-mini" value={d.to} onChange={(e) => setDay(i, { to: e.target.value })}>
                          {TIMES.slice(1).map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </label>
                      {errors[i] && <small className="adm-err">{errors[i]}</small>}
                    </span>
                  ) : (
                    <span className="adm-muted">Unavailable</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="adm-panel" aria-labelledby="av-h2">
          <h3 id="av-h2">Call settings</h3>
          <div className="adm-fields">
            <div className="adm-field">
              <label htmlFor="av-slot">Call length</label>
              <select id="av-slot" className="adm-select adm-select-full" value={draft.slotMinutes} onChange={(e) => set("slotMinutes", Number(e.target.value))}>
                {[15, 30, 45, 60].map((n) => (
                  <option key={n} value={n}>
                    {n} minutes
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-field">
              <label htmlFor="av-buffer">Gap between calls</label>
              <select id="av-buffer" className="adm-select adm-select-full" value={draft.bufferMinutes} onChange={(e) => set("bufferMinutes", Number(e.target.value))}>
                {[0, 5, 10, 15, 30].map((n) => (
                  <option key={n} value={n}>
                    {n === 0 ? "No gap" : `${n} minutes`}
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-field">
              <label htmlFor="av-notice">Minimum notice</label>
              <select id="av-notice" className="adm-select adm-select-full" value={draft.noticeHours} onChange={(e) => set("noticeHours", Number(e.target.value))}>
                {[1, 2, 4, 8, 24, 48].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "hour" : "hours"}
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-field">
              <label htmlFor="av-window">How far ahead people can book</label>
              <select id="av-window" className="adm-select adm-select-full" value={draft.windowDays} onChange={(e) => set("windowDays", Number(e.target.value))}>
                {[7, 14, 21, 30, 60].map((n) => (
                  <option key={n} value={n}>
                    {n} days
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-field adm-field-wide">
              <label htmlFor="av-link">Video call link</label>
              <input id="av-link" className="adm-input" type="url" value={draft.meetingLink} onChange={(e) => set("meetingLink", e.target.value)} placeholder="https://meet.google.com/…" />
            </div>
          </div>
        </section>
      </div>

      <div className="adm-avail-grid">
        <section className="adm-panel" aria-labelledby="av-h3">
          <h3 id="av-h3">Days off and holidays</h3>
          <p className="adm-muted">Blocked days can&apos;t be booked.</p>
          <div className="adm-blockform">
            <div className="adm-field">
              <label htmlFor="av-date">Date</label>
              <input id="av-date" className="adm-input adm-input-sm" type="date" min={today} value={blockDate} onChange={(e) => setBlockDate(e.target.value)} />
            </div>
            <div className="adm-field">
              <label htmlFor="av-reason">Reason (optional)</label>
              <input id="av-reason" className="adm-input adm-input-sm" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g. Bank holiday" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBlock())} />
            </div>
            <button type="button" className="adm-mini" onClick={addBlock} disabled={!blockDate || blockDate < today}>
              <IconPlus className="adm-ic adm-ic-xs" /> Block day
            </button>
          </div>
          {draft.blocked.length === 0 ? (
            <p className="adm-muted">No days blocked.</p>
          ) : (
            <ul className="adm-blocked-list">
              {draft.blocked.map((b) => (
                <li key={b.date}>
                  <span>
                    <strong>{fmtKey(b.date, { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</strong>
                    <small>{b.reason}</small>
                  </span>
                  <button type="button" className="adm-mini" aria-label={`Unblock ${fmtKey(b.date)}`} onClick={() => set("blocked", draft.blocked.filter((x) => x.date !== b.date))}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-panel" aria-labelledby="av-h4">
          <h3 id="av-h4">What visitors will see</h3>
          <p className="adm-muted">The next free times with these settings.</p>
          {preview.length === 0 ? (
            <p className="adm-note adm-note-warn">No free times. Turn on a day, widen the hours or allow more notice days.</p>
          ) : (
            <ul className="adm-preview" aria-label="Next free times">
              {preview.map((s) => (
                <li key={s}>
                  <strong>{fmtKey(dateKey(s), { weekday: "short", day: "numeric", month: "short" })}</strong>
                  <span>{fmtTime(s)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="adm-savebar" data-dirty={dirty} role="region" aria-label="Save changes">
        <span>{dirty ? "You have unsaved changes." : "All changes saved."}</span>
        <span className="adm-dlg-foot-btns">
          <button type="button" className="adm-mini" disabled={!dirty} onClick={() => setDraft(availability)}>
            Discard
          </button>
          <button type="button" className="adm-btn adm-btn-sm" disabled={!dirty || invalid} onClick={() => saveAvailability(draft)}>
            Save changes
          </button>
        </span>
      </div>
    </div>
  );
}
