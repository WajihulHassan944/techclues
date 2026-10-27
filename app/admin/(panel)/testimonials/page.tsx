import type { Metadata } from "next";
import TestimonialManager from "@/components/admin/TestimonialManager";

export const metadata: Metadata = { title: "Testimonials | TechClues admin" };

export default function Page() {
  return <TestimonialManager />;
}
