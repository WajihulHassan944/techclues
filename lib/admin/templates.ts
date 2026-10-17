import type { Enquiry, SourceKey } from "./inbox-types";

export const SIGNATURE = "Best wishes,\nTechClues team\ninfo@techclues.co.uk\n+44 7472 411699";

export type Template = { id: string; label: string; body: string; sources?: SourceKey[] };

/** Saved replies. {first} becomes the person's first name. Editable in Settings in a later step. */
export const TEMPLATES: Template[] = [
  { id: "thanks", label: "Thanks, we'll be in touch", body: "Hi {first},\n\nThanks for getting in touch. We've read your message and will come back to you within one working day with next steps." },
  { id: "book-call", label: "Invite to a free call", body: "Hi {first},\n\nThanks for your message. The quickest way to move forward is a free 30-minute call, so we can understand your idea and tell you honestly how we would approach it. You can pick a time that suits you here: https://techclues.co.uk/book-a-call" },
  { id: "estimate", label: "Estimate follow-up", sources: ["calculator"], body: "Hi {first},\n\nThanks for using our cost calculator. The range you saw is a good starting point. If you'd like, we can check it against your real workflow on a free 30-minute call and give you a firmer number: https://techclues.co.uk/book-a-call" },
  { id: "idea", label: "After the idea test", sources: ["kill-my-idea"], body: "Hi {first},\n\nThanks for putting your idea through our test. Before building anything, the cheapest next step is to check whether real people will commit, for example through a waitlist or a small pre-sale. We'd be happy to help you set that up." },
  { id: "grant", label: "Grant support intro", sources: ["grant"], body: "Hi {first},\n\nThanks for your enquiry. We've looked at what you've told us and will check which technology and innovation funding might fit your project. I'll come back to you shortly with the options, and a few follow-up questions." },
  { id: "partner", label: "Partner welcome", sources: ["partner-join", "partner-refer"], body: "Hi {first},\n\nThank you for getting in touch about working together. I'll send over the partner pack with how referrals work, the commission and how we keep you updated. Would a quick call this week suit you?" },
  { id: "careers", label: "Careers acknowledgement", sources: ["careers"], body: "Hi {first},\n\nThanks for applying and for sharing your work. We've received your details and will be in touch if there's a role that fits. We keep every application on file." },
  { id: "not-fit", label: "Not a fit right now", body: "Hi {first},\n\nThank you for thinking of us. After reading your message, I don't think we're the right fit for this at the moment, and I'd rather say so now than waste your time. If your plans change, we'd be glad to hear from you." },
];

export const firstName = (e: Pick<Enquiry, "name">) => e.name.trim().split(/\s+/)[0] || "there";
export const fillTemplate = (t: Template, e: Pick<Enquiry, "name">) => t.body.replace(/\{first\}/g, firstName(e));

/** A template with no sources, or an empty sources list, applies to every enquiry — the latter
 * can happen because the backend stores an unset `sources` as `[]`, not `undefined`. */
export const templateAppliesToEverySource = (t: Pick<Template, "sources">) => !t.sources || t.sources.length === 0;
export const templateMatchesSource = (t: Template, source: SourceKey) => templateAppliesToEverySource(t) || t.sources!.includes(source);
