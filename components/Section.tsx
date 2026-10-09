export function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">{children}</p>;
}

export function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">{children}</h2>;
}
