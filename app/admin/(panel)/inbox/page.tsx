import type { Metadata } from "next";
import EnquiryList from "@/components/admin/EnquiryList";

export const metadata: Metadata = { title: "Inbox | TechClues admin" };

export default function Page() {
  return <EnquiryList folder="inbox" />;
}
