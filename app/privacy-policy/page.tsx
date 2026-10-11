import type { Metadata } from "next";
import PrivacyPolicyMarkup from "@/components/PrivacyPolicyMarkup";

export const metadata: Metadata = {
  title: "Privacy Policy | TechClues",
  description:
    "How TechClues collects, uses and protects your personal data under UK GDPR and the Data Protection Act 2018.",
  alternates: { canonical: "https://techclues.co.uk/privacy-policy" },
};

export default function Page() {
  return <PrivacyPolicyMarkup />;
}
