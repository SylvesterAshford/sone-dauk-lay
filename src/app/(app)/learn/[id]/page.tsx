"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { lessonById, techniqueById } from "@/content/pack";
import { ScenarioCard } from "@/components/spine/ScenarioCard";
import { TellPanel } from "@/components/spine/TellPanel";
import { RoundEngine } from "@/modules/play/RoundEngine";
import { buildRound } from "@/modules/play/buildRound";

// Five beats, one per screen. Tap-forward only, no swipe (design v4 §8.3).
// Beat 4 is THE BRIDGE — launches a real round, returns to beat 5 automatically.
export default function LessonReader() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const lesson = lessonById(id);
  const [beat, setBeat] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-[560px] px-5 pt-10">
        <p className="text-muted">Lesson not found.</p>
      </div>
    );
  }

  const tech = techniqueById(lesson.technique);

  return (
    <div className="flex min-h-[calc(100vh-96px)] flex-col">
      {/* five-segment bar */}
      <div className="sticky top-0 z-10 bg-mist px-5 pb-3 pt-4">
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <button
            onClick={() => (beat === 1 ? router.push("/learn") : setBeat((b) => b - 1))}
            aria-label="Back"
            className="grid h-8 w-8 place-items-center rounded-full text-muted"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <ol className="flex flex-1 list-none gap-1.5 p-0" aria-label="Lesson progress">
            {[1, 2, 3, 4, 5].map((n) => (
              <li
                key={n}
                aria-current={n === beat ? "step" : undefined}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: n <= beat ? "var(--color-forest)" : "var(--color-hairline)" }}
              />
            ))}
          </ol>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[560px] flex-1 px-5 py-4">
        {/* Beat 1 — Meet it: full-bleed scenario, no title */}
        {beat === 1 && (
          <div className="animate-fade flex flex-col gap-6 pt-6">
            <ScenarioCard sender={lesson.meet.sender} meta={lesson.meet.meta} body={lesson.meet} />
            <Forward onClick={() => setBeat(2)} label="What's going on here? →" />
          </div>
        )}

        {/* Beat 2 — How it works: prose (the only long-reading screen) */}
        {beat === 2 && (
          <div className="animate-fade pt-2">
            <p className="eyebrow m-0 mb-2">how it works</p>
            <h2 className="mm m-0 mb-4 text-[22px] font-semibold leading-[1.7] text-ink">
              {lesson.title.mm}
            </h2>
            <p className="mm m-0 max-w-[34ch] text-[16px] leading-[1.8] text-ink">
              {lesson.how.mm}
            </p>
            <p className="m-0 mt-4 text-[14px] leading-relaxed text-muted">
              {lesson.how.en}
            </p>
            <Forward onClick={() => setBeat(3)} label="So what's the tell? →" />
          </div>
        )}

        {/* Beat 3 — The tell: alone, centred */}
        {beat === 3 && (
          <div className="animate-fade flex min-h-[50vh] flex-col justify-center">
            <TellPanel tell={lesson.tell} />
            <Forward onClick={() => setBeat(4)} label="Try it →" />
          </div>
        )}

        {/* Beat 4 — THE BRIDGE: a real round, no lesson framing, returns to beat 5 */}
        {beat === 4 && (
          <div className="animate-fade -mx-5">
            <RoundEngine
              scenarios={buildRound(3, lesson.technique)}
              onComplete={() => setBeat(5)}
            />
          </div>
        )}

        {/* Beat 5 — Carry it: forest reversed, the ONLY copyable text */}
        {beat === 5 && (
          <div className="animate-fade flex min-h-[50vh] flex-col justify-center">
            <div className="rounded-2xl p-6 text-surface" style={{ background: "var(--color-forest)" }}>
              <p className="m-0 font-mono text-[11px] uppercase tracking-[0.1em] text-sage-soft">
                carry it
              </p>
              <p className="mm m-0 mt-3 text-[20px] font-medium leading-[1.8]">
                {lesson.carry.mm}
              </p>
              <p className="m-0 mt-2 text-[14px] leading-relaxed text-sage-soft">
                {lesson.carry.en}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${lesson.carry.mm}\n${lesson.carry.en}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }}
                className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-surface px-4 text-[14px] font-bold text-ink"
              >
                {copied ? "Copied ✓" : "Copy this sentence"}
              </button>
              <p className="m-0 mt-3 font-mono text-[11px] text-sage-soft">
                the only text in this app you can copy out.
              </p>
            </div>
            <button
              onClick={() => router.push("/learn")}
              className="mt-5 min-h-[52px] rounded-full border border-hairline text-[15px] font-semibold text-ink"
            >
              Back to the casebook
            </button>
            <p className="mt-3 text-center text-[13px] text-muted">
              You practised: <span className="mm font-semibold text-ink">{tech.mm}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Forward({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 min-h-[52px] w-full rounded-full text-[16px] font-bold text-surface"
      style={{ background: "var(--color-ink)" }}
    >
      {label}
    </button>
  );
}
