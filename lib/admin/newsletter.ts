export type SubStatus = "subscribed" | "unsubscribed" | "bounced";
export type SubSource = "footer" | "blog" | "manual" | "import" | "contact" | "booking";

export type Subscriber = { id: string; email: string; name?: string; source: SubSource; at: string; status: SubStatus; endedAt?: string };

export const SUB_SOURCES: Record<SubSource, string> = { footer: "Site footer", blog: "Blog page", manual: "Added by hand", import: "Imported", contact: "Contacted us", booking: "Booked a call" };
export const SUB_STATUS: Record<SubStatus, string> = { subscribed: "Subscribed", unsubscribed: "Unsubscribed", bounced: "Bounced" };

export const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

/** Reproducible pseudo-random numbers so the sample list is the same on every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["maya", "oliver", "amelia", "noah", "isla", "leo", "ava", "arthur", "freya", "george", "grace", "harry", "ivy", "jack", "lily", "oscar", "poppy", "theo", "ruby", "sam", "zara", "ethan", "ella", "daniel", "chloe", "ben", "aisha", "tom", "priya", "luca"];
const LAST = ["ellis", "khan", "patel", "walker", "evans", "clark", "turner", "hughes", "morgan", "bell", "cooper", "reid", "shaw", "rahman", "brown", "wood", "murray", "ahmed", "lewis", "ford"];
const DOMAINS = ["gmail.com", "outlook.com", "icloud.com", "proton.me", "yahoo.co.uk", "hotmail.co.uk", "fleetwise.io", "brightpath.co.uk", "northernfreight.co.uk", "studiolane.uk"];

export function seedSubscribers(now: number): Subscriber[] {
  const r = rng(7);
  const out: Subscriber[] = [];
  const used = new Set<string>();
  for (let i = 0; i < 64; i++) {
    let email = "";
    let first = "";
    for (let t = 0; t < 20; t++) {
      first = FIRST[Math.floor(r() * FIRST.length)];
      const last = LAST[Math.floor(r() * LAST.length)];
      email = `${first}.${last}@${DOMAINS[Math.floor(r() * DOMAINS.length)]}`;
      if (!used.has(email)) break;
    }
    used.add(email);
    // More recent sign-ups are a little more common than old ones.
    const days = Math.floor(Math.pow(r(), 1.35) * 118);
    const at = new Date(now - days * 86_400_000 - Math.floor(r() * 80_000_000)).toISOString();
    const source: SubSource = r() < 0.58 ? "footer" : r() < 0.88 ? "blog" : r() < 0.7 ? "manual" : "import";
    const roll = r();
    const status: SubStatus = days < 6 ? "subscribed" : roll < 0.08 ? "unsubscribed" : roll < 0.11 ? "bounced" : "subscribed";
    out.push({
      id: `sub-${1000 + i}`,
      email,
      name: r() < 0.45 ? first[0].toUpperCase() + first.slice(1) : undefined,
      source,
      at,
      status,
      endedAt: status === "subscribed" ? undefined : new Date(new Date(at).getTime() + Math.floor(r() * 20 + 3) * 86_400_000).toISOString(),
    });
  }
  // The address mentioned in the activity log, so the two line up.
  out.push({ id: "sub-2000", email: "maya.ellis@example.com", name: "Maya", source: "manual", at: new Date(now - 30 * 3_600_000).toISOString(), status: "subscribed" });
  return out;
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function subscribersCsv(list: Subscriber[]): string {
  const head = ["Email", "Name", "Source", "Status", "Subscribed on", "Ended on"].join(",");
  const rows = list.map((s) => [s.email, s.name ?? "", SUB_SOURCES[s.source], SUB_STATUS[s.status], s.at.slice(0, 10), s.endedAt?.slice(0, 10) ?? ""].map(csvCell).join(","));
  return [head, ...rows].join("\r\n") + "\r\n";
}

/** Saves text as a file in the browser, with no server involved. */
export function downloadText(filename: string, text: string, type = "text/csv;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
