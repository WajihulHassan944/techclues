"use client";

import { useState } from "react";
import { useFooterLinks, type FooterGroup, type FooterLink } from "./FooterLinkProvider";
import { IconPlus } from "./icons";

const GROUPS: { key: FooterGroup; label: string; hint: string }[] = [
  { key: "services", label: "Services", hint: "The Services column in the footer." },
  { key: "company", label: "Company", hint: "The Company column in the footer." },
  { key: "sectors", label: "Sectors", hint: "The Sectors column in the footer." },
  { key: "legal", label: "Legal", hint: "The bottom strip, next to “Cookie settings”." },
];

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
            Link text
          </label>
          <input id={`fl-label-${link.id}`} className="adm-input" value={label} onChange={(e) => setLabel(e.target.value)} onBlur={saveLabel} placeholder="Link text" />
          <label className="sr-only" htmlFor={`fl-href-${link.id}`}>
            Link address
          </label>
          <input id={`fl-href-${link.id}`} className="adm-input" value={href} onChange={(e) => setHref(e.target.value)} onBlur={saveHref} placeholder="/page or https://…" />
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

export default function FooterLinkManager() {
  const { byGroup, reorder, create } = useFooterLinks();
  const [group, setGroup] = useState<FooterGroup>("services");
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const items = byGroup(group);
  const active = GROUPS.find((g) => g.key === group)!;

  const move = (id: string, dir: -1 | 1) => {
    const ids = items.map((l) => l.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorder(group, ids);
  };

  const submitNew = () => {
    if (!newLabel.trim() || !newHref.trim()) return;
    create(group, newLabel.trim(), newHref.trim());
    setNewLabel("");
    setNewHref("");
    setAdding(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>
      <aside className="adm-card" style={{ padding: "14px 16px" }}>
        <p className="adm-group-label">Footer column</p>
        <ul style={{ display: "grid", gap: 2 }}>
          {GROUPS.map((g) => (
            <li key={g.key}>
              <button
                type="button"
                className="adm-link"
                aria-current={group === g.key ? "page" : undefined}
                onClick={() => {
                  setGroup(g.key);
                  setAdding(false);
                }}
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <span>{g.label}</span>
                <span className="adm-muted">{byGroup(g.key).length}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h2 style={{ margin: 0 }}>{active.label}</h2>
          <button type="button" className="adm-btn adm-btn-sm" onClick={() => setAdding((o) => !o)}>
            <IconPlus /> Add link
          </button>
        </header>
        <p className="adm-muted" style={{ marginBottom: 16 }}>
          {active.hint}
        </p>
        {adding && (
          <div className="adm-card" style={{ padding: 20, marginBottom: 16, borderStyle: "dashed" }}>
            <input className="adm-input" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Link text" autoFocus />
            <input className="adm-input" style={{ marginTop: 10 }} value={newHref} onChange={(e) => setNewHref(e.target.value)} placeholder="/page or https://…" />
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
            <h3>No links yet</h3>
            <p>Add the first link for this column above.</p>
          </div>
        ) : (
          <ul className="adm-list">
            {items.map((l, i) => (
              <LinkRow key={l.id} link={l} index={i} total={items.length} onMove={(dir) => move(l.id, dir)} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
