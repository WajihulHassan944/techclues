"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { preload } from "@/lib/admin/prefetch";
import { useInbox } from "./InboxProvider";

export type Faq = { id: string; group: string; question: string; answer: string; order: number; published: boolean };

type Ctx = {
  faqs: Faq[];
  groups: string[];
  byGroup: (group: string) => Faq[];
  create: (group: string, question: string, answer: string) => void;
  update: (id: string, patch: Partial<Pick<Faq, "group" | "question" | "answer" | "published">>) => void;
  remove: (id: string) => void;
  reorder: (group: string, ids: string[]) => void;
  refresh: () => void;
};

const FaqCtx = createContext<Ctx | null>(null);
export const useFaqs = () => {
  const c = useContext(FaqCtx);
  if (!c) throw new Error("useFaqs must be used inside FaqProvider");
  return c;
};

type ApiFaq = { _id: string; group: string; question: string; answer: string; order: number; published: boolean };
const mapFaq = (f: ApiFaq): Faq => ({ id: f._id, group: f.group, question: f.question, answer: f.answer, order: f.order, published: f.published });

export function preloadFaqs(force = false) {
  return preload("admin-faqs", () => api.get<ApiFaq[]>("/api/admin/faqs"), force);
}

export default function FaqProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [faqs, setFaqs] = useState<Faq[] | null>(null);

  const load = useCallback(async (force = false) => {
    const rows = await preloadFaqs(force);
    setFaqs(rows.map(mapFaq));
  }, []);

  useEffect(() => {
    load().catch(() => setFaqs([]));
  }, [load]);

  const ctx = useMemo<Ctx | null>(() => {
    if (!faqs) return null;
    const refresh = () => load(true).catch(() => toast("Couldn't refresh FAQs"));
    const patch = (id: string, fn: (f: Faq) => Faq) => setFaqs((l) => (l ? l.map((f) => (f.id === id ? fn(f) : f)) : l));
    return {
      faqs,
      groups: [...new Set(faqs.map((f) => f.group))].sort(),
      byGroup: (group) => faqs.filter((f) => f.group === group).sort((a, b) => a.order - b.order),
      create: (group, question, answer) => {
        api
          .post<ApiFaq>("/api/admin/faqs", { group, question, answer })
          .then((created) => {
            setFaqs((l) => (l ? [...l, mapFaq(created)] : l));
            toast("Question added");
          })
          .catch(() => toast("Couldn't add the question"));
      },
      update: (id, p) => {
        patch(id, (f) => ({ ...f, ...p }));
        api.patch(`/api/admin/faqs/${id}`, p).catch(() => {
          toast("Couldn't save that change");
          refresh();
        });
      },
      remove: (id) => {
        setFaqs((l) => (l ? l.filter((f) => f.id !== id) : l));
        toast("Question deleted");
        api.delete(`/api/admin/faqs/${id}`).catch(() => {
          toast("Couldn't delete — restoring");
          refresh();
        });
      },
      reorder: (group, ids) => {
        setFaqs((l) => (l ? l.map((f) => (f.group === group ? { ...f, order: ids.indexOf(f.id) } : f)) : l));
        api.patch("/api/admin/faqs/reorder", { group, ids }).catch(() => {
          toast("Couldn't save the new order");
          refresh();
        });
      },
      refresh,
    };
  }, [faqs, toast, load]);

  if (!ctx) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return <FaqCtx.Provider value={ctx}>{children}</FaqCtx.Provider>;
}
