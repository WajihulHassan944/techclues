import type { Metadata } from "next";
import PrivacyPolicyMarkup from "@/components/PrivacyPolicyMarkup";

export const metadata: Metadata = {
  title: "Privacy Policy | TechClues",
  description:
    "Find out how TechClues gathers, uses and safeguards your personal data in line with UK GDPR and the Data Protection Act 2018.",
  alternates: { canonical: "https://techclues.co.uk/privacy-policy" },
};

export default function Page() {
  return <PrivacyPolicyMarkup />;
}
