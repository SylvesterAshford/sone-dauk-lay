"use client";

import { useEffect, useState } from "react";
import { LensMascot } from "@/components/LensMascot";
import { TellPanel } from "@/components/spine/TellPanel";
import { ScenarioCard } from "@/components/spine/ScenarioCard";
import { LENS_CASES, techniqueById, type LensCase } from "@/content/pack";

// The Lens (design v4 §9): corner magnifier + bottom sheet, present on every screen.
// This is the OFFLINE scripted flow (§7.7) — "I'll ask the questions, but you'll do
// the looking." No verdicts, ever. Every reply ends with a "what I can't know" block.
// Online /api/lens/analyze (Supabase Edge Function) is a later task.

type View = "intro" | "case" | "escalation";

export function LensOverlay() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("intro");
  const [active, setActive] = useState<LensCase | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-lens", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-lens", onOpen);
    };
  }, []);

  const reset = () => {
    setView("intro");
    setActive(null);
    setRevealed(false);
  };
  const close = () => {
    setOpen(false);
    reset();
  };

  return (
    <>
      {/* corner magnifier — above the bottom nav, every screen */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open the Lens"
          className="fixed right-4 z-40 rounded-full shadow-md"
          style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
        >
          <LensMascot size={56} state="idle" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* dimmed screen beneath stays visible */}
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={close}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="The Lens"
            className="anim-rise relative flex max-h-[75vh] flex-col rounded-t-3xl border-t border-hairline bg-surface"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
              <LensMascot size={32} state={view === "case" && !revealed ? "thinking" : "idle"} />
              <div className="min-w-0 flex-1">
                <div className="display text-[16px] font-bold text-ink">
                  The Lens
                </div>
                <div className="font-mono text-[11px] text-muted">
                  looks with you · never a verdict
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-ink"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              {view === "intro" && (
                <IntroView
                  onPick={(c) => {
                    setActive(c);
                    setRevealed(false);
                    setView("case");
                  }}
                  onEscalate={() => setView("escalation")}
                />
              )}
              {view === "case" && active && (
                <CaseView
                  c={active}
                  revealed={revealed}
                  onReveal={() => setRevealed(true)}
                  onBack={reset}
                />
              )}
              {view === "escalation" && <EscalationView onBack={reset} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function IntroView({
  onPick,
  onEscalate,
}: {
  onPick: (c: LensCase) => void;
  onEscalate: () => void;
}) {
  return (
    <div>
      <p className="mm m-0 text-[19px] font-semibold leading-[1.7] text-ink">
        ဘာကို ကြည့်ကြမလဲ? ပြပါ၊ အတူတူ ကြည့်ရအောင်။
      </p>
      <p className="m-0 mt-1 text-[14px] text-muted">
        What are we looking at? Show me and we&rsquo;ll look together.
      </p>

      <p className="eyebrow mt-6 mb-3">pick something to look at together</p>
      <div className="flex flex-wrap gap-2">
        {LENS_CASES.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c)}
            className="min-h-[44px] rounded-full border border-hairline bg-surface px-4 py-2 text-[15px] font-medium text-ink transition-colors hover:border-forest"
          >
            {c.chip}
          </button>
        ))}
      </div>

      <button
        onClick={onEscalate}
        className="mt-6 text-[15px] font-semibold"
        style={{ color: "var(--color-clay)" }}
      >
        I already sent money →
      </button>
    </div>
  );
}

