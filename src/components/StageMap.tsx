"use client";

import { DetectiveMascot } from "./Mascot";
import { useLang } from "@/lib/lang";
import { useT } from "@/lib/ui";

// The roadmap INSIDE one difficulty. Five stages along a winding trail running
// TOP TO BOTTOM, finishing at the flag.
//
// Same reasoning as LessonMap: a bottom-up climb puts the locked stages at the
// top of the screen and the stage you are on at the bottom, so the first thing
// you see is the thing you cannot do.
//
// Stages open one at a time: you can replay anything you have finished and
// play the one you are on, but you cannot skip ahead. Locked stages are drawn
// as dim dashed circles — never a padlock (DESIGN.md §14 bans padlock/shield/
// siren iconography, and §7.1 says to use the dim "not yet" treatment instead).
//
// Numerals here are chapter framing, permitted by §3.1 and recorded in §7.1:
// stage 3 is a place on a route, not a total climbing toward a target.

const V = "var";
const c = {
  ink: `${V}(--color-ink)`, forest: `${V}(--color-forest)`, hair: `${V}(--color-hairline)`,
  sageSoft: `${V}(--color-sage-soft)`, muted: `${V}(--color-meta)`, surface: `${V}(--color-surface)`,
  mist: `${V}(--color-mist)`, gold: `${V}(--color-amber)`,
};

// top-left down to the flag, alternating sides so the path still winds
const SPOTS = [
  { left: "16%", top: "10%" },
  { left: "56%", top: "29%" },
  { left: "22%", top: "48%" },
  { left: "62%", top: "67%" },
  { left: "30%", top: "86%" },
];

export function StageMap({
  total, done, onPlay,
}: { total: number; done: number; onPlay: (stage: number) => void }) {
  const t = useT();
  const mm = useLang() === "mm";
  const current = Math.min(done, total - 1);
  const allDone = done >= total;

  return (
    <div className="relative w-full overflow-hidden rounded-[18px] border-[1.5px]"
      style={{ borderColor: c.hair, background: c.mist, height: 460 }}>

      {/* scenery: hills behind the trail, pure inline SVG (§7.1 zero raster) */}
      <svg aria-hidden="true" viewBox="0 0 300 460" preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full" style={{ opacity: 0.55 }}>
        <circle cx="240" cy="52" r="26" fill="#f3e7c9" />
        <path d="M0 460 L0 372 Q70 330 130 366 T300 344 L300 460 Z" fill="#d9e9dd" />
        <path d="M0 460 L0 418 Q90 392 160 416 T300 400 L300 460 Z" fill="#cfe3d4" />
        <path d="M28 300 l16 -34 16 34 Z" fill="#b7d3be" />
        <path d="M52 312 l20 -42 20 42 Z" fill="#a9c9b1" />
        <path d="M226 214 l18 -38 18 38 Z" fill="#b7d3be" />
      </svg>

      {/* the trail */}
      <svg aria-hidden="true" viewBox="0 0 300 460" preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full">
        <path d="M48 46 C 108 64, 140 80, 176 124 C 210 166, 106 178, 74 220
                 C 44 260, 172 270, 192 310 C 212 350, 106 364, 96 404"
          fill="none" stroke="#9cc4a9" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
      </svg>

      {/* the flag at the summit */}
      <div className="pointer-events-none absolute" style={{ left: "30%", top: "93%", transform: "translate(-50%,0)" }}>
        <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
          <path d="M5 29 L5 3" stroke={c.ink} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M6 4 L21 9 L6 15 Z" fill={allDone ? c.forest : "#c3d6c8"} stroke={c.ink} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>

      {SPOTS.slice(0, total).map((pos, i) => {
        const isDone = i < done;
        const isNow = !allDone && i === current;
        const locked = i > current;
        const size = isNow ? 60 : 50;
        return (
          <div key={i} className="absolute" style={{ left: pos.left, top: pos.top, transform: "translate(-50%,-50%)" }}>
            {isNow && (
              <div className="pointer-events-none absolute left-1/2" style={{ bottom: "calc(100% + 4px)", transform: "translateX(-50%)" }}>
                <DetectiveMascot size="42px" blink={false} label="" />
              </div>
            )}
            <button
              onClick={() => !locked && onPlay(i)}
              disabled={locked}
              aria-label={`${t("stageLabel")} ${i + 1}`}
              aria-current={isNow ? "step" : undefined}
              className="card-tactile grid place-items-center rounded-full font-bold disabled:cursor-default"
              style={{
                width: size, height: size,
                background: isDone ? c.forest : isNow ? c.surface : "transparent",
                border: isDone ? "none" : isNow ? `3px solid ${c.forest}` : `2px dashed ${c.hair}`,
                color: isDone ? "#fff" : isNow ? c.forest : "#a9bcb0",
                fontSize: isNow ? 20 : 17,
                boxShadow: isNow ? "0 6px 18px -6px rgba(35,55,44,.45)" : "none",
              }}>
              {isDone ? "✓" : i + 1}
            </button>
          </div>
        );
      })}

      <div className={`absolute left-0 right-0 text-center text-[11.5px] ${mm ? "mm" : "font-mono"}`}
        style={{ bottom: 8, color: c.muted }}>
        {allDone ? t("lvlCleared") : `${t("stageLabel")} ${current + 1}`}
      </div>
    </div>
  );
}
