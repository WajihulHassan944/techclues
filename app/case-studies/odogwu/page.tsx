import type { Metadata } from "next";
import OdogwuMarkup from "@/components/OdogwuMarkup";

export const metadata: Metadata = {
  title: "Odogwu Foods Case Study | TechClues",
  description:
    "A custom online grocery store for African and Afro-Caribbean food. Built for UK shoppers, with smart delivery rules.",
  alternates: { canonical: "https://techclues.co.uk/case-studies/odogwu" },
};

export default function Page() {
  return <OdogwuMarkup />;
}
