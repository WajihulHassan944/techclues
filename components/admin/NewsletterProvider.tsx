"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { EMAIL_RE, type SubSource, type SubStatus, type Subscriber } from "@/lib/admin/newsletter";
import { useInbox } from "./InboxProvider";

type Ctx = {
  subs: Subscriber[];
  /** Adds one address. Returns an error message, or "" on success. */
  add: (email: string, name: string, source: SubSource) => string;
  /** Adds many addresses in one request; returns how many were new, already there, or invalid. */
  addMany: (emails: string[], source: SubSource) => Promise<{ added: number; existing: number; invalid: number }>;
  setStatus: (ids: string[], status: SubStatus) => void;
  remove: (ids: string[]) => void;
  deleteByEmail: (email: string) => void;
  /** Downloads subscribers as CSV, built server-side (not limited to what's loaded), honouring the given filter. */
  exportCsv: (filter?: { status?: SubStatus; source?: SubSource; search?: string }) => Promise<void>;
  refresh: () => void;
};

const NewsCtx = createContext<Ctx | null>(null);
export const useNewsletter = () => {
  const c = useContext(NewsCtx);
  if (!c) throw new Error("useNewsletter must be used inside NewsletterProvider");
  return c;
};

type ApiSubscriber = Omit<Subscriber, "id"> & { _id: string };
const mapSub = (s: ApiSubscriber): Subscriber => ({ ...s, id: s._id });

export default function NewsletterProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [subs, setSubs] = useState<Subscriber[] | null>(null);

  const load = useCallback(async () => {
    const list = await api.get<{ items: ApiSubscriber[] }>("/api/admin/newsletter?pageSize=1000");
    setSubs(list.items.map(mapSub));
  }, []);

  useEffect(() => {
    load().catch(() => setSubs([]));
  }, [load]);

  const ctx = useMemo<Ctx | null>(() => {
    if (!subs) return null;
    const has = (email: string) => subs.some((s) => s.email.toLowerCase() === email.toLowerCase());
    const refresh = () => load().catch(() => toast("Couldn't refresh subscribers"));
    return {
      subs,
      add: (email, name, source) => {
        const e = email.trim();
        if (!EMAIL_RE.test(e)) return "Check the email address.";
        if (has(e)) return "That address is already on the list.";
        setSubs((l) => (l ? [{ id: `pending-${Date.now()}`, email: e, name: name.trim() || undefined, source, at: new Date().toISOString(), status: "subscribed" }, ...l] : l));
        toast(`${e} added`);
        api
          .post("/api/admin/newsletter", { email: e, name: name.trim() || undefined, source })
          .then(() => refresh())
          .catch(() => {
            toast("Couldn't save that subscriber");
            refresh();
          });
        return "";
      },
      addMany: async (emails, source) => {
        const result = await api.post<{ added: number; existing: number; invalid: number }>("/api/admin/newsletter/add-many", { emails, source });
        if (result.added > 0) toast(`${result.added} ${result.added === 1 ? "subscriber" : "subscribers"} imported`);
        await refresh();
        return result;
      },
      setStatus: (ids, status) => {
        const set = new Set(ids);
        const t = new Date().toISOString();
        setSubs((l) => (l ? l.map((s) => (set.has(s.id) ? { ...s, status, endedAt: status === "subscribed" ? undefined : t } : s)) : l));
        const msg = status === "subscribed" ? "resubscribed" : status === "unsubscribed" ? "unsubscribed" : "marked as bounced";
        toast(ids.length === 1 ? `Subscriber ${msg}` : `${ids.length} subscribers ${msg}`);
        api.post("/api/admin/newsletter/status", { ids, status }).catch(() => {
          toast("Couldn't update subscriber status");
          refresh();
        });
      },
      remove: (ids) => {
        const set = new Set(ids);
        setSubs((l) => (l ? l.filter((s) => !set.has(s.id)) : l));
        toast(ids.length === 1 ? "Subscriber deleted" : `${ids.length} subscribers deleted`);
        api.post("/api/admin/newsletter/remove", { ids }).catch(() => {
          toast("Couldn't delete — restoring");
          refresh();
        });
      },
      deleteByEmail: (email) => {
        setSubs((l) => (l ? l.filter((s) => s.email.toLowerCase() !== email.toLowerCase()) : l));
        api.post("/api/admin/newsletter/delete-by-email", { email }).catch(() => refresh());
      },
      exportCsv: async (filter) => {
        const params = new URLSearchParams();
        if (filter?.status) params.set("status", filter.status);
        if (filter?.source) params.set("source", filter.source);
        if (filter?.search) params.set("search", filter.search);
        const qs = params.toString();
        const csv = await api.get<string>(`/api/admin/newsletter/export${qs ? `?${qs}` : ""}`);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `techclues-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
      refresh,
    };
  }, [subs, toast, load]);

  if (!ctx) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return <NewsCtx.Provider value={ctx}>{children}</NewsCtx.Provider>;
}
