"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { fmtFull, fmtWhen, initials } from "@/lib/admin/format";
import { SOURCES, STATUSES, STATUS_KEYS, type StatusKey } from "@/lib/admin/inbox-types";
import { SIGNATURE, TEMPLATES, fillTemplate, firstName } from "@/lib/admin/templates";
import { useInbox } from "./InboxProvider";
import { SourcePill, StatusBadge } from "./EnquiryList";
import { IconArrowLeft, IconArrowRight, IconBan, IconExternal, IconInbox, IconMail } from "./icons";

export default function EnquiryDetail({ id }: { id: string }) {
  const router = useRouter();
  const { state, get, setRead, setStatus, toggleStar, moveTo, deleteForever, sendReply, saveDraft, addNote, block, toast } = useInbox();
  const e = get(id);
  const [reply, setReply] = useState(e?.draft ?? "");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [now] = useState(() => Date.now());
  const loaded = useRef(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  // Opening an enquiry marks it as read.
  useEffect(() => {
    if (e && !e.read) setRead([id], true);
  }, [e, id, setRead]);

  // Keep a draft while typing.
  useEffect(() => {
    if (!e) return;
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    const t = window.setTimeout(() => {
      saveDraft(id, reply);
      setSaved(reply.trim().length > 0);
    }, 600);
    return () => window.clearTimeout(t);
  }, [reply, id, e, saveDraft]);

  const siblings = useMemo(() => {
    if (!e) return { prev: undefined, next: undefined };
    const list = state.enquiries.filter((x) => x.folder === e.folder).sort((a, b) => b.received.localeCompare(a.received));
    const i = list.findIndex((x) => x.id === id);
    return { prev: list[i - 1], next: list[i + 1] };
  }, [state.enquiries, e, id]);

  const others = useMemo(() => (e ? state.enquiries.filter((x) => x.id !== id && x.email.toLowerCase() === e.email.toLowerCase()) : []), [state.enquiries, e, id]);

  if (!e) {
    return (
      <div className="adm-empty adm-empty-page">
        <IconInbox />
        <h3>Enquiry not found</h3>
        <p>It may have been deleted for good.</p>
        <Link href="/admin/inbox" className="adm-mini">
          Back to the inbox
        </Link>
      </div>
    );
  }

  const back = e.folder === "inbox" ? "/admin/inbox" : "/admin/inbox/spam";
  const backLabel = e.folder === "inbox" ? "Inbox" : e.folder === "spam" ? "Spam" : "Trash";
  const closed = e.folder !== "inbox";
  const blocked = state.blocked.some((b) => b.email.toLowerCase() === e.email.toLowerCase());

  const send = () => {
    const body = reply.trim();
    if (!body) return;
    sendReply(id, `${body}\n\n${SIGNATURE}`);
    setReply("");
    setSaved(false);
  };

  return (
    <div className="adm-detail">
      <div className="adm-detail-bar">
        <Link href={back} className="adm-backlink">
          <IconArrowLeft /> {backLabel}
        </Link>
        <div className="adm-detail-actions">
          <Link href={siblings.prev ? `/admin/inbox/${siblings.prev.id}` : "#"} className="adm-icon-btn adm-sm" aria-label="Newer enquiry" aria-disabled={!siblings.prev} tabIndex={siblings.prev ? 0 : -1} onClick={(ev) => !siblings.prev && ev.preventDefault()}>
            <IconArrowLeft />
          </Link>
          <Link href={siblings.next ? `/admin/inbox/${siblings.next.id}` : "#"} className="adm-icon-btn adm-sm" aria-label="Older enquiry" aria-disabled={!siblings.next} tabIndex={siblings.next ? 0 : -1} onClick={(ev) => !siblings.next && ev.preventDefault()}>
            <IconArrowRight />
          </Link>
          <button type="button" className="adm-mini" onClick={() => toggleStar(id)} aria-pressed={e.starred}>
            {e.starred ? "Starred" : "Star"}
          </button>
          <button type="button" className="adm-mini" onClick={() => { setRead([id], false); router.push(back); }}>
            Mark unread
          </button>
        </div>
      </div>

      {closed && (
        <div className="adm-banner" role="status">
          <span>{e.folder === "spam" ? "This enquiry is in spam." : "This enquiry is in the trash."}</span>
          <span className="adm-banner-actions">
            <button type="button" className="adm-mini" onClick={() => moveTo([id], "inbox")}>
              {e.folder === "spam" ? "Not spam" : "Restore"}
            </button>
            <button type="button" className="adm-mini adm-mini-danger" onClick={() => { deleteForever([id]); router.push(back); }}>
              Delete forever
            </button>
          </span>
        </div>
      )}

      <div className="adm-detail-grid">
        <div className="adm-detail-main">
          <header className="adm-detail-head">
            <h2>{e.subject}</h2>
            <p>
              <SourcePill source={e.source} /> <span>Received {fmtFull(e.received)}</span>
            </p>
          </header>

          <article className="adm-msg adm-msg-them" aria-label="Original submission">
            <div className="adm-msg-head">
              <span className="adm-avatar adm-avatar-sm" aria-hidden="true">
                {initials(e.name)}
              </span>
              <div>
                <strong>{e.name}</strong>
                <small>
                  {e.email} · {fmtWhen(e.received, now)}
                </small>
              </div>
            </div>
            <p className="adm-msg-body">{e.message}</p>
            {e.details.length > 0 && (
              <dl className="adm-dl">
                {e.details.map((d) => (
                  <div key={d.label}>
                    <dt>{d.label}</dt>
                    <dd>{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {e.result && (
              <div className="adm-result">
                <small>{e.result.title}</small>
                <strong>{e.result.headline}</strong>
                {e.result.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            )}
            {e.attachments && e.attachments.length > 0 && (
              <ul className="adm-files" aria-label="Attachments">
                {e.attachments.map((f) => (
                  <li key={f.name}>
                    <span>{f.name}</span>
                    <small>{f.size}</small>
                  </li>
                ))}
              </ul>
            )}
          </article>

          {e.thread.map((m) => (
            <article key={m.id} className={`adm-msg ${m.from === "us" ? "adm-msg-us" : "adm-msg-them"}`}>
              <div className="adm-msg-head">
                <span className="adm-avatar adm-avatar-sm" aria-hidden="true">
                  {m.from === "us" ? "TC" : initials(e.name)}
                </span>
                <div>
                  <strong>{m.from === "us" ? "You" : e.name}</strong>
                  <small>
                    {m.from === "us" ? "from info@techclues.co.uk" : e.email} · {fmtWhen(m.at, now)}
                  </small>
                </div>
              </div>
              <p className="adm-msg-body">{m.body}</p>
            </article>
          ))}

          {!closed && (
            <section className="adm-compose" aria-label="Reply">
              <div className="adm-compose-head">
                <div>
                  <h3>Reply to {firstName(e)}</h3>
                  <p>
                    From <strong>info@techclues.co.uk</strong> to <strong>{e.email}</strong>
                  </p>
                </div>
                <label className="adm-select-wrap">
                  <span className="sr-only">Insert a saved reply</span>
                  <select
                    className="adm-select"
                    value=""
                    onChange={(ev) => {
                      const t = TEMPLATES.find((x) => x.id === ev.target.value);
                      if (!t) return;
                      setReply((r) => (r.trim() ? `${r}\n\n${fillTemplate(t, e)}` : fillTemplate(t, e)));
                      replyRef.current?.focus();
                    }}
                  >
                    <option value="">Insert a saved reply…</option>
                    {TEMPLATES.filter((t) => !t.sources || t.sources.includes(e.source)).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="sr-only" htmlFor="adm-reply">
                Your reply
              </label>
              <textarea id="adm-reply" ref={replyRef} className="adm-textarea" rows={9} value={reply} onChange={(ev) => setReply(ev.target.value)} placeholder={`Write your reply to ${firstName(e)}…`} />
              <pre className="adm-sig" aria-label="Signature added to your reply">{SIGNATURE}</pre>
              <div className="adm-compose-foot">
                <span className="adm-draft" aria-live="polite">
                  {saved ? "Draft saved" : ""}
                </span>
                <button type="button" className="adm-btn adm-btn-sm" disabled={!reply.trim()} onClick={send}>
                  Send reply <IconMail />
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="adm-detail-side" aria-label="Details">
          <section className="adm-panel">
            <h3>Contact</h3>
            <div className="adm-contact">
              <span className="adm-avatar" aria-hidden="true">
                {initials(e.name)}
              </span>
              <div>
                <strong>{e.name}</strong>
                {e.company && <small>{e.company}</small>}
              </div>
            </div>
            <ul className="adm-kv">
              <li>
                <span>Email</span>
                <a href={`mailto:${e.email}`}>{e.email}</a>
              </li>
              {e.phone && (
                <li>
                  <span>Phone</span>
                  <a href={`tel:${e.phone.replace(/\s/g, "")}`}>{e.phone}</a>
                </li>
              )}
              <li>
                <span>Came from</span>
                <a href={SOURCES[e.source].page} target="_blank" rel="noopener">
                  {SOURCES[e.source].page} <IconExternal className="adm-ic adm-ic-xs" />
                </a>
              </li>
            </ul>
          </section>

          <section className="adm-panel">
            <h3>Status</h3>
            <div className="adm-statusrow">
              <StatusBadge status={e.status} />
              <label className="adm-select-wrap">
                <span className="sr-only">Change status</span>
                <select className="adm-select" value={e.status} onChange={(ev) => setStatus([id], ev.target.value as StatusKey)}>
                  {STATUS_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {STATUSES[k].label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="adm-panel">
            <h3>Private notes</h3>
            {e.notes.length === 0 ? (
              <p className="adm-muted">Only you can see notes.</p>
            ) : (
              <ul className="adm-notes">
                {e.notes.map((n) => (
                  <li key={n.id}>
                    <p>{n.body}</p>
                    <small>{fmtWhen(n.at, now)}</small>
                  </li>
                ))}
              </ul>
            )}
            <label className="sr-only" htmlFor="adm-note">
              Add a note
            </label>
            <textarea id="adm-note" className="adm-textarea adm-textarea-sm" rows={3} value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="Add a note…" />
            <button
              type="button"
              className="adm-mini"
              disabled={!note.trim()}
              onClick={() => {
                addNote(id, note.trim());
                setNote("");
                toast("Note added");
              }}
            >
              Add note
            </button>
          </section>

          {others.length > 0 && (
            <section className="adm-panel">
              <h3>Also from {firstName(e)}</h3>
              <ul className="adm-others">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={`/admin/inbox/${o.id}`}>{o.subject}</Link>
                    <small>{fmtWhen(o.received, now)}</small>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="adm-panel">
            <h3>Manage</h3>
            <div className="adm-manage">
              {!closed && (
                <>
                  <button type="button" className="adm-mini" onClick={() => { moveTo([id], "spam"); router.push(back); }}>
                    <IconBan className="adm-ic adm-ic-xs" /> Mark as spam
                  </button>
                  <button type="button" className="adm-mini adm-mini-danger" onClick={() => { moveTo([id], "trash"); router.push(back); }}>
                    Move to trash
                  </button>
                </>
              )}
              <button type="button" className="adm-mini" disabled={blocked} onClick={() => block(e.email)}>
                {blocked ? "Sender blocked" : "Block this sender"}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
