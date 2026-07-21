"use client";

import Link from "next/link";
import { useState } from "react";
import { LESSONS, TRACKS, TECHNIQUES } from "@/content/pack";
import { useProgress, stateFor } from "@/lib/progress";
import { TechniqueIcon } from "@/components/TechniqueIcon";

const STATE_TAG: Record<string, string> = {
  not_met: "not met",
  met: "met",
  practised: "practised",
  mastered: "mastered",
};

export default function HubPage() {
  const progress = useProgress();
  const [tab, setTab] = useState(1);
  const track = TRACKS.find((t) => t.n === tab)!;
  const lessons = LESSONS.filter((l) => l.track === tab);
  const practised = lessons.filter((l) => {
    const s = stateFor(progress.tech[l.technique]);
    return s === "practised" || s === "mastered";
  }).length;

  return (
    <div className="anim-screen mx-auto flex max-w-[700px] flex-col gap-6">
      <div>
        <span className="eyebrow">THE CASEBOOK</span>
        <h1 className="display m-0 mt-2 mb-1.5 text-[26px] text-ink">
          Why the tricks work.
        </h1>
        <p className="m-0 max-w-[54ch] text-[14px] leading-relaxed text-muted">
          Short lessons behind the loop — about four minutes each. Every lesson
          ends in <b>practice, never a checkbox</b>. Reading alone changes
          nothing; naming a technique in the wild does.
        </p>
      </div>

      {/* techniques you can name */}
      <div className="rounded-[16px] border-[1.5px] border-hairline bg-surface p-[18px]">
        <div className="eyebrow" style={{ fontSize: 11 }}>
          TECHNIQUES YOU CAN NAME
        </div>
        <div className="mt-3 grid grid-cols-1 gap-x-[18px] gap-y-3 sm:grid-cols-2">
          {TECHNIQUES.map((t) => {
            const st = stateFor(progress.tech[t.id]);
            return (
              <div key={t.id} className="flex items-center gap-2.5">
                <span
                  className="flex shrink-0"
                  style={{ color: st === "not_met" ? "var(--color-meta)" : "var(--color-ink)" }}
                >
                  <TechniqueIcon id={t.id} size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold leading-tight text-ink">{t.en}</div>
                  <div className="font-mono text-[10px] text-meta">{STATE_TAG[st]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* track tabs */}
      <div className="flex gap-1 rounded-[12px] p-1" style={{ background: "#e4ede7" }}>
        {TRACKS.map((t) => {
          const on = t.n === tab;
          return (
            <button
              key={t.n}
              onClick={() => setTab(t.n)}
              className="flex-1 rounded-[9px] px-2 py-2.5 text-[12.5px] font-semibold transition-colors"
              style={{
                background: on ? "var(--color-surface)" : "transparent",
                color: on ? "var(--color-ink)" : "var(--color-muted)",
                boxShadow: on ? "0 1px 3px rgba(35,55,44,.12)" : "none",
              }}
            >
              Track {t.n}
            </button>
          );
        })}
      </div>

      {/* active track lessons */}
      <div className="anim-slide flex flex-col gap-3">
        <div
          className="flex flex-wrap items-baseline justify-between gap-3 pt-3"
          style={{ borderTop: `3px solid ${track.accent}` }}
        >
          <div className="min-w-[180px] flex-1">
            <div className="mm text-[16.5px] font-semibold text-ink">{track.mm}</div>
            <div className="text-[13.5px] font-semibold text-muted">
              Track {track.n} · {track.en}
            </div>
          </div>
          <div className="font-mono text-[11px] text-meta">
            {practised} of {lessons.length} practised
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {lessons.map((l) => (
            <Link
              key={l.id}
              href={`/learn/${l.id}`}
              className="flex items-center gap-3 rounded-[12px] border-[1.5px] border-hairline bg-surface py-3 pl-[15px] pr-4 no-underline transition-all hover:translate-x-[3px] hover:border-ink"
              style={{ borderLeft: `4px solid ${track.accent}` }}
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px]"
                style={{ background: "#eef1f0", color: track.accent }}
              >
                <TechniqueIcon id={l.technique} size={21} bg="#eef1f0" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mm text-[15.5px] font-semibold leading-[1.65] text-ink">{l.title.mm}</div>
                <div className="text-[12.5px] text-meta">{l.title.en}</div>
              </div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-meta">
                {STATE_TAG[stateFor(progress.tech[l.technique])]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
