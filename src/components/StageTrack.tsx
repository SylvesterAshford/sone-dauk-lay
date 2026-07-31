"use client";

import { Fragment } from "react";
import { DetectiveMascot } from "./Mascot";

// The stages inside one difficulty, drawn as a route rather than a bar.
//
// Numbers here are CHAPTER FRAMING, which DESIGN.md §3.1 explicitly allows
// ("illustrated terrain, a path, character presence, chapter framing"). They
// are positional, not accumulable: stage 3 is a place, not a score climbing
// toward a target. The banned thing is a number you watch go up — this one
// tells you where you are standing.
//
// The detective stands on the current stage. That is the "you are here" mark,
// and it is why this reads as a route instead of a progress bar.

const V = "var";
const c = {
  ink: `${V}(--color-ink)`, forest: `${V}(--color-forest)`, hair: `${V}(--color-hairline)`,
  sageSoft: `${V}(--color-sage-soft)`, muted: `${V}(--color-meta)`, surface: `${V}(--color-surface)`,
};

export function StageTrack({
  done,
  total,
  showMascot = true,
}: { done: number; total: number; showMascot?: boolean }) {
  const at = Math.min(done, total - 1); // the stage you are standing on
  const allDone = done >= total;
  return (
    <div className="flex w-full items-center gap-1" style={{ paddingTop: showMascot ? 26 : 0 }}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < done;
        const isNow = !allDone && i === at;
        return (
          <Fragment key={i}>
            {i > 0 && (
              <span className="h-[3px] min-w-[10px] flex-1 rounded-full"
                style={{ background: isDone ? c.forest : c.hair }} />
            )}
            <span className="relative grid shrink-0 place-items-center rounded-full"
              style={{
                width: isNow ? 34 : 28,
                height: isNow ? 34 : 28,
                background: isDone ? c.forest : isNow ? c.sageSoft : c.surface,
                border: isDone ? "none" : isNow ? `2.5px solid ${c.forest}` : `1.5px dashed ${c.hair}`,
                color: isDone ? "#fff" : isNow ? c.forest : "#a9bcb0",
                fontSize: isNow ? 14 : 12.5,
                fontWeight: 700,
              }}>
              {isDone ? "✓" : i + 1}
              {isNow && showMascot && (
                <span className="pointer-events-none absolute left-1/2"
                  style={{ bottom: "calc(100% + 2px)", transform: "translateX(-50%)" }}>
                  <DetectiveMascot size="30px" blink={false} label="" />
                </span>
              )}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}
