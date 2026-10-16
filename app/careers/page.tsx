import type { Metadata } from "next";
import CareersMarkup from "@/components/CareersMarkup";

export const metadata: Metadata = {
  title: "Careers at TechClues | West Midlands & Islamabad Product Studio",
  description:
    "Join TechClues, the West Midlands MVP studio with a production studio in Islamabad. Browse open roles, or tell us about yourself and the work you&#x27;d like to take on.",
  alternates: { canonical: "https://techclues.co.uk/careers" },
};

export default function Page() {
  return <CareersMarkup />;
}
