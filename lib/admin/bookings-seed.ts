import { addDays, dateKey, zoned } from "./tz";
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

/** Sample calls, relative to today so there is always something upcoming. */
export function seedBookings(now: number): Booking[] {
  const today = dateKey(now);
  const at = (days: number, h: number, m: number) => zoned(addDays(today, days), h * 60 + m).toISOString();
  const ago = (min: number) => new Date(now - min * 60_000).toISOString();
  const soon = new Date(now + 150 * 60_000);
  soon.setUTCMinutes(soon.getUTCMinutes() < 30 ? 30 : 60, 0, 0);
  const b = (id: string, name: string, email: string, company: string | undefined, start: string, topic: string, via: Booking["via"], status: Booking["status"], created: number, extra: Partial<Booking> = {}): Booking => ({
    id, name, email, company, start, minutes: 30, topic, via, status, createdAt: ago(created), notes: [], history: [{ id: `${id}-h0`, at: ago(created), text: `Booked on the website (${via})` }], ...extra,
  });
  return [
    b("bk-2001", "Aisha Rahman", "aisha@rahmanandco.co.uk", "Rahman & Co Accountants", soon.toISOString(), "Partner introduction", "Book a call", "confirmed", 2600, { phone: "+44 7700 900117" }),
    b("bk-2002", "James Carter", "james@northernfreight.co.uk", "Northern Freight", at(1, 11, 0), "Shipment tracking portal: scoping", "Book a call", "confirmed", 3800, { phone: "+44 7766 301288", notes: [{ id: "bn-1", at: ago(3700), body: "Decision maker. Bring the dispatch-system integration questions." }] }),
    b("bk-2003", "Hannah Lee", "hannah@fitloop.app", "FitLoop", at(1, 15, 30), "ZERO.ONE scope call", "ZERO.ONE brief", "confirmed", 1400, { phone: "+44 7488 220915" }),
    b("bk-2004", "Sarah Whitfield", "sarah@brightpathtutoring.co.uk", "Brightpath Tutoring", at(2, 10, 0), "MVP strategy call", "Book a call", "confirmed", 55),
    b("bk-2005", "Daniel Okafor", "daniel@fleetwise.io", "Fleetwise", at(4, 14, 0), "Estimate review", "Book a call", "confirmed", 40, { phone: "+44 7700 900412" }),
    b("bk-2006", "Marcus Doyle", "marcus@doylefabrication.co.uk", "Doyle Fabrication Ltd", at(6, 9, 30), "Automation and grant options", "Book a call", "confirmed", 170),
    b("bk-2007", "Olivia Brennan", "olivia@greenpathcic.org", "Greenpath CIC", at(9, 16, 0), "Volunteer platform ideas", "Book a call", "confirmed", 6900),
    b("bk-2008", "Emily Zhang", "emily@lumenhealth.co", "Lumen Health", at(-1, 10, 0), "Patient intake app", "Book a call", "completed", 5600, { notes: [{ id: "bn-2", at: ago(1300), body: "Sent proposal. Follow up Friday." }] }),
    b("bk-2009", "Ben Taylor", "ben@oddsocksclub.com", "Odd Socks Club", at(-3, 12, 30), "Proposal walkthrough", "Book a call", "completed", 12000),
    b("bk-2010", "Rahul Mehta", "rahul@spliteasy.in", undefined, at(-2, 14, 0), "ZERO.ONE scope call", "ZERO.ONE brief", "no-show", 8600),
    b("bk-2011", "Tom Gallagher", "tom@pixelandpine.studio", "Pixel & Pine", at(3, 11, 30), "Referral partner catch-up", "Book a call", "cancelled", 1600, { cancelReason: "Visitor asked to cancel", history: [{ id: "bk-2011-h0", at: ago(1600), text: "Booked on the website (Book a call)" }, { id: "bk-2011-h1", at: ago(300), text: "Cancelled: Visitor asked to cancel" }] }),
  ];
}
