export type Booking = {
  id: string;
  name: string;
  email: string;
  company?: string;
  start: string;
  minutes: number;
  topic: string;
  via: "Book a call" | "ZERO.ONE brief";
  status: "confirmed" | "completed";
};

/** Sample calls, relative to today so the dashboard always has something upcoming. */
export function seedBookings(now: number): Booking[] {
  const at = (days: number, h: number, m: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  const soon = new Date(now + 150 * 60_000);
  soon.setMinutes(soon.getMinutes() < 30 ? 30 : 60, 0, 0);
  const b = (id: string, name: string, email: string, company: string | undefined, start: string, topic: string, via: Booking["via"], status: Booking["status"] = "confirmed"): Booking => ({ id, name, email, company, start, minutes: 30, topic, via, status });
  return [
    b("bk-2001", "Aisha Rahman", "aisha@rahmanandco.co.uk", "Rahman & Co Accountants", soon.toISOString(), "Partner introduction", "Book a call"),
    b("bk-2002", "James Carter", "james@northernfreight.co.uk", "Northern Freight", at(1, 11, 0), "Shipment tracking portal: scoping", "Book a call"),
    b("bk-2003", "Hannah Lee", "hannah@fitloop.app", "FitLoop", at(1, 15, 30), "ZERO.ONE scope call", "ZERO.ONE brief"),
    b("bk-2004", "Sarah Whitfield", "sarah@brightpathtutoring.co.uk", "Brightpath Tutoring", at(2, 10, 0), "MVP strategy call", "Book a call"),
    b("bk-2005", "Daniel Okafor", "daniel@fleetwise.io", "Fleetwise", at(4, 14, 0), "Estimate review", "Book a call"),
    b("bk-2006", "Marcus Doyle", "marcus@doylefabrication.co.uk", "Doyle Fabrication Ltd", at(6, 9, 30), "Automation and grant options", "Book a call"),
    b("bk-2007", "Olivia Brennan", "olivia@greenpathcic.org", "Greenpath CIC", at(9, 16, 0), "Volunteer platform ideas", "Book a call"),
    b("bk-2008", "Emily Zhang", "emily@lumenhealth.co", "Lumen Health", at(-1, 10, 0), "Patient intake app", "Book a call", "completed"),
    b("bk-2009", "Ben Taylor", "ben@oddsocksclub.com", "Odd Socks Club", at(-3, 12, 30), "Proposal walkthrough", "Book a call", "completed"),
  ];
}
