"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { useInbox } from "./InboxProvider";
import Dialog from "./Dialog";
import RichEditor from "./RichEditor";
import { IconPlus } from "./icons";

type Template = { _id: string; name: string; subject: string; bodyHtml: string; lastSentAt?: string; lastSentCount: number };

export default function EmailBuilder() {
  const { toast } = useInbox();
  const [items, setItems] = useState<Template[] | null>(null);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [editing, setEditing] = useState<Template | "new" | null>(null);
  const [sending, setSending] = useState<string | null>(null);

  const load = () => api.get<Template[]>("/api/admin/email-templates").then(setItems).catch(() => setItems([]));
  useEffect(() => {
    load();
    api.get<number>("/api/admin/email-templates/recipient-count").then(setRecipientCount).catch(() => {});
  }, []);

  if (!items) return <div aria-busy="true" />;

  const remove = (id: string) => {
    if (!confirm("Delete this email template?")) return;
    api
      .delete(`/api/admin/email-templates/${id}`)
      .then(() => setItems((l) => (l ? l.filter((t) => t._id !== id) : l)))
      .catch(() => toast("Couldn't delete that template"));
  };

  const send = async (t: Template) => {
    if (!confirm(`Send "${t.name}" to all ${recipientCount ?? "subscribed"} newsletter subscribers now? This can't be undone.`)) return;
    setSending(t._id);
    try {
      const res = await api.post<{ sent: number; failed: number; total: number }>(`/api/admin/email-templates/${t._id}/send`);
      toast(`Sent to ${res.sent} of ${res.total} subscriber${res.total === 1 ? "" : "s"}${res.failed ? ` (${res.failed} failed)` : ""}`);
      load();
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Couldn't send that campaign");
    } finally {
      setSending(null);
    }
  };

  return (
    <section>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h2 style={{ margin: 0 }}>Email templates</h2>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => setEditing("new")}>
          <IconPlus /> New template
        </button>
      </header>
      <p className="adm-muted" style={{ marginBottom: 16 }}>
        Compose a one-off email and send it to {recipientCount ?? "…"} subscribed newsletter address{recipientCount === 1 ? "" : "es"}. Transactional emails (booking confirmations, etc.) aren&apos;t managed here.
      </p>

      {items.length === 0 ? (
        <div className="adm-empty adm-empty-tight adm-empty-page">
          <h3>No email templates yet</h3>
          <p>Create one above.</p>
        </div>
      ) : (
        <ul className="adm-list">
          {items.map((t) => (
            <li key={t._id} className="adm-card" style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{t.name}</strong>
                  <div className="adm-muted" style={{ fontSize: 13, marginTop: 2 }}>
                    {t.subject}
                    {t.lastSentAt ? ` · last sent to ${t.lastSentCount} on ${new Date(t.lastSentAt).toLocaleDateString()}` : " · never sent"}
                  </div>
                </div>
                <button type="button" className="adm-mini" onClick={() => setEditing(t)}>
                  Edit
                </button>
                <button type="button" className="adm-mini" onClick={() => send(t)} disabled={sending === t._id}>
                  {sending === t._id ? "Sending…" : "Send"}
                </button>
                <button type="button" className="adm-mini adm-mini-danger" onClick={() => remove(t._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <TemplateDialog
          template={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            load();
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

function TemplateDialog({ template, onClose, onSaved }: { template?: Template; onClose: () => void; onSaved: () => void }) {
  const { toast } = useInbox();
  const [name, setName] = useState(template?.name ?? "");
  const [subject, setSubject] = useState(template?.subject ?? "");
  const [bodyHtml, setBodyHtml] = useState(template?.bodyHtml ?? "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      if (template) await api.patch(`/api/admin/email-templates/${template._id}`, { name, subject, bodyHtml });
      else await api.post("/api/admin/email-templates", { name, subject, bodyHtml });
      toast(template ? "Template updated" : "Template created");
      onSaved();
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Couldn't save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog title={template ? "Edit email template" : "New email template"} onClose={onClose}>
      <div className="adm-form">
        <div className="adm-field">
          <label htmlFor="et-name">Template name (internal only)</label>
          <input id="et-name" className="adm-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. November product update" />
        </div>
        <div className="adm-field">
          <label htmlFor="et-subject">Subject line</label>
          <input id="et-subject" className="adm-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="adm-field">
          <label>Email body</label>
          <RichEditor initial={bodyHtml} onChange={setBodyHtml} placeholder="Write the email…" />
        </div>
      </div>
      <div className="adm-dlg-foot-btns" style={{ marginTop: 16 }}>
        <button type="button" className="adm-btn adm-btn-sm" onClick={save} disabled={busy || !name.trim() || !subject.trim()}>
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" className="adm-mini adm-mini-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
