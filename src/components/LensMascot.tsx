// The little detective — a friendly magnifier with a smiling face (design v4).
// A companion who does the looking with you. Never a threat icon.

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
      className={`relative inline-grid place-items-center rounded-full ${className}`}
      style={{ width: size, height: size, background: "var(--color-sage)" }}
      aria-hidden="true"
    >
      <span
        className={`grid place-items-center rounded-full ${
          state === "thinking" ? "lens-pulse" : ""
        }`}
        style={{
          width: size * 0.72,
          height: size * 0.72,
          border: `${Math.max(2, size * 0.05)}px solid var(--color-forest)`,
          background: "var(--color-mist)",
          animation:
            state === "thinking" ? "lensPulse 1.6s ease-in-out infinite" : undefined,
        }}
      >
        {/* eyes + smile */}
        <svg
          width={size * 0.4}
          height={size * 0.4}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-forest)"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <circle cx="8.5" cy="9" r="0.6" fill="var(--color-forest)" stroke="none" />
          <circle cx="15.5" cy="9" r="0.6" fill="var(--color-forest)" stroke="none" />
          <path d="M8 14c1.3 1.6 6.7 1.6 8 0" />
        </svg>
      </span>
      {state === "reply" && (
        <span
          className="absolute right-0 top-0 block rounded-full"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            background: "var(--color-sage)",
            border: "2px solid var(--color-surface)",
          }}
        />
      )}
    </span>
  );
}
