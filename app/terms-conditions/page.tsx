import type { Metadata } from "next";
import TermsConditionsMarkup from "@/components/TermsConditionsMarkup";

export const metadata: Metadata = {
  title: "Terms & Conditions | Vebryx",
  description:
    "The terms governing your use of the Vebryx website and our technology, consulting, development and support services.",
  alternates: { canonical: "https://vebryx.co.uk/terms-conditions" },
};

export default function Page() {
  return <TermsConditionsMarkup />;
}
