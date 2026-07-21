import type { Bi } from "@/content/pack";

// Burmese first, Latin gloss second — everywhere (Invariant 11 / design v4 §11).
// Burmese carries the .mm class (Noto Myanmar, 1.8 line-height, never italic).

export function Bilingual({
  text,
  size = "body",
  className = "",
}: {
  text: Bi;
  size?: "title" | "body" | "tell" | "technique" | "caption";
  className?: string;
}) {
  const mmSize = {
    title: "text-[24px] leading-[1.7] font-semibold",
    body: "text-[16px] leading-[1.75]",
    tell: "text-[18px] leading-[1.8] font-medium",
    technique: "text-[17px] font-semibold",
    caption: "text-[14px]",
  }[size];
  const enSize = {
    title: "text-[14px]",
    body: "text-[14px]",
    tell: "text-[14px]",
    technique: "text-[13px]",
    caption: "text-[12px]",
  }[size];

  return (
    <div className={className}>
      <p className={`mm m-0 text-ink ${mmSize}`}>{text.mm}</p>
      <p className={`m-0 mt-1 text-muted ${enSize}`}>{text.en}</p>
    </div>
  );
}
