// The San Dauk Lay detective mascot — a magnifying-glass face.
// `mood` drives the mouth; `face` sets the lens fill (used for risk tiers).

type Mood = "happy" | "neutral" | "amber" | "red" | "sleep";

export function Mascot({
  size = 120,
  face = "#58b08b",
  mood = "happy",
  className = "",
}: {
  size?: number;
  face?: string;
  mood?: Mood;
  className?: string;
}) {
  const s = size / 120; // scale factor relative to the 120px reference
  const px = (n: number) => `${n * s}px`;
  const ink = "#23372c";

  return (
    <div
      className={`relative ${className}`}
      style={{ width: px(120), height: px(120) }}
    >
      <div
        className="relative rounded-full"
        style={{
          width: px(120),
          height: px(120),
          border: `${px(4)} solid ${ink}`,
          background: face,
          transition: "background 0.3s",
        }}
      >
        {/* eyes */}
        {mood === "sleep" ? (
          <>
            <span
              className="absolute rounded"
              style={{ left: px(32), top: px(48), width: px(16), height: px(4), background: ink }}
            />
            <span
              className="absolute rounded"
              style={{ right: px(32), top: px(48), width: px(16), height: px(4), background: ink }}
            />
          </>
        ) : (
          <>
            <span
              className="absolute rounded-full animate-blink"
              style={{ left: px(32), top: px(44), width: px(11), height: px(11), background: ink }}
            />
            <span
              className="absolute rounded-full animate-blink"
              style={{ right: px(32), top: px(44), width: px(11), height: px(11), background: ink }}
            />
          </>
        )}
        {/* mouth */}
        {mood === "happy" && (
          <span
            className="absolute"
            style={{
              left: "50%",
              top: px(70),
              transform: "translateX(-50%)",
              width: px(26),
              height: px(13),
              border: `${px(3)} solid ${ink}`,
              borderTop: "none",
              borderRadius: `0 0 ${px(26)} ${px(26)}`,
            }}
          />
        )}
        {(mood === "amber" || mood === "sleep") && (
          <span
            className="absolute rounded"
            style={{
              left: "50%",
              top: px(74),
              transform: "translateX(-50%)",
              width: px(24),
              height: px(4),
              background: ink,
            }}
          />
        )}
        {mood === "red" && (
          <span
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: px(72),
              transform: "translateX(-50%)",
              width: px(18),
              height: px(20),
              border: `${px(3)} solid ${ink}`,
            }}
          />
        )}
        {mood === "neutral" && (
          <span
            className="absolute rounded"
            style={{
              left: "50%",
              top: px(74),
              transform: "translateX(-50%)",
              width: px(18),
              height: px(4),
              background: ink,
            }}
          />
        )}
      </div>
      {/* magnifier handle */}
      <div
        className="absolute rounded-lg"
        style={{
          width: px(44),
          height: px(14),
          background: ink,
          transform: "rotate(45deg)",
          right: px(-26),
          bottom: px(-2),
        }}
      />
    </div>
  );
}
