"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { INDUSTRY_OPTIONS, SERVICE_OPTIONS, type CaseStudy, type CaseStudyStatus } from "@/lib/admin/case-study-types";
import { fmtWhen } from "@/lib/admin/format";
import { useCaseStudies } from "./CaseStudyProvider";
import Dialog from "./Dialog";
import { IconCaseStudy, IconPlus, IconSearch } from "./icons";

type Tab = "all" | CaseStudyStatus;

function StatusBadge({ status }: { status: CaseStudyStatus }) {
  return <span className={`adm-pstatus adm-pstatus-${status}`}>{status === "draft" ? "Draft" : "Published"}</span>;
}

function RowMenu({ cs, onDelete }: { cs: CaseStudy; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
      <button type="button" className="adm-icon-btn adm-sm" aria-label={`Actions for ${cs.title || "untitled case study"}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">⋯</span>
      </button>
      {open && (
        <div className="adm-pop adm-pop-sm" role="menu">
          <Link href={`/admin/case-studies/${cs.id}`} className="adm-pop-item" role="menuitem">
            Edit
          </Link>
          {cs.status === "published" && (
            <a href={`/case-studies/${cs.slug}`} target="_blank" rel="noopener" className="adm-pop-item" role="menuitem">
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

export default function CaseStudyManager() {
  const { caseStudies, remove } = useCaseStudies();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [service, setService] = useState("");
  const [del, setDel] = useState<CaseStudy | null>(null);
  const [now] = useState(() => Date.now());

  const counts = useMemo(() => {
    const c = { all: caseStudies.length, published: 0, draft: 0 };
    for (const cs of caseStudies) c[cs.status]++;
    return c;
  }, [caseStudies]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = caseStudies.filter(
      (cs) =>
        (tab === "all" || cs.status === tab) &&
        (!industry || cs.industry === industry) &&
        (!service || cs.services.includes(service)) &&
        (!q || `${cs.title} ${cs.client} ${cs.slug}`.toLowerCase().includes(q)),
    );
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [caseStudies, tab, industry, service, query]);

  return (
    <div className="adm-stack">
      <div className="adm-seg" role="tablist" aria-label="Case study sections">
        <Link href="/admin/case-studies/new" className="adm-btn adm-btn-sm adm-seg-empty">
          <IconPlus /> New case study
        </Link>
      </div>

      <div className="adm-filters">
        <label className="adm-search adm-search-wide">
          <span className="sr-only">Search case studies</span>
          <IconSearch />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, client or address…" />
        </label>
        <label className="adm-select-wrap">
          <span className="sr-only">Industry</span>
          <select className="adm-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="">All industries</option>
            {INDUSTRY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="adm-select-wrap">
          <span className="sr-only">Service</span>
          <select className="adm-select" value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">All services</option>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="adm-tabs" role="tablist" aria-label="Filter by status">
        {([["all", "All"], ["published", "Published"], ["draft", "Drafts"]] as [Tab, string][]).map(([k, label]) => (
          <button key={k} type="button" role="tab" className="adm-tab" aria-selected={tab === k} onClick={() => setTab(k)}>
            {label}
            <span className="adm-tab-n">{counts[k]}</span>
          </button>
        ))}
      </div>

      <div className="adm-table">
        {rows.length === 0 ? (
          <div className="adm-empty">
            <IconCaseStudy />
            <h3>{caseStudies.length === 0 ? "No case studies yet" : "No case studies match"}</h3>
            <p>{caseStudies.length === 0 ? "Add your first case study." : "Try a different search, status, industry or service."}</p>
            <Link href="/admin/case-studies/new" className="adm-mini">
              New case study
            </Link>
          </div>
        ) : (
          <ul className="adm-posts">
            {rows.map((cs) => (
              <li key={cs.id} className="adm-post adm-post-cs">
                <Link href={`/admin/case-studies/${cs.id}`} className="adm-post-main" aria-label={`Edit ${cs.title || "untitled case study"}`}>
                  {cs.cover ? <img src={cs.cover} alt="" className="adm-thumb" /> : <span className="adm-thumb adm-thumb-empty" aria-hidden="true" />}
                  <span className="adm-post-title">
                    <strong>{cs.title || "Untitled case study"} {cs.featured && <span className="adm-src adm-src-contact">Featured</span>}</strong>
                    <small>/case-studies/{cs.slug || "…"} · {cs.client || "No client"}</small>
                  </span>
                </Link>
                <span className="adm-post-cat">{cs.industry ? <span className="adm-src adm-src-contact">{INDUSTRY_OPTIONS.find((o) => o.value === cs.industry)?.label ?? cs.industry}</span> : <small className="adm-muted">No industry</small>}</span>
                <span className="adm-post-author">{cs.services.length ? `${cs.services.length} service${cs.services.length === 1 ? "" : "s"}` : "No services"}</span>
                <span className="adm-post-when">
                  <StatusBadge status={cs.status} />
                  <small>Edited {fmtWhen(cs.updatedAt, now)}</small>
                </span>
                <RowMenu cs={cs} onDelete={() => setDel(cs)} />
              </li>
            ))}
          </ul>
        )}
      </div>
      {del && (
        <Dialog
          title="Delete this case study?"
          onClose={() => setDel(null)}
          footer={
            <span className="adm-dlg-foot-btns" style={{ marginLeft: "auto" }}>
              <button type="button" className="adm-mini" onClick={() => setDel(null)}>
                Keep it
              </button>
              <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => { remove(del.id); setDel(null); router.refresh(); }}>
                Delete case study
              </button>
            </span>
          }
        >
          <p className="adm-muted">“{del.title || "Untitled case study"}” will be deleted for good{del.status === "published" ? " and taken off the website" : ""}.</p>
        </Dialog>
      )}
    </div>
  );
}
