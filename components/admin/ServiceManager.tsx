"use client";

import { useState } from "react";
import { useServices, type ServiceEntry } from "./ServiceProvider";
import Dialog from "./Dialog";
import { IconPlus } from "./icons";

export default function ServiceManager() {
  const { services, reorder } = useServices();
  const [editing, setEditing] = useState<string | null>(null);

  const move = (slug: string, dir: -1 | 1) => {
    const slugs = services.map((s) => s.slug);
    const i = slugs.indexOf(slug);
    const j = i + dir;
    if (j < 0 || j >= slugs.length) return;
    [slugs[i], slugs[j]] = [slugs[j], slugs[i]];
    reorder(slugs);
  };

  return (
    <section>
      <header style={{ marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>Services</h2>
      </header>
      <p className="adm-muted" style={{ marginBottom: 16 }}>
        The title, description and &quot;what we cover&quot; list on the /services grid, and the headline on each service&apos;s own page. There are a fixed 11 — order here controls the grid order.
      </p>
      <ul className="adm-list">
        {services.map((s, i) => (
          <li key={s.slug} className="adm-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{s.cardTitle}</strong>
                <div className="adm-muted" style={{ fontSize: 13, marginTop: 4 }}>
                  /services/{s.slug}
                </div>
                <p className="adm-muted" style={{ fontSize: 14, marginTop: 8 }}>
                  {s.cardDescription}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                <button type="button" className="adm-mini" disabled={i === 0} onClick={() => move(s.slug, -1)} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className="adm-mini" disabled={i === services.length - 1} onClick={() => move(s.slug, 1)} aria-label="Move down">
                  ↓
                </button>
                <button type="button" className="adm-mini" onClick={() => setEditing(s.slug)}>
                  Edit
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {editing && <EditDialog service={services.find((s) => s.slug === editing)!} onClose={() => setEditing(null)} />}
    </section>
  );
}

function EditDialog({ service, onClose }: { service: ServiceEntry; onClose: () => void }) {
  const { update } = useServices();
  const [cardTitle, setCardTitle] = useState(service.cardTitle);
  const [cardDescription, setCardDescription] = useState(service.cardDescription);
  const [features, setFeatures] = useState(service.features);
  const [heroEyebrow, setHeroEyebrow] = useState(service.heroEyebrow);
  const [heroHeadline, setHeroHeadline] = useState(service.heroHeadline);
  const [heroSubheading, setHeroSubheading] = useState(service.heroSubheading);

  const setFeature = (i: number, v: string) => setFeatures((f) => f.map((x, idx) => (idx === i ? v : x)));
  const removeFeature = (i: number) => setFeatures((f) => f.filter((_, idx) => idx !== i));
  const addFeature = () => setFeatures((f) => [...f, ""]);

  const save = () => {
    update(service.slug, {
      cardTitle: cardTitle.trim(),
      cardDescription: cardDescription.trim(),
      features: features.map((f) => f.trim()).filter(Boolean),
      heroEyebrow: heroEyebrow.trim(),
      heroHeadline: heroHeadline.trim(),
      heroSubheading: heroSubheading.trim(),
    });
    onClose();
  };

  return (
    <Dialog title={`Edit — /services/${service.slug}`} onClose={onClose}>
      <form
        className="adm-form"
        id="svc-edit-form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <h4 style={{ margin: "0 0 4px" }}>Services grid card</h4>
        <div className="adm-field">
          <label htmlFor="svc-card-title">Card title</label>
          <input id="svc-card-title" className="adm-input" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} required />
        </div>
        <div className="adm-field">
          <label htmlFor="svc-card-desc">Card description</label>
          <textarea id="svc-card-desc" className="adm-input" rows={2} value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} required />
        </div>
        <div className="adm-field">
          <label>&quot;What we cover&quot; list</label>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <input className="adm-input" value={f} onChange={(e) => setFeature(i, e.target.value)} aria-label={`Feature ${i + 1}`} />
              <button type="button" className="adm-mini adm-mini-danger" onClick={() => removeFeature(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="adm-mini" style={{ marginTop: 8 }} onClick={addFeature}>
            <IconPlus /> Add item
          </button>
        </div>

        <h4 style={{ margin: "16px 0 4px" }}>This service&apos;s own page</h4>
        <div className="adm-field">
          <label htmlFor="svc-eyebrow">Eyebrow (small label above the headline)</label>
          <input id="svc-eyebrow" className="adm-input" value={heroEyebrow} onChange={(e) => setHeroEyebrow(e.target.value)} />
        </div>
        <div className="adm-field">
          <label htmlFor="svc-headline">Headline (H1)</label>
          <textarea id="svc-headline" className="adm-input" rows={2} value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} required />
        </div>
        <div className="adm-field">
          <label htmlFor="svc-subheading">Subheading</label>
          <textarea id="svc-subheading" className="adm-input" rows={2} value={heroSubheading} onChange={(e) => setHeroSubheading(e.target.value)} />
        </div>
      </form>
      <div className="adm-dlg-foot-btns" style={{ marginTop: 16 }}>
        <button type="submit" form="svc-edit-form" className="adm-btn adm-btn-sm">
          Save
        </button>
        <button type="button" className="adm-mini adm-mini-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