function CaseView({
  c,
  revealed,
  onReveal,
  onBack,
}: {
  c: LensCase;
  revealed: boolean;
  onReveal: () => void;
  onBack: () => void;
}) {
  const tech = techniqueById(c.tech);
  return (
    <div className="flex flex-col gap-4">
      <ScenarioCard sender={c.sender} meta={c.meta} body={c.body} />

      {!revealed ? (
        <div>
          {/* Move 2: ask before telling */}
          <p className="mm m-0 text-[17px] font-semibold leading-[1.7] text-ink">
            {c.q.mm}
          </p>
          <p className="m-0 mt-1 text-[13.5px] text-muted">{c.q.en}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.answers.map((a) => (
              <button
                key={a}
                onClick={onReveal}
                className="mm min-h-[44px] rounded-full px-4 py-2 text-[15px] text-ink transition-colors"
                style={{ background: "var(--color-sage-soft)" }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="anim-rise">
          {/* Move 3: name what it can see */}
          <p className="eyebrow m-0 mb-1">what this is doing</p>
          <p className="mm m-0 text-[17px] font-semibold text-ink">{tech.mm}</p>
          <p className="m-0 text-[13px] text-muted">{tech.en}</p>
          <TellPanel tell={{ mm: tech.tellMm, en: tech.tellEn }} />

          {/* Move 4a: hand back the work */}
          <p className="eyebrow m-0 mb-2">what you can check yourself</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {c.check.map((ch, i) => (
              <li key={i} className="mm flex gap-2 text-[15px] leading-[1.7] text-ink">
                <span className="text-muted">·</span>
                {ch}
              </li>
            ))}
          </ul>

          {/* Move 4b: the "what I can't know" block — always last, mono, muted */}
          <div className="mt-5 rounded-lg border border-hairline px-4 py-3">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
              what I can&rsquo;t know
            </p>
            <p className="mm m-0 mt-1.5 text-[14px] leading-[1.7] text-muted">
              {c.cant.mm}
            </p>
            <p className="m-0 mt-1 font-mono text-[12px] leading-relaxed text-muted">
              {c.cant.en}
            </p>
          </div>

          <button
            onClick={onBack}
            className="mt-5 rounded-full border border-hairline px-4 py-2 text-[14px] font-medium text-muted hover:border-forest hover:text-ink"
          >
            Look at something else
          </button>
        </div>
      )}
    </div>
  );
}

function EscalationView({ onBack }: { onBack: () => void }) {
  // Calm, not alarmed. No clay, no warning icons. Plain steps, phone numbers as
  // large tap targets. The resource list is a PLACEHOLDER — must be human-verified
  // before launch (spec §7.6). Never generate real numbers.
  return (
    <div>
      <p className="mm m-0 text-[19px] font-semibold leading-[1.7] text-ink">
        အရင်ဆုံး ဒါတွေ လုပ်ပါ။ ဖြည်းဖြည်း လုပ်ရင် ရပါတယ်။
      </p>
      <p className="m-0 mt-1 text-[14px] text-muted">
        Do these first. Step by step is fine.
      </p>
      <ol className="mm mt-4 flex list-decimal flex-col gap-3 pl-5 text-[16px] leading-[1.8] text-ink">
        <li>သင့်ဘဏ်ကို ချက်ချင်း ဖုန်းဆက်ပြီး ငွေလွှဲမှုကို ရပ်ခိုင်းပါ။</li>
        <li>လွှဲပြောင်းမှု အသေးစိတ်ကို မှတ်ထားပါ (အချိန်၊ ပမာဏ၊ အကောင့်)။</li>
        <li>ယုံကြည်ရသူ တစ်ဦးကို အခု အကြောင်းကြားပါ။</li>
      </ol>
      <div className="mt-5 flex flex-col gap-2">
        {["Your bank hotline", "Local police", "A person you trust"].map((label) => (
          <a
            key={label}
            href="#"
            className="flex min-h-[52px] items-center justify-between rounded-lg border border-hairline px-4 text-[15px] font-semibold text-ink no-underline"
          >
            {label}
            <span className="font-mono text-[12px] text-muted">to be added</span>
          </a>
        ))}
      </div>
      <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted">
        placeholder — real numbers must be verified by a person before launch.
      </p>
      <button
        onClick={onBack}
        className="mt-4 text-[14px] font-medium text-muted underline"
      >
        Back
      </button>
    </div>
  );
}
