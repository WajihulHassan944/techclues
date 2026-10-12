"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ACTIVITY_LABEL, clearActivity, logActivity, useActivity, type ActivityKind } from "@/lib/admin/activity";
import { fmtWhen } from "@/lib/admin/format";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/admin/settings-defaults";
import { SOURCES, SOURCE_KEYS, type SourceKey } from "@/lib/admin/inbox-types";
import { EMAIL_RE, downloadText } from "@/lib/admin/newsletter";
import type { Template } from "@/lib/admin/templates";
import { dateKey } from "@/lib/admin/tz";
import { changePassword, logout as apiLogout } from "@/lib/api/auth";
import { api, ApiError } from "@/lib/api/client";
import { useBookings } from "./BookingsProvider";
import Dialog from "./Dialog";
import { useInbox } from "./InboxProvider";
import { useNewsletter } from "./NewsletterProvider";
import { useSettings } from "./SettingsProvider";
import { IconPlus, IconShield } from "./icons";

type Tab = "notifications" | "templates" | "security" | "privacy" | "activity";
const TABS: [Tab, string][] = [["notifications", "Notifications"], ["templates", "Reply templates"], ["security", "Password & security"], ["privacy", "Privacy & data"], ["activity", "Activity log"]];

function Switch({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <li className="adm-switchrow">
      <label className="adm-switch">
        <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
        <span aria-hidden="true" />
        <b>{label}</b>
      </label>
      {hint && <small className="adm-muted">{hint}</small>}
    </li>
  );
}

