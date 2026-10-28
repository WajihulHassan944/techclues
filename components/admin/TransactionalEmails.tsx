"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { useInbox } from "./InboxProvider";
import Dialog from "./Dialog";

type TemplateInfo = {
  key: string;
  label: string;
  description: string;
  tags: string[];
  defaultSubject: string;
  defaultHeading: string;
  defaultBodyText: string;
  customized: boolean;
  subject?: string;
  heading?: string;
  bodyText?: string;
};

export default function TransactionalEmails() {
  const { toast } = useInbox();
  const [items, setItems] = useState<TemplateInfo[] | null>(null);
  const [editing, setEditing] = useState<TemplateInfo | null>(null);

  const load = () => api.get<TemplateInfo[]>("/api/admin/transactional-emails").then(setItems).catch(() => setItems([]));
  useEffect(() => {
    load();
  }, []);

  if (!items) return <div aria-busy="true" />;

  const reset = (t: TemplateInfo) => {
    if (!confirm(`Reset "${t.label}" to its built-in copy?`)) return;
    api
      .delete(`/api/admin/transactional-emails/${t.key}`)
      .then(() => {
        toast(`${t.label} reset to default`);
        load();
      })
      .catch(() => toast("Couldn't reset that template"));
  };

  return (
    <div>
      <p className="adm-muted" style={{ marginBottom: 16 }}>
        These emails are sent automatically by the site. You can edit the subject, heading and main message — buttons, booking details and the unsubscribe link stay as they are.
      </p>
      <ul className="adm-list">
        {items.map((t) => (
          <li key={t.key} className="adm-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{t.label}</strong>
                <div className="adm-muted" style={{ fontSize: 13, marginTop: 2 }}>
                  {t.description}
                </div>
                <div className="adm-muted" style={{ fontSize: 12, marginTop: 4 }}>
                  {t.customized ? "Customised" : "Using the default copy"}
                </div>
              </div>
              <button type="button" className="adm-mini" onClick={() => setEditing(t)}>
                Edit
              </button>
              {t.customized && (
                <button type="button" className="adm-mini adm-mini-ghost" onClick={() => reset(t)}>
                  Reset
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <EditDialog
          template={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            load();
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function EditDialog({ template, onClose, onSaved }: { template: TemplateInfo; onClose: () => void; onSaved: () => void }) {
  const { toast } = useInbox();
  const [subject, setSubject] = useState(template.subject ?? template.defaultSubject);
  const [heading, setHeading] = useState(template.heading ?? template.defaultHeading);
  const [bodyText, setBodyText] = useState(template.bodyText ?? template.defaultBodyText);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await api.put("/api/admin/transactional-emails", { key: template.key, subject, heading, bodyText });
      toast(`${template.label} updated`);
      onSaved();
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Couldn't save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog title={`Edit — ${template.label}`} onClose={onClose}>
      <div className="adm-form">
        <p className="adm-note">
          Available placeholders: {template.tags.map((t) => `{{${t}}}`).join(", ")}
        </p>
        <div className="adm-field">
          <label htmlFor="te-subject">Subject</label>
          <input id="te-subject" className="adm-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="adm-field">
          <label htmlFor="te-heading">Heading</label>
          <input id="te-heading" className="adm-input" value={heading} onChange={(e) => setHeading(e.target.value)} />
        </div>
        <div className="adm-field">
          <label htmlFor="te-body">Message</label>
          <textarea id="te-body" className="adm-input" rows={4} value={bodyText} onChange={(e) => setBodyText(e.target.value)} />
        </div>
      </div>
      <div className="adm-dlg-foot-btns" style={{ marginTop: 16 }}>
        <button type="button" className="adm-btn adm-btn-sm" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" className="adm-mini adm-mini-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
