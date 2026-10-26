"use client";

import { AdminContentSkeleton } from "./AdminSkeleton";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { preload } from "@/lib/admin/prefetch";
import { slugify, type CaseStudy } from "@/lib/admin/case-study-types";
import { useInbox } from "./InboxProvider";

type Ctx = {
  caseStudies: CaseStudy[];
  get: (id: string) => CaseStudy | undefined;
  /** Creates an empty draft and returns its id. */
  create: () => Promise<string>;
  save: (cs: CaseStudy, quiet?: boolean) => void;
  remove: (id: string) => void;
  uniqueSlug: (slug: string, exceptId?: string) => string;
  slugTaken: (slug: string, exceptId?: string) => boolean;
  refresh: () => void;
};

const CaseStudyCtx = createContext<Ctx | null>(null);
export const useCaseStudies = () => {
  const c = useContext(CaseStudyCtx);
  if (!c) throw new Error("useCaseStudies must be used inside CaseStudyProvider");
  return c;
};

type ApiCaseStudy = Omit<CaseStudy, "id"> & { _id: string };
const mapCaseStudy = (c: ApiCaseStudy): CaseStudy => ({
  ...c,
  id: c._id,
  seoTitle: c.seoTitle ?? "",
  seoDescription: c.seoDescription ?? "",
  cover: c.cover ?? "",
  coverAlt: c.coverAlt ?? "",
  images: c.images ?? [],
  results: c.results ?? [],
  services: c.services ?? [],
  testimonial: c.testimonial ?? { quote: "", author: "", role: "" },
});

export function preloadCaseStudies(force = false) {
  return preload("admin-case-studies", () => api.get<{ items: ApiCaseStudy[] }>("/api/admin/case-studies?pageSize=500"), force);
}

export default function CaseStudyProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[] | null>(null);

  const load = useCallback(async (force = false) => {
    const res = await preloadCaseStudies(force);
    setCaseStudies(res.items.map(mapCaseStudy));
  }, []);

  useEffect(() => {
    load().catch(() => setCaseStudies([]));
  }, [load]);

  const slugTaken = useCallback((slug: string, exceptId?: string) => !!caseStudies?.some((c) => c.slug === slug && c.id !== exceptId), [caseStudies]);
  const uniqueSlug = useCallback(
    (slug: string, exceptId?: string) => {
      const base = slugify(slug) || "case-study";
      let s = base;
      for (let i = 2; slugTaken(s, exceptId); i++) s = `${base}-${i}`;
      return s;
    },
    [slugTaken],
  );

  const ctx = useMemo<Ctx | null>(() => {
    if (!caseStudies) return null;
    const refresh = () => load(true).catch(() => toast("Couldn't refresh case studies"));
    return {
      caseStudies,
      get: (id) => caseStudies.find((c) => c.id === id),
      create: async () => {
        const created = await api.post<ApiCaseStudy>("/api/admin/case-studies", {
          title: "",
          client: "",
          industry: "",
          excerpt: "",
          status: "draft",
        });
        const cs = mapCaseStudy(created);
        setCaseStudies((s) => (s ? [cs, ...s] : s));
        return cs.id;
      },
      save: (cs, quiet) => {
        setCaseStudies((s) => (s ? (s.some((c) => c.id === cs.id) ? s.map((c) => (c.id === cs.id ? { ...cs, updatedAt: new Date().toISOString() } : c)) : [{ ...cs, updatedAt: new Date().toISOString() }, ...s]) : s));
        if (!quiet) toast(cs.status === "published" ? "Case study saved" : "Draft saved");
        api.patch(`/api/admin/case-studies/${cs.id}`, cs).catch(() => {
          toast("Couldn't save the case study");
          refresh();
        });
      },
      remove: (id) => {
        const title = caseStudies.find((c) => c.id === id)?.title || "an untitled case study";
        setCaseStudies((s) => (s ? s.filter((c) => c.id !== id) : s));
        toast("Case study deleted");
        api.delete(`/api/admin/case-studies/${id}`).catch(() => {
          toast(`Couldn't delete "${title}" — restoring`);
          refresh();
        });
      },
      uniqueSlug,
      slugTaken,
      refresh,
    };
  }, [caseStudies, toast, uniqueSlug, slugTaken, load]);

  if (!ctx) return <AdminContentSkeleton />;
  return <CaseStudyCtx.Provider value={ctx}>{children}</CaseStudyCtx.Provider>;
}
