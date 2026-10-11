"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import { slugify, type Author, type Category, type Post } from "@/lib/admin/blog-types";
import { useInbox } from "./InboxProvider";

type State = { posts: Post[]; categories: Category[]; authors: Author[] };

type Ctx = {
  posts: Post[];
  categories: Category[];
  authors: Author[];
  get: (id: string) => Post | undefined;
  /** Creates an empty draft and returns its id. */
  create: () => Promise<string>;
  /** Saves a post. `quiet` skips the toast (used by autosave). */
  save: (post: Post, quiet?: boolean) => void;
  duplicate: (id: string) => Promise<string | undefined>;
  remove: (id: string) => void;
  uniqueSlug: (slug: string, exceptId?: string) => string;
  slugTaken: (slug: string, exceptId?: string) => boolean;
  addCategory: (name: string) => Category | undefined;
  renameCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;
  addAuthor: (name: string, role: string) => Author | undefined;
  updateAuthor: (id: string, name: string, role: string) => void;
  removeAuthor: (id: string) => void;
  refresh: () => void;
};

const BlogCtx = createContext<Ctx | null>(null);
export const useBlog = () => {
  const c = useContext(BlogCtx);
  if (!c) throw new Error("useBlog must be used inside BlogProvider");
  return c;
};

type ApiPost = Omit<Post, "id"> & { _id: string };
type ApiCategory = { _id: string; name: string };
type ApiAuthor = { _id: string; name: string; role: string };

const mapPost = (p: ApiPost): Post => ({ ...p, id: p._id, seoTitle: p.seoTitle ?? "", seoDescription: p.seoDescription ?? "", cover: p.cover ?? "", coverAlt: p.coverAlt ?? "" });
const mapCategory = (c: ApiCategory): Category => ({ id: c._id, name: c.name });
const mapAuthor = (a: ApiAuthor): Author => ({ id: a._id, name: a.name, role: a.role });

