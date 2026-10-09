import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white">T</span>
      <span className={`text-[22px] font-medium uppercase tracking-wide transition-opacity group-hover:opacity-80 ${light ? "text-white" : "text-ink"}`}>
        Techclues
      </span>
    </Link>
  );
}
