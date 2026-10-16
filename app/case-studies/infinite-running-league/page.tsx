import type { Metadata } from "next";
import InfiniteRunningLeagueMarkup from "@/components/InfiniteRunningLeagueMarkup";

export const metadata: Metadata = {
  title: "Infinite Running League Case Study | TechClues",
  description:
    "The first platform for a relay running league. Over 1,000 sign-ups before any code was written.",
  alternates: { canonical: "https://techclues.co.uk/case-studies/infinite-running-league" },
};

export default function Page() {
  return <InfiniteRunningLeagueMarkup />;
}
