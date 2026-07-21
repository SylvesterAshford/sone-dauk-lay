import type { Bi } from "@/content/pack";

// The product's most important component (design v4 §6). amber-soft bg, 3px amber
// left rule, Burmese first, Latin gloss below. One sentence. Generous clearance.

export function TellPanel({ tell }: { tell: Bi }) {
  return (
    <div
      className="my-8 rounded-lg py-5 pl-5 pr-4"
      style={{
        background: "var(--color-amber-soft)",
        borderLeft: "3px solid var(--color-amber)",
      }}
    >
      <p className="eyebrow m-0 mb-2">the tell</p>
      <p className="mm m-0 text-[18px] font-medium leading-[1.8] text-ink">
        {tell.mm}
      </p>
      <p className="m-0 mt-2 text-[14px] leading-relaxed text-muted">{tell.en}</p>
    </div>
  );
}
