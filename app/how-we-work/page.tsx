import type { Metadata } from "next";
import HowWeWorkMarkup from "@/components/HowWeWorkMarkup";

export const metadata: Metadata = {
  title: "How We Work | Our 8-Phase MVP Development Process",
  description:
    "From Ignition to Everest: see every phase of building your product with TechClues, from validation and design to development and launch.",
  alternates: { canonical: "https://techclues.co.uk/how-we-work" },
};

export default function Page() {
  return <HowWeWorkMarkup />;
}
