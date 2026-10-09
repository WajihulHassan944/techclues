import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { navLinks } from "@/lib/data";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-ink-soft transition-colors hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>
        <Button href="/book-a-call" className="hidden sm:inline-flex">Start your project</Button>
        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-line px-4 py-2 text-sm">Menu</summary>
          <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-line bg-white p-4 shadow-xl">
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
