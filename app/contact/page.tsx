import type { Metadata } from "next";
import ContactMarkup from "@/components/ContactMarkup";

export const metadata: Metadata = {
  title: "Contact Vebryx | Book a Free MVP Strategy Call",
  description:
    "Talk to Vebryx about your idea. Book a free strategy call, email us or visit our Glasgow headquarters at Plantation Square.",
  alternates: { canonical: "https://vebryx.co.uk/contact" },
};

export default function Page() {
  return <ContactMarkup />;
}
