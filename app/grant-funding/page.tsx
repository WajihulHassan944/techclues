import type { Metadata } from "next";
import GrantFundingMarkup from "@/components/GrantFundingMarkup";

export const metadata: Metadata = {
  title: "Help Applying for Grants for UK Tech Projects | TechClues",
  description:
    "Want to build a website, software platform, automation or AI project but lack the full budget? TechClues looks into which technology and innovation funding could back it, then writes the grant application.",
  alternates: { canonical: "https://techclues.co.uk/grant-funding" },
};

export default function Page() {
  return <GrantFundingMarkup />;
}
