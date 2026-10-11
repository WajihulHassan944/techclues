"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api/client";

/** Footer newsletter signup. Markup matches the original static form exactly. */
export default function NewsletterFooterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await api.post<{ ok: boolean; error?: string }>(
        "/api/public/newsletter/subscribe",
        { email },
        { auth: false },
      );
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setError(res.error ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "sent") {
    return (
      <p role="status" className="border-t border-white/20 pt-6 text-[17px] text-white">
        Thanks — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form data-form="newsletter" data-clarity-mask="True" onSubmit={submit} className="group/form relative flex items-center gap-4 border-t border-white/20 pt-6">
      <label htmlFor="newsletter-email" className="sr-only">
        Your email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email"
        className="w-0 min-w-0 flex-1 bg-transparent text-[17px] text-white placeholder:text-white/45 focus:outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" aria-label="Subscribe" disabled={status === "sending"} className="grid size-14 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-ink disabled:opacity-60">
        <span style={{ opacity: 1, transform: "none" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-5" aria-hidden="true">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </span>
      </button>
      <span className="absolute left-0 top-0 h-px w-0 bg-brand-soft transition-all duration-500 group-focus-within/form:w-full"></span>
      {status === "error" && (
        <span role="alert" className="absolute -bottom-6 left-0 text-[13px] text-[#ff8a8a]">
          {error}
        </span>
      )}
    </form>
  );
}
