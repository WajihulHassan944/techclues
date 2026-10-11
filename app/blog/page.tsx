import type { Metadata } from "next";
import BlogMarkup from "@/components/BlogMarkup";

export const metadata: Metadata = {
  title: "MVP & Startup Insights | Vebryx Blog",
  description:
    "Practical guides for founders on validating ideas, product strategy and building MVPs that work, from a Glasgow product studio.",
  alternates: { canonical: "https://vebryx.co.uk/blog" },
};

export default function Page() {
  return <BlogMarkup />;
}
