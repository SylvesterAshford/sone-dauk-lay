"use client";

import { useRef, useState } from "react";
import type { Scenario, TechniqueId } from "@/content/pack";
import { TECHNIQUES } from "@/content/pack";
import { ScenarioCard } from "@/components/spine/ScenarioCard";
import { TechniqueChip } from "@/components/spine/TechniqueChip";
import { TellPanel } from "@/components/spine/TellPanel";
import { VoteButtons, type Vote } from "@/components/spine/VoteButtons";
import { recordEncounter, recordNamed, recordGenuine } from "@/lib/progress";

// The round engine — shared spine for Solo case AND the Learn bridge (design v4 §8.3).
// See -> Name -> Reveal, per scenario. NO live score (spec §5.2). A bridge round is
// indistinguishable from a Solo round except by length.

export type RoundSummary = {
  named: TechniqueId[];
  missed: { id: TechniqueId; scenarioId: string }[];
  genuineTrusted: number;
  genuineTotal: number;
};

type Phase = "see" | "name" | "reveal";

export function RoundEngine({
  scenarios,
  onComplete,
}: {
  scenarios: Scenario[];
  onComplete: (summary: RoundSummary) => void;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("see");
  const [vote, setVote] = useState<Vote | null>(null);
  const [picked, setPicked] = useState<TechniqueId[]>([]);
  const [revealedGlyphs, setRevealedGlyphs] = useState<boolean[]>(
    () => scenarios.map(() => false)
  );

  const accRef = useRef({
    named: new Set<TechniqueId>(),
    missed: [] as { id: TechniqueId; scenarioId: string }[],
    genuineTrusted: 0,
    genuineTotal: 0,
  });
  const acc = accRef.current;

  const sc = scenarios[index];
  const last = index === scenarios.length - 1;

  const toggle = (id: TechniqueId) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  function commitReveal() {
    // Update mastery (identical for Solo and bridge).
    if (sc.genuine) {
      acc.genuineTotal += 1;
      const trusted = vote === "trust";
      if (trusted) acc.genuineTrusted += 1;
      recordGenuine(trusted);
    } else {
      for (const t of sc.techniques) {
        recordEncounter(t);
        if (picked.includes(t)) {
          acc.named.add(t);
          recordNamed(t, sc.platform);
        } else {
          acc.missed.push({ id: t, scenarioId: sc.id });
        }
      }
    }
    setRevealedGlyphs((g) => g.map((v, i) => (i === index ? true : v)));
    setPhase("reveal");
  }

  function next() {
    if (last) {
      onComplete({
        named: [...acc.named],
        missed: acc.missed,
        genuineTrusted: acc.genuineTrusted,
        genuineTotal: acc.genuineTotal,
      });
      return;
    }
    setIndex((i) => i + 1);
    setPhase("see");
    setVote(null);
    setPicked([]);
  }

  return (
    <div className="mx-auto max-w-[560px] px-5 pb-8 pt-6">
      {/* segmented progress — one segment per scenario, no timer, no counter */}
      <div className="mb-6 flex gap-1.5">
        {scenarios.map((_, i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{
              background:
                revealedGlyphs[i] || i === index
                  ? "var(--color-forest)"
                  : "var(--color-hairline)",
            }}
          />
        ))}
      </div>

      <p className="eyebrow m-0 mb-3">
        {phase === "name" ? "name the technique" : phase === "reveal" ? "the reveal" : "see"}
      </p>

      {phase === "see" && (
        <div className="flex flex-col gap-5">
          <ScenarioCard
            sender={sc.sender}
            meta={sc.meta}
            platform={sc.platform}
            body={sc.body}
          />
          <div>
            <p className="mm m-0 mb-2 text-[15px] text-muted">
              ဒီစာကို ဘယ်လို ခံစားရလဲ?
              <span className="ml-1 text-muted">First reaction?</span>
            </p>
            <VoteButtons value={vote} onVote={setVote} />
          </div>
          <button
            disabled={!vote}
            onClick={() => setPhase("name")}
            className="min-h-[52px] rounded-full text-[16px] font-bold text-surface disabled:opacity-40"
            style={{ background: "var(--color-ink)" }}
          >
            Name the technique →
          </button>
        </div>
      )}

      {phase === "name" && (
        <div className="flex flex-col gap-3.5">
          <div className="display text-[22px] text-ink">
            Which technique is this using?
          </div>
          <p className="m-0 -mt-2 text-[13.5px] text-muted">
            Pick as many as apply — real messages stack tricks. Or none, if it
            looks genuine.
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {TECHNIQUES.map((t) => (
              <TechniqueChip
                key={t.id}
                technique={t}
                checked={picked.includes(t.id)}
                onToggle={() => toggle(t.id)}
              />
            ))}
          </div>
          <button
            onClick={commitReveal}
            className="display mt-1 min-h-[52px] rounded-full text-[15px] text-white"
            style={{ background: "var(--color-ink)" }}
          >
            Check
          </button>
        </div>
      )}

      {phase === "reveal" && (
        <Reveal sc={sc} picked={picked} vote={vote} last={last} onNext={next} />
      )}
    </div>
  );
}

function Reveal({
  sc,
  picked,
  vote,
  last,
  onNext,
}: {
  sc: Scenario;
  picked: TechniqueId[];
  vote: Vote | null;
  last: boolean;
  onNext: () => void;
}) {
  if (sc.genuine) {
    return (
      <div className="anim-rise flex flex-col gap-4">
        <ScenarioCard sender={sc.sender} meta={sc.meta} platform={sc.platform} body={sc.body} />
        <div className="rounded-lg border border-hairline bg-surface p-4">
          <p className="m-0 flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.06em] text-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
            genuine
          </p>
          <p className="mm m-0 mt-2 text-[15px] leading-[1.7] text-ink">
            {vote === "doubt"
              ? "ဒါ တကယ့်စာပါ — ယုံလိုက်တာ မှန်ပါတယ်။"
              : "ဒါ တကယ့်စာပါ။ အမှန်ကို ယုံတတ်တာလည်း ကျွမ်းကျင်မှုတစ်ခုပါ။"}
          </p>
          <p className="m-0 mt-1 text-[13px] text-muted">
            {vote === "doubt"
              ? "This one's real — trusting it was the right call to make."
              : "This one's real. Trusting true things is a skill too."}
          </p>
        </div>
        <NextBtn last={last} onNext={onNext} />
      </div>
    );
  }

  const primary = TECHNIQUES.find((t) => t.id === sc.techniques[0]);
  return (
    <div className="anim-rise flex flex-col gap-3">
      <ScenarioCard sender={sc.sender} meta={sc.meta} platform={sc.platform} body={sc.body} />
      {sc.techniques.map((id) => {
        const t = TECHNIQUES.find((x) => x.id === id)!;
        const named = picked.includes(id);
        return (
          <TechniqueChip
            key={id}
            technique={t}
            checked
            disabled
            tone={named ? "correct" : "missed"}
          />
        );
      })}
      {primary && <TellPanel tell={{ mm: primary.tellMm, en: primary.tellEn }} />}
      <NextBtn last={last} onNext={onNext} />
    </div>
  );
}

function NextBtn({ last, onNext }: { last: boolean; onNext: () => void }) {
  return (
    <button
      onClick={onNext}
      className="mt-2 min-h-[52px] rounded-full text-[16px] font-bold text-surface"
      style={{ background: "var(--color-forest)" }}
    >
      {last ? "See how you did →" : "Next →"}
    </button>
  );
}
