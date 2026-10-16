import type { Metadata } from "next";
import KillMyIdeaMarkup from "@/components/KillMyIdeaMarkup";

export const metadata: Metadata = {
  title: "Kill My Idea | Free Tool to Validate Your Startup Idea",
  description:
    "Sure your idea is brilliant? Spare two minutes and we will try to kill it. A free stress test covering your customer, problem, differentiation, MVP scope and risks.",
  alternates: { canonical: "https://techclues.co.uk/kill-my-idea" },
};

export default function Page() {
  return <KillMyIdeaMarkup />;
}
