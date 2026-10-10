import type { Metadata } from "next";
import FaqMarkup from "@/components/FaqMarkup";

export const metadata: Metadata = {
  title: "FAQ | Costs, Timelines & How We Build | Vebryx",
  description:
    "Answers to the questions founders actually ask: what an MVP costs, how long it takes, who owns the code, how we use AI, and what happens after launch.",
  alternates: { canonical: "https://vebryx.co.uk/faq" },
};

export default function Page() {
  return <FaqMarkup />;
}
