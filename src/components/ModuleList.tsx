"use client";

import Link from "next/link";
import { useAcademy } from "@/lib/academyStore";

type Module = {
  n: string;
  href: string;
  title: string;
  sub: string;
  badge: string;
};

function Row({ m }: { m: Module }) {
  return (
    <Link
      href={m.href}
      className="group grid grid-cols-[40px_1fr_auto] items-center gap-4 rounded-[20px] border-[1.5px] border-line bg-card px-5 py-5 no-underline transition-all hover:translate-x-1.5 hover:border-ink sm:grid-cols-[56px_1fr_auto_auto] sm:gap-5 sm:px-6"
    >
      <span className="font-mono text-[13px] text-muted-2">{m.n}</span>
      <span>
        <span className="block font-display text-lg font-bold text-ink">
          {m.title}
        </span>
        <span className="text-sm text-muted-2">{m.sub}</span>
      </span>
      <span className="hidden justify-self-end rounded-full border-[1.5px] border-line px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-muted sm:block">
        {m.badge}
      </span>
      <span className="text-lg text-ink">→</span>
    </Link>
  );
}

export function ModuleList() {
  const { doneCount } = useAcademy();

  const modules: Module[] = [
    {
      n: "01",
      href: "/check",
      title: "Safety Check",
      sub: "Five scam signs, one verdict",
      badge: "READY",
    },
    {
      n: "02",
      href: "/detective",
      title: "AI Detective",
      sub: "Paste a message, get it inspected",
      badge: "RULE-BASED",
    },
    {
      n: "03",
      href: "/academy",
      title: "Safety Academy",
      sub: "Six tiny lessons for lasting habits",
      badge: `${doneCount}/6`,
    },
    {
      n: "04",
      href: "/watch",
      title: "Community Watch",
      sub: "Draft a scam report for your community",
      badge: "DRAFT ONLY",
    },
  ];

  return (
    <div className="mt-14 flex flex-col gap-2.5">
      {modules.map((m) => (
        <Row key={m.href} m={m} />
      ))}
    </div>
  );
}
