import type { Metadata } from "next";
import ZeroOneMarkup from "@/components/ZeroOneMarkup";

export const metadata: Metadata = {
  title: "ZERO.ONE | Build & Test Your Core Feature in a Week | TechClues",
  description:
    "ZERO.ONE by TechClues: your core feature built and tested with five real users in one week, for £499. An investor-ready prototype and real feedback before you invest in a full MVP.",
  alternates: { canonical: "https://techclues.co.uk/zero-one" },
};

export default function Page() {
  return <ZeroOneMarkup />;
}
