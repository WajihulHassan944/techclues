"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCaseStudies } from "./CaseStudyProvider";

/** Creates an empty draft and opens it in the editor. */
export default function NewCaseStudy() {
  const { create } = useCaseStudies();
  const router = useRouter();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    create().then((id) => router.replace(`/admin/case-studies/${id}`));
  }, [create, router]);
  return <div aria-busy="true" style={{ minHeight: "40vh" }} />;
}
