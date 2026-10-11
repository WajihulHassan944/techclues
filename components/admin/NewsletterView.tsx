"use client";

import { useMemo, useState } from "react";
import { fmtWhen } from "@/lib/admin/format";
import { SUB_SOURCES, SUB_STATUS, downloadText, subscribersCsv, type SubSource, type SubStatus, type Subscriber } from "@/lib/admin/newsletter";
import { addDays, dateKey, zoned } from "@/lib/admin/tz";
import { CountColumns, LabelBars, type CountBucket } from "./charts";
import Dialog from "./Dialog";
import { useInbox } from "./InboxProvider";
import { useNewsletter } from "./NewsletterProvider";
import { IconMail, IconPlus, IconSearch } from "./icons";

const PERIODS = [
  { key: "30d", label: "30 days", days: 30, bucket: 1 },
  { key: "13w", label: "13 weeks", days: 91, bucket: 7 },
] as const;

const PAGE = 20;
const srcLabels = Object.keys(SUB_SOURCES) as SubSource[];

function buildBuckets(subs: Subscriber[], now: number, days: number, bucket: number): CountBucket[] {
  const today = dateKey(now);
  const byDay = new Map<string, Subscriber[]>();
  for (const s of subs) {
    const k = dateKey(s.at);
    byDay.set(k, [...(byDay.get(k) ?? []), s]);
  }
  const n = Math.ceil(days / bucket);
  const out: CountBucket[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const endKey = addDays(today, -i * bucket);
    const startKey = addDays(endKey, -(bucket - 1));
    const counts = Object.fromEntries(srcLabels.map((s) => [s, 0])) as Record<SubSource, number>;
    let total = 0;
    for (let d = 0; d < bucket; d++) {
      for (const s of byDay.get(addDays(startKey, d)) ?? []) {
        counts[s.source]++;
        total++;
      }
    }
    out.push({ start: zoned(startKey, 12 * 60), end: zoned(endKey, 12 * 60), total, rows: srcLabels.map((s) => ({ label: SUB_SOURCES[s], value: counts[s] })) });
  }
  return out;
}

const countIn = (subs: Subscriber[], from: number, to: number) => subs.filter((s) => new Date(s.at).getTime() >= from && new Date(s.at).getTime() < to).length;

function AddDialog({ onClose }: { onClose: () => void }) {
  const { add } = useNewsletter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");
  return (
    <Dialog
      title="Add a subscriber"
      onClose={onClose}
      footer={
        <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
          <button type="button" className="adm-mini" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="adm-btn adm-btn-sm"
            disabled={!consent}
            onClick={() => {
              const e = add(email, name, "manual");
              if (e) setErr(e);
              else onClose();
            }}
          >
            Add subscriber
          </button>
        </span>
      }
    >
      <p className="adm-muted adm-dlg-lead">Only add someone who has asked to hear from you. We keep a note that you added them by hand.</p>
      <div className="adm-field">
        <label htmlFor="ns-email">Email address</label>
        <input id="ns-email" type="email" className="adm-input" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} aria-invalid={!!err} autoFocus />
        {err && <small className="adm-err">{err}</small>}
      </div>
      <div className="adm-field">
        <label htmlFor="ns-name">Name (optional)</label>
        <input id="ns-name" className="adm-input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <label className="adm-check">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> They asked to receive the newsletter
      </label>
    </Dialog>
  );
}

function ImportDialog({ onClose }: { onClose: () => void }) {
  const { addMany } = useNewsletter();
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<null | { added: number; existing: number; invalid: number }>(null);
  const list = text.split(/[\n,;]+/).map((x) => x.trim()).filter(Boolean);
  return (
    <Dialog
      title="Import subscribers"
      onClose={onClose}
      footer={
        <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
          {result ? (
            <button type="button" className="adm-btn adm-btn-sm" onClick={onClose}>
              Done
            </button>
          ) : (
            <>
              <button type="button" className="adm-mini" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="adm-btn adm-btn-sm" disabled={!consent || list.length === 0} onClick={() => setResult(addMany(list, "import"))}>
                Import {list.length || ""} {list.length === 1 ? "address" : "addresses"}
              </button>
            </>
          )}
        </span>
      }
    >
      {result ? (
        <p className="adm-note" role="status">
          Added {result.added}. {result.existing} already on the list. {result.invalid} not valid.
        </p>
      ) : (
        <>
          <p className="adm-muted adm-dlg-lead">Paste email addresses, one per line or separated by commas. Duplicates and invalid addresses are skipped.</p>
          <div className="adm-field">
            <label htmlFor="ns-import">Email addresses</label>
            <textarea id="ns-import" className="adm-textarea" rows={7} value={text} onChange={(e) => setText(e.target.value)} placeholder={"name@example.com\nsecond@example.com"} />
          </div>
          <label className="adm-check">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> Everyone on this list asked to receive the newsletter
          </label>
        </>
      )}
    </Dialog>
  );
}