/* ---------------- notifications ---------------- */
function Notifications() {
  const { settings, update } = useSettings();
  const { toast } = useInbox();
  const [draft, setDraft] = useState<Settings>(settings);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const dirty = JSON.stringify([draft.recipients, draft.events, draft.summaryTime, draft.fromName]) !== JSON.stringify([settings.recipients, settings.events, settings.summaryTime, settings.fromName]);
  const ev = (k: keyof Settings["events"], v: boolean) => setDraft((d) => ({ ...d, events: { ...d.events, [k]: v } }));

  const addRecipient = () => {
    const e = email.trim();
    if (!EMAIL_RE.test(e)) return setErr("Check the email address.");
    if (draft.recipients.some((r) => r.toLowerCase() === e.toLowerCase())) return setErr("That address is already on the list.");
    setDraft((d) => ({ ...d, recipients: [...d.recipients, e] }));
    setEmail("");
    setErr("");
  };

  return (
    <div className="adm-avail">
      <div className="adm-avail-grid">
        <section className="adm-panel" aria-labelledby="st-n1">
          <h3 id="st-n1">Who gets the emails</h3>
          <p className="adm-muted">These addresses are emailed when something happens on the website.</p>
          <ul className="adm-rowlist adm-rowlist-tight" aria-label="Notification recipients">
            {draft.recipients.map((r) => (
              <li key={r}>
                <strong>{r}</strong>
                <button type="button" className="adm-mini" aria-label={`Remove ${r}`} disabled={draft.recipients.length === 1} onClick={() => setDraft((d) => ({ ...d, recipients: d.recipients.filter((x) => x !== r) }))}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="adm-inlineadd">
            <label className="sr-only" htmlFor="st-rec">
              Add an email address
            </label>
            <input id="st-rec" type="email" className="adm-input adm-input-sm" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} placeholder="Add an email address" aria-invalid={!!err} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRecipient())} />
            <button type="button" className="adm-mini" onClick={addRecipient} disabled={!email.trim()}>
              <IconPlus className="adm-ic adm-ic-xs" /> Add
            </button>
          </div>
          {err && <small className="adm-err">{err}</small>}
        </section>

        <section className="adm-panel" aria-labelledby="st-n2">
          <h3 id="st-n2">What they&apos;re told about</h3>
          <ul className="adm-switchlist">
            <Switch label="A new enquiry arrives" hint="Contact, calculator, grants, partners, ZERO.ONE and careers forms." checked={draft.events.enquiry} onChange={(v) => ev("enquiry", v)} />
            <Switch label="A call is booked" checked={draft.events.booking} onChange={(v) => ev("booking", v)} />
            <Switch label="A visitor cancels or moves a call" checked={draft.events.cancelled} onChange={(v) => ev("cancelled", v)} />
            <Switch label="Someone subscribes to the newsletter" hint="Sent as one weekly email, not one per person." checked={draft.events.subscriber} onChange={(v) => ev("subscriber", v)} />
            <Switch label="A daily summary" hint="Unanswered enquiries and the day's calls." checked={draft.events.summary} onChange={(v) => ev("summary", v)} />
          </ul>
          {draft.events.summary && (
            <div className="adm-field">
              <label htmlFor="st-time">Send the summary at</label>
              <select id="st-time" className="adm-select" value={draft.summaryTime} onChange={(e) => setDraft((d) => ({ ...d, summaryTime: e.target.value }))}>
                {["06:00", "07:00", "08:00", "09:00", "12:00", "17:00"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <small className="adm-muted"> UK time</small>
            </div>
          )}
        </section>
      </div>

      <section className="adm-panel" aria-labelledby="st-n3">
        <h3 id="st-n3">Sending replies</h3>
        <div className="adm-fields">
          <div className="adm-field">
            <label htmlFor="st-from">From name</label>
            <input id="st-from" className="adm-input" value={draft.fromName} onChange={(e) => setDraft((d) => ({ ...d, fromName: e.target.value }))} />
          </div>
          <div className="adm-field">
            <label htmlFor="st-addr">From address</label>
            <input id="st-addr" className="adm-input" value={settings.recipients[0] ?? ""} readOnly aria-readonly="true" />
          </div>
        </div>
        <p className="adm-muted">Replies from the inbox are sent from this address, so people can answer you directly.</p>
        <button type="button" className="adm-mini" onClick={() => { toast(`Test email sent to ${draft.recipients.join(", ")}`); logActivity("settings", "Sent a test notification email"); }}>
          Send a test email
        </button>
      </section>

      <div className="adm-savebar" data-dirty={dirty} role="region" aria-label="Save changes">
        <span>{dirty ? "You have unsaved changes." : "All changes saved."}</span>
        <span className="adm-dlg-foot-btns">
          <button type="button" className="adm-mini" disabled={!dirty} onClick={() => setDraft(settings)}>
            Discard
          </button>
          <button type="button" className="adm-btn adm-btn-sm" disabled={!dirty || !draft.fromName.trim()} onClick={() => update({ recipients: draft.recipients, events: draft.events, summaryTime: draft.summaryTime, fromName: draft.fromName.trim() }, "Notification settings saved")}>
            Save changes
          </button>
        </span>
      </div>
    </div>
  );
}

/* ---------------- reply templates ---------------- */
function TemplateDialog({ initial, onClose, onSave }: { initial?: Template; onClose: () => void; onSave: (t: Template) => void }) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [all, setAll] = useState(!initial?.sources);
  const [sources, setSources] = useState<SourceKey[]>(initial?.sources ?? []);
  const valid = label.trim() && body.trim() && (all || sources.length > 0);
  return (
    <Dialog
      title={initial ? "Edit template" : "New template"}
      onClose={onClose}
      footer={
        <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
          <button type="button" className="adm-mini" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="adm-btn adm-btn-sm" disabled={!valid} onClick={() => onSave({ id: initial?.id ?? `tpl-${Date.now()}`, label: label.trim(), body: body.trim(), sources: all ? undefined : sources })}>
            Save template
          </button>
        </span>
      }
    >
      <div className="adm-field">
        <label htmlFor="tpl-label">Name</label>
        <input id="tpl-label" className="adm-input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Invite to a free call" autoFocus />
      </div>
      <div className="adm-field">
        <label htmlFor="tpl-body">Message</label>
        <textarea id="tpl-body" className="adm-textarea" rows={9} value={body} onChange={(e) => setBody(e.target.value)} />
        <small className="adm-muted">Write {"{first}"} where the person&apos;s first name should go. Your signature is added when you send.</small>
      </div>
      <fieldset className="adm-fieldset">
        <legend>Offer it for</legend>
        <label className="adm-check">
          <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Every enquiry
        </label>
        {!all && (
          <div className="adm-checkgrid">
            {SOURCE_KEYS.map((k) => (
              <label key={k} className="adm-check">
                <input type="checkbox" checked={sources.includes(k)} onChange={(e) => setSources((l) => (e.target.checked ? [...l, k] : l.filter((x) => x !== k)))} /> {SOURCES[k].label}
              </label>
            ))}
          </div>
        )}
      </fieldset>
    </Dialog>
  );
}

function Templates() {
  const { settings, update } = useSettings();
  const [edit, setEdit] = useState<null | Template | "new">(null);
  const [del, setDel] = useState<Template | null>(null);
  const [sig, setSig] = useState(settings.signature);
  return (
    <div className="adm-avail">
      <section className="adm-panel" aria-labelledby="st-t1">
        <div className="adm-panelhead">
          <div>
            <h3 id="st-t1">Saved replies</h3>
            <p className="adm-muted">Pick one in the reply box and edit it before sending.</p>
          </div>
          <button type="button" className="adm-btn adm-btn-sm" onClick={() => setEdit("new")}>
            <IconPlus /> New template
          </button>
        </div>
        <ul className="adm-tpls">
          {settings.templates.map((t) => (
            <li key={t.id}>
              <div>
                <strong>{t.label}</strong>
                <p>{t.body.replace(/\s+/g, " ").slice(0, 150)}…</p>
                <span className="adm-tpl-for">{t.sources ? t.sources.map((s) => SOURCES[s].label).join(", ") : "Every enquiry"}</span>
              </div>
              <span className="adm-dlg-foot-btns">
                <button type="button" className="adm-mini" aria-label={`Edit ${t.label}`} onClick={() => setEdit(t)}>
                  Edit
                </button>
                <button type="button" className="adm-mini adm-mini-danger" aria-label={`Delete ${t.label}`} onClick={() => setDel(t)}>
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
        <button type="button" className="adm-text-btn" onClick={() => update({ templates: DEFAULT_SETTINGS.templates }, "Templates restored to the defaults")}>
          Restore the default templates
        </button>
      </section>

      <section className="adm-panel" aria-labelledby="st-t2">
        <h3 id="st-t2">Email signature</h3>
        <p className="adm-muted">Added to the end of every reply you send.</p>
        <label className="sr-only" htmlFor="st-sig">
          Signature
        </label>
        <textarea id="st-sig" className="adm-textarea" rows={5} value={sig} onChange={(e) => setSig(e.target.value)} />
        <div className="adm-dlg-foot-btns">
          <button type="button" className="adm-btn adm-btn-sm" disabled={sig === settings.signature || !sig.trim()} onClick={() => update({ signature: sig.trim() }, "Signature saved")}>
            Save signature
          </button>
          <button type="button" className="adm-mini" disabled={sig === settings.signature} onClick={() => setSig(settings.signature)}>
            Discard
          </button>
        </div>
      </section>

      {edit && (
        <TemplateDialog
          initial={edit === "new" ? undefined : edit}
          onClose={() => setEdit(null)}
          onSave={(t) => {
            const exists = settings.templates.some((x) => x.id === t.id);
            update({ templates: exists ? settings.templates.map((x) => (x.id === t.id ? t : x)) : [...settings.templates, t] }, exists ? "Template saved" : "Template added");
            setEdit(null);
          }}
        />
      )}
      {del && (
        <Dialog
          title="Delete this template?"
          onClose={() => setDel(null)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setDel(null)}>
                Keep it
              </button>
              <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => { update({ templates: settings.templates.filter((x) => x.id !== del.id) }, "Template deleted"); setDel(null); }}>
                Delete template
              </button>
            </span>
          }
        >
          <p className="adm-muted">“{del.label}” will no longer appear in the reply box.</p>
        </Dialog>
      )}
    </div>
  );
}

/* ---------------- password & security ---------------- */
const strength = (p: string) => {
  let n = 0;
  if (p.length >= 12) n++;
  if (p.length >= 16) n++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) n++;
  if (/\d/.test(p)) n++;
  if (/[^A-Za-z0-9]/.test(p)) n++;
  return p.length < 12 ? Math.min(n, 1) : n;
};
const STRENGTH = ["Too short", "Weak", "Fair", "Good", "Strong", "Very strong"];

type ApiSession = { id: string; device: string; ip?: string; createdAt: string; lastUsedAt: string; current: boolean };

function Security() {
  const { settings, refresh } = useSettings();
  const { toast } = useInbox();
  const router = useRouter();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [now] = useState(() => Date.now());
  const [sessions, setSessions] = useState<ApiSession[]>([]);
  const s = strength(next);

  const loadSessions = () => {
    api.get<ApiSession[]>("/api/auth/sessions").then(setSessions).catch(() => {});
  };
  useEffect(() => {
    loadSessions();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!cur) er.cur = "Enter your current password.";
    if (next.length < 12) er.next = "Use at least 12 characters.";
    else if (next === cur) er.next = "Choose a password you haven't used here.";
    if (again !== next) er.again = "The two passwords don't match.";
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await changePassword(cur, next);
      toast("Password changed — other sessions were signed out");
      refresh();
      loadSessions();
      setCur("");
      setNext("");
      setAgain("");
    } catch (err) {
      setErrs({ cur: err instanceof ApiError ? err.message : "Couldn't change the password." });
    } finally {
      setBusy(false);
    }
  };

  const logOut = () => {
    apiLogout().finally(() => router.replace("/admin/login"));
  };

  const signOutOthers = () => {
    api
      .post("/api/auth/sessions/revoke-others")
      .then(() => {
        toast("Every other session was signed out");
        loadSessions();
      })
      .catch(() => toast("Couldn't sign out other sessions"));
  };

  const signOutOne = (id: string) => {
    api
      .delete(`/api/auth/sessions/${id}`)
      .then(() => setSessions((l) => l.filter((x) => x.id !== id)))
      .catch(() => toast("Couldn't sign out that session"));
  };

  return (
    <div className="adm-avail">
      <div className="adm-avail-grid">
        <section className="adm-panel" aria-labelledby="st-s1">
          <h3 id="st-s1">Change password</h3>
          <p className="adm-muted">{settings.passwordChangedAt ? `Last changed ${fmtWhen(settings.passwordChangedAt, now)}.` : "Use a long, unique password."}</p>
          <form className="adm-form" onSubmit={submit} noValidate>
            <div className="adm-field">
              <label htmlFor="pw-cur">Current password</label>
              <input id="pw-cur" className="adm-input" type={show ? "text" : "password"} autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} aria-invalid={!!errs.cur} />
              {errs.cur && <small className="adm-err">{errs.cur}</small>}
            </div>
            <div className="adm-field">
              <label htmlFor="pw-new">New password</label>
              <input id="pw-new" className="adm-input" type={show ? "text" : "password"} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} aria-invalid={!!errs.next} aria-describedby="pw-meter" />
              <div id="pw-meter" className="adm-meter" data-level={s} role="img" aria-label={`Password strength: ${STRENGTH[s]}`}>
                <span />
                <span />
                <span />
                <span />
                <span />
                <small>{next ? STRENGTH[s] : "At least 12 characters"}</small>
              </div>
              {errs.next && <small className="adm-err">{errs.next}</small>}
            </div>
            <div className="adm-field">
              <label htmlFor="pw-again">Confirm new password</label>
              <input id="pw-again" className="adm-input" type={show ? "text" : "password"} autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} aria-invalid={!!errs.again} />
              {errs.again && <small className="adm-err">{errs.again}</small>}
            </div>
            <label className="adm-check">
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show passwords
            </label>
            <button type="submit" className="adm-btn adm-btn-sm" disabled={busy}>
              {busy ? "Changing…" : "Change password"}
            </button>
          </form>
        </section>

        <div className="adm-stack">
          <section className="adm-panel" aria-labelledby="st-s2">
            <h3 id="st-s2">Where you&apos;re signed in</h3>
            <ul className="adm-rowlist adm-rowlist-tight" aria-label="Signed-in devices">
              {sessions.map((x) => (
                <li key={x.id}>
                  <span>
                    <strong>{x.device}</strong>
                    <small>
                      {x.current ? "Signed in now" : `Last active ${fmtWhen(x.lastUsedAt, now)}`}
                      {x.ip ? ` · ${x.ip}` : ""}
                    </small>
                  </span>
                  {x.current ? (
                    <span className="adm-substatus adm-substatus-subscribed">This device</span>
                  ) : (
                    <button type="button" className="adm-mini" onClick={() => signOutOne(x.id)}>
                      Sign out
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="adm-dlg-foot-btns" style={{ marginTop: 10 }}>
              <button type="button" className="adm-mini adm-mini-danger" onClick={signOutOthers} disabled={sessions.filter((x) => !x.current).length === 0}>
                Sign out all other sessions
              </button>
              <button type="button" className="adm-mini" onClick={logOut}>
                Log out of this device
              </button>
            </div>
          </section>
          <section className="adm-panel" aria-labelledby="st-s3">
            <h3 id="st-s3">Two-step sign-in</h3>
            <p className="adm-muted">
              <IconShield className="adm-ic adm-ic-xs" /> An authenticator-app code on top of your password. It becomes available once the panel is connected to a real sign-in.
            </p>
            <label className="adm-switch">
              <input type="checkbox" role="switch" checked={false} disabled aria-label="Two-step sign-in" readOnly />
              <span aria-hidden="true" />
              <b>Off</b>
            </label>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------------- privacy & data ---------------- */
type PrivacyRecord = { _id: string; subject?: string; topic?: string; email: string };
type PrivacyFindResult = { enquiries: PrivacyRecord[]; bookings: PrivacyRecord[]; subscriptions: PrivacyRecord[] };

function Privacy() {
  const { settings, update } = useSettings();
  const inbox = useInbox();
  const bookings = useBookings();
  const news = useNewsletter();
  const [spam, setSpam] = useState(settings.retention.spamDays);
  const [months, setMonths] = useState(settings.retention.enquiryMonths);
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<string | null>(null);
  const [result, setResult] = useState<PrivacyFindResult | null>(null);
  const [looking, setLooking] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [now] = useState(() => Date.now());
  const dirty = spam !== settings.retention.spamDays || months !== settings.retention.enquiryMonths;

  const total = result ? result.enquiries.length + result.bookings.length + result.subscriptions.length : 0;

  const lookUp = async (email: string) => {
    setLooking(true);
    setFound(email);
    try {
      const r = await api.get<PrivacyFindResult>(`/api/admin/privacy/find?email=${encodeURIComponent(email)}`);
      setResult(r);
    } catch {
      inbox.toast("Couldn't look that up — please try again");
      setFound(null);
    } finally {
      setLooking(false);
    }
  };

  const exportData = () => {
    downloadText(`data-${found!.replace(/[^a-z0-9]+/g, "-")}-${dateKey(now)}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), email: found, ...result }, null, 2), "application/json");
    inbox.toast(`Exported everything held about ${found}`);
    logActivity("settings", `Exported the data held about ${found}`);
  };
  const wipe = async () => {
    setErasing(true);
    try {
      await api.delete(`/api/admin/privacy/erase?email=${encodeURIComponent(found!)}`);
      inbox.refresh();
      bookings.refresh();
      news.refresh();
      logActivity("settings", `Deleted everything held about ${found}`);
      setConfirm(false);
      setFound(null);
      setResult(null);
      setQuery("");
    } catch {
      inbox.toast("Couldn't erase that person's data — please try again");
    } finally {
      setErasing(false);
    }
  };

  return (
    <div className="adm-avail">
      <section className="adm-panel" aria-labelledby="st-p1">
        <h3 id="st-p1">Find everything held about a person</h3>
        <p className="adm-muted">For access and deletion requests under UK GDPR. Searches enquiries, bookings and newsletter sign-ups by email address, across everyone — not just what's loaded on screen.</p>
        <form className="adm-inlineadd adm-inlineadd-lg" onSubmit={(e) => { e.preventDefault(); if (query.trim()) lookUp(query.trim()); }}>
          <label className="sr-only" htmlFor="pv-email">
            Email address to look up
          </label>
          <input id="pv-email" type="email" className="adm-input adm-input-sm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="name@example.com" />
          <button type="submit" className="adm-mini" disabled={!query.trim() || looking}>
            {looking ? "Looking up…" : "Look up"}
          </button>
        </form>
        {found !== null && !looking && result && (
          <div className="adm-found" role="region" aria-label={`Data held about ${found}`}>
            {total === 0 ? (
              <p className="adm-muted">Nothing is held about {found}.</p>
            ) : (
              <>
                <ul className="adm-foundlist">
                  <li>
                    <strong>{result.enquiries.length}</strong> {result.enquiries.length === 1 ? "enquiry" : "enquiries"}
                    {result.enquiries.length > 0 && <small>{result.enquiries.map((e) => e.subject).join(" · ")}</small>}
                  </li>
                  <li>
                    <strong>{result.bookings.length}</strong> {result.bookings.length === 1 ? "call" : "calls"}
                    {result.bookings.length > 0 && <small>{result.bookings.map((b) => b.topic).join(" · ")}</small>}
                  </li>
                  <li>
                    <strong>{result.subscriptions.length}</strong> newsletter {result.subscriptions.length === 1 ? "record" : "records"}
                  </li>
                </ul>
                <div className="adm-dlg-foot-btns">
                  <button type="button" className="adm-mini" onClick={exportData}>
                    Export their data
                  </button>
                  <button type="button" className="adm-mini adm-mini-danger" onClick={() => setConfirm(true)}>
                    Delete everything
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      <section className="adm-panel" aria-labelledby="st-p2">
        <h3 id="st-p2">How long data is kept</h3>
        <div className="adm-fields">
          <div className="adm-field">
            <label htmlFor="rt-spam">Delete spam after</label>
            <select id="rt-spam" className="adm-select adm-select-full" value={spam} onChange={(e) => setSpam(Number(e.target.value))}>
              {[7, 14, 30, 60, 90].map((n) => (
                <option key={n} value={n}>
                  {n} days
                </option>
              ))}
            </select>
          </div>
          <div className="adm-field">
            <label htmlFor="rt-enq">Delete old enquiries after</label>
            <select id="rt-enq" className="adm-select adm-select-full" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
              <option value={0}>Never (keep until I delete them)</option>
              {[12, 24, 36].map((n) => (
                <option key={n} value={n}>
                  {n} months
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="adm-muted">Your privacy policy tells people how their data is used. Keep these periods in line with it.</p>
        <button type="button" className="adm-btn adm-btn-sm" disabled={!dirty} onClick={() => update({ retention: { spamDays: spam, enquiryMonths: months } }, "Retention settings saved")}>
          Save
        </button>
      </section>

      {confirm && (
        <Dialog
          title={`Delete everything about ${found}?`}
          onClose={() => setConfirm(false)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setConfirm(false)} disabled={erasing}>
                Keep it
              </button>
              <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" onClick={wipe} disabled={erasing}>
                {erasing ? "Deleting…" : "Delete for good"}
              </button>
            </span>
          }
        >
          <p className="adm-muted">
            {result?.enquiries.length ?? 0} {result?.enquiries.length === 1 ? "enquiry" : "enquiries"}, {result?.bookings.length ?? 0} {result?.bookings.length === 1 ? "call" : "calls"} and {result?.subscriptions.length ?? 0} newsletter {result?.subscriptions.length === 1 ? "record" : "records"} will be removed completely. This can&apos;t be undone.
          </p>
        </Dialog>
      )}
    </div>
  );
}

/* ---------------- activity log ---------------- */
function ActivityLog() {
  const [log, refreshLog] = useActivity();
  const [kind, setKind] = useState<"" | ActivityKind>("");
  const [confirm, setConfirm] = useState(false);
  const [now] = useState(() => Date.now());
  const rows = log.filter((a) => !kind || a.kind === kind);
  const kinds = Object.keys(ACTIVITY_LABEL) as ActivityKind[];
  return (
    <section className="adm-panel" aria-labelledby="st-a1">
      <div className="adm-panelhead">
        <div>
          <h3 id="st-a1">Activity log</h3>
          <p className="adm-muted">What has been done in the panel, newest first.</p>
        </div>
        <span className="adm-dlg-foot-btns">
          <button type="button" className="adm-mini" disabled={rows.length === 0} onClick={() => downloadText(`techclues-activity-${dateKey(Date.now())}.csv`, ["When,Area,What", ...rows.map((r) => [r.at, ACTIVITY_LABEL[r.kind], `"${r.text.replace(/"/g, '""')}"`].join(","))].join("\r\n") + "\r\n")}>
            Export CSV
          </button>
          <button type="button" className="adm-mini adm-mini-danger" disabled={log.length === 0} onClick={() => setConfirm(true)}>
            Clear log
          </button>
        </span>
      </div>
      <div className="adm-chips" role="group" aria-label="Filter by area">
        <button type="button" className="adm-chipbtn" aria-pressed={kind === ""} onClick={() => setKind("")}>
          Everything
        </button>
        {kinds.map((k) => (
          <button key={k} type="button" className="adm-chipbtn" aria-pressed={kind === k} onClick={() => setKind(kind === k ? "" : k)}>
            {ACTIVITY_LABEL[k]}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="adm-muted adm-empty-line">{log.length === 0 ? "Nothing logged yet." : "Nothing logged for that area."}</p>
      ) : (
        <ol className="adm-activity" aria-label="Activity">
          {rows.map((a) => (
            <li key={a.id}>
              <span className={`adm-actdot adm-actdot-${a.kind}`} aria-hidden="true" />
              <span>
                <strong>{a.text}</strong>
                <small>
                  {ACTIVITY_LABEL[a.kind]} · {fmtWhen(a.at, now)}
                </small>
              </span>
            </li>
          ))}
        </ol>
      )}
      {confirm && (
        <Dialog
          title="Clear the activity log?"
          onClose={() => setConfirm(false)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setConfirm(false)}>
                Keep it
              </button>
              <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => { clearActivity().then(refreshLog); setConfirm(false); }}>
                Clear log
              </button>
            </span>
          }
        >
          <p className="adm-muted">The record of what has been done in the panel will be removed.</p>
        </Dialog>
      )}
    </section>
  );
}

export default function SettingsView() {
  const [tab, setTab] = useState<Tab>("notifications");
  return (
    <div className="adm-stack">
      <div className="adm-tabs" role="tablist" aria-label="Settings sections">
        {TABS.map(([k, label]) => (
          <button key={k} type="button" role="tab" className="adm-tab" aria-selected={tab === k} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>
      {tab === "notifications" && <Notifications />}
      {tab === "templates" && <Templates />}
      {tab === "security" && <Security />}
      {tab === "privacy" && <Privacy />}
      {tab === "activity" && <ActivityLog />}
    </div>
  );
}
