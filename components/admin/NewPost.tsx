"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useBlog } from "./BlogProvider";

/** Creates an empty draft and opens it in the editor. */
export default function NewPost() {
  const { create } = useBlog();
  const router = useRouter();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    create().then((id) => router.replace(`/admin/blog/${id}`));
  }, [create, router]);
  return <div aria-busy="true" style={{ minHeight: "40vh" }} />;
}
