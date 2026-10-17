import type { Metadata } from "next";
import ContactMarkup from "@/components/ContactMarkup";

export const metadata: Metadata = {
  title: "Contact TechClues | Book Your Free MVP Strategy Call",
  description:
    "Tell TechClues about your idea. Book a free strategy call, send us an email or drop in at our Birmingham headquarters on Hazelville Road.",
  alternates: { canonical: "https://techclues.co.uk/contact" },
};

export default function Page() {
  return <ContactMarkup />;
}
