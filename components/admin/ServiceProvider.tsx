"use client";

import { AdminContentSkeleton } from "./AdminSkeleton";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { preload } from "@/lib/admin/prefetch";
import { useInbox } from "./InboxProvider";

export type ServiceEntry = {
  slug: string;
  order: number;
  cardTitle: string;
  cardDescription: string;
  features: string[];
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheading: string;
};

type Ctx = {
  services: ServiceEntry[];
  update: (slug: string, patch: Partial<Pick<ServiceEntry, "cardTitle" | "cardDescription" | "features" | "heroEyebrow" | "heroHeadline" | "heroSubheading">>) => void;
  reorder: (slugs: string[]) => void;
  refresh: () => void;
};

const ServiceCtx = createContext<Ctx | null>(null);
export const useServices = () => {
  const c = useContext(ServiceCtx);
  if (!c) throw new Error("useServices must be used inside ServiceProvider");
  return c;
};

export function preloadServices(force = false) {
  return preload("admin-services", () => api.get<ServiceEntry[]>("/api/admin/services"), force);
}

export default function ServiceProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [services, setServices] = useState<ServiceEntry[] | null>(null);

  const load = useCallback(async (force = false) => {
    const rows = await preloadServices(force);
    setServices(rows);
  }, []);

  useEffect(() => {
    load().catch(() => setServices([]));
  }, [load]);

  const ctx = useMemo<Ctx | null>(() => {
    if (!services) return null;
    const refresh = () => load(true).catch(() => toast("Couldn't refresh services"));
    return {
      services: [...services].sort((a, b) => a.order - b.order),
      update: (slug, patch) => {
        setServices((l) => (l ? l.map((s) => (s.slug === slug ? { ...s, ...patch } : s)) : l));
        api.patch(`/api/admin/services/${slug}`, patch).catch(() => {
          toast("Couldn't save that change");
          refresh();
        });
      },
      reorder: (slugs) => {
        setServices((l) => (l ? l.map((s) => ({ ...s, order: slugs.indexOf(s.slug) })) : l));
        api.patch("/api/admin/services/reorder", { slugs }).catch(() => {
          toast("Couldn't save the new order");
          refresh();
        });
      },
      refresh,
    };
  }, [services, toast, load]);

  if (!ctx) return <AdminContentSkeleton />;
  return <ServiceCtx.Provider value={ctx}>{children}</ServiceCtx.Provider>;
}
