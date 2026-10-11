import type { Metadata } from "next";
import BlogMvpCostMarkup from "@/components/BlogMvpCostMarkup";

export const metadata: Metadata = {
  title: "MVP Cost in UK and How Much Startups Should Budget | TechClues",
  description:
    "Find out the MVP cost in UK and what drives the price. Learn the hidden costs founders miss and how to spend less. Get an instant estimate.",
  alternates: { canonical: "https://techclues.co.uk/blog/mvp-cost-uk" },
};

export default function Page() {
  return <BlogMvpCostMarkup />;
}
