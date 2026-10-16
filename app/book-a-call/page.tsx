import type { Metadata } from "next";
import BookACallMarkup from "@/components/BookACallMarkup";

export const metadata: Metadata = {
  title: "Free MVP strategy call booking | TechClues",
  description: "Pick a slot for a free 30-minute call about your idea, covering what to validate first and how to get it built.",
  alternates: { canonical: "https://techclues.co.uk/book-a-call" },
};

export default function Page() {
  return <BookACallMarkup />;
}
