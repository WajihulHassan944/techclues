import type { Metadata } from "next";
import ZeroOneMarkup from "@/components/ZeroOneMarkup";

export const metadata: Metadata = {
  title: "BUILD.ONE | Core Feature Built and Tested in One Week | TechClues",
  description:
    "BUILD.ONE by TechClues: in a single week we build your core feature and put it in front of five real users, for £499. You get a prototype investors can take seriously, plus genuine feedback, before committing to a full MVP.",
  alternates: { canonical: "https://techclues.co.uk/zero-one" },
};

export default function Page() {
  return <ZeroOneMarkup />;
}
