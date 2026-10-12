"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import { IconInbox, IconSearch } from "./icons";

type SearchItem = { id: string; title: string; subtitle: string; slug?: string };
type SearchResult = { enquiries: SearchItem[]; bookings: SearchItem[]; subscribers: SearchItem[]; posts: SearchItem[] };

const GROUPS: { key: keyof SearchResult; label: string; href: (item: SearchItem) => string }[] = [
  { key: "enquiries", label: "Enquiries", href: (i) => `/admin/inbox/${i.id}` },
  { key: "bookings", label: "Bookings", href: () => `/admin/bookings` },
  { key: "subscribers", label: "Subscribers", href: () => `/admin/newsletter` },
  { key: "posts", label: "Blog posts", href: (i) => `/admin/blog/${i.id}` },
];

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const flat = result ? GROUPS.flatMap((g) => result[g.key].map((item) => ({ item, group: g }))) : [];

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResult(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => {
      api
        .get<SearchResult>(`/api/admin/search?q=${encodeURIComponent(q)}`)
        .then((r) => {
          setResult(r);
          setActive(0);
        })
        .catch(() => setResult({ enquiries: [], bookings: [], subscribers: [], posts: [] }))
        .finally(() => setLoading(false));
    }, 280);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (item: SearchItem, group: (typeof GROUPS)[number]) => {
    router.push(group.href(item));
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!flat.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = flat[active];
      if (picked) go(picked.item, picked.group);
    }
  };

  const hasAny = result && GROUPS.some((g) => result[g.key].length > 0);

  return (
    <div ref={wrapRef} className="adm-pop-wrap" style={{ flex: "0 1 auto" }}>
      <label className="adm-search">
        <span className="sr-only">Search the admin panel</span>
        <IconSearch />
        <input
          type="search"
          placeholder="Search enquiries, posts, people…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
      </label>
      {open && query.trim() && (
        <div className="adm-pop adm-search-pop" role="listbox">
          {loading ? (
            <p className="adm-pop-empty">Searching…</p>
          ) : !hasAny ? (
            <div className="adm-pop-empty">
              <IconInbox />
              Nothing matches &ldquo;{query.trim()}&rdquo;.
            </div>
          ) : (
            GROUPS.filter((g) => result![g.key].length > 0).map((g) => (
              <div key={g.key}>
                <p className="adm-pop-head" style={{ paddingBottom: 2 }}>
                  {g.label}
                </p>
                {result![g.key].map((item) => {
                  const i = flat.findIndex((f) => f.item === item && f.group === g);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      className="adm-pop-item"
                      style={i === active ? { background: "rgb(14 15 49 / 0.05)" } : undefined}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(item, g)}
                    >
                      <span style={{ overflow: "hidden" }}>
                        <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</strong>
                        <small style={{ color: "var(--color-muted)" }}>{item.subtitle}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
