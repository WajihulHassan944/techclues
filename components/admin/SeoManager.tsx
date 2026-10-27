"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { useInbox } from "./InboxProvider";
import { useSettings } from "./SettingsProvider";
import Dialog from "./Dialog";
import { IconPlus } from "./icons";

type SeoTab = "pages" | "redirects" | "404s" | "global";
const TABS: [SeoTab, string][] = [["pages", "Pages"], ["redirects", "Redirects"], ["404s", "404s"], ["global", "Analytics & defaults"]];

type PageRow = { path: string; label: string; hasEntry: boolean; title: string; description: string; noindex: boolean; schemaType: string; score: number };
type PageEntry = {
  path: string;
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  noindex?: boolean;
  schemaType?: string;
  schemaJson?: string;
  includeInSitemap?: boolean;
};
type RedirectRow = { _id: string; from: string; to: string; statusCode: 301 | 302; hits: number };
type NotFoundRow = { _id: string; path: string; hits: number; lastReferrer?: string; lastSeenAt: string };

const SCHEMA_TYPES = ["none", "Organization", "LocalBusiness", "Service", "FAQPage", "Article", "BreadcrumbList"];

export default function SeoManager() {
  const [tab, setTab] = useState<SeoTab>("pages");
  return (
    <section>
      <header style={{ marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>SEO</h2>
      </header>
      <div className="adm-tabs" role="tablist" style={{ marginBottom: 20 }}>
        {TABS.map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} className="adm-tab" onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>
      {tab === "pages" && <PagesTab />}
      {tab === "redirects" && <RedirectsTab />}
      {tab === "404s" && <NotFoundTab />}
      {tab === "global" && <GlobalTab />}
    </section>
  );
}

function scoreColor(score: number) {
  if (score >= 75) return "#1a9d5c";
  if (score >= 45) return "#b8860b";
  return "#c0392b";
}

function PagesTab() {
  const [rows, setRows] = useState<PageRow[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const load = () => api.get<PageRow[]>("/api/admin/seo/pages").then(setRows).catch(() => setRows([]));
  useEffect(() => {
    load();
  }, []);

  if (!rows) return <div aria-busy="true" />;

  return (
    <div>
      <p className="adm-muted" style={{ marginBottom: 14 }}>
        Title, description, social preview, structured data and indexing — per page. Score is a quick completeness check, not a crawl.
      </p>
      <ul className="adm-list">
        {rows.map((r) => (
          <li key={r.path} className="adm-card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{r.label}</strong>
              <div className="adm-muted" style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.path} {r.noindex && "· noindex"}
              </div>
            </div>
            <span style={{ fontWeight: 600, color: scoreColor(r.score), minWidth: 36, textAlign: "right" }}>{r.score}</span>
            <button type="button" className="adm-mini" onClick={() => setEditing(r.path)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      {editing && <PageEditDialog path={editing} onClose={() => setEditing(null)} onSaved={load} />}
    </div>
  );
}

function PageEditDialog({ path, onClose, onSaved }: { path: string; onClose: () => void; onSaved: () => void }) {
  const { toast } = useInbox();
  const [entry, setEntry] = useState<PageEntry | null>(null);
  const [checks, setChecks] = useState<{ label: string; pass: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<{ entry: PageEntry | null; score: number; checks: { label: string; pass: boolean }[] }>(`/api/admin/seo/pages/by-path?path=${encodeURIComponent(path)}`)
      .then((res) => {
        setEntry({ path, includeInSitemap: true, schemaType: "none", ...res.entry });
        setScore(res.score);
        setChecks(res.checks);
      })
      .catch(() => setEntry({ path, includeInSitemap: true, schemaType: "none" }));
  }, [path]);

  if (!entry) return <Dialog title="Loading…" onClose={onClose}><div aria-busy="true" /></Dialog>;

  const save = async () => {
    setBusy(true);
    try {
      await api.post("/api/admin/seo/pages", entry);
      toast(`Saved SEO for ${path}`);
      onSaved();
      onClose();
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Couldn't save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog title={`SEO — ${path}`} onClose={onClose}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {checks.map((c) => (
          <span key={c.label} className="adm-chip" style={{ opacity: c.pass ? 1 : 0.5 }}>
            {c.pass ? "✓" : "✗"} {c.label}
          </span>
        ))}
        <strong style={{ marginLeft: "auto" }}>{score}/100</strong>
      </div>
      <form className="adm-form" id="seo-page-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <div className="adm-field">
          <label htmlFor="seo-title">Title</label>
          <input id="seo-title" className="adm-input" value={entry.title ?? ""} onChange={(e) => setEntry((x) => x && { ...x, title: e.target.value })} maxLength={70} />
        </div>
        <div className="adm-field">
          <label htmlFor="seo-desc">Meta description</label>
          <textarea id="seo-desc" className="adm-input" rows={2} value={entry.description ?? ""} onChange={(e) => setEntry((x) => x && { ...x, description: e.target.value })} maxLength={170} />
        </div>
        <div className="adm-field">
          <label htmlFor="seo-canon">Canonical URL</label>
          <input id="seo-canon" className="adm-input" value={entry.canonical ?? ""} onChange={(e) => setEntry((x) => x && { ...x, canonical: e.target.value })} placeholder="https://techclues.co.uk..." />
        </div>
        <div className="adm-field">
          <label htmlFor="seo-og-image">Social share image (OG) URL</label>
          <input id="seo-og-image" className="adm-input" value={entry.ogImage ?? ""} onChange={(e) => setEntry((x) => x && { ...x, ogImage: e.target.value })} />
        </div>
        <div className="adm-field">
          <label htmlFor="seo-schema">Structured data (schema.org)</label>
          <select id="seo-schema" className="adm-input" value={entry.schemaType ?? "none"} onChange={(e) => setEntry((x) => x && { ...x, schemaType: e.target.value })}>
            {SCHEMA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <label className="adm-check">
          <input type="checkbox" checked={!!entry.noindex} onChange={(e) => setEntry((x) => x && { ...x, noindex: e.target.checked })} /> Hide from search (noindex)
        </label>
        <label className="adm-check">
          <input type="checkbox" checked={entry.includeInSitemap !== false} onChange={(e) => setEntry((x) => x && { ...x, includeInSitemap: e.target.checked })} /> Include in sitemap.xml
        </label>
      </form>
      <div className="adm-dlg-foot-btns" style={{ marginTop: 16 }}>
        <button type="submit" form="seo-page-form" className="adm-btn adm-btn-sm" disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" className="adm-mini adm-mini-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
}

function RedirectsTab() {
  const { toast } = useInbox();
  const [rows, setRows] = useState<RedirectRow[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = () => api.get<RedirectRow[]>("/api/admin/seo/redirects").then(setRows).catch(() => setRows([]));
  useEffect(() => {
    load();
  }, []);

  if (!rows) return <div aria-busy="true" />;

  const submitNew = () => {
    if (!from.trim() || !to.trim()) return;
    api
      .post<RedirectRow>("/api/admin/seo/redirects", { from: from.trim(), to: to.trim() })
      .then((r) => {
        setRows((l) => (l ? [...l, r] : l));
        setFrom("");
        setTo("");
        setAdding(false);
        toast("Redirect added");
      })
      .catch((e) => toast(e instanceof ApiError ? e.message : "Couldn't add that redirect"));
  };

  const remove = (id: string) => {
    api
      .delete(`/api/admin/seo/redirects/${id}`)
      .then(() => setRows((l) => (l ? l.filter((r) => r._id !== id) : l)))
      .catch(() => toast("Couldn't delete that redirect"));
  };

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <p className="adm-muted" style={{ margin: 0 }}>301/302 redirects for old or moved URLs.</p>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => setAdding((o) => !o)}>
          <IconPlus /> Add redirect
        </button>
      </header>
      {adding && (
        <div className="adm-card" style={{ padding: 16, marginBottom: 16, borderStyle: "dashed", display: "flex", gap: 10 }}>
          <input className="adm-input" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="/old-page" />
          <input className="adm-input" value={to} onChange={(e) => setTo(e.target.value)} placeholder="/new-page" />
          <button type="button" className="adm-mini" onClick={submitNew}>
            Add
          </button>
        </div>
      )}
      <ul className="adm-rowlist">
        {rows.map((r) => (
          <li key={r._id}>
            <span>
              <strong>{r.from}</strong> → {r.to}
              <small> {r.statusCode} · {r.hits} hit{r.hits === 1 ? "" : "s"}</small>
            </span>
            <button type="button" className="adm-mini adm-mini-danger" onClick={() => remove(r._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotFoundTab() {
  const { toast } = useInbox();
  const [rows, setRows] = useState<NotFoundRow[] | null>(null);

  const load = () => api.get<NotFoundRow[]>("/api/admin/seo/404s").then(setRows).catch(() => setRows([]));
  useEffect(() => {
    load();
  }, []);

  if (!rows) return <div aria-busy="true" />;

  const resolve = (id: string) => {
    api
      .patch(`/api/admin/seo/404s/${id}/resolve`)
      .then(() => setRows((l) => (l ? l.filter((r) => r._id !== id) : l)))
      .catch(() => toast("Couldn't dismiss that"));
  };

  return (
    <div>
      <p className="adm-muted" style={{ marginBottom: 14 }}>
        URLs visitors hit that returned a 404, most-hit first. Add a redirect, then dismiss.
      </p>
      {rows.length === 0 ? (
        <div className="adm-empty adm-empty-tight adm-empty-page">
          <h3>No 404s reported</h3>
        </div>
      ) : (
        <ul className="adm-rowlist">
          {rows.map((r) => (
            <li key={r._id}>
              <span>
                <strong>{r.path}</strong>
                <small>
                  {r.hits} hit{r.hits === 1 ? "" : "s"} · last seen {new Date(r.lastSeenAt).toLocaleDateString()}
                  {r.lastReferrer ? ` · from ${r.lastReferrer}` : ""}
                </small>
              </span>
              <button type="button" className="adm-mini" onClick={() => resolve(r._id)}>
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GlobalTab() {
  const { settings, update } = useSettings();
  const [draft, setDraft] = useState(settings.seo);
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings.seo);

  return (
    <div className="adm-avail">
      <section className="adm-panel">
        <h3>Tracking</h3>
        <div className="adm-fields">
          <div className="adm-field">
            <label htmlFor="seo-ga">Google Analytics ID</label>
            <input id="seo-ga" className="adm-input" value={draft.googleAnalyticsId} onChange={(e) => setDraft((d) => ({ ...d, googleAnalyticsId: e.target.value }))} placeholder="G-XXXXXXXXXX" />
          </div>
          <div className="adm-field">
            <label htmlFor="seo-gsc">Search Console verification</label>
            <input id="seo-gsc" className="adm-input" value={draft.googleSearchConsoleVerification} onChange={(e) => setDraft((d) => ({ ...d, googleSearchConsoleVerification: e.target.value }))} placeholder="content= value" />
          </div>
          <div className="adm-field">
            <label htmlFor="seo-pixel">Meta Pixel ID</label>
            <input id="seo-pixel" className="adm-input" value={draft.metaPixelId} onChange={(e) => setDraft((d) => ({ ...d, metaPixelId: e.target.value }))} />
          </div>
        </div>
      </section>
      <section className="adm-panel">
        <h3>Site-wide defaults</h3>
        <p className="adm-muted">Used for any page without its own SEO entry.</p>
        <div className="adm-fields">
          <div className="adm-field">
            <label htmlFor="seo-dtitle">Default title</label>
            <input id="seo-dtitle" className="adm-input" value={draft.defaultTitle} onChange={(e) => setDraft((d) => ({ ...d, defaultTitle: e.target.value }))} />
          </div>
          <div className="adm-field">
            <label htmlFor="seo-ddesc">Default description</label>
            <textarea id="seo-ddesc" className="adm-input" rows={2} value={draft.defaultDescription} onChange={(e) => setDraft((d) => ({ ...d, defaultDescription: e.target.value }))} />
          </div>
          <div className="adm-field">
            <label htmlFor="seo-dimg">Default social share image URL</label>
            <input id="seo-dimg" className="adm-input" value={draft.defaultOgImage} onChange={(e) => setDraft((d) => ({ ...d, defaultOgImage: e.target.value }))} />
          </div>
        </div>
      </section>
      {dirty && (
        <div className="adm-savebar">
          <span>Unsaved changes</span>
          <button type="button" className="adm-btn adm-btn-sm" onClick={() => update({ seo: draft }, "SEO settings saved")}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}
