import type { Metadata } from "next";
import PartnersMarkup from "@/components/PartnersMarkup";

export const metadata: Metadata = {
  title: "Partner Referral Programme | Earn 10% Per Introduction",
  description:
    "Refer a client to TechClues and receive 10% of the project fees, capped at £5,000 per referral, paid as the client pays. Open to agencies, freelancers, advisers and past clients.",
  alternates: { canonical: "https://techclues.co.uk/partners" },
};

export default function Page() {
  return <PartnersMarkup />;
}
