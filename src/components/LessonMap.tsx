"use client";

import { DetectiveMascot } from "./Mascot";
import { TechniqueIcon } from "./TechniqueIcon";
import type { TechniqueId } from "@/content/pack";

// A learning route: lessons laid along a winding trail through a landscape,
// climbing bottom to top, opening one at a time.
//
// Scales to any lesson count (tracks hold 5-7), so positions and the trail are
// computed rather than hand-placed. Everything is inline SVG and CSS — no
// raster assets, which §7.1 makes a hard constraint, not a preference.
//
// Locked stops use the dim dashed treatment, never a padlock (§14 bans
// padlock/shield/siren iconography for this audience).

const V = "var";
const c = {
  ink: `${V}(--color-ink)`, forest: `${V}(--color-forest)`, hair: `${V}(--color-hairline)`,
  sageSoft: `${V}(--color-sage-soft)`, muted: `${V}(--color-meta)`, surface: `${V}(--color-surface)`,
  mist: `${V}(--color-mist)`,
};

const W = 300;      // viewBox width; height scales with the number of stops
const STEP = 118;   // vertical distance between stops

export type MapStop = {
  id: string;
  title: string;
  sub: string;
  technique: TechniqueId;
  done: boolean;
};

export function LessonMap({
  stops, accent, onOpen,
}: { stops: MapStop[]; accent: string; onOpen: (id: string) => void }) {
  const n = stops.length;
  const H = n * STEP + 90;

  // bottom-to-top, alternating sides so the path reads as a climb
  const pts = stops.map((_, i) => ({
    x: i % 2 === 0 ? 78 : 214,
    y: H - 60 - i * STEP,
  }));

  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const midY = (a.y + b.y) / 2;
    d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
  }

  // first not-done stop is where you are; everything after it is shut
  const currentIdx = stops.findIndex((s) => !s.done);
  const allDone = currentIdx === -1;

  return (
    <div className="relative w-full overflow-hidden rounded-[18px] border-[1.5px]"
      style={{ borderColor: c.hair, background: c.mist }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
        {/* landscape: sky wash, far hills, near hills, trees, sun */}
        <defs>
          <linearGradient id="lm-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dfeee4" />
            <stop offset="100%" stopColor="#eef4ef" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#lm-sky)" />
        <circle cx={W - 58} cy="62" r="27" fill="#f4e8ca" />
        {Array.from({ length: Math.ceil(H / 260) }).map((_, k) => {
          const base = H - k * 260;
          return (
            <g key={k}>
              <path d={`M0 ${base} L0 ${base - 78} Q80 ${base - 118} 150 ${base - 82} T${W} ${base - 100} L${W} ${base} Z`} fill="#d9e9dd" />
              <path d={`M0 ${base} L0 ${base - 34} Q100 ${base - 62} 180 ${base - 38} T${W} ${base - 52} L${W} ${base} Z`} fill="#cde1d3" />
              <path d={`M34 ${base - 66} l16 -34 16 34 Z`} fill="#b3d0ba" />
              <path d={`M${W - 62} ${base - 150} l18 -38 18 38 Z`} fill="#b3d0ba" />
            </g>
          );
        })}
        {/* the trail */}
        <path d={d} fill="none" stroke="#9cc4a9" strokeWidth="4.5" strokeDasharray="2 13" strokeLinecap="round" />
        {/* flag at the summit */}
        <g transform={`translate(${pts[n - 1].x - 4} ${pts[n - 1].y - 78})`}>
          <path d="M2 44 L2 4" stroke={c.ink} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M3 5 L20 11 L3 17 Z" fill={allDone ? c.forest : "#c3d6c8"} stroke={c.ink} strokeWidth="2" strokeLinejoin="round" />
        </g>
      </svg>

      {stops.map((s, i) => {
        const locked = !allDone && i > currentIdx;
        const isNow = i === currentIdx;
        const size = isNow ? 66 : 56;
        return (
          <div key={s.id} className="absolute" style={{
            left: `${(pts[i].x / W) * 100}%`,
            top: `${(pts[i].y / H) * 100}%`,
            transform: "translate(-50%,-50%)",
          }}>
            {isNow && (
              <span className="pointer-events-none absolute left-1/2" style={{ bottom: "calc(100% + 4px)", transform: "translateX(-50%)" }}>
                <DetectiveMascot size="40px" blink={false} label="" />
              </span>
            )}
            <button onClick={() => !locked && onOpen(s.id)} disabled={locked}
              aria-label={s.title} aria-current={isNow ? "step" : undefined}
              className="card-tactile grid place-items-center rounded-full disabled:cursor-default"
              style={{
                width: size, height: size,
                background: s.done ? c.forest : isNow ? c.surface : "transparent",
                border: s.done ? "none" : isNow ? `3px solid ${c.forest}` : `2px dashed ${c.hair}`,
                color: s.done ? "#fff" : isNow ? accent : "#a9bcb0",
                boxShadow: isNow ? "0 6px 18px -6px rgba(35,55,44,.45)" : "none",
              }}>
              {s.done
                ? <span className="text-[19px] font-bold">✓</span>
                : <TechniqueIcon id={s.technique} size={isNow ? 27 : 23} bg={isNow ? "#ffffff" : "#eef4ef"} />}
            </button>
            {/* the title sits beside the stop, on whichever side has room */}
            <div className="pointer-events-none absolute top-1/2 w-[124px] -translate-y-1/2"
              style={{ [i % 2 === 0 ? "left" : "right"]: `${size + 10}px` } as React.CSSProperties}>
              <div className="mm text-[13px] font-semibold leading-[1.5]"
                style={{ color: locked ? "#9aa89e" : c.ink }}>{s.title}</div>
              <div className="text-[11px] leading-tight" style={{ color: c.muted }}>{s.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
