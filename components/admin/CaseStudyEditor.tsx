"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { INDUSTRY_OPTIONS, SERVICE_OPTIONS, slugify, type CaseStudy } from "@/lib/admin/case-study-types";
import { fmtWhen } from "@/lib/admin/format";
import { logActivity } from "@/lib/admin/activity";
import { api } from "@/lib/api/client";
import { useCaseStudies } from "./CaseStudyProvider";
import Dialog from "./Dialog";
import { useInbox } from "./InboxProvider";
import { IconArrowLeft, IconCaseStudy, IconPlus } from "./icons";
import RichEditor from "./RichEditor";

const strip = (c: CaseStudy) => JSON.stringify({ ...c, updatedAt: "" });

export default function CaseStudyEditor({ id }: { id: string }) {
  const router = useRouter();
  const { get, save, slugTaken, remove } = useCaseStudies();
  const { toast } = useInbox();
  const saved = get(id);
  const [cs, setCs] = useState<CaseStudy | null>(saved ?? null);
  const [slugTouched, setSlugTouched] = useState(!!saved && saved.slug !== "" && saved.slug !== slugify(saved.title));
  const [leave, setLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [autosaved, setAutosaved] = useState<string | null>(null);
  const [now] = useState(() => Date.now());
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [cs?.title]);

  useEffect(() => {
    if (!cs && saved) {
      setCs(saved);
      setSlugTouched(saved.slug !== "" && saved.slug !== slugify(saved.title));
    }
  }, [saved, cs]);

  const dirty = !!cs && !!saved && strip(cs) !== strip(saved);

  useEffect(() => {
    if (!cs || !saved || !dirty || cs.status === "published") return;
    const t = window.setTimeout(() => {
      save(cs, true);
      setAutosaved(new Date().toISOString());
    }, 1200);
    return () => window.clearTimeout(t);
  }, [cs, saved, dirty, save]);

  useEffect(() => {
    if (!(dirty && cs?.status === "published")) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty, cs?.status]);

  if (!cs) {
    return (
      <div className="adm-empty adm-empty-page">
        <IconCaseStudy />
        <h3>Case study not found</h3>
        <p>It may have been deleted.</p>
        <Link href="/admin/case-studies" className="adm-mini">
          Back to case studies
        </Link>
      </div>
    );
  }

  const set = <K extends keyof CaseStudy>(k: K, v: CaseStudy[K]) => setCs((p) => (p ? { ...p, [k]: v } : p));
  const slugBad = cs.slug === "" || slugTaken(cs.slug, cs.id);
  const toggleService = (value: string) => set("services", cs.services.includes(value) ? cs.services.filter((s) => s !== value) : [...cs.services, value]);

  const required = [
    { ok: cs.title.trim().length > 0, text: "A title" },
    { ok: !slugBad, text: cs.slug && slugTaken(cs.slug, cs.id) ? "A web address that isn't used by another case study" : "A web address (slug)" },
    { ok: cs.client.trim().length > 0, text: "A client name" },
    { ok: cs.industry.trim().length > 0, text: "An industry" },
    { ok: cs.excerpt.trim().length > 0, text: "A short summary for the case studies page" },
  ];
  const blocking = required.filter((r) => !r.ok);

  const finish = (patch: Partial<CaseStudy>, message: string) => {
    const next = { ...cs, ...patch };
    save(next, true);
    setCs(next);
    toast(message);
    logActivity("settings", `${message}: “${next.title || "Untitled case study"}”`);
  };
  const publish = () => {
    setShowErrors(true);
    if (blocking.length) return;
    finish({ status: "published" }, cs.status === "published" ? "Case study updated" : "Case study published");
  };
  const saveDraft = () => finish({ status: "draft" }, "Draft saved");
  const back = () => (dirty && cs.status === "published" ? setLeave(true) : router.push("/admin/case-studies"));

  const uploadTo = async (f: File, onDone: (url: string) => void) => {
    if (!/^image\//.test(f.type) || f.size > 2_000_000) return toast("Choose an image under 2 MB");
    try {
      const formData = new FormData();
      formData.append("file", f);
      const { url } = await api.post<{ url: string }>("/api/admin/case-studies/upload-image", undefined, { formData });
      onDone(url);
    } catch {
      toast("Couldn't upload that image — please try again");
    }
  };

  const primaryLabel = cs.status === "published" ? "Update case study" : "Publish";

  return (
    <div className="adm-editorpage">
      <div className="adm-editbar">
        <button type="button" className="adm-backlink adm-linkbtn" onClick={back}>
          <IconArrowLeft /> Case studies
        </button>
        <span className="adm-editbar-state">
          <span className={`adm-pstatus adm-pstatus-${cs.status}`}>{cs.status === "draft" ? "Draft" : "Published"}</span>
          <span aria-live="polite">{dirty ? (cs.status === "published" ? "Unsaved changes" : "Saving…") : autosaved ? `Saved ${fmtWhen(autosaved, Date.now())}` : "All changes saved"}</span>
        </span>
        <span className="adm-editbar-actions">
          {cs.status === "published" ? (
            <button type="button" className="adm-mini" onClick={() => finish({ status: "draft" }, "Moved back to drafts")}>
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
          <label className="sr-only" htmlFor="cs-title">
            Title
          </label>
          <textarea
            id="cs-title"
            ref={titleRef}
            rows={1}
            className="adm-title-input"
            value={cs.title}
            placeholder="Case study title"
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            onChange={(e) => {
              const title = e.target.value;
              setCs((p) => (p ? { ...p, title, ...(slugTouched ? {} : { slug: slugify(title) }) } : p));
            }}
          />
          <div className="adm-slugrow">
            <label htmlFor="cs-slug">techclues.co.uk/case-studies/</label>
            <input
              id="cs-slug"
              className="adm-slug-input"
              value={cs.slug}
              aria-invalid={showErrors && slugBad}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              onBlur={() => cs.slug && slugTaken(cs.slug, cs.id) && toast("That address is already used by another case study")}
            />
            {cs.slug && !slugTaken(cs.slug, cs.id) ? null : cs.slug ? <small className="adm-err">Already used</small> : null}
          </div>

          <RichEditor key={cs.id} initial={cs.body} onChange={(html) => set("body", html)} placeholder="The challenge, the approach, what shipped…" />

          <section className="adm-panel" aria-labelledby="cs-results-h" style={{ marginTop: 24 }}>
            <h3 id="cs-results-h">Results</h3>
            <p className="adm-muted">Short stat chips shown on the case study, e.g. “3x” / “faster launch”.</p>
            <ul className="adm-rowlist adm-rowlist-tight">
              {cs.results.map((r, i) => (
                <li key={i}>
                  <span className="adm-dlg-foot-btns" style={{ flex: 1 }}>
                    <input className="adm-input adm-input-sm" style={{ width: 110 }} value={r.value} placeholder="3x" onChange={(e) => set("results", cs.results.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
                    <input className="adm-input adm-input-sm" style={{ flex: 1 }} value={r.label} placeholder="faster launch" onChange={(e) => set("results", cs.results.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                  </span>
                  <button type="button" className="adm-mini adm-mini-danger" onClick={() => set("results", cs.results.filter((_, j) => j !== i))}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="adm-mini" style={{ marginTop: 10 }} onClick={() => set("results", [...cs.results, { value: "", label: "" }])}>
              <IconPlus className="adm-ic adm-ic-xs" /> Add result
            </button>
          </section>

          <section className="adm-panel" aria-labelledby="cs-testimonial-h" style={{ marginTop: 24 }}>
            <h3 id="cs-testimonial-h">Testimonial</h3>
            <div className="adm-field">
              <label htmlFor="cs-t-quote">Quote</label>
              <textarea id="cs-t-quote" className="adm-textarea adm-textarea-sm" rows={3} value={cs.testimonial.quote} onChange={(e) => set("testimonial", { ...cs.testimonial, quote: e.target.value })} />
            </div>
            <div className="adm-fields">
              <div className="adm-field">
                <label htmlFor="cs-t-author">Attributed to</label>
                <input id="cs-t-author" className="adm-input adm-input-sm" value={cs.testimonial.author} onChange={(e) => set("testimonial", { ...cs.testimonial, author: e.target.value })} placeholder="Company or team name" />
              </div>
              <div className="adm-field">
                <label htmlFor="cs-t-role">Role</label>
                <input id="cs-t-role" className="adm-input adm-input-sm" value={cs.testimonial.role} onChange={(e) => set("testimonial", { ...cs.testimonial, role: e.target.value })} placeholder="Founder, Operations lead…" />
              </div>
            </div>
          </section>
        </div>

        <aside className="adm-editside" aria-label="Case study settings">
          <section className="adm-panel" aria-labelledby="cs-publish">
            <h3 id="cs-publish">Publish</h3>
            {cs.status === "published" && (
              <p className="adm-muted">
                Live.{" "}
                <a href={`/case-studies/${cs.slug}`} target="_blank" rel="noopener" className="adm-text-btn">
                  View on the site
                </a>
              </p>
            )}
            <label className="adm-check">
              <input type="checkbox" checked={cs.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured
            </label>
            <ul className="adm-checklist" aria-label="Before you publish">
              {required.map((r) => (
                <li key={r.text} data-ok={r.ok} data-flag={showErrors && !r.ok}>
                  <span aria-hidden="true">{r.ok ? "✓" : "○"}</span> {r.text}
                </li>
              ))}
            </ul>
          </section>

          <section className="adm-panel" aria-labelledby="cs-client">
            <h3 id="cs-client">Client &amp; industry</h3>
            <div className="adm-field">
              <label htmlFor="cs-client-input">Client</label>
              <input id="cs-client-input" className="adm-input adm-input-sm" value={cs.client} onChange={(e) => set("client", e.target.value)} aria-invalid={showErrors && cs.client.trim() === ""} placeholder="Client or project name" />
            </div>
            <div className="adm-field">
              <label htmlFor="cs-industry">Industry</label>
              <input id="cs-industry" className="adm-input adm-input-sm" list="cs-industry-list" value={cs.industry} onChange={(e) => set("industry", e.target.value)} aria-invalid={showErrors && cs.industry.trim() === ""} placeholder="e.g. healthcare-medical" />
              <datalist id="cs-industry-list">
                {INDUSTRY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </datalist>
            </div>
          </section>

          <section className="adm-panel" aria-labelledby="cs-services-h">
            <h3 id="cs-services-h">Services</h3>
            <ul className="adm-switchlist">
              {SERVICE_OPTIONS.map((o) => (
                <li key={o.value} className="adm-switchrow">
                  <label className="adm-switch">
                    <input type="checkbox" checked={cs.services.includes(o.value)} onChange={() => toggleService(o.value)} />
                    <span aria-hidden="true" />
                    <b>{o.label}</b>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section className="adm-panel" aria-labelledby="cs-cover">
            <h3 id="cs-cover">Cover image</h3>
            {cs.cover ? <img className="adm-cover" src={cs.cover} alt={cs.coverAlt || "Cover preview"} /> : <div className="adm-cover adm-cover-empty">No cover image</div>}
            <div className="adm-inlineadd">
              <button type="button" className="adm-mini" onClick={() => coverRef.current?.click()}>
                Upload
              </button>
              {cs.cover && (
                <button type="button" className="adm-mini adm-mini-ghost" onClick={() => { set("cover", ""); set("coverAlt", ""); }}>
                  Remove
                </button>
              )}
              <input ref={coverRef} type="file" accept="image/*" className="sr-only" aria-label="Upload a cover image" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadTo(f, (url) => set("cover", url)); e.target.value = ""; }} />
            </div>
            <div className="adm-field">
              <label htmlFor="cs-cover-url">Or an image address</label>
              <input id="cs-cover-url" className="adm-input adm-input-sm" value={cs.cover.startsWith("data:") ? "" : cs.cover} onChange={(e) => set("cover", e.target.value.trim())} placeholder="https://… or /images/…" />
            </div>
            <div className="adm-field">
              <label htmlFor="cs-cover-alt">Image description (alt text)</label>
              <input id="cs-cover-alt" className="adm-input adm-input-sm" value={cs.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} placeholder="What the image shows" />
            </div>
          </section>

          <section className="adm-panel" aria-labelledby="cs-gallery">
            <h3 id="cs-gallery">Gallery images</h3>
            {cs.images.length > 0 && (
              <ul className="adm-rowlist adm-rowlist-tight">
                {cs.images.map((src, i) => (
                  <li key={i}>
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={src} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                      <small className="adm-muted">Image {i + 1}</small>
                    </span>
                    <button type="button" className="adm-mini adm-mini-danger" onClick={() => set("images", cs.images.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="adm-inlineadd" style={{ marginTop: 10 }}>
              <button type="button" className="adm-mini" onClick={() => galleryRef.current?.click()}>
                <IconPlus className="adm-ic adm-ic-xs" /> Add image
              </button>
              <input ref={galleryRef} type="file" accept="image/*" className="sr-only" aria-label="Add a gallery image" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadTo(f, (url) => set("images", [...cs.images, url])); e.target.value = ""; }} />
            </div>
          </section>

          <section className="adm-panel" aria-labelledby="cs-ex">
            <h3 id="cs-ex">Summary</h3>
            <label className="sr-only" htmlFor="cs-excerpt">
              Short summary
            </label>
            <textarea id="cs-excerpt" className="adm-textarea adm-textarea-sm" rows={4} value={cs.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="One or two sentences shown on the case studies page." aria-invalid={showErrors && cs.excerpt.trim() === ""} />
            <small className="adm-count" data-over={cs.excerpt.length > 200}>
              {cs.excerpt.length} / 200
            </small>
          </section>

          <section className="adm-panel" aria-labelledby="cs-seo">
            <h3 id="cs-seo">Search appearance</h3>
            <div className="adm-serp" aria-label="Search result preview">
              <small>techclues.co.uk › case-studies › {cs.slug || "your-case-study"}</small>
              <strong>{cs.seoTitle || cs.title || "Case study title"}</strong>
              <span>{cs.seoDescription || cs.excerpt || "The description search engines show appears here."}</span>
            </div>
            <div className="adm-field">
              <label htmlFor="cs-seo-title">Page title</label>
              <input id="cs-seo-title" className="adm-input adm-input-sm" value={cs.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={cs.title || "Defaults to the case study title"} />
              <small className="adm-count" data-over={cs.seoTitle.length > 60}>
                {cs.seoTitle.length} / 60
              </small>
            </div>
            <div className="adm-field">
              <label htmlFor="cs-seo-desc">Description</label>
              <textarea id="cs-seo-desc" className="adm-textarea adm-textarea-sm" rows={3} value={cs.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder="Defaults to the summary" />
              <small className="adm-count" data-over={cs.seoDescription.length > 160}>
                {cs.seoDescription.length} / 160
              </small>
            </div>
          </section>

          <section className="adm-panel adm-danger-zone">
            <button type="button" className="adm-mini adm-mini-danger" onClick={() => setConfirmDelete(true)}>
              Delete this case study
            </button>
          </section>
        </aside>
      </div>

      {leave && (
        <Dialog
          title="Leave without saving?"
          onClose={() => setLeave(false)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setLeave(false)}>
                Keep editing
              </button>
              <button type="button" className="adm-mini adm-mini-danger" onClick={() => router.push("/admin/case-studies")}>
                Leave without saving
              </button>
              <button type="button" className="adm-btn adm-btn-sm" onClick={() => { save(cs, true); router.push("/admin/case-studies"); }}>
                Save and leave
              </button>
            </span>
          }
        >
          <p className="adm-muted">This case study is live, so your changes aren&apos;t saved until you update it.</p>
        </Dialog>
      )}

      {confirmDelete && (
        <Dialog
          title="Delete this case study?"
          onClose={() => setConfirmDelete(false)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setConfirmDelete(false)}>
                Keep it
              </button>
              <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => { remove(cs.id); router.push("/admin/case-studies"); }}>
                Delete case study
              </button>
            </span>
          }
        >
          <p className="adm-muted">“{cs.title || "Untitled case study"}” will be deleted for good{cs.status === "published" ? " and taken off the website" : ""}.</p>
        </Dialog>
      )}
    </div>
  );
}
