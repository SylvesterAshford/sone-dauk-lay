"use client";

// trust / not sure / doubt — equal weight, never pre-selected, no styling that
// favours "doubt" (design v4 §6). Styling doubt as safe trains reflexive suspicion.

export type Vote = "trust" | "unsure" | "doubt";

const OPTIONS: { id: Vote; mm: string; en: string }[] = [
  { id: "trust", mm: "ယုံတယ်", en: "Trust" },
  { id: "unsure", mm: "မသေချာ", en: "Not sure" },
  { id: "doubt", mm: "သံသယ", en: "Doubt" },
];

export function VoteButtons({
  value,
  onVote,
}: {
  value: Vote | null;
  onVote: (v: Vote) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {OPTIONS.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onVote(o.id)}
            className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-[14px] border-[1.5px] transition-colors"
            style={{
              borderColor: on ? "var(--color-forest)" : "var(--color-hairline)",
              background: on ? "var(--color-sage-soft)" : "var(--color-surface)",
            }}
          >
            <span className="mm text-[15px] font-semibold text-ink">{o.mm}</span>
            <span className="text-[11px] text-muted">{o.en}</span>
          </button>
        );
      })}
    </div>
  );
}
