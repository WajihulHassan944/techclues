"use client";

import { useState } from "react";
import { useTestimonials, type Testimonial } from "./TestimonialProvider";
import { IconPlus } from "./icons";

function Row({ t, index, total, onMove }: { t: Testimonial; index: number; total: number; onMove: (dir: -1 | 1) => void }) {
  const { update, remove } = useTestimonials();
  const [quote, setQuote] = useState(t.quote);
  const [name, setName] = useState(t.name);
  const [role, setRole] = useState(t.role);

  const saveQuote = () => {
    const v = quote.trim();
    if (v && v !== t.quote) update(t.id, { quote: v });
    else setQuote(t.quote);
  };
  const saveName = () => {
    const v = name.trim();
    if (v && v !== t.name) update(t.id, { name: v });
    else setName(t.name);
  };
  const saveRole = () => {
    const v = role.trim();
    if (v && v !== t.role) update(t.id, { role: v });
    else setRole(t.role);
  };

  return (
    <li className="adm-card" style={{ padding: 20, opacity: t.published ? 1 : 0.55 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 10 }}>
          <label className="sr-only" htmlFor={`t-quote-${t.id}`}>
            Quote
          </label>
          <textarea id={`t-quote-${t.id}`} className="adm-input" rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} onBlur={saveQuote} placeholder="What the client said…" />
          <div style={{ display: "flex", gap: 10 }}>
            <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} onBlur={saveName} placeholder="Name" />
            <input className="adm-input" value={role} onChange={(e) => setRole(e.target.value)} onBlur={saveRole} placeholder="Role, company" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          <button type="button" className="adm-mini" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up">
            ↑
          </button>
          <button type="button" className="adm-mini" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Move down">
            ↓
          </button>
          <button type="button" className="adm-mini" aria-pressed={!t.published} onClick={() => update(t.id, { published: !t.published })}>
            {t.published ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            className="adm-mini adm-mini-danger"
            onClick={() => {
              if (confirm("Delete this testimonial?")) remove(t.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default function TestimonialManager() {
  const { testimonials, reorder, create } = useTestimonials();
  const [adding, setAdding] = useState(false);
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const move = (id: string, dir: -1 | 1) => {
    const ids = testimonials.map((t) => t.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorder(ids);
  };

  const submitNew = () => {
    if (!quote.trim() || !name.trim() || !role.trim()) return;
    create({ quote: quote.trim(), name: name.trim(), role: role.trim() });
    setQuote("");
    setName("");
    setRole("");
    setAdding(false);
  };

  return (
    <section>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>Testimonials</h2>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => setAdding((o) => !o)}>
          <IconPlus /> Add testimonial
        </button>
      </header>
      <p className="adm-muted" style={{ marginBottom: 16 }}>
        Shown in the homepage review rotator, in this order. Hidden ones stay saved but don&apos;t appear on the site.
      </p>
      {adding && (
        <div className="adm-card" style={{ padding: 20, marginBottom: 16, borderStyle: "dashed" }}>
          <textarea className="adm-input" rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="What the client said…" autoFocus />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input className="adm-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role, company" />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button type="button" className="adm-btn adm-btn-sm" disabled={!quote.trim() || !name.trim() || !role.trim()} onClick={submitNew}>
              Add
            </button>
            <button type="button" className="adm-mini adm-mini-ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {testimonials.length === 0 ? (
        <div className="adm-empty adm-empty-tight adm-empty-page">
          <h3>No testimonials yet</h3>
          <p>Add the first one above.</p>
        </div>
      ) : (
        <ul className="adm-list">
          {testimonials.map((t, i) => (
            <Row key={t.id} t={t} index={i} total={testimonials.length} onMove={(dir) => move(t.id, dir)} />
          ))}
        </ul>
      )}
    </section>
  );
}
