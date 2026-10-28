"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import Dialog from "./Dialog";
import { IconPlus } from "./icons";

type Asset = { _id: string; url: string; filename: string; altText: string };

/** A dialog for picking an existing image from the shared media library, or uploading a new
 *  one on the spot. Reusable from any editor that has an image field. */
export default function MediaPickerDialog({ onClose, onSelect }: { onClose: () => void; onSelect: (url: string, altText?: string) => void }) {
  const [items, setItems] = useState<Asset[] | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = (q = search) => {
    api
      .get<{ items: Asset[] }>(`/api/admin/media?pageSize=60${q ? `&search=${encodeURIComponent(q)}` : ""}`)
      .then((res) => setItems(res.items))
      .catch(() => setItems([]));
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const asset = await api.post<Asset>("/api/admin/media/upload", undefined, { formData });
      onSelect(asset.url, asset.altText);
      onClose();
    } catch {
      // ignore — the upload-failed state just leaves the picker open
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog title="Choose an image" onClose={onClose}>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input className="adm-input adm-input-sm" placeholder="Search filenames…" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
        <button type="button" className="adm-mini" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <IconPlus /> {uploading ? "Uploading…" : "Upload new"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      {!items ? (
        <div aria-busy="true" />
      ) : items.length === 0 ? (
        <div className="adm-empty adm-empty-tight adm-empty-page">
          <h3>No images yet</h3>
          <p>Upload one above.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, maxHeight: "50vh", overflowY: "auto" }}>
          {items.map((a) => (
            <button
              key={a._id}
              type="button"
              onClick={() => {
                onSelect(a.url, a.altText);
                onClose();
              }}
              style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(14,15,49,0.1)", padding: 0, cursor: "pointer" }}
              title={a.filename}
            >
              <img src={a.url} alt={a.altText || a.filename} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </Dialog>
  );
}
