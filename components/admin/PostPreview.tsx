"use client";

import { useState } from "react";
import { readMinutes, type Post } from "@/lib/admin/blog-types";
import { fmtKey, dateKey } from "@/lib/admin/tz";
import { useBlog } from "./BlogProvider";
import Dialog from "./Dialog";

/** How the post will read: desktop or phone width. The body is the editor's own HTML. */
export default function PostPreview({ post, onClose }: { post: Post; onClose: () => void }) {
  const { authors } = useBlog();
  const [mobile, setMobile] = useState(false);
  const author = authors.find((a) => a.id === post.authorId)?.name ?? "TechClues team";
  const when = post.publishedAt ?? post.scheduledFor ?? new Date().toISOString();
  return (
    <Dialog
      title="Preview"
      onClose={onClose}
      footer={
        <span className="adm-seg" role="group" aria-label="Preview width">
          <button type="button" className="adm-seg-btn" aria-pressed={!mobile} onClick={() => setMobile(false)}>
            Desktop
          </button>
          <button type="button" className="adm-seg-btn" aria-pressed={mobile} onClick={() => setMobile(true)}>
            Phone
          </button>
        </span>
      }
    >
      <div className="adm-previewframe" data-mobile={mobile}>
        <article className="adm-article">
          <p className="adm-article-meta">
            {post.category && <span className="adm-src adm-src-contact">{post.category}</span>}
            <span>{author}</span>
            <span>{fmtKey(dateKey(when), { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>{readMinutes(post.body)} min read</span>
          </p>
          <h1>{post.title || "Untitled post"}</h1>
          {post.excerpt && <p className="adm-article-lead">{post.excerpt}</p>}
          {post.cover && <img src={post.cover} alt={post.coverAlt} className="adm-article-cover" />}
          <div className="adm-prose" dangerouslySetInnerHTML={{ __html: post.body || "<p><em>Nothing written yet.</em></p>" }} />
        </article>
      </div>
    </Dialog>
  );
}
