import type { Metadata } from "next";
import PartnersMarkup from "@/components/PartnersMarkup";

export const metadata: Metadata = {
  title: "Partner Referral Programme | Earn 10% for Introductions",
  description:
    "Introduce a client to Vebryx and earn 10% of the project fees, up to £5,000 a referral, paid as the client pays. For agencies, freelancers, advisers and past clients.",
  alternates: { canonical: "https://vebryx.co.uk/partners" },
};

export default function Page() {
  return <PartnersMarkup />;
}
