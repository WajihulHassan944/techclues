import type { Metadata } from "next";
import BlogMvpAiMarkup from "@/components/BlogMvpAiMarkup";

export const metadata: Metadata = {
  title: "MVP Software Development in the Age of AI | TechClues",
  description:
    "Most startups fail because they build too much, too early. MVP software development is how you validate before you commit, and AI tools have made it faster than ever.",
  alternates: { canonical: "https://techclues.co.uk/blog/mvp-software-development-age-of-ai" },
};

export default function Page() {
  return <BlogMvpAiMarkup />;
}
