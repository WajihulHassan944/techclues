"use client";

import { useState } from "react";
import { useFooterLinks, type FooterLink } from "./FooterLinkProvider";
import { IconPlus } from "./icons";

const GROUP = "social" as const;

function LinkRow({ link, index, total, onMove }: { link: FooterLink; index: number; total: number; onMove: (dir: -1 | 1) => void }) {
  const { update, remove } = useFooterLinks();
  const [label, setLabel] = useState(link.label);
  const [href, setHref] = useState(link.href);

  const saveLabel = () => {
    const v = label.trim();
    if (v && v !== link.label) update(link.id, { label: v });
    else setLabel(link.label);
  };
  const saveHref = () => {
    const v = href.trim();
    if (v && v !== link.href) update(link.id, { href: v });
    else setHref(link.href);
  };

  return (
    <li className="adm-card" style={{ padding: 20, opacity: link.published ? 1 : 0.55 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 10 }}>
          <label className="sr-only" htmlFor={`fl-label-${link.id}`}>
            Platform name
          </label>
          <input id={`fl-label-${link.id}`} className="adm-input" value={label} onChange={(e) => setLabel(e.target.value)} onBlur={saveLabel} placeholder="e.g. LinkedIn" />
          <label className="sr-only" htmlFor={`fl-href-${link.id}`}>
            Link address
          </label>
          <input id={`fl-href-${link.id}`} className="adm-input" value={href} onChange={(e) => setHref(e.target.value)} onBlur={saveHref} placeholder="https://…" />
          <label className="adm-check">
            <input type="checkbox" checked={link.newTab} onChange={(e) => update(link.id, { newTab: e.target.checked })} /> Open in a new tab
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          <button type="button" className="adm-mini" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up">
            ↑
          </button>
          <button type="button" className="adm-mini" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Move down">
            ↓
          </button>
          <button type="button" className="adm-mini" aria-pressed={!link.published} onClick={() => update(link.id, { published: !link.published })}>
            {link.published ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            className="adm-mini adm-mini-danger"
            onClick={() => {
              if (confirm("Delete this link?")) remove(link.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

/** Edits the footer's "Follow" social icons only — the Services/Company/Sectors/Legal columns
 *  stay as fixed site navigation, not admin-managed. */
export default function FooterLinkManager() {
  const { byGroup, reorder, create } = useFooterLinks();
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const items = byGroup(GROUP);

  const move = (id: string, dir: -1 | 1) => {
    const ids = items.map((l) => l.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorder(GROUP, ids);
  };

  const submitNew = () => {
    if (!newLabel.trim() || !newHref.trim()) return;
    create(GROUP, newLabel.trim(), newHref.trim());
    setNewLabel("");
    setNewHref("");
    setAdding(false);
  };

  return (
    <section>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>Social links</h2>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => setAdding((o) => !o)}>
          <IconPlus /> Add link
        </button>
      </header>
      <p className="adm-muted" style={{ marginBottom: 16 }}>
        The “Follow” icons in the footer. Use a platform name as the link text (LinkedIn, Instagram, Facebook, Google, Twitter/X, YouTube, TikTok) to get the matching icon — anything else shows a generic link icon.
      </p>
      {adding && (
        <div className="adm-card" style={{ padding: 20, marginBottom: 16, borderStyle: "dashed" }}>
          <input className="adm-input" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. LinkedIn" autoFocus />
          <input className="adm-input" style={{ marginTop: 10 }} value={newHref} onChange={(e) => setNewHref(e.target.value)} placeholder="https://…" />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button type="button" className="adm-btn adm-btn-sm" disabled={!newLabel.trim() || !newHref.trim()} onClick={submitNew}>
              Add
            </button>
            <button type="button" className="adm-mini adm-mini-ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {items.length === 0 ? (
        <div className="adm-empty adm-empty-tight adm-empty-page">
          <h3>No social links yet</h3>
          <p>Add the first one above.</p>
        </div>
      ) : (
        <ul className="adm-list">
          {items.map((l, i) => (
            <LinkRow key={l.id} link={l} index={i} total={items.length} onMove={(dir) => move(l.id, dir)} />
          ))}
        </ul>
      )}
    </section>
  );
}
