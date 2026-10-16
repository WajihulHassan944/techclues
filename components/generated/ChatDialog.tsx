"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api/client";

const TOPICS = ["A new product or MVP", "An existing product", "Design or branding", "AI features", "Something else"];

/** Chat widget enquiry form. Markup matches the saved homepage design exactly; now submits to the real API. */
export default function ChatDialog() {
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const canSubmit = name.trim() && email.trim() && message.trim();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setError("");
    try {
      await api.post("/api/public/chat", { topic: topic || undefined, name, email, phone: phone || undefined, message, website }, { auth: false });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "That did not go through. Please try once more.");
    }
  };

  return (
    <>
<div role="dialog" aria-label="Send TechClues an enquiry" className="fixed z-[60] flex origin-bottom-right flex-col overflow-hidden bg-white shadow-[0_40px_90px_-30px_rgba(14,15,49,0.45)] inset-x-3 bottom-3 top-20 rounded-[24px] sm:inset-x-auto sm:bottom-28 sm:right-8 sm:top-auto sm:h-[600px] sm:max-h-[calc(100dvh-160px)] sm:w-[400px] sm:rounded-[26px]" style={{opacity: 1, transform: "none"}}><div className="relative isolate z-10 shrink-0 overflow-hidden bg-ink px-5 py-4 text-white"><span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(130%_130%_at_100%_0%,#0064ff_0%,rgba(0,100,255,0)_58%),linear-gradient(135deg,#0e0f31,#0a1f6b)]"></span><div className="flex items-center justify-between gap-3"><div><p className="text-[15px] font-medium leading-tight">Describe what you are after</p><p className="mt-0.5 text-[12.5px] text-white/65">Expect an answer within a few hours</p></div><button type="button" aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x size-4" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button></div></div><div className="relative min-h-0 flex-1 bg-paper"><div data-lenis-prevent="true" className="chat-scroll h-full overflow-y-auto overscroll-contain px-5 py-5">
{status === "success" ? (
  <div className="rounded-2xl bg-[#f1f0f6] p-6 text-center" role="status">
    <p className="text-[16px] font-medium text-ink">Thank you, your message has arrived.</p>
    <p className="mt-2 text-[13.5px] text-ink-soft">Expect a reply within a few hours.</p>
  </div>
) : (
<form data-form="chat" data-clarity-mask="True" onSubmit={submit} className="space-y-5"><div><p className="text-[13px] text-muted">What is this regarding?</p><div className="mt-2.5 flex flex-wrap gap-2">{TOPICS.map((t) => (<button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(topic === t ? "" : t)} className={`rounded-full border px-3.5 py-2 text-[13.5px] transition-colors duration-300 ${topic === t ? "border-brand bg-brand text-white" : "border-ink/12 bg-white text-ink-soft hover:border-brand/40 hover:text-ink"}`}>{t}</button>))}</div></div><label className="block"><span className="text-[13px] text-muted">Full name</span><input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-ink/12 bg-white px-3.5 text-[15px] text-ink transition-colors placeholder:text-ink/30 focus:border-brand focus:outline-none" type="text" /></label><label className="block"><span className="text-[13px] text-muted">Email</span><input autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-ink/12 bg-white px-3.5 text-[15px] text-ink transition-colors placeholder:text-ink/30 focus:border-brand focus:outline-none" type="email" /></label><label className="block"><span className="text-[13px] text-muted">Phone number (optional)</span><input autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-ink/12 bg-white px-3.5 text-[15px] text-ink transition-colors placeholder:text-ink/30 focus:border-brand focus:outline-none" type="tel" /></label><label className="block"><span className="text-[13px] text-muted">What are you creating?</span><textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="One or two sentences will do." className="mt-2 w-full resize-none rounded-2xl border border-ink/12 bg-white px-3.5 py-3 text-[15px] leading-relaxed text-ink transition-colors placeholder:text-ink/30 focus:border-brand focus:outline-none"></textarea></label><input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />{status === "error" && (<p role="alert" className="rounded-xl bg-[#fdecec] px-3.5 py-2.5 text-[13px] text-[#b42318]">{error}</p>)}<button type="submit" disabled={!canSubmit || status === "submitting"} className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-white transition-colors duration-300 enabled:hover:bg-brand disabled:opacity-45">{status === "submitting" ? "Sending…" : "Submit enquiry"}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send size-4 transition-transform duration-300 group-enabled:group-hover:translate-x-0.5" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg></button><p className="text-center text-[12px] text-muted">Your details are used only to respond. No newsletters or mailing lists.</p></form>
)}
</div><div className="pointer-events-none absolute right-1.5 top-2 bottom-2 w-1.5"><div role="presentation" className="pointer-events-auto w-full cursor-grab rounded-full bg-ink/30 transition-colors duration-200 hover:bg-ink/55 active:cursor-grabbing active:bg-ink" style={{transform: "translateY(0px)", height: "355px"}}></div></div></div></div>
    </>
  );
}
