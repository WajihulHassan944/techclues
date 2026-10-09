import Link from "next/link";

type Props = { href: string; children: React.ReactNode; variant?: "primary" | "ghost" | "light"; className?: string };

export function Button({ href, children, variant = "primary", className = "" }: Props) {
  const styles = {
    primary: "bg-brand text-white hover:bg-brand-ink",
    ghost: "border border-ink/15 text-ink hover:bg-ice",
    light: "bg-white text-ink hover:bg-ice",
  }[variant];
  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors ${styles} ${className}`}>
      {children}
    </Link>
  );
}
