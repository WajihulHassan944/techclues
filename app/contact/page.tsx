import type { Metadata } from "next";
import ContactMarkup from "@/components/ContactMarkup";

export const metadata: Metadata = {
  title: "Contact TechClues | Book a Free MVP Strategy Call",
  description:
    "Talk to TechClues about your idea. Book a free strategy call, email us or visit our West Midlands headquarters at Hazelville Road.",
  alternates: { canonical: "https://techclues.co.uk/contact" },
};

export default function Page() {
  return <ContactMarkup />;
}
