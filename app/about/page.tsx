import type { Metadata } from "next";
import AboutMarkup from "@/components/AboutMarkup";

export const metadata: Metadata = {
  title: "About TechClues | MVP Development Studio in Birmingham",
  description:
    "TechClues helps founders validate ideas before they build, then ship MVPs that grow into real products. Meet the Birmingham studio behind them.",
  alternates: { canonical: "https://techclues.co.uk/about" },
};

export default function Page() {
  return <AboutMarkup />;
}
