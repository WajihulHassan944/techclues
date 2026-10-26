"use client";

import { AdminContentSkeleton } from "./AdminSkeleton";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { preload } from "@/lib/admin/prefetch";
import { useInbox } from "./InboxProvider";

export type FooterGroup = "services" | "company" | "sectors" | "legal";
export type FooterLink = { id: string; group: FooterGroup; label: string; href: string; order: number; newTab: boolean; published: boolean };

type Ctx = {
  links: FooterLink[];
  byGroup: (group: FooterGroup) => FooterLink[];
  create: (group: FooterGroup, label: string, href: string) => void;
  update: (id: string, patch: Partial<Pick<FooterLink, "label" | "href" | "newTab" | "published">>) => void;
  remove: (id: string) => void;
  reorder: (group: FooterGroup, ids: string[]) => void;
  refresh: () => void;
};

const FooterLinkCtx = createContext<Ctx | null>(null);
export const useFooterLinks = () => {
  const c = useContext(FooterLinkCtx);
  if (!c) throw new Error("useFooterLinks must be used inside FooterLinkProvider");
  return c;
};

type ApiLink = { _id: string; group: FooterGroup; label: string; href: string; order: number; newTab: boolean; published: boolean };
const mapLink = (l: ApiLink): FooterLink => ({ id: l._id, group: l.group, label: l.label, href: l.href, order: l.order, newTab: l.newTab, published: l.published });

export function preloadFooterLinks(force = false) {
  return preload("admin-footer-links", () => api.get<ApiLink[]>("/api/admin/footer-links"), force);
}

export default function FooterLinkProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [links, setLinks] = useState<FooterLink[] | null>(null);

  const load = useCallback(async (force = false) => {
    const rows = await preloadFooterLinks(force);
    setLinks(rows.map(mapLink));
  }, []);

  useEffect(() => {
    load().catch(() => setLinks([]));
  }, [load]);

  const ctx = useMemo<Ctx | null>(() => {
    if (!links) return null;
    const refresh = () => load(true).catch(() => toast("Couldn't refresh footer links"));
    const patch = (id: string, fn: (l: FooterLink) => FooterLink) => setLinks((l) => (l ? l.map((x) => (x.id === id ? fn(x) : x)) : l));
    return {
      links,
      byGroup: (group) => links.filter((l) => l.group === group).sort((a, b) => a.order - b.order),
      create: (group, label, href) => {
        api
          .post<ApiLink>("/api/admin/footer-links", { group, label, href })
          .then((created) => {
            setLinks((l) => (l ? [...l, mapLink(created)] : l));
            toast("Link added");
          })
          .catch(() => toast("Couldn't add that link"));
      },
      update: (id, p) => {
        patch(id, (l) => ({ ...l, ...p }));
        api.patch(`/api/admin/footer-links/${id}`, p).catch(() => {
          toast("Couldn't save that change");
          refresh();
        });
      },
      remove: (id) => {
        setLinks((l) => (l ? l.filter((x) => x.id !== id) : l));
        toast("Link deleted");
        api.delete(`/api/admin/footer-links/${id}`).catch(() => {
          toast("Couldn't delete — restoring");
          refresh();
        });
      },
      reorder: (group, ids) => {
        setLinks((l) => (l ? l.map((x) => (x.group === group ? { ...x, order: ids.indexOf(x.id) } : x)) : l));
        api.patch("/api/admin/footer-links/reorder", { group, ids }).catch(() => {
          toast("Couldn't save the new order");
          refresh();
        });
      },
      refresh,
    };
  }, [links, toast, load]);

  if (!ctx) return <AdminContentSkeleton />;
  return <FooterLinkCtx.Provider value={ctx}>{children}</FooterLinkCtx.Provider>;
}
