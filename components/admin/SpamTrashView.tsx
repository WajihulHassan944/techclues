"use client";

import { useState } from "react";
import { fmtWhen } from "@/lib/admin/format";
import EnquiryList from "./EnquiryList";
import { useInbox } from "./InboxProvider";

export default function SpamTrashView() {
  const { state, deleteForever, unblock } = useInbox();
  const [folder, setFolder] = useState<"spam" | "trash">("spam");
  const [confirm, setConfirm] = useState(false);
  const [now] = useState(() => Date.now());
  const count = (f: string) => state.enquiries.filter((e) => e.folder === f).length;
  const inFolder = state.enquiries.filter((e) => e.folder === folder);

  return (
    <div className="adm-stack">
      <div className="adm-seg" role="tablist" aria-label="Spam or trash">
        {(["spam", "trash"] as const).map((f) => (
          <button key={f} type="button" role="tab" aria-selected={folder === f} className="adm-seg-btn" onClick={() => { setFolder(f); setConfirm(false); }}>
            {f === "spam" ? "Spam" : "Trash"}
            <span className="adm-tab-n">{count(f)}</span>
          </button>
        ))}
        <span className="adm-seg-note">{folder === "trash" ? "Items in the trash are deleted for good after 30 days." : "Spam is cleared automatically after 30 days."}</span>
        {inFolder.length > 0 &&
          (confirm ? (
            <span className="adm-seg-confirm" role="alert">
              Delete {inFolder.length} for good?
              <button type="button" className="adm-mini adm-mini-danger" onClick={() => { deleteForever(inFolder.map((e) => e.id)); setConfirm(false); }}>
                Yes, delete
              </button>
              <button type="button" className="adm-mini adm-mini-ghost" onClick={() => setConfirm(false)}>
                Cancel
              </button>
            </span>
          ) : (
            <button type="button" className="adm-mini adm-mini-danger adm-seg-empty" onClick={() => setConfirm(true)}>
              Empty {folder}
            </button>
          ))}
      </div>

      <EnquiryList key={folder} folder={folder} />

      <section className="adm-panel adm-blocked" aria-label="Blocked senders">
        <div className="adm-blocked-head">
          <div>
            <h3>Blocked senders</h3>
            <p className="adm-muted">New submissions from these addresses go straight to spam.</p>
          </div>
        </div>
        {state.blocked.length === 0 ? (
          <p className="adm-muted">No one is blocked.</p>
        ) : (
          <ul className="adm-blocked-list">
            {state.blocked.map((b) => (
              <li key={b.email}>
                <span>
                  <strong>{b.email}</strong>
                  <small>Blocked {fmtWhen(b.at, now)}</small>
                </span>
                <button type="button" className="adm-mini" onClick={() => unblock(b.email)}>
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
