import type { Metadata } from "next";
import CaseStudiesMarkup from "@/components/CaseStudiesMarkup";

export const metadata: Metadata = {
  title: "Case Studies | MVPs & Products Built by Vebryx",
  description:
    "How Vebryx helped founders validate, design and launch real products, from a relay running league to dental practice software.",
  alternates: { canonical: "https://vebryx.co.uk/case-studies" },
};

export default function Page() {
  return <CaseStudiesMarkup />;
}
