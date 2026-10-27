"use client";

import { AdminContentSkeleton } from "./AdminSkeleton";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { preload } from "@/lib/admin/prefetch";
import { useInbox } from "./InboxProvider";

export type Testimonial = { id: string; quote: string; name: string; role: string; initials: string; photo?: string; order: number; published: boolean };

type Ctx = {
  testimonials: Testimonial[];
  create: (input: { quote: string; name: string; role: string; initials?: string; photo?: string }) => void;
  update: (id: string, patch: Partial<Pick<Testimonial, "quote" | "name" | "role" | "initials" | "photo" | "published">>) => void;
  remove: (id: string) => void;
  reorder: (ids: string[]) => void;
  refresh: () => void;
};

const TestimonialCtx = createContext<Ctx | null>(null);
export const useTestimonials = () => {
  const c = useContext(TestimonialCtx);
  if (!c) throw new Error("useTestimonials must be used inside TestimonialProvider");
  return c;
};

type ApiTestimonial = { _id: string; quote: string; name: string; role: string; initials?: string; photo?: string; order: number; published: boolean };
const mapT = (t: ApiTestimonial): Testimonial => ({ id: t._id, quote: t.quote, name: t.name, role: t.role, initials: t.initials ?? "", photo: t.photo, order: t.order, published: t.published });

export function preloadTestimonials(force = false) {
  return preload("admin-testimonials", () => api.get<ApiTestimonial[]>("/api/admin/testimonials"), force);
}

export default function TestimonialProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);

  const load = useCallback(async (force = false) => {
    const rows = await preloadTestimonials(force);
    setTestimonials(rows.map(mapT));
  }, []);

  useEffect(() => {
    load().catch(() => setTestimonials([]));
  }, [load]);

  const ctx = useMemo<Ctx | null>(() => {
    if (!testimonials) return null;
    const refresh = () => load(true).catch(() => toast("Couldn't refresh testimonials"));
    const patch = (id: string, fn: (t: Testimonial) => Testimonial) => setTestimonials((l) => (l ? l.map((t) => (t.id === id ? fn(t) : t)) : l));
    return {
      testimonials: [...testimonials].sort((a, b) => a.order - b.order),
      create: (input) => {
        api
          .post<ApiTestimonial>("/api/admin/testimonials", input)
          .then((created) => {
            setTestimonials((l) => (l ? [...l, mapT(created)] : l));
            toast("Testimonial added");
          })
          .catch(() => toast("Couldn't add that testimonial"));
      },
      update: (id, p) => {
        patch(id, (t) => ({ ...t, ...p }));
        api.patch(`/api/admin/testimonials/${id}`, p).catch(() => {
          toast("Couldn't save that change");
          refresh();
        });
      },
      remove: (id) => {
        setTestimonials((l) => (l ? l.filter((t) => t.id !== id) : l));
        toast("Testimonial deleted");
        api.delete(`/api/admin/testimonials/${id}`).catch(() => {
          toast("Couldn't delete — restoring");
          refresh();
        });
      },
      reorder: (ids) => {
        setTestimonials((l) => (l ? l.map((t) => ({ ...t, order: ids.indexOf(t.id) })) : l));
        api.patch("/api/admin/testimonials/reorder", { ids }).catch(() => {
          toast("Couldn't save the new order");
          refresh();
        });
      },
      refresh,
    };
  }, [testimonials, toast, load]);

  if (!ctx) return <AdminContentSkeleton />;
  return <TestimonialCtx.Provider value={ctx}>{children}</TestimonialCtx.Provider>;
}
