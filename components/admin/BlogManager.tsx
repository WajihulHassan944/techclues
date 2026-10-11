"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { readMinutes, type Post, type PostStatus } from "@/lib/admin/blog-types";
import { fmtWhen } from "@/lib/admin/format";
import { dateKey, fmtKey, fmtTime } from "@/lib/admin/tz";
import { useBlog } from "./BlogProvider";
import Dialog from "./Dialog";
import { StatusBadge } from "./PostBits";
import { IconBlog, IconPlus, IconSearch } from "./icons";

type Tab = "all" | PostStatus;

function RowMenu({ post, onDelete }: { post: Post; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { duplicate } = useBlog();
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div className="adm-pop-wrap" ref={ref}>
      <button type="button" className="adm-icon-btn adm-sm" aria-label={`Actions for ${post.title || "untitled post"}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">⋯</span>
      </button>
      {open && (
        <div className="adm-pop adm-pop-sm" role="menu">
          <Link href={`/admin/blog/${post.id}`} className="adm-pop-item" role="menuitem">
            Edit
          </Link>
          <button type="button" className="adm-pop-item" role="menuitem" onClick={() => { setOpen(false); duplicate(post.id).then((id) => { if (id) router.push(`/admin/blog/${id}`); }); }}>
            Duplicate
          </button>
          {post.status === "published" && (
            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="adm-pop-item" role="menuitem">
              View on the site
            </a>
          )}
          <div className="adm-pop-sep" />
          <button type="button" className="adm-pop-item adm-pop-danger" role="menuitem" onClick={() => { setOpen(false); onDelete(); }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function PostsTab() {
  const { posts, categories, authors, remove } = useBlog();
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState<"updated" | "title">("updated");
  const [del, setDel] = useState<Post | null>(null);
  const [now] = useState(() => Date.now());

  const counts = useMemo(() => {
    const c = { all: posts.length, published: 0, scheduled: 0, draft: 0 };
    for (const p of posts) c[p.status]++;
    return c;
  }, [posts]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = posts.filter((p) => (tab === "all" || p.status === tab) && (!cat || p.category === cat) && (!q || `${p.title} ${p.slug} ${p.excerpt}`.toLowerCase().includes(q)));
    return list.sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title) : (b.publishedAt ?? b.scheduledFor ?? b.updatedAt).localeCompare(a.publishedAt ?? a.scheduledFor ?? a.updatedAt)));
  }, [posts, tab, cat, query, sort]);

  const when = (p: Post) => {
    if (p.status === "published" && p.publishedAt) return fmtKey(dateKey(p.publishedAt), { day: "numeric", month: "short", year: "numeric" });
    if (p.status === "scheduled" && p.scheduledFor) return `${fmtKey(dateKey(p.scheduledFor), { weekday: "short", day: "numeric", month: "short" })}, ${fmtTime(p.scheduledFor)}`;
    return `Edited ${fmtWhen(p.updatedAt, now)}`;
  };

  return (
    <div className="adm-stack">
      <div className="adm-filters">
        <label className="adm-search adm-search-wide">
          <span className="sr-only">Search posts</span>
          <IconSearch />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, address or summary…" />
        </label>
        <label className="adm-select-wrap">
          <span className="sr-only">Category</span>
          <select className="adm-select" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="adm-select-wrap">
          <span className="sr-only">Sort</span>
          <select className="adm-select" value={sort} onChange={(e) => setSort(e.target.value as "updated" | "title")}>
            <option value="updated">Newest first</option>
            <option value="title">Title A to Z</option>
          </select>
        </label>
      </div>

      <div className="adm-tabs" role="tablist" aria-label="Filter posts by status">
        {([["all", "All"], ["published", "Published"], ["scheduled", "Scheduled"], ["draft", "Drafts"]] as [Tab, string][]).map(([k, label]) => (
          <button key={k} type="button" role="tab" className="adm-tab" aria-selected={tab === k} onClick={() => setTab(k)}>
            {label}
            <span className="adm-tab-n">{counts[k]}</span>
          </button>
        ))}
      </div>

      <div className="adm-table">
        {rows.length === 0 ? (
          <div className="adm-empty">
            <IconBlog />
            <h3>{posts.length === 0 ? "No posts yet" : "No posts match"}</h3>
            <p>{posts.length === 0 ? "Write your first post." : "Try a different search, status or category."}</p>
            <Link href="/admin/blog/new" className="adm-mini">
              New post
            </Link>
          </div>
        ) : (
          <ul className="adm-posts">
            {rows.map((p) => {
              const author = authors.find((a) => a.id === p.authorId)?.name ?? "No author";
              return (
                <li key={p.id} className="adm-post">
                  <Link href={`/admin/blog/${p.id}`} className="adm-post-main" aria-label={`Edit ${p.title || "untitled post"}`}>
                    {p.cover ? <img src={p.cover} alt="" className="adm-thumb" /> : <span className="adm-thumb adm-thumb-empty" aria-hidden="true" />}
                    <span className="adm-post-title">
                      <strong>{p.title || "Untitled post"}</strong>
                      <small>/blog/{p.slug || "…"}</small>
                    </span>
                  </Link>
                  <span className="adm-post-cat">{p.category ? <span className="adm-src adm-src-contact">{p.category}</span> : <small className="adm-muted">No category</small>}</span>
                  <span className="adm-post-author">{author}</span>
                  <span className="adm-post-when">
                    <StatusBadge post={p} />
                    <small>{when(p)}</small>
                  </span>
                  <span className="adm-post-read">{p.body ? `${readMinutes(p.body)} min` : "–"}</span>
                  <RowMenu post={p} onDelete={() => setDel(p)} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {del && (
        <Dialog
          title="Delete this post?"
          onClose={() => setDel(null)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setDel(null)}>
                Keep it
              </button>
              <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => { remove(del.id); setDel(null); }}>
                Delete post
              </button>
            </span>
          }
        >
          <p className="adm-muted">“{del.title || "Untitled post"}” will be deleted for good{del.status === "published" ? " and taken off the website" : ""}.</p>
        </Dialog>
      )}
    </div>
  );
}

function CategoriesTab() {
  const { categories, posts, addCategory, renameCategory, removeCategory } = useBlog();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const used = (n: string) => posts.filter((p) => p.category === n).length;
  return (
    <section className="adm-panel" aria-label="Categories">
      <h3>Categories</h3>
      <p className="adm-muted">Group posts on the blog page. A category in use can be renamed but not deleted.</p>
      <form className="adm-inlineadd adm-inlineadd-lg" onSubmit={(e) => { e.preventDefault(); if (addCategory(name)) setName(""); }}>
        <label className="sr-only" htmlFor="cat-new">
          New category name
        </label>
        <input id="cat-new" className="adm-input adm-input-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" />
        <button type="submit" className="adm-mini" disabled={!name.trim()}>
          <IconPlus className="adm-ic adm-ic-xs" /> Add category
        </button>
      </form>
      <ul className="adm-rowlist">
        {categories.map((c) => (
          <li key={c.id}>
            {editing === c.id ? (
              <form className="adm-inlineadd" onSubmit={(e) => { e.preventDefault(); renameCategory(c.id, draft); setEditing(null); }}>
                <label className="sr-only" htmlFor={`cat-${c.id}`}>
                  Category name
                </label>
                <input id={`cat-${c.id}`} className="adm-input adm-input-sm" value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
                <button type="submit" className="adm-mini">
                  Save
                </button>
                <button type="button" className="adm-mini adm-mini-ghost" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span>
                  <strong>{c.name}</strong>
                  <small>
                    {used(c.name)} {used(c.name) === 1 ? "post" : "posts"}
                  </small>
                </span>
                <span className="adm-dlg-foot-btns">
                  <button type="button" className="adm-mini" aria-label={`Rename ${c.name}`} onClick={() => { setEditing(c.id); setDraft(c.name); }}>
                    Rename
                  </button>
                  <button type="button" className="adm-mini adm-mini-danger" aria-label={`Delete ${c.name}`} disabled={used(c.name) > 0} title={used(c.name) > 0 ? "Move its posts to another category first" : undefined} onClick={() => removeCategory(c.id)}>
                    Delete
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function AuthorsTab() {
  const { authors, posts, addAuthor, updateAuthor, removeAuthor } = useBlog();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [en, setEn] = useState("");
  const [er, setEr] = useState("");
  const used = (id: string) => posts.filter((p) => p.authorId === id).length;
  return (
    <section className="adm-panel" aria-label="Authors">
      <h3>Authors</h3>
      <p className="adm-muted">Shown on each post. An author with posts can be edited but not deleted.</p>
      <form className="adm-inlineadd adm-inlineadd-lg" onSubmit={(e) => { e.preventDefault(); if (addAuthor(name, role)) { setName(""); setRole(""); } }}>
        <label className="sr-only" htmlFor="au-new">
          Author name
        </label>
        <input id="au-new" className="adm-input adm-input-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <label className="sr-only" htmlFor="au-role">
          Role
        </label>
        <input id="au-role" className="adm-input adm-input-sm" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role (optional)" />
        <button type="submit" className="adm-mini" disabled={!name.trim()}>
          <IconPlus className="adm-ic adm-ic-xs" /> Add author
        </button>
      </form>
      <ul className="adm-rowlist">
        {authors.map((a) => (
          <li key={a.id}>
            {editing === a.id ? (
              <form className="adm-inlineadd" onSubmit={(e) => { e.preventDefault(); updateAuthor(a.id, en, er); setEditing(null); }}>
                <label className="sr-only" htmlFor={`au-n-${a.id}`}>
                  Name
                </label>
                <input id={`au-n-${a.id}`} className="adm-input adm-input-sm" value={en} onChange={(e) => setEn(e.target.value)} autoFocus />
                <label className="sr-only" htmlFor={`au-r-${a.id}`}>
                  Role
                </label>
                <input id={`au-r-${a.id}`} className="adm-input adm-input-sm" value={er} onChange={(e) => setEr(e.target.value)} />
                <button type="submit" className="adm-mini">
                  Save
                </button>
                <button type="button" className="adm-mini adm-mini-ghost" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span>
                  <strong>{a.name}</strong>
                  <small>
                    {a.role || "No role"} · {used(a.id)} {used(a.id) === 1 ? "post" : "posts"}
                  </small>
                </span>
                <span className="adm-dlg-foot-btns">
                  <button type="button" className="adm-mini" aria-label={`Edit ${a.name}`} onClick={() => { setEditing(a.id); setEn(a.name); setEr(a.role); }}>
                    Edit
                  </button>
                  <button type="button" className="adm-mini adm-mini-danger" aria-label={`Delete ${a.name}`} disabled={used(a.id) > 0 || authors.length === 1} title={used(a.id) > 0 ? "Reassign their posts first" : undefined} onClick={() => removeAuthor(a.id)}>
                    Delete
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BlogManager() {
  const [view, setView] = useState<"posts" | "categories" | "authors">("posts");
  const { posts, categories, authors } = useBlog();
  return (
    <div className="adm-stack">
      <div className="adm-seg" role="tablist" aria-label="Blog sections">
        {([["posts", "Posts", posts.length], ["categories", "Categories", categories.length], ["authors", "Authors", authors.length]] as [typeof view, string, number][]).map(([k, label, n]) => (
          <button key={k} type="button" role="tab" className="adm-seg-btn" aria-selected={view === k} onClick={() => setView(k)}>
            {label}
            <span className="adm-tab-n">{n}</span>
          </button>
        ))}
        <Link href="/admin/blog/new" className="adm-btn adm-btn-sm adm-seg-empty">
          <IconPlus /> New post
        </Link>
      </div>
      {view === "posts" ? <PostsTab /> : view === "categories" ? <CategoriesTab /> : <AuthorsTab />}
    </div>
  );
}
