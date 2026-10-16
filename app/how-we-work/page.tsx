import type { Metadata } from "next";
import HowWeWorkMarkup from "@/components/HowWeWorkMarkup";

export const metadata: Metadata = {
  title: "How We Work | Our 8-Phase Process for MVP Development",
  description:
    "From Ignition to Everest: walk through each phase of building your product with TechClues, covering validation, design, development and launch.",
  alternates: { canonical: "https://techclues.co.uk/how-we-work" },
};

export default function Page() {
  return <HowWeWorkMarkup />;
}
