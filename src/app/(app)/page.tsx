import Link from "next/link";
import { LensMascot } from "@/components/LensMascot";

const STEPS = [
  {
    n: "STEP 1",
    title: "See",
    body: "Meet manipulation in the wild — react before being told.",
    icon: SearchIcon,
  },
  {
    n: "STEP 2",
    title: "Name",
    body: "Identify which of six techniques is at work, learn the tell.",
    icon: NameIcon,
  },
  {
    n: "STEP 3",
    title: "Build",
    body: "Take the manipulator's seat once — the step that makes it stick.",
    icon: BuildIcon,
  },
];

export default function HomePage() {
  return (
    <section className="mx-auto max-w-[560px] px-5 pb-8 pt-10">
      <div className="mb-8 flex items-start gap-4">
        <LensMascot size={56} />
        <div>
          <h1 className="m-0 font-[family-name:var(--font-poppins)] text-[24px] font-bold leading-tight text-ink">
            San Dauk Lay
          </h1>
          <p className="m-0 mt-1 text-[14px] leading-relaxed text-muted">
            A little detective for your pocket. Meet manipulation in the wild,
            name the technique behind it, then take the manipulator&rsquo;s seat
            once — the move that makes it stick.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="rounded-lg border border-hairline bg-surface p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">{s.n}</span>
                <Icon />
              </div>
              <div className="font-[family-name:var(--font-poppins)] text-[22px] font-bold text-ink">
                {s.title}
              </div>
              <p className="m-0 mt-1 text-[15px] leading-relaxed text-muted">
                {s.body}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        href="/play"
        className="mt-4 flex min-h-[56px] items-center justify-center rounded-full text-[16px] font-bold text-surface no-underline"
        style={{ background: "var(--color-ink)" }}
      >
        Start a case →
      </Link>

      {/* The Casebook band */}
      <div
        className="mt-6 rounded-2xl p-6 text-surface"
        style={{ background: "var(--color-forest)" }}
      >
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.1em] text-sage-soft">
          the casebook · start here
        </p>
        <h2 className="m-0 mt-2 font-[family-name:var(--font-poppins)] text-[24px] font-bold">
          Learn why the tricks work.
        </h2>
        <p className="m-0 mt-2 text-[14px] leading-relaxed text-sage-soft">
          12 short lessons — scams, AI &amp; synthetic media, and how information
          travels. Each ends in practice, never a checkbox.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Six techniques", "AI & synthetic media", "Information integrity"].map(
            (c) => (
              <span
                key={c}
                className="rounded-full border border-white/25 px-3 py-1.5 text-[12.5px] font-semibold"
              >
                {c}
              </span>
            )
          )}
        </div>
        <Link
          href="/learn"
          className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-surface px-5 text-[15px] font-bold text-ink no-underline"
        >
          Open the Hub →
        </Link>
      </div>

      <p className="mt-6 text-center font-mono text-[11px] leading-relaxed text-muted">
        no account needed · works offline · named techniques, never a verdict
      </p>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage)" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
function NameIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage)" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}
function BuildIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 3v18M4 7.5l8 4.5 8-4.5" />
    </svg>
  );
}
