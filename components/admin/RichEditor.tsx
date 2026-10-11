"use client";

import Image from "@tiptap/extension-image";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState, type ReactNode } from "react";

const MAX_IMAGE_BYTES = 1_500_000;

function Btn({ label, on, onClick, disabled, children }: { label: string; on?: boolean; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button type="button" className="adm-tb" aria-label={label} title={label} aria-pressed={on ?? false} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      {children}
    </button>
  );
}

const I = ({ d, fill }: { d: string; fill?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="adm-ic" aria-hidden="true">
    <path d={d} />
  </svg>
);

function Toolbar({ editor }: { editor: Editor }) {
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      link: e.isActive("link"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      table: e.isActive("table"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
      href: (e.getAttributes("link").href as string | undefined) ?? "",
    }),
  });
  const [pop, setPop] = useState<null | "link" | "image">(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const openLink = () => {
    setUrl(st.href);
    setPop(pop === "link" ? null : "link");
  };
  const applyLink = () => {
    const href = url.trim();
    if (!href) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : `https://${href}` }).run();
    setPop(null);
  };
  const addImage = (src: string) => {
    editor.chain().focus().setImage({ src, alt: alt.trim() }).run();
    setPop(null);
    setUrl("");
    setAlt("");
    setErr("");
  };
  const onFile = (f?: File) => {
    if (!f) return;
    if (!/^image\//.test(f.type)) return setErr("Choose an image file.");
    if (f.size > MAX_IMAGE_BYTES) return setErr("That image is over 1.5 MB. Use a smaller one.");
    const r = new FileReader();
    r.onload = () => addImage(String(r.result));
    r.readAsDataURL(f);
  };

  return (
    <div className="adm-toolbar" role="toolbar" aria-label="Formatting">
      <Btn label="Heading 2" on={st.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <b>H2</b>
      </Btn>
      <Btn label="Heading 3" on={st.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <b>H3</b>
      </Btn>
      <span className="adm-tb-sep" />
      <Btn label="Bold" on={st.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <b>B</b>
      </Btn>
      <Btn label="Italic" on={st.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i>I</i>
      </Btn>
      <Btn label="Underline" on={st.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <u>U</u>
      </Btn>
      <Btn label="Link" on={st.link} onClick={openLink}>
        <I d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </Btn>
      <span className="adm-tb-sep" />
      <Btn label="Bulleted list" on={st.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <I d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </Btn>
      <Btn label="Numbered list" on={st.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <I d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
      </Btn>
      <Btn label="Quote" on={st.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <I d="M17 6H3M21 12H8M21 18H8M3 12v6" />
      </Btn>
      <span className="adm-tb-sep" />
      <Btn label="Image" onClick={() => { setPop(pop === "image" ? null : "image"); setErr(""); }}>
        <I d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 15l-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
      </Btn>
      <Btn label="Table" on={st.table} onClick={() => (st.table ? editor.chain().focus().deleteTable().run() : editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}>
        <I d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M3 15h18M9 3v18M15 3v18" />
      </Btn>
      <Btn label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <I d="M4 12h16" />
      </Btn>
      <span className="adm-tb-sep" />
      <Btn label="Undo" disabled={!st.canUndo} onClick={() => editor.chain().focus().undo().run()}>
        <I d="M3 7v6h6M3 13a9 9 0 1 0 3-6.7L3 9" />
      </Btn>
      <Btn label="Redo" disabled={!st.canRedo} onClick={() => editor.chain().focus().redo().run()}>
        <I d="M21 7v6h-6M21 13a9 9 0 1 1-3-6.7L21 9" />
      </Btn>

      {pop === "link" && (
        <div className="adm-tbpop" role="dialog" aria-label="Link">
          <label htmlFor="adm-link-url">Link address</label>
          <input id="adm-link-url" className="adm-input adm-input-sm" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… or /services" autoFocus onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyLink())} />
          <span className="adm-tbpop-row">
            <button type="button" className="adm-mini" onClick={applyLink}>
              {st.link && !url.trim() ? "Remove link" : "Apply"}
            </button>
            <button type="button" className="adm-mini adm-mini-ghost" onClick={() => setPop(null)}>
              Cancel
            </button>
          </span>
        </div>
      )}
      {pop === "image" && (
        <div className="adm-tbpop" role="dialog" aria-label="Insert image">
          <label htmlFor="adm-img-alt">Description (alt text)</label>
          <input id="adm-img-alt" className="adm-input adm-input-sm" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="What the image shows" />
          <label htmlFor="adm-img-url">Image address</label>
          <input id="adm-img-url" className="adm-input adm-input-sm" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… or /images/…" />
          <span className="adm-tbpop-row">
            <button type="button" className="adm-mini" disabled={!url.trim()} onClick={() => addImage(url.trim())}>
              Insert from address
            </button>
            <button type="button" className="adm-mini" onClick={() => fileRef.current?.click()}>
              Upload a file
            </button>
            <button type="button" className="adm-mini adm-mini-ghost" onClick={() => setPop(null)}>
              Cancel
            </button>
          </span>
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" aria-label="Upload an image" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
          {err && <small className="adm-err">{err}</small>}
        </div>
      )}
    </div>
  );
}

export default function RichEditor({ initial, onChange, placeholder = "Start writing…" }: { initial: string; onChange: (html: string) => void; placeholder?: string }) {
  const cb = useRef(onChange);
  cb.current = onChange;
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } } }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content: initial,
    editorProps: { attributes: { class: "adm-prose adm-prose-edit", "aria-label": "Article body", role: "textbox", "aria-multiline": "true" } },
    onUpdate: ({ editor: e }) => cb.current(e.isEmpty ? "" : e.getHTML()),
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) return <div className="adm-editor adm-editor-loading" aria-busy="true" />;
  return (
    <div className="adm-editor">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
