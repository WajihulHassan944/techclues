import type { Post } from "@/lib/admin/blog-types";

export function StatusBadge({ post }: { post: Pick<Post, "status"> }) {
  return <span className={`adm-pstatus adm-pstatus-${post.status}`}>{post.status === "draft" ? "Draft" : post.status === "scheduled" ? "Scheduled" : "Published"}</span>;
}
