"use client";

import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import { useInbox } from "./InboxProvider";
import { IconPlus } from "./icons";

type Asset = { _id: string; url: string; filename: string; width?: number; height?: number; bytes?: number; altText: string; createdAt: string };

function formatSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary() {
  const { toast } = useInbox();
  const [items, setItems] = useState<Asset[] | null>(null);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = (q = search) => {
    api
      .get<{ items: Asset[]; total: number }>(`/api/admin/media?pageSize=96${q ? `&search=${encodeURIComponent(q)}` : ""}`)
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch(() => {
        setItems([]);
        setTotal(0);
      });
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await api.post("/api/admin/media/upload", undefined, { formData });
        ok += 1;
      } catch (e) {
        toast(e instanceof ApiError ? e.message : `Couldn't upload ${file.name}`);
      }
    }
    if (ok) toast(`Uploaded ${ok} image${ok === 1 ? "" : "s"}`);
    setUploading(false);
    load();
  };

  const remove = (asset: Asset) => {
    if (!confirm(`Delete "${asset.filename}"? This can't be undone.`)) return;
    api
      .delete(`/api/admin/media/${asset._id}`)
      .then(() => setItems((l) => (l ? l.filter((a) => a._id !== asset._id) : l)))
      .catch(() => toast("Couldn't delete that image"));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard?.writeText(url).then(() => toast("URL copied"));
  };

  if (!items) return <div aria-busy="true" />;

  return (
    <section
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        upload(e.dataTransfer.files);
      }}
    >
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Media library</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <input className="adm-input adm-input-sm" placeholder="Search filenames…" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
          <button type="button" className="adm-btn adm-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <IconPlus /> {uploading ? "Uploading…" : "Upload"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
        </div>
      </header>
      <p className="adm-muted" style={{ marginBottom: 16 }}>
        {total} image{total === 1 ? "" : "s"}. Drag and drop files anywhere on this page to upload.
      </p>

      {items.length === 0 ? (
        <div className="adm-empty adm-empty-tight adm-empty-page">
          <h3>No images yet</h3>
          <p>Upload or drop one above.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
          {items.map((a) => (
            <div key={a._id} className="adm-card" style={{ padding: 10 }}>
              <div style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", background: "#f1f0f6" }}>
                <img src={a.url} alt={a.altText || a.filename} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="adm-muted" style={{ fontSize: 12, marginTop: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={a.filename}>
                {a.filename}
              </div>
              <div className="adm-muted" style={{ fontSize: 11, marginTop: 2 }}>
                {a.width && a.height ? `${a.width}×${a.height}` : ""} {formatSize(a.bytes)}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button type="button" className="adm-mini" onClick={() => copyUrl(a.url)}>
                  Copy
                </button>
                <button type="button" className="adm-mini" onClick={() => setEditing(a)}>
                  Alt
                </button>
                <button type="button" className="adm-mini adm-mini-danger" onClick={() => remove(a)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <AltTextDialog
          asset={editing}
          onClose={() => setEditing(null)}
          onSaved={(altText) => {
            setItems((l) => (l ? l.map((a) => (a._id === editing._id ? { ...a, altText } : a)) : l));
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

function AltTextDialog({ asset, onClose, onSaved }: { asset: Asset; onClose: () => void; onSaved: (altText: string) => void }) {
  const { toast } = useInbox();
  const [value, setValue] = useState(asset.altText);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await api.patch(`/api/admin/media/${asset._id}`, { altText: value });
      onSaved(value);
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Couldn't save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-dlg-scrim" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-dlg" role="dialog" aria-modal="true" aria-label="Edit alt text">
        <header className="adm-dlg-head">
          <h2>Alt text — {asset.filename}</h2>
        </header>
        <div className="adm-dlg-body">
          <input className="adm-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="What does this image show?" autoFocus />
        </div>
        <footer className="adm-dlg-foot">
          <div className="adm-dlg-foot-btns">
            <button type="button" className="adm-btn adm-btn-sm" onClick={save} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
            <button type="button" className="adm-mini adm-mini-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