export default function BlogProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [state, setState] = useState<State | null>(null);

  const load = useCallback(async () => {
    const [posts, categories, authors] = await Promise.all([
      api.get<{ items: ApiPost[] }>("/api/admin/blog/posts?pageSize=500"),
      api.get<ApiCategory[]>("/api/admin/blog/categories"),
      api.get<ApiAuthor[]>("/api/admin/blog/authors"),
    ]);
    setState({ posts: posts.items.map(mapPost), categories: categories.map(mapCategory), authors: authors.map(mapAuthor) });
  }, []);

  useEffect(() => {
    load().catch(() => setState({ posts: [], categories: [], authors: [] }));
  }, [load]);

  const slugTaken = useCallback((slug: string, exceptId?: string) => !!state?.posts.some((p) => p.slug === slug && p.id !== exceptId), [state]);
  const uniqueSlug = useCallback(
    (slug: string, exceptId?: string) => {
      const base = slugify(slug) || "untitled-post";
      let s = base;
      for (let i = 2; slugTaken(s, exceptId); i++) s = `${base}-${i}`;
      return s;
    },
    [slugTaken],
  );

  const ctx = useMemo<Ctx | null>(() => {
    if (!state) return null;
    const refresh = () => load().catch(() => toast("Couldn't refresh the blog"));
    return {
      posts: state.posts,
      categories: state.categories,
      authors: state.authors,
      get: (id) => state.posts.find((p) => p.id === id),
      create: async () => {
        const created = await api.post<ApiPost>("/api/admin/blog/posts", {
          title: "",
          excerpt: "",
          category: state.categories[0]?.name ?? "",
          authorId: state.authors[0]?.id ?? "",
          body: "",
          status: "draft",
        });
        const post = mapPost(created);
        setState((s) => (s ? { ...s, posts: [post, ...s.posts] } : s));
        return post.id;
      },
      save: (post, quiet) => {
        setState((s) => (s ? { ...s, posts: s.posts.some((p) => p.id === post.id) ? s.posts.map((p) => (p.id === post.id ? { ...post, updatedAt: new Date().toISOString() } : p)) : [{ ...post, updatedAt: new Date().toISOString() }, ...s.posts] } : s));
        if (!quiet) toast(post.status === "published" ? "Post saved" : post.status === "scheduled" ? "Schedule saved" : "Draft saved");
        api.patch(`/api/admin/blog/posts/${post.id}`, post).catch(() => {
          toast("Couldn't save the post");
          refresh();
        });
      },
      duplicate: async (id) => {
        const src = state.posts.find((p) => p.id === id);
        if (!src) return undefined;
        try {
          const copy = mapPost(await api.post<ApiPost>(`/api/admin/blog/posts/${id}/duplicate`));
          setState((s) => (s ? { ...s, posts: [copy, ...s.posts] } : s));
          toast("Duplicated as a draft");
          return copy.id;
        } catch {
          toast("Couldn't duplicate the post");
          return undefined;
        }
      },
      remove: (id) => {
        const title = state.posts.find((p) => p.id === id)?.title || "an untitled post";
        setState((s) => (s ? { ...s, posts: s.posts.filter((p) => p.id !== id) } : s));
        toast("Post deleted");
        api.delete(`/api/admin/blog/posts/${id}`).catch(() => {
          toast(`Couldn't delete "${title}" — restoring`);
          refresh();
        });
      },
      uniqueSlug,
      slugTaken,
      addCategory: (name) => {
        const n = name.trim().replace(/\s+/g, " ");
        if (!n || state.categories.some((c) => c.name.toLowerCase() === n.toLowerCase())) return undefined;
        const optimistic: Category = { id: `pending-${Date.now()}`, name: n };
        setState((s) => (s ? { ...s, categories: [...s.categories, optimistic] } : s));
        toast(`Category "${n}" added`);
        api
          .post("/api/admin/blog/categories", { name: n })
          .then(() => refresh())
          .catch(() => {
            toast("Couldn't save the category");
            refresh();
          });
        return optimistic;
      },
      renameCategory: (id, name) => {
        const n = name.trim().replace(/\s+/g, " ");
        const old = state.categories.find((c) => c.id === id);
        if (!n || !old || state.categories.some((c) => c.id !== id && c.name.toLowerCase() === n.toLowerCase())) return;
        setState((s) => (s ? { ...s, categories: s.categories.map((c) => (c.id === id ? { ...c, name: n } : c)), posts: s.posts.map((p) => (p.category === old.name ? { ...p, category: n } : p)) } : s));
        toast("Category renamed");
        api.patch(`/api/admin/blog/categories/${id}`, { name: n }).catch(() => {
          toast("Couldn't rename the category");
          refresh();
        });
      },
      removeCategory: (id) => {
        setState((s) => (s ? { ...s, categories: s.categories.filter((c) => c.id !== id) } : s));
        toast("Category deleted");
        api.delete(`/api/admin/blog/categories/${id}`).catch(() => refresh());
      },
      addAuthor: (name, role) => {
        const n = name.trim().replace(/\s+/g, " ");
        if (!n) return undefined;
        const optimistic: Author = { id: `pending-${Date.now()}`, name: n, role: role.trim() };
        setState((s) => (s ? { ...s, authors: [...s.authors, optimistic] } : s));
        toast(`Author "${n}" added`);
        api
          .post("/api/admin/blog/authors", { name: n, role: role.trim() })
          .then(() => refresh())
          .catch(() => {
            toast("Couldn't save the author");
            refresh();
          });
        return optimistic;
      },
      updateAuthor: (id, name, role) => {
        const n = name.trim().replace(/\s+/g, " ");
        if (!n) return;
        setState((s) => (s ? { ...s, authors: s.authors.map((a) => (a.id === id ? { ...a, name: n, role: role.trim() } : a)) } : s));
        toast("Author updated");
        api.patch(`/api/admin/blog/authors/${id}`, { name: n, role: role.trim() }).catch(() => {
          toast("Couldn't update the author");
          refresh();
        });
      },
      removeAuthor: (id) => {
        setState((s) => (s ? { ...s, authors: s.authors.filter((a) => a.id !== id) } : s));
        toast("Author deleted");
        api.delete(`/api/admin/blog/authors/${id}`).catch(() => refresh());
      },
      refresh,
    };
  }, [state, toast, uniqueSlug, slugTaken, load]);

  if (!ctx) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return <BlogCtx.Provider value={ctx}>{children}</BlogCtx.Provider>;
}
