"use client";

import { useRef, useState } from "react";
import { HERO_DETECTIVE_SVG } from "./heroDetectiveSvg";

// Wraps a centre mascot so it reacts to the player: lifts on hover, hops when
// poked. Delight only — it changes nothing in the app, so it is safe to make it
// a real button (labelled, keyboard-reachable) rather than a mystery hit area.
// The hop is one-shot and self-clearing; nothing new loops (§10).
export function PokeMascot({ label, children }: { label: string; children: React.ReactNode }) {
  const [hopping, setHopping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const poke = () => {
    if (timer.current) clearTimeout(timer.current);
    setHopping(true);
    timer.current = setTimeout(() => setHopping(false), 760);
  };
  return (
    <button type="button" onClick={poke} aria-label={label}
      className={`mascot-poke${hopping ? " is-hopping" : ""}`}>
      {children}
    </button>
  );
}

// The little detective — a magnifier with a face. Exact port of the confirmed
// design, but built with calc(var(--m) * f) so it scales with any CSS size,
// including a responsive clamp() on the hero.

const f = (n: number) => `calc(var(--m) * ${(n / 196).toFixed(4)})`;

// The Little Detective CHARACTER — a round green detective holding the magnifier
// (design §14, revised): used for the big "center" moments (Home hero, Mission
// Map header, celebrations) so those pages aren't yet another lone lens. The
// plain magnifier (Mascot / MascotMark) stays the header logo and the corner
// Lens (which IS the lens tool, §9). Inline SVG, on-palette (cap = forest, no
// new colour), greyscale-safe, zero raster.
// The four multiplayer hats (DESIGN.md §16.1). One character, four hats — NOT a
// cast. A hidden-role game needs every player to look like the same kind of
// thing, or the Manipulator leaks before anyone speaks.
//
// "deerstalker" is the canonical mascot's own cap, unchanged, so the existing
// HQ/Play detective is literally variant one. Bucket hat and trilby were drawn
// and cut: at 44px they were indistinguishable from the deerstalker. Re-run the
// 44px test before adding a fifth.
export type HatId = "deerstalker" | "beanie" | "newsboy" | "visor";
export const HAT_IDS: HatId[] = ["deerstalker", "beanie", "newsboy", "visor"];

const F = "var(--color-forest)";
const I = "var(--color-ink)";
const SAGE = "#93c7a4";

// Hats draw BEFORE the magnifier so a brim can never cover the lens.
function Hat({ id }: { id: HatId }) {
  switch (id) {
    case "beanie":
      return (
        <>
          <path d="M41 52 C41 27 55 17 70 17 C85 17 99 27 99 52 Z" fill={F} stroke={I} strokeWidth="3.5" />
          <rect x="37" y="46" width="66" height="11" rx="5.5" fill={F} stroke={I} strokeWidth="3.5" />
          <circle cx="70" cy="12" r="7.5" fill={F} stroke={I} strokeWidth="3" />
        </>
      );
    case "newsboy":
      return (
        <>
          <path d="M39 53 C34 29 56 17 75 20 C93 23 101 35 99 53 Z" fill={F} stroke={I} strokeWidth="3.5" />
          <path d="M95 46 Q120 48 123 58 Q106 63 93 57 Z" fill={F} stroke={I} strokeWidth="3.5" strokeLinejoin="round" />
        </>
      );
    case "visor":
      // The only variant showing the head: a sage crown above a forest band.
      return (
        <>
          <path d="M45 53 C45 33 56 26 70 26 C84 26 95 33 95 53 Z" fill={SAGE} stroke={I} strokeWidth="3.5" />
          <rect x="38" y="40" width="65" height="12" rx="6" fill={F} stroke={I} strokeWidth="3.5" />
          <path d="M39 44 Q16 47 13 57 Q29 62 41 55 Z" fill={F} stroke={I} strokeWidth="3.5" strokeLinejoin="round" />
        </>
      );
    default:
      return (
        <>
          <path d="M38 55 C38 29 54 20 70 20 C86 20 102 29 102 55 Z" fill={F} stroke={I} strokeWidth="3.5" />
          <ellipse cx="70" cy="56" rx="40" ry="8" fill={F} stroke={I} strokeWidth="3.5" />
          <circle cx="70" cy="20" r="4" fill={F} stroke={I} strokeWidth="3" />
        </>
      );
  }
}

export function DetectiveMascot({
  size = "180px",
  float = false,
  hat = "deerstalker",
  label = "The little detective",
  blink = true,
}: { size?: string; float?: boolean; hat?: HatId; label?: string; blink?: boolean }) {
  const eye = blink ? "anim-blink" : undefined;
  // label="" marks the figure decorative: inside a button that already carries
  // the player's name, an img role would announce that name a second time.
  const decorative = label === "";
  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": label } as const);
  return (
    <div className={float ? "anim-idle-bob" : undefined} style={{ display: "inline-block", lineHeight: 0 }}>
      <svg viewBox="0 0 140 152" {...a11y} style={{ height: size, width: "auto", display: "block", overflow: "visible" }}>
        {/* feet (behind body) */}
        <rect x="52" y="127" width="15" height="17" rx="6" fill={F} stroke={I} strokeWidth="3" />
        <rect x="73" y="127" width="15" height="17" rx="6" fill={F} stroke={I} strokeWidth="3" />
        {/* body */}
        <path d="M28 90 C28 62 46 48 70 48 C94 48 112 62 112 90 C112 120 96 138 70 138 C44 138 28 120 28 90 Z"
          fill={SAGE} stroke={I} strokeWidth="3.5" />
        {/* Arms are single rounded-cap strokes — the round end IS the mitten
            hand. Separate paw circles read as lumps chained onto a noodle at
            this size, so there are none. */}
        <path d="M99 99 L112 113" fill="none" stroke={I} strokeWidth="16" strokeLinecap="round" />
        <path d="M99 99 L112 113" fill="none" stroke={SAGE} strokeWidth="10" strokeLinecap="round" />
        <Hat id={hat} />
        {/* magnifier, clear of the brim — present in EVERY variant (§14) */}
        <path d="M33 84 L44 96" stroke={I} strokeWidth="6" strokeLinecap="round" />
        <circle cx="26" cy="76" r="12" fill="#ecfaf1" stroke={I} strokeWidth="3.5" />
        <path d="M20 71 q4 -4 8 -2" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
        {/* left arm LAST: its rounded end closes over the base of the handle,
            which is what makes it read as a grip rather than a near-miss */}
        <path d="M56 108 L45 95" fill="none" stroke={I} strokeWidth="16" strokeLinecap="round" />
        <path d="M56 108 L45 95" fill="none" stroke={SAGE} strokeWidth="10" strokeLinecap="round" />
        {/* face */}
        <circle className={eye} cx="58" cy="78" r="4.6" fill={I} style={{ transformOrigin: "58px 78px" }} />
        <circle className={eye} cx="82" cy="78" r="4.6" fill={I} style={{ transformOrigin: "82px 78px" }} />
        <path d="M62 87 Q70 95 78 87" stroke={I} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// The cartoon detective for the HQ hero — the approved cd-1 concept, vectorized
// to SVG (see heroDetectiveSvg.ts). HQ hero only; the Play tab keeps the simpler
// flat DetectiveMascot. Rendered inline (no image request, offline-ready).
export function CartoonDetective({ size = "220px", float = false }: { size?: string; float?: boolean }) {
  return (
    <div
      className={float ? "anim-idle-bob" : undefined}
      style={{ height: size, display: "inline-block", lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: HERO_DETECTIVE_SVG }}
    />
  );
}

export function Mascot({
  size = "196px",
  ring = false,
  float = false,
  pulse = false,
  cheeks = false,
}: {
  size?: string; // any CSS length, e.g. "196px" or "clamp(140px,34vw,196px)"
  ring?: boolean;
  float?: boolean;
  // Corner Lens mascot only: a slow single ring-breath instead of a spin —
  // the one place character concentrates outside the Home hero.
  pulse?: boolean;
  // Soft rosy cheeks — extra warmth for the big hero mascot; off by default so
  // small instances stay clean.
  cheeks?: boolean;
}) {
  return (
    <div
      className="relative"
      style={{ ["--m" as string]: size, width: "var(--m)", height: "var(--m)" }}
    >
      {ring && (
        <div
          className="anim-ringspin absolute rounded-full"
          style={{ inset: f(-16), border: "3px dashed #b9d6c4" }}
        />
      )}
      {pulse && (
        <div
          className="anim-ring-pulse pointer-events-none absolute rounded-full"
          style={{ inset: f(-10), border: "2px solid var(--color-green)" }}
        />
      )}
      <div
        className={float ? "anim-idle-bob relative" : "relative"}
        style={{ width: "var(--m)", height: "var(--m)" }}
      >
        <div
          className="relative overflow-hidden rounded-full"
          style={{
            width: "var(--m)",
            height: "var(--m)",
            border: `${f(4)} solid var(--color-ink)`,
            // Paler, translucent "glass" lens (was a saturated solid green) — reads
            // more like an actual magnifier and lets the ink face features pop.
            background:
              "radial-gradient(circle at 33% 27%, #ecfaf1 0%, #cdecd9 60%, #b6e1c5 100%)",
            boxShadow: "0 18px 40px -12px rgba(35,55,44,.4)",
          }}
        >
          {/* glassy highlight — a long streak + a small dot, the classic lens glint */}
          <span className="pointer-events-none absolute" style={{ left: "17%", top: "15%", width: f(48), height: f(20), background: "rgba(255,255,255,.6)", borderRadius: f(20), transform: "rotate(-26deg)" }} />
          <span className="pointer-events-none absolute" style={{ left: "20%", top: "32%", width: f(12), height: f(12), background: "rgba(255,255,255,.55)", borderRadius: "50%" }} />
          {cheeks && (
            <>
              <span className="pointer-events-none absolute" style={{ left: "19%", top: "51%", width: f(22), height: f(13), background: "rgba(224,138,120,.42)", borderRadius: "50%" }} />
              <span className="pointer-events-none absolute" style={{ right: "19%", top: "51%", width: f(22), height: f(13), background: "rgba(224,138,120,.42)", borderRadius: "50%" }} />
            </>
          )}
          <span className="anim-blink absolute rounded-full" style={{ left: "27%", top: "37%", width: f(14), height: f(14), background: "var(--color-ink)" }} />
          <span className="anim-blink absolute rounded-full" style={{ right: "27%", top: "37%", width: f(14), height: f(14), background: "var(--color-ink)" }} />
          <span
            className="absolute"
            style={{
              left: "50%",
              top: "58%",
              transform: "translateX(-50%)",
              width: f(34),
              height: f(17),
              border: `${f(3)} solid var(--color-ink)`,
              borderTop: "none",
              borderRadius: `0 0 ${f(34)} ${f(34)}`,
            }}
          />
        </div>
        <span
          className="absolute"
          style={{
            width: f(58),
            height: f(18),
            background: "var(--color-ink)",
            borderRadius: f(9),
            transform: "rotate(45deg)",
            right: f(-32),
            bottom: f(-2),
          }}
        />
      </div>
    </div>
  );
}

// Small logo lens (header) with a glint + gold speck.
export function MascotMark({ size = 32 }: { size?: number }) {
  const s = size / 32;
  const px = (n: number) => `${n * s}px`;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="relative overflow-hidden rounded-full"
        style={{
          width: px(27),
          height: px(27),
          border: `${px(2.5)} solid var(--color-ink)`,
          background: "radial-gradient(circle at 32% 28%, #ecfaf1 0%, #bfe6cd 72%)",
        }}
      >
        <span className="absolute rounded-full" style={{ left: px(5), top: px(4), width: px(8), height: px(8), background: "rgba(255,255,255,.72)" }} />
        <span className="absolute rounded-full" style={{ right: px(4), bottom: px(4), width: px(5), height: px(5), background: "var(--color-amber)" }} />
      </div>
      <span className="absolute" style={{ width: px(14), height: px(5), background: "var(--color-ink)", borderRadius: px(3), transform: "rotate(45deg)", right: px(-4), bottom: px(-1) }} />
    </div>
  );
}
