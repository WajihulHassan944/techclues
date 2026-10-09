import type { Metadata } from "next";
import CalculatorMarkup from "@/components/CalculatorMarkup";

export const metadata: Metadata = {
  title: "MVP Cost Calculator UK | Estimate Your App Build | Vebryx",
  description:
    "How much will your MVP cost in the UK? Pick your platform, features and pace for an instant cost and timeline estimate in pounds. Free, in four steps.",
  alternates: { canonical: "https://vebryx.co.uk/mvp-cost-calculator" },
};

export default function Page() {
  return <CalculatorMarkup />;
}
