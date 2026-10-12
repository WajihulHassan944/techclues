"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { initials, snippet } from "@/lib/admin/format";
import { SOURCE_KEYS, type SourceKey } from "@/lib/admin/inbox-types";
import { RANGES, type Range } from "@/lib/admin/stats";
import { ColumnChart, SourceBars, Spark } from "./charts";
import { SourcePill } from "./EnquiryList";
import { useInbox } from "./InboxProvider";
import { dateKey, fmtKey, fmtTime } from "@/lib/admin/tz";
import { IconArrowRight, IconCalendar, IconInbox } from "./icons";

type ApiNeedsReply = { _id: string; name: string; subject: string; source: SourceKey; received: string };
type ApiUpcomingCall = { _id: string; name: string; topic: string; start: string; minutes: number };
type DashboardStats = {
  total: number;
  previousTotal: number;
  spark: number[];
  bySource: Record<SourceKey, number>;
  buckets: { start: string; end: string; total: number; bySource: Record<SourceKey, number> }[];
  needsReply: ApiNeedsReply[];
  upcomingCalls: ApiUpcomingCall[];
};

const waiting = (iso: string, now: number) => {
  const m = Math.max(1, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (m < 60) return `${m} min`;
  if (m < 60 * 24) return `${Math.round(m / 60)} h`;
  const d = Math.round(m / 1440);
  return `${d} ${d === 1 ? "day" : "days"}`;
};

const greeting = (now: number) => {
  const h = new Date(now).getHours();
  return h < 12 ? "Good morning." : h < 18 ? "Good afternoon." : "Good evening.";
};

function callWhen(iso: string, now: number) {
  const key = dateKey(iso);
  const today = dateKey(now);
  const dayDiff = Math.round((Date.parse(key) - Date.parse(today)) / 86_400_000);
  const day = dayDiff === 0 ? "Today" : dayDiff === 1 ? "Tomorrow" : fmtKey(key, { weekday: "short", day: "numeric", month: "short" });
  return { day, time: fmtTime(iso), dayDiff };
}

function Tile({ label, value, note, href, children }: { label: string; value: string; note: React.ReactNode; href?: string; children?: React.ReactNode }) {
  const body = (
    <>
      <p className="adm-tile-label">{label}</p>
      <p className="adm-tile-value">{value}</p>
      <div className="adm-tile-foot">
        <span>{note}</span>
        {children}
      </div>
    </>
  );
  return href ? (
    <Link href={href} className="adm-tile adm-tile-link">
      {body}
    </Link>
  ) : (
    <div className="adm-tile">{body}</div>
  );
}

export default function Dashboard() {
  const { unread } = useInbox();
  const [now] = useState(() => Date.now());
  const [range, setRange] = useState<Range>("30d");
  const [chartTable, setChartTable] = useState(false);
  const [sourceTable, setSourceTable] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const cfg = RANGES.find((r) => r.key === range)!;

  useEffect(() => {
    let live = true;
    api
      .get<DashboardStats>(`/api/admin/dashboard/stats?range=${range}`)
      .then((s) => live && setStats(s))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [range]);

  const buckets = useMemo(() => (stats?.buckets ?? []).map((b) => ({ ...b, start: new Date(b.start), end: new Date(b.end) })), [stats]);
  const total = stats?.total ?? 0;
  const before = stats?.previousTotal ?? 0;
  const delta = before ? Math.round(((total - before) / before) * 100) : 0;
  const spark = stats?.spark ?? [];
  const bySource = stats?.bySource ?? (Object.fromEntries(SOURCE_KEYS.map((k) => [k, 0])) as Record<SourceKey, number>);

  const waitingList = useMemo(
    () => (stats?.needsReply ?? []).map((e) => ({ id: e._id, name: e.name, subject: e.subject, source: e.source, received: e.received })),
    [stats],
  );
  const upcoming = useMemo(
    () => (stats?.upcomingCalls ?? []).map((b) => ({ id: b._id, name: b.name, topic: b.topic, start: b.start, minutes: b.minutes })).sort((a, b) => a.start.localeCompare(b.start)),
    [stats],
  );
  const thisWeek = upcoming.filter((b) => new Date(b.start).getTime() < now + 7 * 86_400_000);
  const next = upcoming[0];
  const nextWhen = next ? callWhen(next.start, now) : null;

  return (
    <div className="adm-dash">
      <div className="adm-hero">
        <div>
          <p className="adm-eyebrow">{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(now)}</p>
          <h2 className="adm-title">{greeting(now)}</h2>
          <p className="adm-lead">
            {waitingList.length > 0 ? (
              <>
                {waitingList.length} {waitingList.length === 1 ? "enquiry is" : "enquiries are"} waiting for a reply
                {thisWeek.length > 0 ? ` and ${thisWeek.length} ${thisWeek.length === 1 ? "call is" : "calls are"} booked this week.` : "."}
              </>
            ) : (
              "You're all caught up. New enquiries will show up here."
            )}
          </p>
        </div>
        <div className="adm-hero-actions">
          <Link href="/admin/inbox" className="adm-btn adm-btn-sm">
            Open inbox <IconArrowRight />
          </Link>
        </div>
      </div>

      <section className="adm-kpis" aria-label="At a glance">
        <Tile label="Unread" value={String(unread)} note={unread === 1 ? "new enquiry in the inbox" : "new enquiries in the inbox"} href="/admin/inbox" />
        <Tile label="Needs a reply" value={String(waitingList.length)} note={waitingList[0] ? `Oldest waiting ${waiting(waitingList[0].received, now)}` : "All caught up"} href="/admin/inbox" />
        <Tile label="Calls coming up" value={String(thisWeek.length)} note={next && nextWhen ? `Next: ${nextWhen.day} ${nextWhen.time}, ${next.name}` : "Nothing booked yet"} href="/admin/bookings" />
        <Tile
          label={`Enquiries, last ${cfg.label}`}
          value={String(total)}
          note={
            before ? (
              <span className={delta >= 0 ? "adm-delta adm-up" : "adm-delta adm-down"}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% <em>vs the previous {cfg.label}</em>
              </span>
            ) : (
              "No earlier period to compare"
            )
          }
        >
          <Spark points={spark} />
        </Tile>
      </section>

      <div className="adm-filterrow">
        <span className="adm-filterlabel" id="adm-range-label">
          Period
        </span>
        <div className="adm-tabs" role="tablist" aria-labelledby="adm-range-label">
          {RANGES.map((r) => (
            <button key={r.key} type="button" role="tab" className="adm-tab" aria-selected={range === r.key} onClick={() => setRange(r.key)}>
              {r.label}
            </button>
          ))}
        </div>
        <span className="adm-muted">Applies to the enquiry tile and both charts. Unread, replies and calls are always current.</span>
      </div>

      <div className="adm-dash-grid">
        <section className="adm-card adm-chartcard" aria-labelledby="adm-c1">
          <header className="adm-cardhead">
            <div>
              <h3 id="adm-c1">Enquiries over time</h3>
              <p>
                {total} in the last {cfg.label}, by {cfg.bucket === 1 ? "day" : "week"}. Hover a bar to see where they came from.
              </p>
            </div>
            <button type="button" className="adm-mini" aria-pressed={chartTable} onClick={() => setChartTable((t) => !t)}>
              {chartTable ? "Show chart" : "View as table"}
            </button>
          </header>
          <ColumnChart buckets={buckets} bucketDays={cfg.bucket} table={chartTable} />
        </section>

        <section className="adm-card adm-chartcard" aria-labelledby="adm-c2">
          <header className="adm-cardhead">
            <div>
              <h3 id="adm-c2">Where enquiries come from</h3>
              <p>Last {cfg.label}, by website form.</p>
            </div>
            <button type="button" className="adm-mini" aria-pressed={sourceTable} onClick={() => setSourceTable((t) => !t)}>
              {sourceTable ? "Show chart" : "View as table"}
            </button>
          </header>
          <SourceBars totals={bySource} table={sourceTable} />
        </section>
      </div>

      <div className="adm-dash-grid">
        <section className="adm-card" aria-labelledby="adm-c3">
          <header className="adm-cardhead">
            <div>
              <h3 id="adm-c3">Needs a reply</h3>
              <p>Oldest first, so nothing slips.</p>
            </div>
            <Link href="/admin/inbox" className="adm-mini">
              Open inbox
            </Link>
          </header>
          {waitingList.length === 0 ? (
            <div className="adm-empty adm-empty-tight">
              <IconInbox />
              <h3>You&apos;re all caught up</h3>
              <p>Nothing is waiting for a reply.</p>
            </div>
          ) : (
            <ul className="adm-mlist">
              {waitingList.slice(0, 5).map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/inbox/${e.id}`}>
                    <span className="adm-avatar adm-avatar-sm" aria-hidden="true">
                      {initials(e.name)}
                    </span>
                    <span className="adm-mlist-main">
                      <strong>{e.name}</strong>
                      <span>
                        <SourcePill source={e.source} /> {snippet(e.subject, 46)}
                      </span>
                    </span>
                    <span className="adm-wait" title="Time since it arrived">
                      {waiting(e.received, now)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {waitingList.length > 5 && <p className="adm-more">and {waitingList.length - 5} more in the inbox</p>}
        </section>

        <section className="adm-card" aria-labelledby="adm-c4">
          <header className="adm-cardhead">
            <div>
              <h3 id="adm-c4">Upcoming calls</h3>
              <p>Booked through the website.</p>
            </div>
            <Link href="/admin/bookings" className="adm-mini">
              All bookings
            </Link>
          </header>
          {upcoming.length === 0 ? (
            <div className="adm-empty adm-empty-tight">
              <IconCalendar />
              <h3>No calls booked</h3>
              <p>Calls booked on the website appear here.</p>
            </div>
          ) : (
            <ul className="adm-mlist adm-calls">
              {upcoming.slice(0, 4).map((b) => {
                const w = callWhen(b.start, now);
                const end = fmtTime(new Date(new Date(b.start).getTime() + b.minutes * 60_000));
                return (
                  <li key={b.id}>
                    <Link href="/admin/bookings">
                      <span className={`adm-datechip${w.dayDiff <= 1 ? " adm-datechip-soon" : ""}`}>
                        <small>{fmtKey(dateKey(b.start), { month: "short" })}</small>
                        <b>{Number(dateKey(b.start).slice(8))}</b>
                      </span>
                      <span className="adm-mlist-main">
                        <strong>{b.name}</strong>
                        <span>{b.topic}</span>
                      </span>
                      <span className="adm-wait">
                        {w.day}
                        <small>
                          {w.time}–{end}
                        </small>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {upcoming.length > 4 && <p className="adm-more">and {upcoming.length - 4} more booked</p>}
        </section>
      </div>
    </div>
  );
}
