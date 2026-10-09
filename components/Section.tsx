export function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-[1320px] px-5 sm:px-0">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-base font-medium text-brand">{children}</p>;
}

export function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-4xl font-normal leading-[1.04] tracking-[-0.04em] sm:text-6xl">{children}</h2>;
}
