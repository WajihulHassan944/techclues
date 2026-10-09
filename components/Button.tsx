import Link from "next/link";

type Props = { href: string; children: React.ReactNode; variant?: "primary" | "ghost" | "light"; className?: string };

export function Button({ href, children, variant = "primary", className = "" }: Props) {
  const styles = {
    primary: "bg-ink text-white hover:bg-brand",
    ghost: "border border-ink/15 bg-transparent text-ink hover:bg-ice",
    light: "bg-white text-ink hover:bg-ice",
  }[variant];
  return (
    <Link href={href} className={`inline-flex h-[52px] items-center justify-center rounded-full px-7 text-[15px] font-medium transition-colors ${styles} ${className}`}>
      {children}
    </Link>
  );
}
