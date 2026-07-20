"use client";

import { useState } from "react";
import { Mascot } from "@/components/Mascot";
import { CHECKS, tier, dots } from "@/lib/modules";

export default function SafetyCheckPage() {
  const [checks, setChecks] = useState([false, false, false, false, false]);
  const score = checks.filter(Boolean).length;
  const t = tier(score);
  const mood = t.g ? "happy" : t.a ? "amber" : "red";

  const toggle = (i: number) =>
    setChecks((s) => s.map((v, j) => (j === i ? !v : v)));

  return (
    <section className="mx-auto grid max-w-[1060px] grid-cols-1 items-start gap-12 px-6 pb-20 pt-14 sm:px-10 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="font-mono text-xs tracking-[0.12em] text-muted-2">
          CASE 01
        </div>
        <h1 className="mt-2.5 mb-2 font-display text-4xl font-extrabold text-ink">
          Safety Check
        </h1>
        <p className="m-0 mb-7 max-w-[48ch] text-pretty text-muted">
          Tick every sign you spot in the message you received. The verdict
          updates as you go.
        </p>
        <div className="flex flex-col gap-2.5">
          {CHECKS.map((item, i) => (
            <button
              key={item.title}
              onClick={() => toggle(i)}
              className="flex items-center gap-4 rounded-[18px] border-[1.5px] border-line bg-card px-5 py-4 text-left transition-colors hover:border-ink"
            >
              <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border-2 border-ink">
                {checks[i] && (
                  <span className="block h-3.5 w-3.5 rounded-full bg-accent" />
                )}
              </span>
              <span>
                <span className="block font-semibold text-ink">
                  {item.title}
                </span>
                <span className="text-[13.5px] text-muted-2">{item.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-[18px] rounded-3xl border-[1.5px] border-line bg-card px-7 py-8 text-center lg:sticky lg:top-8">
        <Mascot size={84} face={t.face} mood={mood} />
        <div className="flex gap-2">
          {dots(score, t.color).map((d, i) => (
            <span
              key={i}
              className="block h-[13px] w-[13px] rounded-full transition-colors"
              style={{ background: d.bg }}
            />
          ))}
        </div>
        <div>
          <div
            className="font-display text-2xl font-extrabold"
            style={{ color: t.color }}
          >
            {t.label}
          </div>
          <p className="mt-2 text-pretty text-sm text-muted">{t.advice}</p>
        </div>
        <button
          onClick={() => setChecks([false, false, false, false, false])}
          className="rounded-full border-[1.5px] border-line px-5 py-2 text-[13px] font-medium text-muted transition-colors hover:border-ink hover:text-ink"
        >
          Reset check
        </button>
      </div>
    </section>
  );
}
