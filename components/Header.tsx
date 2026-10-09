import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { navLinks } from "@/lib/data";

export function Header() {
  return (
    <header className="relative z-50">
      <div className="mx-auto flex h-28 max-w-[1320px] items-center justify-between px-5 sm:px-0">
        <Logo />
        <nav className="hidden items-center gap-1 rounded-full border border-line bg-paper px-5 py-[27px] lg:flex" style={{ height: 56, paddingTop: 0, paddingBottom: 0 }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-4 text-base text-ink transition-colors hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>
        <Button href="/book-a-call" className="hidden !h-[52px] sm:inline-flex">Start your project</Button>
        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-line px-5 py-2.5 text-sm">Menu</summary>
          <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-line bg-white p-4 shadow-xl">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-ice">{l.label}</Link>
            ))}
            <Button href="/book-a-call" className="mt-3 w-full">Start your project</Button>
          </div>
        </details>
      </div>
    </header>
  );
}
