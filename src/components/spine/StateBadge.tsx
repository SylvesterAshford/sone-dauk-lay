import type { MasteryState } from "@/content/pack";

// Mastery shown as WORDS, never bars or percentages (design v4 §6).
// Correctness has no colour — earned states carry a check glyph, not a hue.
const LABEL: Record<MasteryState, { word: string; check: boolean }> = {
  not_met: { word: "New", check: false },
  met: { word: "Met", check: false },
  practised: { word: "Practised", check: true },
  mastered: { word: "Mastered", check: true },
};

export function StateBadge({ state }: { state: MasteryState }) {
  const { word, check } = LABEL[state];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-hairline px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted"
    >
      {check && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
      {word}
    </span>
  );
}
