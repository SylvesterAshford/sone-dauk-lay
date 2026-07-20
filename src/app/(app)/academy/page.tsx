"use client";

import { LESSONS } from "@/lib/modules";
import { useAcademy } from "@/lib/academyStore";

export default function AcademyPage() {
  const { lessons, doneCount, toggle, reset } = useAcademy();
  const progressPct = Math.round((doneCount / 6) * 100);

  return (
    <section className="mx-auto max-w-[1060px] px-6 pb-20 pt-14 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <div className="font-mono text-xs tracking-[0.12em] text-muted-2">
            CASE 03
          </div>
          <h1 className="mt-2.5 mb-2 font-display text-4xl font-extrabold text-ink">
            Safety Academy
          </h1>
          <p className="m-0 max-w-[48ch] text-pretty text-muted">
            Six habits that stop most scams cold. Tick them off as you learn.
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-[44px] font-extrabold leading-none text-ink">
            {doneCount}
            <span className="text-[26px] text-faint">/6</span>
          </div>
          <div className="mt-2.5 h-1.5 w-40 overflow-hidden rounded-full bg-line">
            <div
              className="h-1.5 rounded-full bg-ink transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {LESSONS.map((item, i) => (
          <button
            key={item.title}
            onClick={() => toggle(i)}
            className="flex items-start gap-4 rounded-[18px] border-[1.5px] border-line bg-card px-5 py-5 text-left transition-colors hover:border-ink"
          >
            <span className="mt-0.5 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border-2 border-ink">
              {lessons[i] && (
                <span className="block h-3.5 w-3.5 rounded-full bg-tier-green" />
              )}
            </span>
            <span>
              <span className="flex items-baseline gap-2.5">
                <span className="font-mono text-[11px] text-faint">
                  {"0" + (i + 1)}
                </span>
                <span className="font-semibold text-ink">{item.title}</span>
              </span>
              <span className="mt-0.5 block text-[13.5px] text-muted-2">
                {item.tip}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="m-0 font-mono text-[11.5px] text-faint">
          progress lives on this device only
        </p>
        <button
          onClick={reset}
          className="rounded-full border-[1.5px] border-line px-5 py-2 text-[13px] font-medium text-muted transition-colors hover:border-ink hover:text-ink"
        >
          Reset progress
        </button>
      </div>
    </section>
  );
}
