import type { Metadata } from "next";
import AboutMarkup from "@/components/AboutMarkup";

export const metadata: Metadata = {
  title: "About TechClues | West Midlands MVP Development Studio",
  description:
    "TechClues gets founders to validate their ideas before building, then ships MVPs that grow into real products. Meet the West Midlands studio behind the work.",
  alternates: { canonical: "https://techclues.co.uk/about" },
};

export default function Page() {
  return <AboutMarkup />;
}
