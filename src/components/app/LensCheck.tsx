"use client";

import { useState } from "react";
import { LENS_CHECK, CANT_KNOW } from "@/content/lens-check";
import { techniqueById, type TechniqueId } from "@/content/pack";
import { TechniqueIcon } from "@/components/TechniqueIcon";
import { useLang } from "@/lib/lang";
import { useT } from "@/lib/ui";

// The Lens guided check. Six categorisation steps the PLAYER answers, then a
// summary of what their answers point at.
//
// It never returns a verdict (DESIGN.md §14). It names techniques, lists what
// is checkable, and states plainly what it cannot know. Everything here runs
// offline against the player's own answers — nothing is sent anywhere, which
// keeps the "nothing is uploaded" promise on the hero literally true.

const V = "var";
const c = {
  ink: `${V}(--color-ink)`, surface: `${V}(--color-surface)`, hair: `${V}(--color-hairline)`,
  muted: `${V}(--color-meta)`, muted2: `${V}(--color-muted)`, forest: `${V}(--color-forest)`,
  flag: `${V}(--color-clay)`, gold: `${V}(--color-amber)`, goldSoft: `${V}(--color-amber-soft)`,
  sageSoft: `${V}(--color-sage-soft)`,
};

export function LensCheck({ text }: { text: string }) {
  const t = useT();
  const mm = useLang() === "mm";
  const f = (s: { mm: string; en: string }) => (mm ? s.mm : s.en);

  const [at, setAt] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const done = LENS_CHECK.every((s) => picks[s.id] != null);
  const step = LENS_CHECK[Math.min(at, LENS_CHECK.length - 1)];

  const choose = (i: number) => {
    setPicks((p) => ({ ...p, [step.id]: i }));
    // Allowed to reach LENS_CHECK.length — that value IS the result screen.
    // Capping at length-1 made the summary unreachable: you could answer all
    // six steps and just sit on step 6 forever.
    setAt(at + 1);
  };

  if (at < LENS_CHECK.length || !done) {
    const chosen = picks[step.id];
    return (
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] tracking-[0.09em] uppercase ${mm ? "mm" : "font-mono"}`} style={{ color: c.gold }}>
            {at + 1} · {f(step.label)}
          </span>
          <span className={`text-[11px] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{at + 1} / {LENS_CHECK.length}</span>
        </div>
        <div className={`text-[17px] leading-[1.6] ${mm ? "mm font-bold" : "display"}`} style={{ color: c.ink }}>{f(step.q)}</div>
        <div className="flex flex-col gap-2">
          {step.options.map((o, i) => (
            <button key={i} onClick={() => choose(i)}
              className={`rounded-[12px] border-[1.5px] px-4 py-3 text-left text-[14.5px] leading-snug ${mm ? "mm" : ""}`}
              style={{ borderColor: chosen === i ? c.forest : c.hair,
                       background: chosen === i ? c.sageSoft : c.surface, color: c.ink, minHeight: 48 }}>
              {f(o)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAt(Math.max(0, at - 1))} disabled={at === 0}
            className={`rounded-full border-[1.5px] px-4 text-[13.5px] font-semibold ${mm ? "mm" : ""}`}
            style={{ borderColor: c.hair, background: c.surface, color: c.ink, minHeight: 44, opacity: at === 0 ? 0.4 : 1 }}>
            {t("back")}
          </button>
          <div className="flex flex-1 justify-center gap-1.5">
            {LENS_CHECK.map((s, i) => (
              <span key={s.id} className="rounded-full"
                style={{ width: i === at ? 16 : 6, height: 6, background: picks[s.id] != null ? c.forest : "#cfddd2" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- result: what the answers point at. NOT a verdict. ----
  const selected = LENS_CHECK.map((s) => s.options[picks[s.id]]);
  const found = [...new Set(selected.map((o) => o.points).filter(Boolean))] as TechniqueId[];
  const todos = selected.map((o) => o.todo).filter(Boolean) as { mm: string; en: string }[];

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="rounded-[12px] border px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
        <div className={`text-[11px] tracking-[0.08em] uppercase ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("lensYouPasted")}</div>
        <div className={`mt-1.5 text-[14px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>
          {text.slice(0, 180)}{text.length > 180 ? "…" : ""}
        </div>
      </div>

      <div className="rounded-[0_12px_12px_0] px-4 py-3.5" style={{ background: c.goldSoft, borderLeft: `4px solid ${c.gold}` }}>
        <div className={`text-[11px] tracking-[0.08em] uppercase ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("lensPointsAt")}</div>
        {found.length ? (
          <div className="mt-2 flex flex-col gap-2">
            {found.map((id) => (
              <div key={id} className="flex items-center gap-2.5">
                <span className="flex shrink-0" style={{ color: c.flag }}><TechniqueIcon id={id} size={19} /></span>
                <span className={`text-[15px] font-semibold ${mm ? "mm" : ""}`} style={{ color: c.ink }}>
                  {mm ? techniqueById(id).mm : techniqueById(id).en}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={`mt-1.5 text-[14.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.ink }}>{t("lensNothingFlagged")}</div>
        )}
      </div>

      {todos.length > 0 && (
        <div className="rounded-[12px] border px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
          <div className={`text-[11px] tracking-[0.08em] uppercase ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("lensYouCanCheck")}</div>
          <ul className="mt-2 flex flex-col gap-1.5">
            {todos.map((td, i) => (
              <li key={i} className={`flex gap-2 text-[14px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.ink }}>
                <span style={{ color: c.forest }}>·</span>{f(td)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The refusal. §14: this is the feature, not a limitation. */}
      <div className="rounded-[12px] border px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
        <div className={`text-[11px] tracking-[0.08em] uppercase ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("whatICantKnow")}</div>
        <div className={`mt-2 text-[14.5px] leading-[1.8] ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{f(CANT_KNOW)}</div>
      </div>

      <div className={`text-[15px] leading-relaxed ${mm ? "mm font-semibold" : "font-semibold"}`} style={{ color: c.ink }}>{t("lensWhatDoYouThink")}</div>

      <button onClick={() => { setPicks({}); setAt(0); }}
        className={`self-start rounded-full border-[1.5px] px-5 text-[14px] font-semibold ${mm ? "mm" : ""}`}
        style={{ borderColor: c.hair, background: c.surface, color: c.ink, minHeight: 44 }}>
        {t("lensRedo")}
      </button>
    </div>
  );
}
