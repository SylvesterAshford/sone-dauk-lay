import { Mascot } from "@/components/Mascot";

// The Lens uses the SAME magnifier mascot as the rest of the app (consistency).
// idle · thinking (slow pulse) · reply (small sage dot). Design v4 §9.1.
export function LensMascot({
  size = 56,
  state = "idle",
  className = "",
}: {
  size?: number;
  state?: "idle" | "thinking" | "reply";
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        lineHeight: 0,
        animation: state === "thinking" ? "floaty 2.4s ease-in-out infinite" : undefined,
      }}
      aria-hidden="true"
    >
      <Mascot size={`${size}px`} />
      {state === "reply" && (
        <span
          className="absolute right-0 top-0 block rounded-full"
          style={{
            width: size * 0.22,
            height: size * 0.22,
            background: "var(--color-green-deep)",
            border: "2px solid var(--color-surface)",
          }}
        />
      )}
    </span>
  );
}
