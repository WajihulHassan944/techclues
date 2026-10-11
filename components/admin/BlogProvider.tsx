"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedBlog } from "@/lib/admin/blog-seed";
import { slugify, type Author, type BlogState, type Category, type Post } from "@/lib/admin/blog-types";
import { useInbox } from "./InboxProvider";

const KEY = "techclues-admin-blog-v1";

type Ctx = {
  posts: Post[];
  categories: Category[];
  authors: Author[];
  get: (id: string) => Post | undefined;
  /** Creates an empty draft and returns its id. */
  create: () => string;
  /** Saves a post. `quiet` skips the toast (used by autosave). */
  save: (post: Post, quiet?: boolean) => void;
  duplicate: (id: string) => string | undefined;
  remove: (id: string) => void;
  uniqueSlug: (slug: string, exceptId?: string) => string;
  slugTaken: (slug: string, exceptId?: string) => boolean;
  addCategory: (name: string) => Category | undefined;
  renameCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;
  addAuthor: (name: string, role: string) => Author | undefined;
  updateAuthor: (id: string, name: string, role: string) => void;
  removeAuthor: (id: string) => void;
  reset: () => void;
};

const BlogCtx = createContext<Ctx | null>(null);
export const useBlog = () => {
  const c = useContext(BlogCtx);
  if (!c) throw new Error("useBlog must be used inside BlogProvider");
  return c;
};

export default function BlogProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useInbox();
  const [state, setState] = useState<BlogState | null>(null);

  useEffect(() => {
    let loaded: BlogState | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw) as BlogState;
    } catch {
      loaded = null;
    }
    setState(loaded && Array.isArray(loaded.posts) && Array.isArray(loaded.categories) ? loaded : seedBlog(Date.now()));
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable: the panel keeps working for this visit */
    }
  }, [state]);

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

  const api = useMemo<Ctx | null>(() => {
    if (!state) return null;
    const now = () => new Date().toISOString();
    const norm = (s: string) => s.trim().replace(/\s+/g, " ");
    return {
      posts: state.posts,
      categories: state.categories,
      authors: state.authors,
      get: (id) => state.posts.find((p) => p.id === id),
      create: () => {
        const id = `post-${Date.now()}`;
        const t = now();
        const post: Post = { id, slug: "", title: "", excerpt: "", category: "", authorId: state.authors[0]?.id ?? "", cover: "", coverAlt: "", body: "", status: "draft", createdAt: t, updatedAt: t, seoTitle: "", seoDescription: "" };
        setState((s) => (s ? { ...s, posts: [post, ...s.posts] } : s));
        return id;
      },
      save: (post, quiet) => {
        setState((s) => (s ? { ...s, posts: s.posts.some((p) => p.id === post.id) ? s.posts.map((p) => (p.id === post.id ? { ...post, updatedAt: now() } : p)) : [{ ...post, updatedAt: now() }, ...s.posts] } : s));
        if (!quiet) toast(post.status === "published" ? "Post saved" : post.status === "scheduled" ? "Schedule saved" : "Draft saved");
      },
      duplicate: (id) => {
        const src = state.posts.find((p) => p.id === id);
        if (!src) return undefined;
        const nid = `post-${Date.now()}`;
        const t = now();
        const copy: Post = { ...src, id: nid, title: `${src.title} (copy)`, slug: uniqueSlug(`${src.slug}-copy`), status: "draft", publishedAt: undefined, scheduledFor: undefined, createdAt: t, updatedAt: t };
        setState((s) => (s ? { ...s, posts: [copy, ...s.posts] } : s));
        toast("Duplicated as a draft");
        return nid;
      },
      remove: (id) => {
        setState((s) => (s ? { ...s, posts: s.posts.filter((p) => p.id !== id) } : s));
        toast("Post deleted");
      },
      uniqueSlug,
      slugTaken,
      addCategory: (name) => {
        const n = norm(name);
        if (!n || state.categories.some((c) => c.name.toLowerCase() === n.toLowerCase())) return undefined;
        const c = { id: `cat-${Date.now()}`, name: n };
        setState((s) => (s ? { ...s, categories: [...s.categories, c] } : s));
        toast(`Category “${n}” added`);
        return c;
      },
      renameCategory: (id, name) => {
        const n = norm(name);
        const old = state.categories.find((c) => c.id === id);
        if (!n || !old || state.categories.some((c) => c.id !== id && c.name.toLowerCase() === n.toLowerCase())) return;
        setState((s) => (s ? { ...s, categories: s.categories.map((c) => (c.id === id ? { ...c, name: n } : c)), posts: s.posts.map((p) => (p.category === old.name ? { ...p, category: n } : p)) } : s));
        toast("Category renamed");
      },
      removeCategory: (id) => {
        setState((s) => (s ? { ...s, categories: s.categories.filter((c) => c.id !== id) } : s));
        toast("Category deleted");
      },
      addAuthor: (name, role) => {
        const n = norm(name);
        if (!n) return undefined;
        const a = { id: `au-${Date.now()}`, name: n, role: norm(role) };
        setState((s) => (s ? { ...s, authors: [...s.authors, a] } : s));
        toast(`Author “${n}” added`);
        return a;
      },
      updateAuthor: (id, name, role) => {
        const n = norm(name);
        if (!n) return;
        setState((s) => (s ? { ...s, authors: s.authors.map((a) => (a.id === id ? { ...a, name: n, role: norm(role) } : a)) } : s));
        toast("Author updated");
      },
      removeAuthor: (id) => {
        setState((s) => (s ? { ...s, authors: s.authors.filter((a) => a.id !== id) } : s));
        toast("Author deleted");
      },
      reset: () => {
        setState(seedBlog(Date.now()));
        toast("Sample posts restored");
      },
    };
  }, [state, toast, uniqueSlug, slugTaken]);

  if (!api) return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  return <BlogCtx.Provider value={api}>{children}</BlogCtx.Provider>;
}
