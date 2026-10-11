export type SourceKey = "contact" | "calculator" | "kill-my-idea" | "grant" | "partner-refer" | "partner-join" | "zero-one" | "careers";
export type StatusKey = "new" | "replied" | "qualified" | "won" | "lost";
export type Folder = "inbox" | "spam" | "trash";

export const SOURCES: Record<SourceKey, { label: string; page: string }> = {
  contact: { label: "Contact form", page: "/contact" },
  calculator: { label: "Cost calculator", page: "/mvp-cost-calculator" },
  "kill-my-idea": { label: "Kill my idea", page: "/kill-my-idea" },
  grant: { label: "Grant support", page: "/grant-funding" },
  "partner-refer": { label: "Partner: referral", page: "/partners" },
  "partner-join": { label: "Partner: application", page: "/partners" },
  "zero-one": { label: "ZERO.ONE brief", page: "/zero-one" },
  careers: { label: "Careers", page: "/careers" },
};
export const SOURCE_KEYS = Object.keys(SOURCES) as SourceKey[];

export const STATUSES: Record<StatusKey, { label: string }> = {
  new: { label: "New" },
  replied: { label: "Replied" },
  qualified: { label: "Qualified" },
  won: { label: "Won" },
  lost: { label: "Lost" },
};
export const STATUS_KEYS = Object.keys(STATUSES) as StatusKey[];

export type Detail = { label: string; value: string };
export type Message = { id: string; from: "them" | "us"; at: string; body: string };
export type Note = { id: string; at: string; body: string };

export type Enquiry = {
  id: string;
  source: SourceKey;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  /** What the person wrote, or a one-line summary of the form. */
  message: string;
  details: Detail[];
  /** Calculator estimate or idea verdict, shown as a highlighted card. */
  result?: { title: string; headline: string; lines: string[] };
  attachments?: { name: string; size: string }[];
  received: string;
  status: StatusKey;
  folder: Folder;
  read: boolean;
  starred: boolean;
  /** Replies sent from the panel (and any follow-ups from the visitor). */
  thread: Message[];
  notes: Note[];
  draft?: string;
};

export type InboxState = {
  enquiries: Enquiry[];
  blocked: { email: string; at: string }[];
};
