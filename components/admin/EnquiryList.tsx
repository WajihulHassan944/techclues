"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fmtWhen, initials, snippet } from "@/lib/admin/format";
import { SOURCES, SOURCE_KEYS, STATUSES, STATUS_KEYS, type Enquiry, type Folder, type SourceKey, type StatusKey } from "@/lib/admin/inbox-types";
import { useInbox } from "./InboxProvider";
import { IconBan, IconInbox, IconSearch } from "./icons";

type Tab = "all" | "unread" | "needs-reply" | "starred" | StatusKey;

export const needsReply = (e: Enquiry) => e.status === "new" && !e.thread.some((m) => m.from === "us");

export function SourcePill({ source }: { source: SourceKey }) {
  return <span className={`adm-src adm-src-${source}`}>{SOURCES[source].label}</span>;
}
export function StatusBadge({ status }: { status: StatusKey }) {
  return <span className={`adm-status adm-status-${status}`}>{STATUSES[status].label}</span>;
}

const Star = ({ on }: { on: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="adm-ic" aria-hidden="true">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

export default function EnquiryList({ folder }: { folder: Folder }) {
  const { state, setRead, setStatus, toggleStar, moveTo, deleteForever } = useInbox();
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<SourceKey | "all">("all");
  const [tab, setTab] = useState<Tab>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [picked, setPicked] = useState<string[]>([]);
  const [now] = useState(() => Date.now());
  const inboxMode = folder === "inbox";

  const inFolder = useMemo(() => state.enquiries.filter((e) => e.folder === folder), [state.enquiries, folder]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: inFolder.length, unread: 0, "needs-reply": 0, starred: 0 };
    for (const k of STATUS_KEYS) c[k] = 0;
    for (const e of inFolder) {
      if (!e.read) c.unread++;
      if (needsReply(e)) c["needs-reply"]++;
      if (e.starred) c.starred++;
      c[e.status]++;
    }
    return c;
  }, [inFolder]);

  const sourceCounts = useMemo(() => {
    const c: Partial<Record<SourceKey, number>> = {};
    for (const e of inFolder) c[e.source] = (c[e.source] ?? 0) + 1;
    return c;
  }, [inFolder]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = inFolder.filter((e) => {
      if (source !== "all" && e.source !== source) return false;
      if (tab === "unread" && e.read) return false;
      if (tab === "needs-reply" && !needsReply(e)) return false;
      if (tab === "starred" && !e.starred) return false;
      if ((STATUS_KEYS as string[]).includes(tab) && e.status !== tab) return false;
      if (q && !`${e.name} ${e.email} ${e.company ?? ""} ${e.subject} ${e.message}`.toLowerCase().includes(q)) return false;
      return true;
    });
    list.sort((a, b) => (sort === "newest" ? b.received.localeCompare(a.received) : a.received.localeCompare(b.received)));
    return list;
  }, [inFolder, source, tab, query, sort]);

  const visibleIds = rows.map((r) => r.id);
  const selected = picked.filter((id) => visibleIds.includes(id));
  const allOn = rows.length > 0 && selected.length === rows.length;
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const done = () => setPicked([]);

  const tabs: { key: Tab; label: string }[] = inboxMode
    ? [
        { key: "all", label: "All" },
        { key: "unread", label: "Unread" },
        { key: "needs-reply", label: "Needs reply" },
        { key: "starred", label: "Starred" },
        ...STATUS_KEYS.filter((k) => k !== "new").map((k) => ({ key: k as Tab, label: STATUSES[k].label })),
      ]
    : [{ key: "all", label: "All" }];

  return (
    <div className="adm-list">
      <div className="adm-filters">
        <label className="adm-search adm-search-wide">
          <span className="sr-only">Search enquiries</span>
          <IconSearch />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, company or message…" />
        </label>
        <label className="adm-select-wrap">
          <span className="sr-only">Sort</span>
          <select className="adm-select" value={sort} onChange={(e) => setSort(e.target.value as "newest" | "oldest")}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {inboxMode && (
        <div className="adm-tabs" role="tablist" aria-label="Filter by status">
          {tabs.map((t) => (
            <button key={t.key} role="tab" type="button" aria-selected={tab === t.key} className="adm-tab" onClick={() => setTab(t.key)}>
              {t.label}
              <span className="adm-tab-n">{counts[t.key] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      <div className="adm-chips" role="group" aria-label="Filter by source">
        <button type="button" className="adm-chipbtn" aria-pressed={source === "all"} onClick={() => setSource("all")}>
          All sources
        </button>
        {SOURCE_KEYS.filter((k) => sourceCounts[k]).map((k) => (
          <button key={k} type="button" className="adm-chipbtn" aria-pressed={source === k} onClick={() => setSource(source === k ? "all" : k)}>
            <span className={`adm-dotc adm-src-${k}`} aria-hidden="true" />
            {SOURCES[k].label}
            <span className="adm-tab-n">{sourceCounts[k]}</span>
          </button>
        ))}
      </div>

      <div className="adm-table" role="region" aria-label={folder === "inbox" ? "Enquiries" : folder === "spam" ? "Spam" : "Trash"}>
        <div className="adm-bulk" data-active={selected.length > 0}>
          <label className="adm-check adm-check-all">
            <input type="checkbox" checked={allOn} onChange={() => setPicked(allOn ? [] : visibleIds)} aria-label="Select all shown" />
            {selected.length > 0 ? <strong>{selected.length} selected</strong> : <span>{rows.length} {rows.length === 1 ? "enquiry" : "enquiries"}</span>}
          </label>
          {selected.length > 0 && (
            <div className="adm-bulk-actions">
              {inboxMode ? (
                <>
                  <button type="button" className="adm-mini" onClick={() => { setRead(selected, true); done(); }}>
                    Mark read
                  </button>
                  <button type="button" className="adm-mini" onClick={() => { setRead(selected, false); done(); }}>
                    Mark unread
                  </button>
                  <label className="adm-select-wrap adm-select-mini">
                    <span className="sr-only">Set status</span>
                    <select className="adm-select" value="" onChange={(e) => { if (e.target.value) { setStatus(selected, e.target.value as StatusKey); done(); } }}>
                      <option value="">Set status…</option>
                      {STATUS_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {STATUSES[k].label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" className="adm-mini" onClick={() => { moveTo(selected, "spam"); done(); }}>
                    Spam
                  </button>
                  <button type="button" className="adm-mini adm-mini-danger" onClick={() => { moveTo(selected, "trash"); done(); }}>
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="adm-mini" onClick={() => { moveTo(selected, "inbox"); done(); }}>
                    {folder === "spam" ? "Not spam" : "Restore"}
                  </button>
                  <button type="button" className="adm-mini adm-mini-danger" onClick={() => { deleteForever(selected); done(); }}>
                    Delete forever
                  </button>
                </>
              )}
              <button type="button" className="adm-mini adm-mini-ghost" onClick={done}>
                Clear
              </button>
            </div>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="adm-empty">
            {folder === "inbox" ? <IconInbox /> : <IconBan />}
            <h3>{inFolder.length === 0 ? (folder === "inbox" ? "Your inbox is empty" : `Nothing in ${folder}`) : "No enquiries match"}</h3>
            <p>{inFolder.length === 0 ? (folder === "inbox" ? "New form submissions will show up here." : "Items you move here will wait here.") : "Try a different search, status or source."}</p>
            {inFolder.length > 0 && (
              <button type="button" className="adm-mini" onClick={() => { setQuery(""); setTab("all"); setSource("all"); }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ul className="adm-rows">
            {rows.map((e) => (
              <li key={e.id} className="adm-row-item" data-unread={!e.read} data-selected={selected.includes(e.id)}>
                <input type="checkbox" className="adm-rowcheck" checked={selected.includes(e.id)} onChange={() => toggle(e.id)} aria-label={`Select ${e.name}`} />
                <button type="button" className="adm-star" aria-pressed={e.starred} aria-label={e.starred ? `Unstar ${e.name}` : `Star ${e.name}`} onClick={() => toggleStar(e.id)}>
                  <Star on={e.starred} />
                </button>
                <Link href={`/admin/inbox/${e.id}`} className="adm-row-link">
                  <span className="adm-avatar adm-avatar-sm" aria-hidden="true">
                    {initials(e.name)}
                  </span>
                  <span className="adm-row-who">
                    <strong>{e.name}</strong>
                    {e.company && <small>{e.company}</small>}
                  </span>
                  <span className="adm-row-main">
                    <span className="adm-row-subject">
                      <SourcePill source={e.source} />
                      <span>{e.subject}</span>
                    </span>
                    <span className="adm-row-snip">{snippet(e.message, 130)}</span>
                  </span>
                  <span className="adm-row-meta">
                    <time dateTime={e.received}>{fmtWhen(e.received, now)}</time>
                    {inboxMode && <StatusBadge status={e.status} />}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
