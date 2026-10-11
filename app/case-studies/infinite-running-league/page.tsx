import type { Metadata } from "next";
import InfiniteRunningLeagueMarkup from "@/components/InfiniteRunningLeagueMarkup";

export const metadata: Metadata = {
  title: "Infinite Running League Case Study | TechClues",
  description:
    "The first relay running league platform. 1,000+ sign-ups before a line of code.",
  alternates: { canonical: "https://techclues.co.uk/case-studies/infinite-running-league" },
};

export default function Page() {
  return <InfiniteRunningLeagueMarkup />;
}
