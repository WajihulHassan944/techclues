import type { Metadata } from "next";
import PrivacyPolicyMarkup from "@/components/PrivacyPolicyMarkup";

export const metadata: Metadata = {
  title: "Privacy Policy | Vebryx",
  description:
    "How Vebryx collects, uses and protects your personal data under UK GDPR and the Data Protection Act 2018.",
  alternates: { canonical: "https://vebryx.co.uk/privacy-policy" },
};

export default function Page() {
  return <PrivacyPolicyMarkup />;
}
