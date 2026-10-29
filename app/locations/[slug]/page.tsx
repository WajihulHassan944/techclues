import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationPageMarkup from "@/components/site/LocationPageMarkup";
import { UK_LOCATIONS } from "@/lib/data/uk-locations";

export function generateStaticParams() {
  return UK_LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = UK_LOCATIONS.find((l) => l.slug === slug);
  if (!location) return {};
  return {
    title: `Software Development in ${location.name} | TechClues`,
    description: `MVP and custom software development for founders and businesses in ${location.name}, ${location.region}. Fixed-scope pricing, fast delivery, a free strategy call.`,
    alternates: { canonical: `https://techclues.co.uk/locations/${location.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = UK_LOCATIONS.find((l) => l.slug === slug);
  if (!location) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `TechClues — Software Development in ${location.name}`,
    areaServed: { "@type": "City", name: location.name },
    url: `https://techclues.co.uk/locations/${location.slug}`,
    parentOrganization: { "@type": "Organization", name: "TechClues Limited", url: "https://techclues.co.uk" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LocationPageMarkup location={location} all={UK_LOCATIONS} />
    </>
  );
}
