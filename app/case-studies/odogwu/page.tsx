import type { Metadata } from "next";
import OdogwuMarkup from "@/components/OdogwuMarkup";

export const metadata: Metadata = {
  title: "Odogwu Foods Case Study | TechClues",
  description:
    "A bespoke online grocery store selling African and Afro-Caribbean food, made for UK shoppers and featuring intelligent delivery rules.",
  alternates: { canonical: "https://techclues.co.uk/case-studies/odogwu" },
};

export default function Page() {
  return <OdogwuMarkup />;
}
