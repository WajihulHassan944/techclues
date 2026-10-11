import type { Metadata } from "next";
import BookACallMarkup from "@/components/BookACallMarkup";

export const metadata: Metadata = {
  title: "Book a free MVP strategy call | TechClues",
  description: "Choose a time for a free 30-minute call about your idea: what to validate first, and how to get it built.",
  alternates: { canonical: "https://techclues.co.uk/book-a-call" },
};

export default function Page() {
  return <BookACallMarkup />;
}
