"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Bottom nav: Home · Learn · Play · You (design v4 §2). Labels say what things do.
const ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/learn", label: "Learn", icon: BookIcon },
  { href: "/play", label: "Play", icon: PlayIcon },
  { href: "/profile", label: "You", icon: PersonIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-surface"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-[560px] items-stretch justify-around">
        {ITEMS.map((it) => {
          const on = active(it.href);
          const Icon = it.icon;
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                aria-current={on ? "page" : undefined}
                className="flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 no-underline"
                style={{ color: on ? "var(--color-ink)" : "var(--color-muted)" }}
              >
                <Icon filled={on} />
                <span className="text-[11px] font-semibold">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function base(filled: boolean) {
  return {
    width: 22,
    height: 22,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: filled ? 2.4 : 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}
function HomeIcon({ filled }: { filled: boolean }) {
  return (
    <svg {...base(filled)} viewBox="0 0 24 24">
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9h14v-9" />
    </svg>
  );
}
function BookIcon({ filled }: { filled: boolean }) {
  return (
    <svg {...base(filled)} viewBox="0 0 24 24">
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19a2 2 0 0 1 2-2h12" />
    </svg>
  );
}
function PlayIcon({ filled }: { filled: boolean }) {
  return (
    <svg {...base(filled)} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9l5 3-5 3z" />
    </svg>
  );
}
function PersonIcon({ filled }: { filled: boolean }) {
  return (
    <svg {...base(filled)} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}
