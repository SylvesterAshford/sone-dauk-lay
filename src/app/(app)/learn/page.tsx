"use client";

import Link from "next/link";
import { LESSONS, TRACKS, type Lesson } from "@/content/pack";
import { useProgress, stateFor } from "@/lib/progress";
import { StateBadge } from "@/components/spine/StateBadge";
import type { ProgressLike } from "@/lib/progressTypes";

export default function LearnPage() {
  const progress = useProgress();

  return (
    <section className="mx-auto max-w-[560px] px-5 pb-8 pt-10">
      <p className="eyebrow m-0">the casebook</p>
      <h1 className="mt-1 mb-1 font-[family-name:var(--font-poppins)] text-[24px] font-bold text-ink">
        Learn why the tricks work
      </h1>
      <p className="m-0 mb-6 text-[14px] text-muted">
        12 short lessons. Each ends in practice, never a checkbox.
      </p>

      {TRACKS.map((track) => {
        const lessons = LESSONS.filter((l) => l.track === track.n);
        const practised = lessons.filter(
          (l) => stateForLesson(progress, l) === "practised" || stateForLesson(progress, l) === "mastered"
        ).length;
        return (
          <div key={track.n} className="mb-8">
            <div
              className="mb-3 border-l-[3px] pl-3"
              style={{ borderColor: track.accent }}
            >
              <div className="mm text-[18px] font-semibold text-ink">{track.mm}</div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-muted">
                  Track {track.n} · {track.en}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {practised} of {lessons.length} practised
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {lessons.map((l) => (
                <LessonCard key={l.id} lesson={l} accent={track.accent} progress={progress} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function stateForLesson(progress: ProgressLike, l: Lesson) {
  return stateFor(progress.tech[l.technique]);
}

function LessonCard({
  lesson,
  accent,
  progress,
}: {
  lesson: Lesson;
  accent: string;
  progress: ProgressLike;
}) {
  return (
    <Link
      href={`/learn/${lesson.id}`}
      className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-surface py-3 pl-3 pr-4 no-underline"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <span className="min-w-0">
        <span className="mm block text-[17px] font-semibold leading-snug text-ink">
          {lesson.title.mm}
        </span>
        <span className="block text-[13px] text-muted">{lesson.title.en}</span>
      </span>
      <StateBadge state={stateForLesson(progress, lesson)} />
    </Link>
  );
}
