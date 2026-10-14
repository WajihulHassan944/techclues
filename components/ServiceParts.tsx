/* Small building blocks shared by the newer service pages. */
export const SEC = "py-[clamp(56px,7vw,110px)]";
export const WRAP = "mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]";
export const rv = (d = "0s") => ({ "--reveal-delay": d, "--reveal-y": "28px" }) as React.CSSProperties;

export const Arrow = ({ className = "size-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const Eyebrow = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`flex items-center gap-2 text-[14px] font-medium ${light ? "text-white/60" : "text-muted"}`}>
    <span className="size-1.5 rounded-full bg-brand" />
    {children}
  </p>
);

export const H2 = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <h2 className={`mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] ${light ? "text-white" : "text-ink"}`}>{children}</h2>
);
