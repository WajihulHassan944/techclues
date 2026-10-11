import type { Metadata } from "next";
import CareersMarkup from "@/components/CareersMarkup";

export const metadata: Metadata = {
  title: "Careers at TechClues | Product Studio in Birmingham & Rawalpindi",
  description:
    "Work with TechClues, the MVP studio in Birmingham with a production studio in Rawalpindi. See open roles, or send us your details and the work you&#x27;d like to do.",
  alternates: { canonical: "https://techclues.co.uk/careers" },
};

export default function Page() {
  return <CareersMarkup />;
}
