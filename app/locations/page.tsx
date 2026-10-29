import type { Metadata } from "next";
import { UK_LOCATIONS } from "@/lib/data/uk-locations";

export const metadata: Metadata = {
  title: "Software Development Across the UK | TechClues Locations",
  description:
    "TechClues builds MVPs and custom software for founders and businesses across the UK — find your city or region below.",
  alternates: { canonical: "https://techclues.co.uk/locations" },
};

export default function Page() {
  const byNation = UK_LOCATIONS.reduce<Record<string, typeof UK_LOCATIONS>>((acc, l) => {
    (acc[l.nation] ||= []).push(l);
    return acc;
  }, {});

  return (
    <main>
      <header className="pb-8 pt-[124px] sm:pt-[150px] lg:pt-[170px]">
        <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
          <h1 className="max-w-[1050px] text-[clamp(2.2rem,4.6vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.045em] text-ink">
            Software development, wherever you&apos;re building from
          </h1>
          <p className="mt-5 max-w-[720px] text-[19px] leading-relaxed text-ink-soft">
            We&apos;re a remote-first studio based in Birmingham, working with founders and teams across the UK.
            Find your city below for details on how we work with businesses in your area.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1680px] px-5 py-[clamp(40px,5vw,80px)] sm:px-8 lg:px-[60px]">
        {Object.entries(byNation).map(([nation, locations]) => (
          <section key={nation} className="mb-14">
            <h2 className="mb-5 text-[13px] font-medium uppercase tracking-[0.12em] text-muted">{nation}</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
              {locations.map((l) => (
                <li key={l.slug}>
                  <a href={`/locations/${l.slug}`} className="text-[16px] text-ink-soft transition-colors hover:text-ink">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
