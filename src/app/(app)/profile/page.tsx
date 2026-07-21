"use client";

import Link from "next/link";
import { MasteryList } from "@/components/spine/MasteryList";
import { useProgress } from "@/lib/progress";

// "You" tab — guest-first. Shows what you can name. Sign-in is optional (syncs
// progress across devices); no feature requires it (Invariant 12).
export default function YouPage() {
  const progress = useProgress();
  return (
    <section className="mx-auto max-w-[560px] px-5 pb-8 pt-10">
      <p className="eyebrow m-0">your casebook</p>
      <h1 className="mt-1 mb-1 display text-[24px] font-bold text-ink">
        What you can name
      </h1>
      <p className="m-0 mb-6 text-[14px] text-muted">
        Progress is measured in techniques you can spot — not lessons or minutes.
      </p>

      <MasteryList />

      <div className="mt-4 rounded-lg border border-hairline bg-surface px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          genuine messages trusted
        </p>
        <p className="mm m-0 mt-1 text-[16px] text-ink">
          {progress.genuineTrusted} / {progress.genuineSeen}
          <span className="ml-2 text-[13px] text-muted">
            trusting real messages is a skill too
          </span>
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-hairline bg-surface px-4 py-4">
        <p className="m-0 text-[14px] text-muted">
          Progress lives on this device. Sign in to keep it across devices —
          entirely optional.
        </p>
        <Link
          href="/login"
          className="mt-3 inline-block rounded-full border border-hairline px-4 py-2 text-[14px] font-semibold text-ink no-underline hover:border-forest"
        >
          Sign in to sync
        </Link>
      </div>
    </section>
  );
}
