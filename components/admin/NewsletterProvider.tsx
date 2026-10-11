"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { logActivity } from "@/lib/admin/activity";
import { EMAIL_RE, seedSubscribers, type SubSource, type SubStatus, type Subscriber } from "@/lib/admin/newsletter";
import { useInbox } from "./InboxProvider";

const KEY = "techclues-admin-newsletter-v1";

type Ctx = {
  subs: Subscriber[];
  /** Adds one address. Returns an error message, or "" on success. */
  add: (email: string, name: string, source: SubSource) => string;
  /** Adds many addresses; returns how many were new, already there, or invalid. */
  addMany: (emails: string[], source: SubSource) => { added: number; existing: number; invalid: number };
  setStatus: (ids: string[], status: SubStatus) => void;
  remove: (ids: string[]) => void;
  deleteByEmail: (email: string) => number;
  reset: () => void;
};

const NewsCtx = createContext<Ctx | null>(null);
export const useNewsletter = () => {
  const c = useContext(NewsCtx);
  if (!c) throw new Error("useNewsletter must be used inside NewsletterProvider");
  return c;
};

export default function NewsletterProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [subs, setSubs] = useState<Subscriber[] | null>(null);

  useEffect(() => {
    let loaded: Subscriber[] | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw) as Subscriber[];
    } catch {
      loaded = null;
    }
    setSubs(Array.isArray(loaded) ? loaded : seedSubscribers(Date.now()));
  }, []);

  useEffect(() => {
    if (!subs) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(subs));
    } catch {
      /* ignore */
    }
  }, [subs]);

  const api = useMemo<Ctx | null>(() => {
    if (!subs) return null;
    const has = (email: string) => subs.some((s) => s.email.toLowerCase() === email.toLowerCase());
    return {
      subs,
      add: (email, name, source) => {
        const e = email.trim();
        if (!EMAIL_RE.test(e)) return "Check the email address.";
        if (has(e)) return "That address is already on the list.";
        setSubs((l) => (l ? [{ id: `sub-${Date.now()}`, email: e, name: name.trim() || undefined, source, at: new Date().toISOString(), status: "subscribed" }, ...l] : l));
        toast(`${e} added`);
        logActivity("newsletter", `Added subscriber ${e}`);
        return "";
      },
      addMany: (emails, source) => {
        const seen = new Set(subs.map((s) => s.email.toLowerCase()));
        const fresh: Subscriber[] = [];
        let existing = 0;
        let invalid = 0;
        emails.forEach((raw, i) => {
          const e = raw.trim();
          if (!e) return;
          if (!EMAIL_RE.test(e)) return void invalid++;
          if (seen.has(e.toLowerCase())) return void existing++;
          seen.add(e.toLowerCase());
          fresh.push({ id: `sub-${Date.now()}-${i}`, email: e, source, at: new Date().toISOString(), status: "subscribed" });
        });
        if (fresh.length) {
          setSubs((l) => (l ? [...fresh, ...l] : l));
          toast(`${fresh.length} ${fresh.length === 1 ? "subscriber" : "subscribers"} imported`);
          logActivity("newsletter", `Imported ${fresh.length} subscribers`);
        }
        return { added: fresh.length, existing, invalid };
      },
      setStatus: (ids, status) => {
        const set = new Set(ids);
        const t = new Date().toISOString();
        setSubs((l) => (l ? l.map((s) => (set.has(s.id) ? { ...s, status, endedAt: status === "subscribed" ? undefined : t } : s)) : l));
        const msg = status === "subscribed" ? "resubscribed" : status === "unsubscribed" ? "unsubscribed" : "marked as bounced";
        toast(ids.length === 1 ? `Subscriber ${msg}` : `${ids.length} subscribers ${msg}`);
        logActivity("newsletter", `${ids.length} ${ids.length === 1 ? "subscriber" : "subscribers"} ${msg}`);
      },
      remove: (ids) => {
        const set = new Set(ids);
        setSubs((l) => (l ? l.filter((s) => !set.has(s.id)) : l));
        toast(ids.length === 1 ? "Subscriber deleted" : `${ids.length} subscribers deleted`);
        logActivity("newsletter", `Deleted ${ids.length} ${ids.length === 1 ? "subscriber" : "subscribers"}`);
      },
      deleteByEmail: (email) => {
        const n = subs.filter((s) => s.email.toLowerCase() === email.toLowerCase()).length;
        if (n) setSubs((l) => (l ? l.filter((s) => s.email.toLowerCase() !== email.toLowerCase()) : l));
        return n;
      },
      reset: () => {
        setSubs(seedSubscribers(Date.now()));
        toast("Sample subscribers restored");
      },
    };
  }, [subs, toast]);

  if (!api) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return <NewsCtx.Provider value={api}>{children}</NewsCtx.Provider>;
}
