import type { Metadata } from "next";
import KillMyIdeaMarkup from "@/components/KillMyIdeaMarkup";

export const metadata: Metadata = {
  title: "Free Startup Idea Validation Tool | Kill My Idea",
  description:
    "Think your idea is brilliant? Give us two minutes to try to kill it. A free stress test of your customer, problem, differentiation, MVP scope and risks.",
  alternates: { canonical: "https://techclues.co.uk/kill-my-idea" },
};

export default function Page() {
  return <KillMyIdeaMarkup />;
}
