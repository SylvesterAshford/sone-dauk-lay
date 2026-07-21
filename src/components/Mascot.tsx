// The little detective — a magnifier with a face. Exact port of the confirmed design.

export function Mascot({
  size = 196,
  ring = false,
  float = false,
}: {
  size?: number;
  ring?: boolean;
  float?: boolean;
}) {
  const s = size / 196;
  const px = (n: number) => `${n * s}px`;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {ring && (
        <div
          className="anim-ringspin absolute rounded-full"
          style={{ inset: -16, border: "3px dashed #b9d6c4" }}
        />
      )}
      <div className={float ? "anim-floaty relative" : "relative"} style={{ width: size, height: size }}>
        <div
          className="relative rounded-full"
          style={{
            width: size,
            height: size,
            border: `${px(4)} solid var(--color-ink)`,
            background:
              "radial-gradient(circle at 34% 26%, #a6d9b4 0%, #58b08b 60%, #3f9e6e 100%)",
            boxShadow: "0 18px 40px -12px rgba(35,55,44,.4)",
          }}
        >
          <span className="anim-blink absolute rounded-full" style={{ left: "27%", top: "37%", width: px(14), height: px(14), background: "var(--color-ink)" }} />
          <span className="anim-blink absolute rounded-full" style={{ right: "27%", top: "37%", width: px(14), height: px(14), background: "var(--color-ink)" }} />
          <span
            className="absolute"
            style={{
              left: "50%",
              top: "58%",
              transform: "translateX(-50%)",
              width: px(34),
              height: px(17),
              border: `${px(3)} solid var(--color-ink)`,
              borderTop: "none",
              borderRadius: `0 0 ${px(34)} ${px(34)}`,
            }}
          />
        </div>
        <span
          className="absolute"
          style={{
            width: px(58),
            height: px(18),
            background: "var(--color-ink)",
            borderRadius: px(9),
            transform: "rotate(45deg)",
            right: px(-32),
            bottom: px(-2),
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
