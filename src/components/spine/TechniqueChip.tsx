import type { Technique } from "@/content/pack";

// Bilingual, Burmese primary. Real checkbox. Selected: sage-soft fill + forest
// border + checkmark. Min 44px (design v4 §6). Correctness is never colour-only.

export function TechniqueChip({
  technique,
  checked,
  onToggle,
  disabled = false,
  tone = "default",
}: {
  technique: Technique;
  checked: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  tone?: "default" | "correct" | "missed";
}) {
  const border =
    tone === "missed"
      ? "var(--color-muted)"
      : checked
        ? "var(--color-forest)"
        : "var(--color-hairline)";
  const bg = checked ? "var(--color-sage-soft)" : "var(--color-surface)";

  return (
    <label
      className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] px-4 py-2.5 transition-colors"
      style={{ borderColor: border, background: bg }}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
      />
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded-md border-2"
        style={{
          borderColor: checked ? "var(--color-forest)" : "var(--color-hairline)",
          background: checked ? "var(--color-forest)" : "transparent",
        }}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <span className="mm block text-[17px] font-semibold leading-snug text-ink">
          {technique.mm}
        </span>
        <span className="block text-[13px] text-muted">{technique.en}</span>
      </span>
      {tone === "correct" && (
        <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
          ✓ named
        </span>
      )}
    </label>
  );
}
