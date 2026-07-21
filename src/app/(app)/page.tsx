"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mascot } from "@/components/Mascot";

const LOOP = [
  { step: "STEP 1", title: "See", sub: "Meet manipulation in the wild — react before being told.", icon: "see" },
  { step: "STEP 2", title: "Name", sub: "Identify which of six techniques is at work, learn the tell.", icon: "name" },
  { step: "STEP 3", title: "Build", sub: "Take the manipulator's seat once — the step that makes it stick.", icon: "build" },
] as const;

export default function HomePage() {
  const router = useRouter();
  const openLens = () => window.dispatchEvent(new Event("open-lens"));

  return (
    <div className="anim-screen">
      {/* HERO */}
      <div className="flex flex-wrap items-center gap-8 sm:gap-14">
        <div className="min-w-[280px] flex-1">
          <div className="eyebrow">MINGALABA, DETECTIVE</div>
          <h1 className="mm m-0 mt-3.5 mb-1.5 text-[clamp(28px,7vw,44px)] font-semibold leading-[1.6] text-ink">
            လိမ်လည်မှုကို မခံခင် ကြိုသိအောင်။
          </h1>
          <div className="display text-[clamp(20px,3.4vw,28px)] font-bold leading-[1.2] text-muted">
            Learn the trick before it reaches you.
          </div>
          <p className="m-0 mt-[18px] mb-6 max-w-[46ch] text-[15px] leading-relaxed text-muted">
            Sone Dauk Lay is a little detective for your pocket. Meet
            manipulation in the wild, name the technique behind it, then take the
            manipulator&rsquo;s seat once — the move that makes it stick.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/play"
              className="display rounded-full px-7 py-3.5 text-[15px] text-white no-underline"
              style={{ background: "var(--color-ink)" }}
            >
              Start a case →
            </Link>
            <button
              onClick={openLens}
              className="display rounded-full border-[1.5px] border-hairline bg-transparent px-6 py-3.5 text-[15px] text-ink transition-colors hover:border-ink"
            >
              Paste a message
            </button>
          </div>
          <div className="mt-[18px] font-mono text-[11.5px] text-meta">
            no account needed · nothing is uploaded · works offline
          </div>
        </div>

        <div className="relative mx-auto shrink-0 p-4">
          <Mascot size="clamp(132px,32vw,196px)" ring float />
        </div>
      </div>

      {/* CASEBOOK BAND */}
      <button
        onClick={() => router.push("/learn")}
        className="anim-rise mt-8 flex w-full flex-wrap items-center gap-6 rounded-[24px] p-6 text-left text-white transition-transform hover:-translate-y-0.5 sm:mt-13 sm:p-8"
        style={{
          background: "linear-gradient(135deg,#2c4433 0%,#31564a 48%,#1f6f78 100%)",
        }}
      >
        <div className="min-w-[230px] flex-1">
          <div className="font-mono text-[11.5px] tracking-[0.12em]" style={{ color: "rgba(255,255,255,.65)" }}>
            THE CASEBOOK · START HERE
          </div>
          <div className="display mt-1.5 text-[clamp(24px,3.6vw,30px)] leading-[1.12]">
            Learn why the tricks work.
          </div>
          <div className="mt-2 max-w-[48ch] text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,.82)" }}>
            12 short lessons — scams, AI &amp; synthetic media, and how
            information travels. Each ends in practice, never a checkbox.
          </div>
          <div className="mt-4 flex flex-wrap gap-[7px]">
            {["Six techniques", "AI & synthetic media", "Information integrity"].map((c) => (
              <span key={c} className="rounded-full px-[13px] py-1.5 text-[12.5px] font-semibold" style={{ border: "1px solid rgba(255,255,255,.28)" }}>
                {c}
              </span>
            ))}
          </div>
          <span className="display mt-[18px] inline-block rounded-full bg-white px-[22px] py-3 text-[14.5px]" style={{ color: "#1b2a1f" }}>
            Open the Hub →
          </span>
        </div>
      </button>

      {/* 3-STEP LOOP */}
      <div className="mt-8 sm:mt-11">
        <div className="eyebrow mb-3">THE 3-STEP LOOP · PRACTISE WHAT YOU LEARN</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LOOP.map((c, i) => (
            <Link
              key={c.title}
              href="/play"
              className="anim-rise rounded-[20px] border-[1.5px] border-hairline bg-surface p-6 no-underline transition-all hover:-translate-y-1 hover:border-ink"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-meta">{c.step}</span>
                <span style={{ color: "var(--color-green-deep)" }}>
                  {c.icon === "see" && <SearchGlyph />}
                  {c.icon === "name" && <NameGlyph />}
                  {c.icon === "build" && <CubeGlyph />}
                </span>
              </div>
              <div className="display mt-3.5 text-[22px] text-ink">{c.title}</div>
              <div className="mt-1 text-[14px] text-muted">{c.sub}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function NameGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}
function CubeGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </svg>
  );
}
