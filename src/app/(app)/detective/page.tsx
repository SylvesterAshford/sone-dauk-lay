"use client";

import { useState } from "react";
import { Mascot } from "@/components/Mascot";
import { RULES, EXAMPLE, tier, dots } from "@/lib/modules";

export default function AiDetectivePage() {
  const [msg, setMsg] = useState("");
  const hasMsg = msg.trim().length > 0;
  const matches = hasMsg ? RULES.filter((r) => r.re.test(msg)) : [];
  const score = matches.length;
  const t = tier(score);
  const mood = t.g ? "happy" : t.a ? "amber" : "red";

  return (
    <section className="mx-auto grid max-w-[1060px] grid-cols-1 items-start gap-12 px-6 pb-20 pt-14 sm:px-10 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="font-mono text-xs tracking-[0.12em] text-muted-2">
          CASE 02
        </div>
        <div className="mt-2.5 mb-2 flex flex-wrap items-baseline gap-3.5">
          <h1 className="m-0 font-display text-4xl font-extrabold text-ink">
            AI Detective
          </h1>
          <span className="rounded-full border-[1.5px] border-mustard px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-mustard">
            keyword rules · not real AI
          </span>
        </div>
        <p className="m-0 mb-6 max-w-[48ch] text-pretty text-muted">
          Paste the SMS, chat, or email below. It gets inspected live as you
          type.
        </p>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Paste the suspicious message here…"
          className="min-h-[220px] w-full resize-y rounded-[20px] border-[1.5px] border-line bg-card p-5 text-[15px] leading-relaxed text-ink placeholder:text-faint focus:border-ink"
        />
        <div className="mt-3.5 flex gap-2.5">
          <button
            onClick={() => setMsg(EXAMPLE)}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-mint transition-colors hover:bg-ink-soft"
          >
            Load example scam
          </button>
          <button
            onClick={() => setMsg("")}
            className="rounded-full border-[1.5px] border-line px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-ink hover:text-ink"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-[18px] rounded-3xl border-[1.5px] border-line bg-card px-7 py-8 text-center lg:sticky lg:top-8">
        {hasMsg ? (
          <>
            <Mascot size={84} face={t.face} mood={mood} />
            <div className="flex gap-2">
              {dots(score, t.color).map((d, i) => (
                <span
                  key={i}
                  className="block h-[13px] w-[13px] rounded-full transition-colors"
                  style={{ background: d.bg }}
                />
              ))}
            </div>
            <div>
              <div
                className="font-display text-2xl font-extrabold"
                style={{ color: t.color }}
              >
                {t.label}
              </div>
              <p className="mt-2 text-pretty text-sm text-muted">{t.advice}</p>
            </div>
            {score > 0 && (
              <div className="flex w-full flex-col gap-2 border-t-[1.5px] border-dashed border-line pt-4">
                <div className="font-mono text-[11px] tracking-[0.1em] text-muted-2">
                  SIGNS FOUND
                </div>
                {matches.map((m) => (
                  <div
                    key={m.key}
                    className="flex items-center gap-2.5 text-left text-[13.5px] font-medium text-ink"
                  >
                    <span
                      className="block h-2 w-2 shrink-0 rounded-full"
                      style={{ background: t.color }}
                    />
                    {m.key}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <Mascot size={84} face="#eef4ef" mood="sleep" className="opacity-40" />
            <p className="m-0 text-sm text-muted-2">
              The detective is napping.
              <br />
              Paste a message to wake them up.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
