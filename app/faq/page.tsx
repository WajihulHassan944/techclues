import type { Metadata } from "next";
import FaqMarkup from "@/components/FaqMarkup";

export const metadata: Metadata = {
  title: "FAQ | Costs, Timelines & How We Work | TechClues",
  description:
    "Straight answers to what founders really ask: the cost of an MVP, how long it takes, who owns the code, how we use AI, and what comes after launch.",
  alternates: { canonical: "https://techclues.co.uk/faq" },
};

export default function Page() {
  return <FaqMarkup />;
}
