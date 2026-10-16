import type { Metadata } from "next";
import CaseStudiesMarkup from "@/components/CaseStudiesMarkup";

export const metadata: Metadata = {
  title: "Case Studies | MVPs & Products TechClues Has Built",
  description:
    "See how TechClues supported founders to validate, design and launch real products, ranging from a relay running league to dental practice software.",
  alternates: { canonical: "https://techclues.co.uk/case-studies" },
};

export default function Page() {
  return <CaseStudiesMarkup />;
}
