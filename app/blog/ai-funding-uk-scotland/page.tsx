import type { Metadata } from "next";
import BlogAiFundingMarkup from "@/components/BlogAiFundingMarkup";

export const metadata: Metadata = {
  title: "AI Funding for UK & Scottish Businesses (2026) | TechClues",
  description:
    "What&#x27;s actually open to UK and Scottish businesses that want to use AI, including Scotland&#x27;s AI adoption programme, what&#x27;s paused, and how to plan a project that doesn&#x27;t depend on a grant.",
  alternates: { canonical: "https://techclues.co.uk/blog/ai-funding-uk-scotland" },
};

export default function Page() {
  return <BlogAiFundingMarkup />;
}
