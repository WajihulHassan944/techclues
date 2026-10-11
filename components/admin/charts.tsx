"use client";

import { useState } from "react";
import { SOURCES, SOURCE_KEYS, type SourceKey } from "@/lib/admin/inbox-types";
import { niceAxis, type Bucket } from "@/lib/admin/stats";

const fmtDay = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d);
const fmtLong = (d: Date) => new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }).format(d);
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export function bucketLabel(b: Bucket, bucketDays: number) {
  return bucketDays === 1 ? fmtLong(b.start) : `${fmtDay(b.start)} to ${fmtDay(b.end)}`;
}

/** Enquiries per day (or week): one series, one colour; the source breakdown lives in the tooltip and the table. */
export function ColumnChart({ buckets, bucketDays, table }: { buckets: Bucket[]; bucketDays: number; table: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(0, ...buckets.map((b) => b.total));
  const { top, ticks } = niceAxis(max);
  const n = buckets.length;
  const every = n <= 8 ? 1 : n <= 16 ? 2 : 5;
  const unit = bucketDays === 1 ? "day" : "week";

  if (table) {
    return (
      <div className="adm-tablewrap" data-lenis-prevent>
        <table className="adm-data">
          <caption className="sr-only">Enquiries per {unit}</caption>
          <thead>
            <tr>
              <th scope="col">{bucketDays === 1 ? "Day" : "Week"}</th>
              <th scope="col" className="num">
                Enquiries
              </th>
            </tr>
          </thead>
          <tbody>
            {[...buckets].reverse().map((b) => (
              <tr key={b.start.toISOString()}>
                <th scope="row">{bucketLabel(b, bucketDays)}</th>
                <td className="num">{b.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const tip = active === null ? null : buckets[active];
  const side = active === null ? "" : active < 2 ? "adm-tip-left" : active > n - 3 ? "adm-tip-right" : "";

  return (
    <div className="adm-chart" role="group" aria-label={`Enquiries per ${unit}`}>
      <div className="adm-chart-body">
        <div className="adm-yaxis" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} style={{ bottom: `${(t / top) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>
        <div className="adm-plot" onPointerLeave={() => setActive(null)}>
          {ticks.map((t) => (
            <i key={t} className="adm-gl" style={{ bottom: `${(t / top) * 100}%` }} aria-hidden="true" />
          ))}
          <div className="adm-cols">
            {buckets.map((b, i) => (
              <button
                key={b.start.toISOString()}
                type="button"
                className="adm-col"
                data-on={active === i}
                aria-label={`${bucketLabel(b, bucketDays)}: ${plural(b.total, "enquiry").replace("enquirys", "enquiries")}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <span className="adm-bar" style={{ height: b.total ? `max(3px, ${(b.total / top) * 100}%)` : 0 }} />
              </button>
            ))}
          </div>
          {tip && (
            <div className={`adm-tip ${side}`} style={{ left: `${((active! + 0.5) / n) * 100}%` }} role="status">
              <small>{bucketLabel(tip, bucketDays)}</small>
              <strong>{plural(tip.total, "enquiry").replace("enquirys", "enquiries")}</strong>
              {tip.total > 0 && (
                <ul>
                  {SOURCE_KEYS.filter((k) => tip.bySource[k] > 0)
                    .sort((a, c) => tip.bySource[c] - tip.bySource[a])
                    .map((k) => (
                      <li key={k}>
                        <span>{SOURCES[k].label}</span>
                        <b>{tip.bySource[k]}</b>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="adm-xaxis" aria-hidden="true">
        {buckets.map((b, i) => (
          <span key={b.start.toISOString()} data-x={(n - 1 - i) % every === 0 ? fmtDay(b.start) : ""} />
        ))}
      </div>
    </div>
  );
}

/** Enquiries by source: bars share one hue because the label already says which source it is. */
export function SourceBars({ totals, table }: { totals: Record<SourceKey, number>; table: boolean }) {
  const rows = SOURCE_KEYS.map((k) => ({ k, n: totals[k] })).sort((a, b) => b.n - a.n);
  const sum = rows.reduce((s, r) => s + r.n, 0);
  const max = Math.max(1, ...rows.map((r) => r.n));
  const pct = (n: number) => (sum ? Math.round((n / sum) * 100) : 0);

  if (table) {
    return (
      <div className="adm-tablewrap" data-lenis-prevent>
        <table className="adm-data">
          <caption className="sr-only">Enquiries by source</caption>
          <thead>
            <tr>
              <th scope="col">Source</th>
              <th scope="col" className="num">
                Enquiries
              </th>
              <th scope="col" className="num">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k}>
                <th scope="row">{SOURCES[r.k].label}</th>
                <td className="num">{r.n}</td>
                <td className="num">{pct(r.n)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <ul className="adm-hbars" aria-label="Enquiries by source">
      {rows.map((r) => (
        <li key={r.k} className="adm-hrow" tabIndex={0} aria-label={`${SOURCES[r.k].label}: ${r.n}, ${pct(r.n)}% of enquiries`}>
          <span className="adm-hlabel">{SOURCES[r.k].label}</span>
          <span className="adm-htrack">
            <span className="adm-hbar" style={{ width: r.n ? `max(6px, ${(r.n / max) * 86}%)` : 0 }} />
            <b className="adm-hval" style={{ left: r.n ? `calc(max(6px, ${(r.n / max) * 86}%) + 8px)` : 0 }}>
              {r.n}
            </b>
          </span>
          <span className="adm-tip adm-tip-row" role="tooltip">
            <strong>{plural(r.n, "enquiry").replace("enquirys", "enquiries")}</strong>
            <small>{pct(r.n)}% of the total</small>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Twelve-point trend for a stat tile: the past in grey, the current period in the accent colour. */
export function Spark({ points }: { points: number[] }) {
  const w = 120;
  const h = 36;
  const max = Math.max(1, ...points);
  const xy = points.map((v, i) => [(i / (points.length - 1)) * (w - 8) + 4, h - 6 - (v / max) * (h - 12)] as const);
  const [lx, ly] = xy[xy.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="adm-spark" role="img" aria-label={`Trend: ${points.join(", ")}`}>
      <polyline points={xy.map((p) => p.join(",")).join(" ")} fill="none" stroke="rgb(14 15 49 / 0.28)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="4" fill="#0064ff" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
