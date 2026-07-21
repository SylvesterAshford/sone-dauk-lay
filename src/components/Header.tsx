"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MascotMark } from "@/components/Mascot";

const NAV = [
  { href: "/", label: "HQ" },
  { href: "/play", label: "Play" },
  { href: "/learn", label: "Hub" },
  { href: "/profile", label: "You" },
];

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-20 border-b border-hairline"
      style={{ background: "rgba(238,244,239,.82)", backdropFilter: "blur(10px)" }}
    >
      <div className="mx-auto flex max-w-[1000px] flex-wrap items-center gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="mr-auto flex items-center gap-2.5 no-underline">
          <MascotMark size={32} />
          <span>
            <span className="display block text-[18px] leading-none text-ink">
              Sone&nbsp;Dauk Lay
            </span>
            <span className="block font-mono text-[10px] tracking-[0.08em] text-meta">
              LITTLE DETECTIVE
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap gap-0.5">
          {NAV.map((n) => {
            const on = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? "page" : undefined}
                className="flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-bold no-underline transition-colors"
                style={{
                  background: on ? "var(--color-sage-soft)" : "transparent",
                  color: on ? "var(--color-ink)" : "var(--color-meta)",
                }}
              >
                {n.label}
                <span
                  className="block h-[5px] w-[5px] rounded-full"
                  style={{ background: on ? "var(--color-green-deep)" : "transparent" }}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
