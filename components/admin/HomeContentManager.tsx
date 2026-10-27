"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { useInbox } from "./InboxProvider";

const FIELDS: [string, string, "input" | "textarea"][] = [
  ["heroEyebrow", "Hero — small label above the headline", "input"],
  ["heroLine1", "Hero — first headline line", "input"],
  ["section1Heading", "Intro section — heading", "input"],
  ["section1Body", "Intro section — body", "textarea"],
  ["section2Heading", "What we cover — heading", "input"],
  ["section3Heading", "AI section — heading", "input"],
  ["section4Heading", "Case studies teaser — heading", "input"],
  ["section5Heading", "Process — heading", "input"],
  ["section5Body", "Process — body", "textarea"],
  ["section6Heading", "Stats — heading", "input"],
  ["section7Heading", "FAQ — heading", "input"],
  ["section7Body", "FAQ — body", "textarea"],
  ["section8Heading", "Blog teaser — heading", "input"],
  ["section9Heading", "CTA — heading", "input"],
  ["section9Body", "CTA — body", "textarea"],
];

export default function HomeContentManager() {
  const { toast } = useInbox();
  const [saved, setSaved] = useState<Record<string, string> | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<Record<string, string>>("/api/admin/page-content/home")
      .then((d) => {
        setSaved(d);
        setDraft(d);
      })
      .catch(() => {
        setSaved({});
        setDraft({});
      });
  }, []);

  if (!saved) return <div aria-busy="true" />;

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const save = async () => {
    setBusy(true);
    try {
      const updated = await api.put<Record<string, string>>("/api/admin/page-content/home", { blocks: draft });
      setSaved(updated);
      toast("Homepage content saved");
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Couldn't save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <header style={{ marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>Homepage content</h2>
      </header>
      <p className="adm-muted" style={{ marginBottom: 16 }}>
        The headline and section copy on the homepage. Everything else (images, layout, stats, FAQs, testimonials) is managed elsewhere.
      </p>
      <div className="adm-avail">
        <section className="adm-panel">
          {FIELDS.map(([key, label, type]) => (
            <div className="adm-field" key={key} style={{ marginBottom: 14 }}>
              <label htmlFor={`hc-${key}`}>{label}</label>
              {type === "textarea" ? (
                <textarea
                  id={`hc-${key}`}
                  className="adm-input"
                  rows={3}
                  value={draft[key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                />
              ) : (
                <input
                  id={`hc-${key}`}
                  className="adm-input"
                  value={draft[key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </section>
      </div>
      {dirty && (
        <div className="adm-savebar">
          <span>Unsaved changes</span>
          <button type="button" className="adm-btn adm-btn-sm" onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      )}
    </section>
  );
}
