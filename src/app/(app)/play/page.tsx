"use client";

import Link from "next/link";
import { useState } from "react";
import { RoundEngine, type RoundSummary } from "@/modules/play/RoundEngine";
import { buildRound, lessonForTechnique } from "@/modules/play/buildRound";
import { techniqueById, type Scenario } from "@/content/pack";

type Mode = "select" | "solo" | "summary";

export default function PlayPage() {
  const [mode, setMode] = useState<Mode>("select");
  const [summary, setSummary] = useState<RoundSummary | null>(null);
  const [round, setRound] = useState<Scenario[]>([]);

  const startSolo = () => {
    setRound(buildRound(5));
    setSummary(null);
    setMode("solo");
  };

  if (mode === "solo") {
    return (
      <RoundEngine
        scenarios={round}
        onComplete={(s) => {
          setSummary(s);
          setMode("summary");
        }}
      />
    );
  }

  if (mode === "summary" && summary) {
    return <Summary summary={summary} onAgain={startSolo} />;
  }

  return <ModeSelect onSolo={startSolo} />;
}

function ModeSelect({ onSolo }: { onSolo: () => void }) {
  return (
    <section
      className="min-h-[calc(100vh-96px)] px-5 pb-8 pt-10"
      style={{ background: "var(--color-forest)" }}
    >
      <div className="mx-auto max-w-[560px] text-surface">
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.1em] text-sage-soft">
          the game
        </p>
        <h1 className="m-0 mt-1 mb-6 font-[family-name:var(--font-poppins)] text-[26px] font-bold">
          Play a case
        </h1>

        <button
          onClick={onSolo}
          className="w-full rounded-2xl bg-surface p-5 text-left text-ink"
        >
          <div className="font-[family-name:var(--font-poppins)] text-[20px] font-bold">
            Solo case
          </div>
          <p className="m-0 mt-1 text-[14px] text-muted">
            Five messages. Find the technique.
          </p>
        </button>

        <div className="mt-3 w-full rounded-2xl border border-white/20 p-5 opacity-80">
          <div className="flex items-center justify-between">
            <div className="font-[family-name:var(--font-poppins)] text-[20px] font-bold">
              Villain&rsquo;s Seat
            </div>
            <LockIcon />
          </div>
          <p className="m-0 mt-1 text-[14px] text-sage-soft">
            Finish one case first — you&rsquo;ll meet the defence before the
            attack.
          </p>
        </div>

        <div className="mt-3 w-full rounded-2xl border border-white/20 p-5">
          <div className="font-[family-name:var(--font-poppins)] text-[20px] font-bold">
            Table mode
          </div>
          <p className="m-0 mt-1 text-[14px] text-sage-soft">
            Group play — phone as facilitator, or the printed deck.
          </p>
        </div>

        <p className="mt-6 font-mono text-[11px] text-sage-soft">
          all three work offline
        </p>
      </div>
    </section>
  );
}

function Summary({
  summary,
  onAgain,
}: {
  summary: RoundSummary;
  onAgain: () => void;
}) {
  const named = summary.named;
  const missed = summary.missed;

  return (
    <section className="mx-auto max-w-[560px] px-5 pb-8 pt-10">
      <p className="eyebrow m-0">round complete</p>
      <h1 className="mt-1 mb-6 font-[family-name:var(--font-poppins)] text-[24px] font-bold text-ink">
        How you did
      </h1>

      {/* techniques named */}
      <p className="eyebrow m-0 mb-2">techniques you named</p>
      {named.length === 0 ? (
        <p className="m-0 text-[14px] text-muted">None this round — that&rsquo;s fine.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {named.map((id) => {
            const t = techniqueById(id);
            return (
              <div key={id} className="flex items-center gap-2 rounded-lg border border-hairline bg-surface px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                <span className="mm text-[16px] font-semibold text-ink">{t.mm}</span>
                <span className="text-[13px] text-muted">{t.en}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* missed — neutral, each routes to its lesson */}
      {missed.length > 0 && (
        <>
          <p className="eyebrow m-0 mb-2 mt-6">worth another look</p>
          <div className="flex flex-col gap-2">
            {missed.map((m, i) => {
              const t = techniqueById(m.id);
              const lessonId = lessonForTechnique(m.id);
              return (
                <Link
                  key={`${m.id}-${i}`}
                  href={lessonId ? `/learn/${lessonId}` : "/learn"}
                  className="flex items-center justify-between rounded-lg border border-hairline bg-surface px-4 py-3 no-underline"
                >
                  <span>
                    <span className="mm block text-[16px] font-semibold text-ink">{t.mm}</span>
                    <span className="text-[13px] text-muted">{t.en}</span>
                  </span>
                  <span className="text-[13px] font-semibold text-muted">Learn why →</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* genuine messages trusted — a score line on purpose */}
      {summary.genuineTotal > 0 && (
        <div className="mt-6 rounded-lg border border-hairline bg-surface px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            genuine messages you trusted
          </p>
          <p className="mm m-0 mt-1 text-[16px] text-ink">
            ✓ {summary.genuineTrusted} of {summary.genuineTotal}
          </p>
        </div>
      )}

      <button
        onClick={onAgain}
        className="mt-6 min-h-[52px] w-full rounded-full text-[16px] font-bold text-surface"
        style={{ background: "var(--color-ink)" }}
      >
        Play again
      </button>
    </section>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
