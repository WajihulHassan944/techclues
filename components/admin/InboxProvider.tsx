"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { logActivity } from "@/lib/admin/activity";
import { seedInbox } from "@/lib/admin/inbox-seed";
import type { Enquiry, Folder, InboxState, StatusKey } from "@/lib/admin/inbox-types";

const KEY = "techclues-admin-inbox-v1";

type Ctx = {
  state: InboxState;
  unread: number;
  toast: (msg: string) => void;
  get: (id: string) => Enquiry | undefined;
  setRead: (ids: string[], read: boolean) => void;
  setStatus: (ids: string[], status: StatusKey) => void;
  toggleStar: (id: string) => void;
  moveTo: (ids: string[], folder: Folder) => void;
  deleteForever: (ids: string[]) => void;
  sendReply: (id: string, body: string) => void;
  saveDraft: (id: string, body: string) => void;
  addNote: (id: string, body: string) => void;
  block: (email: string) => void;
  unblock: (email: string) => void;
  resetSample: () => void;
};

const InboxCtx = createContext<Ctx | null>(null);
export const useInbox = () => {
  const c = useContext(InboxCtx);
  if (!c) throw new Error("useInbox must be used inside InboxProvider");
  return c;
};

export default function InboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InboxState | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let loaded: InboxState | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw) as InboxState;
    } catch {
      loaded = null;
    }
    setState(loaded && Array.isArray(loaded.enquiries) ? loaded : seedInbox(Date.now()));
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: the panel still works for this visit */
    }
  }, [state]);

  const toast = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 3200);
  }, []);

  const patch = useCallback((ids: string[], fn: (e: Enquiry) => Enquiry) => {
    const set = new Set(ids);
    setState((s) => (s ? { ...s, enquiries: s.enquiries.map((e) => (set.has(e.id) ? fn(e) : e)) } : s));
  }, []);

  const api = useMemo<Ctx | null>(() => {
    if (!state) return null;
    const now = () => new Date().toISOString();
    return {
      state,
      unread: state.enquiries.filter((e) => e.folder === "inbox" && !e.read).length,
      toast,
      get: (id) => state.enquiries.find((e) => e.id === id),
      setRead: (ids, read) => patch(ids, (e) => ({ ...e, read })),
      setStatus: (ids, status) => {
        patch(ids, (e) => ({ ...e, status, read: true }));
        logActivity("inbox", `Marked ${ids.length === 1 ? (state.enquiries.find((x) => x.id === ids[0])?.name ?? "an enquiry") : `${ids.length} enquiries`} as ${status}`);
        toast(ids.length === 1 ? `Marked as ${status}` : `${ids.length} enquiries marked as ${status}`);
      },
      toggleStar: (id) => patch([id], (e) => ({ ...e, starred: !e.starred })),
      moveTo: (ids, folder) => {
        patch(ids, (e) => ({ ...e, folder }));
        logActivity("inbox", `Moved ${ids.length === 1 ? (state.enquiries.find((x) => x.id === ids[0])?.name ?? "an enquiry") : `${ids.length} enquiries`} to ${folder === "inbox" ? "the inbox" : folder}`);
        const where = folder === "inbox" ? "the inbox" : folder === "spam" ? "spam" : "trash";
        toast(ids.length === 1 ? `Moved to ${where}` : `${ids.length} enquiries moved to ${where}`);
      },
      deleteForever: (ids) => {
        const set = new Set(ids);
        setState((s) => (s ? { ...s, enquiries: s.enquiries.filter((e) => !set.has(e.id)) } : s));
        logActivity("inbox", `Deleted ${ids.length} ${ids.length === 1 ? "enquiry" : "enquiries"} for good`);
        toast(ids.length === 1 ? "Deleted for good" : `${ids.length} enquiries deleted for good`);
      },
      sendReply: (id, body) => {
        const to = state.enquiries.find((x) => x.id === id);
        logActivity("inbox", `Replied to ${to?.name ?? "a visitor"}${to ? ` (${to.subject})` : ""}`);
        patch([id], (e) => ({ ...e, thread: [...e.thread, { id: `t-${Date.now()}`, from: "us", at: now(), body }], status: e.status === "new" ? "replied" : e.status, read: true, draft: "" }));
        toast("Reply sent from info@techclues.co.uk");
      },
      saveDraft: (id, body) => patch([id], (e) => ({ ...e, draft: body })),
      addNote: (id, body) => patch([id], (e) => ({ ...e, notes: [...e.notes, { id: `n-${Date.now()}`, at: now(), body }] })),
      block: (email) => {
        setState((s) => (s && !s.blocked.some((b) => b.email === email) ? { ...s, blocked: [...s.blocked, { email, at: now() }] } : s));
        toast(`${email} blocked`);
        logActivity("inbox", `Blocked ${email}`);
      },
      unblock: (email) => {
        setState((s) => (s ? { ...s, blocked: s.blocked.filter((b) => b.email !== email) } : s));
        toast(`${email} unblocked`);
      },
      resetSample: () => {
        setState(seedInbox(Date.now()));
        toast("Sample enquiries restored");
      },
    };
  }, [state, patch, toast]);

  if (!api) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return (
    <InboxCtx.Provider value={api}>
      {children}
      <div className="adm-toast-wrap" aria-live="polite">
        {msg && (
          <div className="adm-toast" role="status" key={msg}>
            {msg}
          </div>
        )}
      </div>
    </InboxCtx.Provider>
  );
}
