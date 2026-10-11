import type { Metadata } from "next";
import ZeroOneMarkup from "@/components/ZeroOneMarkup";

export const metadata: Metadata = {
  title: "ZERO.ONE | Build & Test Your Core Feature in a Week | Vebryx",
  description:
    "ZERO.ONE by Vebryx: your core feature built and tested with five real users in one week, for £499. An investor-ready prototype and real feedback before you invest in a full MVP.",
  alternates: { canonical: "https://vebryx.co.uk/zero-one" },
};

export default function Page() {
  return <ZeroOneMarkup />;
}
