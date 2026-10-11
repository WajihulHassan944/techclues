import type { Metadata } from "next";
import GrantFundingMarkup from "@/components/GrantFundingMarkup";

export const metadata: Metadata = {
  title: "Grant Application Support for UK Tech Projects | TechClues",
  description:
    "Planning a website, software platform, automation or AI project without the full budget? TechClues checks what technology and innovation funding could support it, and prepares the grant application.",
  alternates: { canonical: "https://techclues.co.uk/grant-funding" },
};

export default function Page() {
  return <GrantFundingMarkup />;
}
