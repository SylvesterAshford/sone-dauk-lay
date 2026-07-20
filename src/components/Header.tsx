"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import type { Profile } from "@/lib/types";

const NAV = [
  { href: "/", label: "Desk" },
  { href: "/check", label: "Safety Check" },
  { href: "/detective", label: "AI Detective" },
  { href: "/academy", label: "Academy" },
  { href: "/watch", label: "Community Watch" },
];

export function Header({ profile }: { profile: Profile }) {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex max-w-[1060px] flex-wrap items-center justify-between gap-6 px-6 pt-7 sm:px-10">
      <Link href="/" className="flex items-center gap-3 no-underline">
        <span className="relative block h-[26px] w-[26px]">
          <span className="block h-[22px] w-[22px] rounded-full border-[2.5px] border-ink bg-accent" />
          <span className="absolute -right-1 -bottom-px h-[5px] w-3 rotate-45 rounded bg-ink" />
        </span>
        <span>
          <span className="block font-display text-lg font-bold leading-none text-ink">
            San Dauk Lay
          </span>
          <span className="font-mono text-[10.5px] tracking-[0.08em] text-muted-2">
            LITTLE DETECTIVE
          </span>
        </span>
      </Link>

      <nav className="flex flex-wrap items-center gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 text-sm font-medium text-ink no-underline transition-colors hover:text-mustard"
            >
              {item.label}
              <span
                className="block h-[5px] w-[5px] rounded-full bg-accent"
                style={{ opacity: active ? 1 : 0 }}
              />
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        {profile.role === "admin" && (
          <Link
            href="/admin"
            className={`rounded-full border-[1.5px] px-3 py-1.5 text-xs font-semibold no-underline transition-colors ${
              pathname.startsWith("/admin")
                ? "border-ink text-ink"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            Admin
          </Link>
        )}
        <Link
          href="/profile"
          className="flex items-center gap-2 no-underline"
          title="Your profile"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border-[1.5px] border-ink bg-accent font-display text-sm font-bold text-ink">
            {profile.name.charAt(0).toUpperCase()}
          </span>
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full border-[1.5px] border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-ink hover:text-ink"
          >
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
