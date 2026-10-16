import type { Metadata } from "next";
import CalculatorMarkup from "@/components/CalculatorMarkup";

export const metadata: Metadata = {
  title: "UK MVP Cost Calculator | Estimate Your App Build | TechClues",
  description:
    "What will your MVP cost in the UK? Choose a platform, features and pace to get an instant cost and timeline estimate in pounds. Free, and done in four steps.",
  alternates: { canonical: "https://techclues.co.uk/mvp-cost-calculator" },
};

export default function Page() {
  return <CalculatorMarkup />;
}
