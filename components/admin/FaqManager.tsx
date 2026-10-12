"use client";

import { useState } from "react";
import { FAQ_GROUPS, FAQ_GROUP_SECTIONS, faqGroupLabel } from "@/lib/admin/faq-groups";
import { useFaqs, type Faq } from "./FaqProvider";
import { IconPlus } from "./icons";

function FaqRow({ faq, index, total, onMove }: { faq: Faq; index: number; total: number; onMove: (dir: -1 | 1) => void }) {
  const { update, remove } = useFaqs();
  const [q, setQ] = useState(faq.question);
  const [a, setA] = useState(faq.answer);

  const saveQ = () => {
    const v = q.trim();
    if (v && v !== faq.question) update(faq.id, { question: v });
    else setQ(faq.question);
  };
  const saveA = () => {
    const v = a.trim();
    if (v && v !== faq.answer) update(faq.id, { answer: v });
    else setA(faq.answer);
  };

  return (
    <li className="adm-card" style={{ padding: 20, opacity: faq.published ? 1 : 0.55 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input className="adm-input" value={q} onChange={(e) => setQ(e.target.value)} onBlur={saveQ} placeholder="Question" />
          <textarea className="adm-textarea" style={{ marginTop: 10 }} rows={3} value={a} onChange={(e) => setA(e.target.value)} onBlur={saveA} placeholder="Answer" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          <button type="button" className="adm-mini" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up">
            ↑
          </button>
          <button type="button" className="adm-mini" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Move down">
            ↓
          </button>
          <button type="button" className="adm-mini" aria-pressed={!faq.published} onClick={() => update(faq.id, { published: !faq.published })}>
            {faq.published ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            className="adm-mini adm-mini-danger"
            onClick={() => {
              if (confirm("Delete this question?")) remove(faq.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default function FaqManager() {
  const { byGroup, reorder, create } = useFaqs();
  const [group, setGroup] = useState(FAQ_GROUPS[0].key);
  const [adding, setAdding] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const items = byGroup(group);

  const move = (id: string, dir: -1 | 1) => {
    const ids = items.map((f) => f.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    reorder(group, ids);
  };

  const submitNew = () => {
    if (!newQ.trim() || !newA.trim()) return;
    create(group, newQ.trim(), newA.trim());
    setNewQ("");
    setNewA("");
    setAdding(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>
      <aside className="adm-card" style={{ padding: 0, maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}>
        {FAQ_GROUP_SECTIONS.map((section) => (
          <div key={section} style={{ padding: "14px 16px 6px" }}>
            <p className="adm-group-label">{section}</p>
            <ul style={{ display: "grid", gap: 2 }}>
              {FAQ_GROUPS.filter((g) => g.section === section).map((g) => (
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
          </div>
        ))}
      </aside>
      <section>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>{faqGroupLabel(group)}</h2>
          <button type="button" className="adm-btn adm-btn-sm" onClick={() => setAdding((o) => !o)}>
            <IconPlus /> Add question
          </button>
        </header>
        {adding && (
          <div className="adm-card" style={{ padding: 20, marginBottom: 16, borderStyle: "dashed" }}>
            <input className="adm-input" value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="New question" autoFocus />
            <textarea className="adm-textarea" style={{ marginTop: 10 }} rows={3} value={newA} onChange={(e) => setNewA(e.target.value)} placeholder="Answer" />
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button type="button" className="adm-btn adm-btn-sm" disabled={!newQ.trim() || !newA.trim()} onClick={submitNew}>
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
            <h3>No questions yet</h3>
            <p>Add the first question for this page above.</p>
          </div>
        ) : (
          <ul className="adm-list">
            {items.map((f, i) => (
              <FaqRow key={f.id} faq={f} index={i} total={items.length} onMove={(dir) => move(f.id, dir)} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
