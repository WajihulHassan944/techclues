import type { Note } from "./inbox-types";

export type BookingStatus = "confirmed" | "completed" | "cancelled" | "no-show";

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  start: string;
  minutes: number;
  topic: string;
  via: "Book a call" | "ZERO.ONE brief";
  status: BookingStatus;
  createdAt: string;
  meetingLink?: string;
  cancelReason?: string;
  notes: Note[];
  history: { id: string; at: string; text: string }[];
};