export default function NewsletterView() {
  const { subs, setStatus, remove } = useNewsletter();
  const { toast } = useInbox();
  const [now] = useState(() => Date.now());
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["key"]>("30d");
  const [chartTable, setChartTable] = useState(false);
  const [srcTable, setSrcTable] = useState(false);
  const [tab, setTab] = useState<"all" | SubStatus>("all");
  const [source, setSource] = useState<"" | SubSource>("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "email">("newest");
  const [picked, setPicked] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<null | "add" | "import" | "delete">(null);
  const cfg = PERIODS.find((p) => p.key === period)!;

  const active = subs.filter((s) => s.status === "subscribed").length;
  const ended = subs.filter((s) => s.status === "unsubscribed").length;
  const bounced = subs.filter((s) => s.status === "bounced").length;
  const last30 = countIn(subs, now - 30 * 86_400_000, now + 1);
  const prev30 = countIn(subs, now - 60 * 86_400_000, now - 30 * 86_400_000);
  const delta = prev30 ? Math.round(((last30 - prev30) / prev30) * 100) : 0;

  const buckets = useMemo(() => buildBuckets(subs, now, cfg.days, cfg.bucket), [subs, now, cfg]);
  const inRange = buckets.reduce((s, b) => s + b.total, 0);
  const bySource = useMemo(
    () =>
      srcLabels.map((k) => ({ label: SUB_SOURCES[k], value: buckets.reduce((s, b) => s + (b.rows.find((r) => r.label === SUB_SOURCES[k])?.value ?? 0), 0) })),
    [buckets],
  );

  const counts = useMemo(() => ({ all: subs.length, subscribed: active, unsubscribed: ended, bounced }), [subs.length, active, ended, bounced]);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = subs.filter((s) => (tab === "all" || s.status === tab) && (!source || s.source === source) && (!q || `${s.email} ${s.name ?? ""}`.toLowerCase().includes(q)));
    return list.sort((a, b) => (sort === "email" ? a.email.localeCompare(b.email) : sort === "oldest" ? a.at.localeCompare(b.at) : b.at.localeCompare(a.at)));
  }, [subs, tab, source, query, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const at = Math.min(page, pages - 1);
  const visible = rows.slice(at * PAGE, at * PAGE + PAGE);
  const ids = visible.map((r) => r.id);
  const selected = picked.filter((id) => rows.some((r) => r.id === id));
  const allOn = visible.length > 0 && visible.every((r) => selected.includes(r.id));
  const clear = () => setPicked([]);

  const exportCsv = (list: Subscriber[]) => {
    downloadText(`techclues-subscribers-${dateKey(Date.now())}.csv`, subscribersCsv(list));
    toast(`Exported ${list.length} ${list.length === 1 ? "subscriber" : "subscribers"}`);
  };

  return (
    <div className="adm-dash">
      <section className="adm-kpis" aria-label="Newsletter at a glance">
        <div className="adm-tile">
          <p className="adm-tile-label">Active subscribers</p>
          <p className="adm-tile-value">{active}</p>
          <div className="adm-tile-foot">
            <span>of {subs.length} people who ever signed up</span>
          </div>
        </div>
        <div className="adm-tile">
          <p className="adm-tile-label">New in the last 30 days</p>
          <p className="adm-tile-value">{last30}</p>
          <div className="adm-tile-foot">
            <span>{prev30 ? <span className={delta >= 0 ? "adm-delta adm-up" : "adm-delta adm-down"}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% <em>vs the 30 days before</em></span> : "No earlier period to compare"}</span>
          </div>
        </div>
        <div className="adm-tile">
          <p className="adm-tile-label">Unsubscribed</p>
          <p className="adm-tile-value">{ended}</p>
          <div className="adm-tile-foot">
            <span>{subs.length ? Math.round((ended / subs.length) * 100) : 0}% of all sign-ups</span>
          </div>
        </div>
        <div className="adm-tile">
          <p className="adm-tile-label">Bounced</p>
          <p className="adm-tile-value">{bounced}</p>
          <div className="adm-tile-foot">
            <span>addresses that could not be reached</span>
          </div>
        </div>
      </section>

      <div className="adm-filterrow">
        <span className="adm-filterlabel" id="ns-period">
          Period
        </span>
        <div className="adm-tabs" role="tablist" aria-labelledby="ns-period">
          {PERIODS.map((p) => (
            <button key={p.key} type="button" role="tab" className="adm-tab" aria-selected={period === p.key} onClick={() => setPeriod(p.key)}>
              {p.label}
            </button>
          ))}
        </div>
        <span className="adm-muted">Applies to both charts.</span>
      </div>

      <div className="adm-dash-grid">
        <section className="adm-card adm-chartcard" aria-labelledby="ns-c1">
          <header className="adm-cardhead">
            <div>
              <h3 id="ns-c1">New subscribers</h3>
              <p>
                {inRange} in the last {cfg.label}, by {cfg.bucket === 1 ? "day" : "week"}. Hover a bar to see where they signed up.
              </p>
            </div>
            <button type="button" className="adm-mini" aria-pressed={chartTable} onClick={() => setChartTable((t) => !t)}>
              {chartTable ? "Show chart" : "View as table"}
            </button>
          </header>
          <CountColumns buckets={buckets} bucketDays={cfg.bucket} table={chartTable} noun="sign-up" plural="sign-ups" />
        </section>
        <section className="adm-card adm-chartcard" aria-labelledby="ns-c2">
          <header className="adm-cardhead">
            <div>
              <h3 id="ns-c2">Where they signed up</h3>
              <p>Last {cfg.label}.</p>
            </div>
            <button type="button" className="adm-mini" aria-pressed={srcTable} onClick={() => setSrcTable((t) => !t)}>
              {srcTable ? "Show chart" : "View as table"}
            </button>
          </header>
          <LabelBars items={bySource} table={srcTable} heading="Sign-ups by source" noun="sign-up" plural="sign-ups" />
        </section>
      </div>

      <section className="adm-stack" aria-label="Subscribers">
        <div className="adm-seg" role="group" aria-label="Subscriber actions">
          <h3 className="adm-listhead">Subscribers</h3>
          <span className="adm-dlg-foot-btns adm-seg-empty">
            <button type="button" className="adm-mini" onClick={() => setDialog("import")}>
              Import
            </button>
            <button type="button" className="adm-mini" onClick={() => exportCsv(rows)} disabled={rows.length === 0}>
              Export CSV ({rows.length})
            </button>
            <button type="button" className="adm-btn adm-btn-sm" onClick={() => setDialog("add")}>
              <IconPlus /> Add subscriber
            </button>
          </span>
        </div>
        <div className="adm-filters">
          <label className="adm-search adm-search-wide">
            <span className="sr-only">Search subscribers</span>
            <IconSearch />
            <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder="Search email or name…" />
          </label>
          <label className="adm-select-wrap">
            <span className="sr-only">Signed up from</span>
            <select className="adm-select" value={source} onChange={(e) => { setSource(e.target.value as "" | SubSource); setPage(0); }}>
              <option value="">All sources</option>
              {srcLabels.map((k) => (
                <option key={k} value={k}>
                  {SUB_SOURCES[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="adm-select-wrap">
            <span className="sr-only">Sort</span>
            <select className="adm-select" value={sort} onChange={(e) => { setSort(e.target.value as typeof sort); setPage(0); }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="email">Email A to Z</option>
            </select>
          </label>
        </div>
        <div className="adm-tabs" role="tablist" aria-label="Filter by status">
          {([["all", "All"], ["subscribed", "Subscribed"], ["unsubscribed", "Unsubscribed"], ["bounced", "Bounced"]] as ["all" | SubStatus, string][]).map(([k, label]) => (
            <button key={k} type="button" role="tab" className="adm-tab" aria-selected={tab === k} onClick={() => { setTab(k); setPage(0); }}>
              {label}
              <span className="adm-tab-n">{counts[k]}</span>
            </button>
          ))}
        </div>

        <div className="adm-table">
          <div className="adm-bulk" data-active={selected.length > 0}>
            <label className="adm-check adm-check-all">
              <input type="checkbox" checked={allOn} onChange={() => setPicked((p) => (allOn ? p.filter((x) => !ids.includes(x)) : [...new Set([...p, ...ids])]))} aria-label="Select all shown" />
              {selected.length > 0 ? <strong>{selected.length} selected</strong> : <span>{rows.length} {rows.length === 1 ? "subscriber" : "subscribers"}</span>}
            </label>
            {selected.length > 0 && (
              <div className="adm-bulk-actions">
                <button type="button" className="adm-mini" onClick={() => exportCsv(rows.filter((r) => selected.includes(r.id)))}>
                  Export selected
                </button>
                <button type="button" className="adm-mini" onClick={() => { setStatus(selected, "unsubscribed"); clear(); }}>
                  Unsubscribe
                </button>
                <button type="button" className="adm-mini" onClick={() => { setStatus(selected, "subscribed"); clear(); }}>
                  Resubscribe
                </button>
                <button type="button" className="adm-mini adm-mini-danger" onClick={() => setDialog("delete")}>
                  Delete
                </button>
                <button type="button" className="adm-mini adm-mini-ghost" onClick={clear}>
                  Clear
                </button>
              </div>
            )}
          </div>
          {rows.length === 0 ? (
            <div className="adm-empty">
              <IconMail />
              <h3>{subs.length === 0 ? "No subscribers yet" : "No subscribers match"}</h3>
              <p>{subs.length === 0 ? "People who sign up on the website appear here." : "Try a different search, status or source."}</p>
            </div>
          ) : (
            <ul className="adm-subs">
              {visible.map((s) => (
                <li key={s.id} className="adm-sub" data-selected={selected.includes(s.id)}>
                  <input type="checkbox" className="adm-rowcheck" checked={selected.includes(s.id)} onChange={() => setPicked((p) => (p.includes(s.id) ? p.filter((x) => x !== s.id) : [...p, s.id]))} aria-label={`Select ${s.email}`} />
                  <span className="adm-sub-who">
                    <strong>{s.email}</strong>
                    {s.name && <small>{s.name}</small>}
                  </span>
                  <span className="adm-sub-src">{SUB_SOURCES[s.source]}</span>
                  <span className={`adm-substatus adm-substatus-${s.status}`}>{SUB_STATUS[s.status]}</span>
                  <time className="adm-sub-when" dateTime={s.at}>
                    {fmtWhen(s.at, now)}
                  </time>
                  <span className="adm-dlg-foot-btns">
                    {s.status === "subscribed" ? (
                      <button type="button" className="adm-mini" aria-label={`Unsubscribe ${s.email}`} onClick={() => setStatus([s.id], "unsubscribed")}>
                        Unsubscribe
                      </button>
                    ) : (
                      <button type="button" className="adm-mini" aria-label={`Resubscribe ${s.email}`} onClick={() => setStatus([s.id], "subscribed")}>
                        Resubscribe
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {pages > 1 && (
            <nav className="adm-pager" aria-label="Pages">
              <span>
                {at * PAGE + 1}–{Math.min(rows.length, at * PAGE + PAGE)} of {rows.length}
              </span>
              <span className="adm-dlg-foot-btns">
                <button type="button" className="adm-mini" disabled={at === 0} onClick={() => setPage(at - 1)}>
                  Previous
                </button>
                <button type="button" className="adm-mini" disabled={at >= pages - 1} onClick={() => setPage(at + 1)}>
                  Next
                </button>
              </span>
            </nav>
          )}
        </div>
      </section>

      {dialog === "add" && <AddDialog onClose={() => setDialog(null)} />}
      {dialog === "import" && <ImportDialog onClose={() => setDialog(null)} />}
      {dialog === "delete" && (
        <Dialog
          title={`Delete ${selected.length} ${selected.length === 1 ? "subscriber" : "subscribers"}?`}
          onClose={() => setDialog(null)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setDialog(null)}>
                Keep them
              </button>
              <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => { remove(selected); clear(); setDialog(null); }}>
                Delete for good
              </button>
            </span>
          }
        >
          <p className="adm-muted">Their addresses are removed completely. Use this for data-deletion requests. To keep a record that someone opted out, choose Unsubscribe instead.</p>
        </Dialog>
      )}
    </div>
  );
}
