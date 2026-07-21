// The little detective — a magnifier with a face. Exact port of the confirmed
// design, but built with calc(var(--m) * f) so it scales with any CSS size,
// including a responsive clamp() on the hero.

const f = (n: number) => `calc(var(--m) * ${(n / 196).toFixed(4)})`;

export function Mascot({
  size = "196px",
  ring = false,
  float = false,
}: {
  size?: string; // any CSS length, e.g. "196px" or "clamp(140px,34vw,196px)"
  ring?: boolean;
  float?: boolean;
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
      <div
        className={float ? "anim-floaty relative" : "relative"}
        style={{ width: "var(--m)", height: "var(--m)" }}
      >
        <div
          className="relative rounded-full"
          style={{
            width: "var(--m)",
            height: "var(--m)",
            border: `${f(4)} solid var(--color-ink)`,
            background:
              "radial-gradient(circle at 34% 26%, #a6d9b4 0%, #58b08b 60%, #3f9e6e 100%)",
            boxShadow: "0 18px 40px -12px rgba(35,55,44,.4)",
          }}
        >
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
          background: "radial-gradient(circle at 32% 28%, #a6d9b4 0%, #58b08b 62%)",
        }}
      >
        <span className="absolute rounded-full" style={{ left: px(5), top: px(4), width: px(8), height: px(8), background: "rgba(255,255,255,.72)" }} />
        <span className="absolute rounded-full" style={{ right: px(4), bottom: px(4), width: px(5), height: px(5), background: "var(--color-amber)" }} />
      </div>
      <span className="absolute" style={{ width: px(14), height: px(5), background: "var(--color-ink)", borderRadius: px(3), transform: "rotate(45deg)", right: px(-4), bottom: px(-1) }} />
    </div>
  );
}
