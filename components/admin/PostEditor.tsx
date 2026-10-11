"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { emptyBody, headingsOf, readMinutes, slugify, wordCount, type Post } from "@/lib/admin/blog-types";
import { fmtWhen } from "@/lib/admin/format";
import { useBlog } from "./BlogProvider";
import Dialog from "./Dialog";
import { useInbox } from "./InboxProvider";
import { IconArrowLeft, IconBlog } from "./icons";
import RichEditor from "./RichEditor";
import PostPreview from "./PostPreview";
import { StatusBadge } from "./PostBits";

const strip = (p: Post) => JSON.stringify({ ...p, updatedAt: "" });
const toLocalInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
const defaultSchedule = () => {
  const d = new Date(Date.now() + 86_400_000);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
};


export default function PostEditor({ id }: { id: string }) {
  const router = useRouter();
  const { get, save, categories, authors, addCategory, slugTaken, uniqueSlug, remove } = useBlog();
  const { toast } = useInbox();
  const saved = get(id);
  const [post, setPost] = useState<Post | null>(saved ?? null);
  const [slugTouched, setSlugTouched] = useState(!!saved && saved.slug !== "" && saved.slug !== slugify(saved.title));
  const [schedule, setSchedule] = useState(saved?.status === "scheduled");
  const [newCat, setNewCat] = useState("");
  const [preview, setPreview] = useState(false);
  const [leave, setLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [autosaved, setAutosaved] = useState<string | null>(null);
  const [now] = useState(() => Date.now());
  const fileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Let the title grow to fit instead of cutting off a long headline.
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [post?.title]);

  // The post may arrive after the first render (e.g. a freshly created draft).
  useEffect(() => {
    if (!post && saved) {
      setPost(saved);
      setSlugTouched(saved.slug !== "" && saved.slug !== slugify(saved.title));
      setSchedule(saved.status === "scheduled");
    }
  }, [saved, post]);

  const dirty = !!post && !!saved && strip(post) !== strip(saved);

  // Drafts and scheduled posts save themselves; published posts need an explicit save.
  useEffect(() => {
    if (!post || !saved || !dirty || post.status === "published") return;
    const t = window.setTimeout(() => {
      save(post, true);
      setAutosaved(new Date().toISOString());
    }, 1200);
    return () => window.clearTimeout(t);
  }, [post, saved, dirty, save]);

  useEffect(() => {
    if (!(dirty && post?.status === "published")) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty, post?.status]);

  const headings = useMemo(() => headingsOf(post?.body ?? ""), [post?.body]);
  if (!post) {
    return (
      <div className="adm-empty adm-empty-page">
        <IconBlog />
        <h3>Post not found</h3>
        <p>It may have been deleted.</p>
        <Link href="/admin/blog" className="adm-mini">
          Back to posts
        </Link>
      </div>
    );
  }

  const set = <K extends keyof Post>(k: K, v: Post[K]) => setPost((p) => (p ? { ...p, [k]: v } : p));
  const words = wordCount(post.body);
  const slugBad = post.slug === "" || slugTaken(post.slug, post.id);
  const scheduleOk = !schedule || (!!post.scheduledFor && new Date(post.scheduledFor).getTime() > now);

  const required = [
    { ok: post.title.trim().length > 0, text: "A title" },
    { ok: !slugBad, text: post.slug && slugTaken(post.slug, post.id) ? "A web address that isn't used by another post" : "A web address (slug)" },
    { ok: post.excerpt.trim().length > 0, text: "A short summary for the blog page" },
    { ok: post.category !== "", text: "A category" },
    { ok: !emptyBody(post.body), text: "Some article text" },
  ];
  const advice = [
    { ok: !!post.cover && !!post.coverAlt.trim(), text: post.cover ? "Describe the cover image (alt text)" : "A cover image" },
    { ok: post.seoDescription.trim().length >= 70 && post.seoDescription.length <= 160, text: "A search description of 70 to 160 characters" },
    { ok: headings.some((h) => h.level === 2), text: "At least one section heading (they make the contents list)" },
  ];
  const blocking = required.filter((r) => !r.ok);

  const finish = (patch: Partial<Post>, message: string) => {
    const next = { ...post, ...patch };
    save(next, true);
    setPost(next);
    toast(message);
  };
  const publish = () => {
    setShowErrors(true);
    if (blocking.length) return;
    if (schedule) {
      if (!scheduleOk) return;
      finish({ status: "scheduled", publishedAt: undefined }, `Scheduled for ${fmtWhen(post.scheduledFor!, now)}`);
    } else finish({ status: "published", publishedAt: post.publishedAt ?? new Date().toISOString(), scheduledFor: undefined }, post.status === "published" ? "Post updated" : "Post published");
  };
  const saveDraft = () => finish({ status: "draft", scheduledFor: undefined, publishedAt: post.status === "published" ? undefined : post.publishedAt }, "Draft saved");
  const back = () => (dirty && post.status === "published" ? setLeave(true) : router.push("/admin/blog"));

  const onCover = (f?: File) => {
    if (!f) return;
    if (!/^image\//.test(f.type) || f.size > 1_500_000) return toast("Choose an image under 1.5 MB");
    const r = new FileReader();
    r.onload = () => set("cover", String(r.result));
    r.readAsDataURL(f);
  };

  const primaryLabel = post.status === "published" ? "Update post" : schedule ? "Schedule" : "Publish";

  return (
    <div className="adm-editorpage">
      <div className="adm-editbar">
        <button type="button" className="adm-backlink adm-linkbtn" onClick={back}>
          <IconArrowLeft /> Posts
        </button>
        <span className="adm-editbar-state">
          <StatusBadge post={post} />
          <span aria-live="polite">{dirty ? (post.status === "published" ? "Unsaved changes" : "Saving…") : autosaved ? `Saved ${fmtWhen(autosaved, Date.now())}` : "All changes saved"}</span>
        </span>
        <span className="adm-editbar-actions">
          <button type="button" className="adm-mini" onClick={() => setPreview(true)}>
            Preview
          </button>
          {post.status === "published" ? (
            <button type="button" className="adm-mini" onClick={() => finish({ status: "draft", publishedAt: undefined }, "Moved back to drafts")}>
              Unpublish
            </button>
          ) : (
            <button type="button" className="adm-mini" onClick={saveDraft}>
              Save draft
            </button>
          )}
          <button type="button" className="adm-btn adm-btn-sm" onClick={publish}>
            {primaryLabel}
          </button>
        </span>
      </div>

      <div className="adm-editgrid">
        <div className="adm-editmain">
          <label className="sr-only" htmlFor="post-title">
            Title
          </label>
          <textarea
            id="post-title"
            ref={titleRef}
            rows={1}
            className="adm-title-input"
            value={post.title}
            placeholder="Post title"
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            onChange={(e) => {
              const title = e.target.value;
              setPost((p) => (p ? { ...p, title, ...(slugTouched ? {} : { slug: slugify(title) }) } : p));
            }}
          />
          <div className="adm-slugrow">
            <label htmlFor="post-slug">techclues.co.uk/blog/</label>
            <input
              id="post-slug"
              className="adm-slug-input"
              value={post.slug}
              aria-invalid={showErrors && slugBad}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              onBlur={() => post.slug && slugTaken(post.slug, post.id) && toast("That address is already used by another post")}
            />
            {post.slug && !slugTaken(post.slug, post.id) ? null : post.slug ? <small className="adm-err">Already used</small> : null}
          </div>

          <RichEditor key={post.id} initial={post.body} onChange={(html) => set("body", html)} placeholder="Start writing your post…" />
          <p className="adm-wordcount">
            {words.toLocaleString("en-GB")} {words === 1 ? "word" : "words"} · about {readMinutes(post.body)} min read
          </p>
        </div>

        <aside className="adm-editside" aria-label="Post settings">
          <section className="adm-panel" aria-labelledby="ps-publish">
            <h3 id="ps-publish">Publish</h3>
            {post.status === "published" ? (
              <p className="adm-muted">
                Live since {post.publishedAt ? fmtWhen(post.publishedAt, now) : "today"}.{" "}
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="adm-text-btn">
                  View on the site
                </a>
              </p>
            ) : (
              <>
                <label className="adm-check">
                  <input type="checkbox" checked={schedule} onChange={(e) => { setSchedule(e.target.checked); if (e.target.checked && !post.scheduledFor) set("scheduledFor", defaultSchedule()); }} /> Schedule for later
                </label>
                {schedule && (
                  <div className="adm-field">
                    <label htmlFor="post-when">Publish on</label>
                    <input id="post-when" type="datetime-local" className="adm-input adm-input-sm" min={toLocalInput(new Date(now).toISOString())} value={toLocalInput(post.scheduledFor)} onChange={(e) => set("scheduledFor", e.target.value ? new Date(e.target.value).toISOString() : undefined)} aria-invalid={showErrors && !scheduleOk} />
                    {showErrors && !scheduleOk && <small className="adm-err">Choose a time in the future.</small>}
                  </div>
                )}
              </>
            )}
            <ul className="adm-checklist" aria-label="Before you publish">
              {required.map((r) => (
                <li key={r.text} data-ok={r.ok} data-flag={showErrors && !r.ok}>
                  <span aria-hidden="true">{r.ok ? "✓" : "○"}</span> {r.text}
                </li>
              ))}
              {advice.map((r) => (
                <li key={r.text} data-ok={r.ok} data-soft="true">
                  <span aria-hidden="true">{r.ok ? "✓" : "○"}</span> {r.text} <em>(recommended)</em>
                </li>
              ))}
            </ul>
          </section>

          <section className="adm-panel" aria-labelledby="ps-cat">
            <h3 id="ps-cat">Category and author</h3>
            <div className="adm-field">
              <label htmlFor="post-cat">Category</label>
              <select id="post-cat" className="adm-select adm-select-full" value={post.category} onChange={(e) => set("category", e.target.value)} aria-invalid={showErrors && post.category === ""}>
                <option value="">Choose a category…</option>
                {categories.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="adm-inlineadd">
                <label className="sr-only" htmlFor="post-newcat">
                  New category
                </label>
                <input id="post-newcat" className="adm-input adm-input-sm" value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const c = addCategory(newCat); if (c) { set("category", c.name); setNewCat(""); } } }} />
                <button type="button" className="adm-mini" disabled={!newCat.trim()} onClick={() => { const c = addCategory(newCat); if (c) { set("category", c.name); setNewCat(""); } }}>
                  Add
                </button>
              </div>
            </div>
            <div className="adm-field">
              <label htmlFor="post-author">Author</label>
              <select id="post-author" className="adm-select adm-select-full" value={post.authorId} onChange={(e) => set("authorId", e.target.value)}>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="adm-panel" aria-labelledby="ps-cover">
            <h3 id="ps-cover">Cover image</h3>
            {post.cover ? <img className="adm-cover" src={post.cover} alt={post.coverAlt || "Cover preview"} /> : <div className="adm-cover adm-cover-empty">No cover image</div>}
            <div className="adm-inlineadd">
              <button type="button" className="adm-mini" onClick={() => fileRef.current?.click()}>
                Upload
              </button>
              {post.cover && (
                <button type="button" className="adm-mini adm-mini-ghost" onClick={() => { set("cover", ""); set("coverAlt", ""); }}>
                  Remove
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" aria-label="Upload a cover image" onChange={(e) => { onCover(e.target.files?.[0]); e.target.value = ""; }} />
            </div>
            <div className="adm-field">
              <label htmlFor="post-cover-url">Or an image address</label>
              <input id="post-cover-url" className="adm-input adm-input-sm" value={post.cover.startsWith("data:") ? "" : post.cover} onChange={(e) => set("cover", e.target.value.trim())} placeholder="https://… or /images/…" />
            </div>
            <div className="adm-field">
              <label htmlFor="post-cover-alt">Image description (alt text)</label>
              <input id="post-cover-alt" className="adm-input adm-input-sm" value={post.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} placeholder="What the image shows" />
            </div>
          </section>

          <section className="adm-panel" aria-labelledby="ps-ex">
            <h3 id="ps-ex">Summary</h3>
            <label className="sr-only" htmlFor="post-excerpt">
              Short summary
            </label>
            <textarea id="post-excerpt" className="adm-textarea adm-textarea-sm" rows={4} value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="One or two sentences shown on the blog page." aria-invalid={showErrors && post.excerpt.trim() === ""} />
            <small className="adm-count" data-over={post.excerpt.length > 200}>
              {post.excerpt.length} / 200
            </small>
          </section>

          <section className="adm-panel" aria-labelledby="ps-seo">
            <h3 id="ps-seo">Search appearance</h3>
            <div className="adm-serp" aria-label="Search result preview">
              <small>techclues.co.uk › blog › {post.slug || "your-post"}</small>
              <strong>{post.seoTitle || post.title || "Post title"}</strong>
              <span>{post.seoDescription || post.excerpt || "The description search engines show appears here."}</span>
            </div>
            <div className="adm-field">
              <label htmlFor="post-seo-title">Page title</label>
              <input id="post-seo-title" className="adm-input adm-input-sm" value={post.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={post.title || "Defaults to the post title"} />
              <small className="adm-count" data-over={post.seoTitle.length > 60}>
                {post.seoTitle.length} / 60
              </small>
            </div>
            <div className="adm-field">
              <label htmlFor="post-seo-desc">Description</label>
              <textarea id="post-seo-desc" className="adm-textarea adm-textarea-sm" rows={3} value={post.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder="Defaults to the summary" />
              <small className="adm-count" data-over={post.seoDescription.length > 160}>
                {post.seoDescription.length} / 160
              </small>
            </div>
          </section>

          <section className="adm-panel" aria-labelledby="ps-toc">
            <h3 id="ps-toc">Contents list</h3>
            {headings.length === 0 ? (
              <p className="adm-muted">Add H2 or H3 headings and they appear here, as the contents list on the post.</p>
            ) : (
              <ol className="adm-toc" aria-label="Headings in this post">
                {headings.map((h, i) => (
                  <li key={`${h.text}-${i}`} data-level={h.level}>
                    {h.text}
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="adm-panel adm-danger-zone">
            <button type="button" className="adm-mini adm-mini-danger" onClick={() => setConfirmDelete(true)}>
              Delete this post
            </button>
          </section>
        </aside>
      </div>

      {preview && <PostPreview post={post} onClose={() => setPreview(false)} />}

      {leave && (
        <Dialog
          title="Leave without saving?"
          onClose={() => setLeave(false)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setLeave(false)}>
                Keep editing
              </button>
              <button type="button" className="adm-mini adm-mini-danger" onClick={() => router.push("/admin/blog")}>
                Leave without saving
              </button>
              <button type="button" className="adm-btn adm-btn-sm" onClick={() => { save(post, true); router.push("/admin/blog"); }}>
                Save and leave
              </button>
            </span>
          }
        >
          <p className="adm-muted">This post is live, so your changes aren&apos;t saved until you update it.</p>
        </Dialog>
      )}

      {confirmDelete && (
        <Dialog
          title="Delete this post?"
          onClose={() => setConfirmDelete(false)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setConfirmDelete(false)}>
                Keep it
              </button>
              <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => { remove(post.id); router.push("/admin/blog"); }}>
                Delete post
              </button>
            </span>
          }
        >
          <p className="adm-muted">“{post.title || "Untitled post"}” will be deleted for good{post.status === "published" ? " and taken off the website" : ""}.</p>
        </Dialog>
      )}
    </div>
  );
}
