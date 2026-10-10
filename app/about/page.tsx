import type { Metadata } from "next";
import AboutMarkup from "@/components/AboutMarkup";

export const metadata: Metadata = {
  title: "About Vebryx | MVP Development Studio in Glasgow",
  description:
    "Vebryx helps founders validate ideas before they build, then ship MVPs that grow into real products. Meet the Glasgow studio behind them.",
  alternates: { canonical: "https://vebryx.co.uk/about" },
};

export default function Page() {
  return <AboutMarkup />;
}
