import type { Metadata } from "next";
import CaseStudiesMarkup from "@/components/CaseStudiesMarkup";

export const metadata: Metadata = {
  title: "Case Studies | MVPs & Products Built by TechClues",
  description:
    "How TechClues helped founders validate, design and launch real products, from a relay running league to dental practice software.",
  alternates: { canonical: "https://techclues.co.uk/case-studies" },
};

export default function Page() {
  return <CaseStudiesMarkup />;
}
