"use client";

import { TECHNIQUES } from "@/content/pack";
import { useProgress, stateFor } from "@/lib/progress";
import { StateBadge } from "@/components/spine/StateBadge";

// Progress in techniques NAMEABLE, as words (design v4 §6). No bars, no percentages.
export function MasteryList() {
  const progress = useProgress();
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {TECHNIQUES.map((t) => {
        const state = stateFor(progress.tech[t.id]);
        return (
          <li
            key={t.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-surface px-4 py-3"
          >
            <span className="min-w-0">
              <span className="mm block text-[17px] font-semibold text-ink">
                {t.mm}
              </span>
              <span className="block text-[13px] text-muted">{t.en}</span>
            </span>
            <StateBadge state={state} />
          </li>
        );
      })}
    </ul>
  );
}
