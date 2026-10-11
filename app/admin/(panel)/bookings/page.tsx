import type { Metadata } from "next";
import BookingsView from "@/components/admin/BookingsView";

export const metadata: Metadata = { title: "Bookings | TechClues admin" };

export default function Page() {
  return <BookingsView />;
}
