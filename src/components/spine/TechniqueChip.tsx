import type { Technique } from "@/content/pack";
import { TechniqueIcon } from "@/components/TechniqueIcon";

// Name-step card — icon + Burmese primary + English. Selected: sage-soft fill,
// green-deep border + a check. Min 82px tall (design). Exact port.
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
      ? "var(--color-hairline)"
      : checked
        ? "var(--color-green-deep)"
        : "var(--color-hairline)";
  const bg = checked ? "var(--color-sage-soft)" : "var(--color-surface)";
  const iconColor = tone === "missed" ? "var(--color-meta)" : "var(--color-clay)";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={checked}
      className="flex min-h-[82px] flex-col gap-2 rounded-[16px] border-2 p-[14px_13px] text-left transition-all disabled:cursor-default"
      style={{ borderColor: border, background: bg }}
    >
      <div className="flex items-center justify-between">
        <span className="flex" style={{ color: iconColor }}>
          <TechniqueIcon id={technique.id} size={22} bg={bg} />
        </span>
        {checked && tone !== "missed" && (
          <span
            className="grid h-5 w-5 place-items-center rounded-full text-[12px] font-extrabold text-white"
            style={{ background: "var(--color-green-deep)", animation: "pop .25s ease" }}
          >
            ✓
          </span>
        )}
        {tone === "missed" && (
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-meta">
            missed
          </span>
        )}
      </div>
      <div>
        <div className="mm text-[14px] font-semibold leading-[1.7] text-ink">
          {technique.mm}
        </div>
        <div className="text-[12.5px] text-meta">{technique.en}</div>
      </div>
    </button>
  );
}
