import type { Metadata } from "next";
import TermsConditionsMarkup from "@/components/TermsConditionsMarkup";

export const metadata: Metadata = {
  title: "Terms & Conditions | TechClues",
  description:
    "The terms that apply when you use the TechClues website and our technology, consulting, development and support services.",
  alternates: { canonical: "https://techclues.co.uk/terms-conditions" },
};

export default function Page() {
  return <TermsConditionsMarkup />;
}
