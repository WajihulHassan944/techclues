"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import { getAdminEmail } from "@/lib/api/auth";
import { preload } from "@/lib/admin/prefetch";
import type { Enquiry, Folder, InboxState, StatusKey } from "@/lib/admin/inbox-types";

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
  refresh: () => void;
};

const InboxCtx = createContext<Ctx | null>(null);
export const useInbox = () => {
  const c = useContext(InboxCtx);
  if (!c) throw new Error("useInbox must be used inside InboxProvider");
  return c;
};

type ApiNote = { _id: string; at: string; body: string };
type ApiMessage = { _id: string; from: "them" | "us"; at: string; body: string };
type ApiEnquiry = Omit<Enquiry, "id" | "thread" | "notes"> & {
  _id: string;
  thread: ApiMessage[];
  notes: ApiNote[];
};

function mapEnquiry(d: ApiEnquiry): Enquiry {
  return {
    ...d,
    id: d._id,
    thread: d.thread.map((m) => ({ id: m._id, from: m.from, at: m.at, body: m.body })),
    notes: d.notes.map((n) => ({ id: n._id, at: n.at, body: n.body })),
  };
}

/** Kicked off early by AdminShell so this provider's own mount-time load() hits a warm cache. */
export function preloadInbox(force = false) {
  return preload(
    "admin-inbox",
    () =>
      Promise.all([
        api.get<{ items: ApiEnquiry[] }>("/api/admin/inbox?pageSize=500"),
        api.get<{ email: string; at: string }[]>("/api/admin/inbox/blocked"),
      ]),
    force,
  );
}

export default function InboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InboxState | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const load = useCallback(async (force = false) => {
    const [list, blocked] = await preloadInbox(force);
    setState({ enquiries: list.items.map(mapEnquiry), blocked });
  }, []);

  useEffect(() => {
    load().catch(() => setState({ enquiries: [], blocked: [] }));
  }, [load]);

  const toast = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 3200);
  }, []);

  const patch = useCallback((ids: string[], fn: (e: Enquiry) => Enquiry) => {
    const set = new Set(ids);
    setState((s) => (s ? { ...s, enquiries: s.enquiries.map((e) => (set.has(e.id) ? fn(e) : e)) } : s));
  }, []);

  const ctx = useMemo<Ctx | null>(() => {
    if (!state) return null;
    const refresh = () => {
      load(true).catch(() => toast("Couldn't refresh the inbox"));
    };
    return {
      state,
      unread: state.enquiries.filter((e) => e.folder === "inbox" && !e.read).length,
      toast,
      get: (id) => state.enquiries.find((e) => e.id === id),
      setRead: (ids, read) => {
        patch(ids, (e) => ({ ...e, read }));
        api.patch("/api/admin/inbox/read", { ids, read }).catch(() => {
          toast("Couldn't update read status");
          refresh();
        });
      },
      setStatus: (ids, status) => {
        patch(ids, (e) => ({ ...e, status, read: true }));
        toast(ids.length === 1 ? `Marked as ${status}` : `${ids.length} enquiries marked as ${status}`);
        api.patch("/api/admin/inbox/status", { ids, status }).catch(() => {
          toast("Couldn't update status");
          refresh();
        });
      },
      toggleStar: (id) => {
        patch([id], (e) => ({ ...e, starred: !e.starred }));
        api.patch(`/api/admin/inbox/${id}/star`).catch(() => {
          toast("Couldn't update star");
          refresh();
        });
      },
      moveTo: (ids, folder) => {
        patch(ids, (e) => ({ ...e, folder }));
        const where = folder === "inbox" ? "the inbox" : folder === "spam" ? "spam" : "trash";
        toast(ids.length === 1 ? `Moved to ${where}` : `${ids.length} enquiries moved to ${where}`);
        api.patch("/api/admin/inbox/move", { ids, folder }).catch(() => {
          toast("Couldn't move enquiries");
          refresh();
        });
      },
      deleteForever: (ids) => {
        const set = new Set(ids);
        setState((s) => (s ? { ...s, enquiries: s.enquiries.filter((e) => !set.has(e.id)) } : s));
        toast(ids.length === 1 ? "Deleted for good" : `${ids.length} enquiries deleted for good`);
        api.post("/api/admin/inbox/delete-forever", { ids }).catch(() => {
          toast("Couldn't delete — restoring");
          refresh();
        });
      },
      sendReply: (id, body) => {
        api
          .post(`/api/admin/inbox/${id}/reply`, { body })
          .then((updated) => {
            const u = updated as ApiEnquiry;
            patch([id], () => mapEnquiry(u));
            toast(`Reply sent from ${getAdminEmail() ?? "your account"}`);
          })
          .catch(() => toast("Couldn't send the reply — please try again"));
      },
      saveDraft: (id, draft) => {
        patch([id], (e) => ({ ...e, draft }));
        api.patch(`/api/admin/inbox/${id}/draft`, { draft }).catch(() => {});
      },
      addNote: (id, body) => {
        api
          .post(`/api/admin/inbox/${id}/notes`, { body })
          .then((updated) => patch([id], () => mapEnquiry(updated as ApiEnquiry)))
          .catch(() => toast("Couldn't save the note"));
      },
      block: (email) => {
        setState((s) => (s && !s.blocked.some((b) => b.email === email) ? { ...s, blocked: [...s.blocked, { email, at: new Date().toISOString() }] } : s));
        toast(`${email} blocked`);
        api.post("/api/admin/inbox/block", { email }).catch(() => {
          toast("Couldn't block sender");
          refresh();
        });
      },
      unblock: (email) => {
        setState((s) => (s ? { ...s, blocked: s.blocked.filter((b) => b.email !== email) } : s));
        toast(`${email} unblocked`);
        api.post("/api/admin/inbox/unblock", { email }).catch(() => {
          toast("Couldn't unblock sender");
          refresh();
        });
      },
      refresh,
    };
  }, [state, patch, toast, load]);

  if (!ctx) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return (
    <InboxCtx.Provider value={ctx}>
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
