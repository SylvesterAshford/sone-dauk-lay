"use client";

import { useState } from "react";
import { DetectiveMascot, RoleBadge, HAT_IDS, type HatId } from "@/components/Mascot";
import { FRAGMENTS, TECHNIQUES, techniqueById, type TechniqueId } from "@/content/pack";
import { SITUATIONS, REASON_MOVES, type Situation } from "@/content/round-claims";
import { useLang } from "@/lib/lang";
import { useT, type UIKey } from "@/lib/ui";

const HAT_LABEL: Record<HatId, UIKey> = {
  deerstalker: "hatDeerstalker", beanie: "hatBeanie",
  newsboy: "hatNewsboy", visor: "hatVisor",
};

// The pass-and-play imposter round (MULTIPLAYER.md, DESIGN.md §16).
//
// 3-4 friends physically together, ONE phone, no network, no accounts, nothing
// stored. Everyone argues from the same persuasion deck; one player is secretly
// arguing the opposite conclusion. The room talks it out, votes, and the fooled
// count is computed from the votes actually cast — never invented.

const V = "var";
const c = {
  ink: `${V}(--color-ink)`, surface: `${V}(--color-surface)`, hair: `${V}(--color-hairline)`,
  muted: `${V}(--color-meta)`, muted2: `${V}(--color-muted)`, forest: `${V}(--color-forest)`,
  flag: `${V}(--color-clay)`, flagSoft: `${V}(--color-clay-soft)`, sageSoft: `${V}(--color-sage-soft)`,
  gold: `${V}(--color-amber)`, goldSoft: `${V}(--color-amber-soft)`,
};

type Player = { name: string; hat: HatId };

type Phase =
  | { k: "setup" }
  | { k: "handoff"; i: number }
  | { k: "turn"; i: number }
  | { k: "lineup" }
  | { k: "voteHandoff"; i: number }
  | { k: "vote"; i: number }
  | { k: "reveal" };

const blankPlayers = (): Player[] => [
  { name: "", hat: "deerstalker" },
  { name: "", hat: "beanie" },
  { name: "", hat: "newsboy" },
];

export function PassAndPlay({ onExit }: { onExit: () => void }) {
  const t = useT();
  const mm = useLang() === "mm";
  const f = (s: { mm: string; en: string }) => (mm ? s.mm : s.en);

  const [players, setPlayers] = useState<Player[]>(blankPlayers);
  const [phase, setPhase] = useState<Phase>({ k: "setup" });
  const [situation, setSituation] = useState<Situation>(SITUATIONS[0]);
  const [manipulator, setManipulator] = useState(0);
  // The technique the Manipulator is secretly told to persuade with. Detectives
  // must argue the same conclusion using a checkable reason instead.
  const [assigned, setAssigned] = useState<TechniqueId>(TECHNIQUES[0].id);
  const [lines, setLines] = useState<string[]>([]);
  const [votes, setVotes] = useState<number[]>([]);
  const [draft, setDraft] = useState("");
  const [pick, setPick] = useState<number | null>(null);

  const named = players.filter((p) => p.name.trim().length > 0);
  const canDeal = named.length >= 3 && players.every((p) => p.name.trim().length > 0);

  const deal = () => {
    setSituation(SITUATIONS[Math.floor(Math.random() * SITUATIONS.length)]);
    setManipulator(Math.floor(Math.random() * players.length));
    setAssigned(TECHNIQUES[Math.floor(Math.random() * TECHNIQUES.length)].id);
    setLines(Array(players.length).fill(""));
    setVotes(Array(players.length).fill(-1));
    setDraft("");
    setPhase({ k: "handoff", i: 0 });
  };

  const submitLine = (i: number) => {
    const next = [...lines];
    next[i] = draft.trim();
    setLines(next);
    setDraft("");
    setPhase(i + 1 < players.length ? { k: "handoff", i: i + 1 } : { k: "lineup" });
  };

  const submitVote = (i: number) => {
    if (pick === null) return;
    const next = [...votes];
    next[i] = pick;
    setVotes(next);
    setPick(null);
    setPhase(i + 1 < players.length ? { k: "voteHandoff", i: i + 1 } : { k: "reveal" });
  };

  const reset = () => { setPhase({ k: "setup" }); setDraft(""); setPick(null); };

  /* ---------- shared bits ---------- */

  const Eyebrow = ({ children }: { children: React.ReactNode }) => (
    <div className={`text-[12px] tracking-[0.14em] uppercase ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{children}</div>
  );

  const Chip = ({ p, size = "34px" }: { p: Player; size?: string }) => (
    <span className="inline-flex items-center gap-1.5">
      <DetectiveMascot size={size} hat={p.hat} blink={false} label="" />
      <span className={`text-[14px] font-semibold ${mm ? "mm" : ""}`} style={{ color: c.ink }}>{p.name}</span>
    </span>
  );

  // The handover gate (§16.2). No motion, no character art, nothing secret on
  // screen. Passed 8+ times a round, so instant beats animated.
  const Gate = ({ name, hint, onOpen }: { name: string; hint: string; onOpen: () => void }) => (
    <div className="mx-auto flex max-w-[620px] flex-col items-center gap-5 py-10 text-center">
      <Eyebrow>{t("passTo")}</Eyebrow>
      <div className={`text-[30px] leading-tight ${mm ? "mm font-bold" : "display"}`} style={{ color: c.ink }}>{name}</div>
      <div className={`text-[13.5px] ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{t("passGateWarn")}</div>
      <button onClick={onOpen}
        className={`w-full rounded-full px-6 text-[15px] text-white ${mm ? "mm font-bold" : "display"}`}
        style={{ background: c.ink, minHeight: 52 }}>{hint}</button>
    </div>
  );

  const Header = ({ label, back }: { label: string; back?: () => void }) => (
    <div className="flex items-center justify-between">
      {back
        ? <button onClick={back} className={`text-[13.5px] font-semibold ${mm ? "mm" : ""}`} style={{ color: c.muted }}>{t("back")}</button>
        : <span />}
      <span className={`text-[12px] tracking-[0.14em] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{label}</span>
    </div>
  );

  /* ---------- setup ---------- */

  if (phase.k === "setup") {
    const setName = (i: number, name: string) =>
      setPlayers(players.map((p, j) => (j === i ? { ...p, name } : p)));
    const setHat = (i: number, hat: HatId) =>
      setPlayers(players.map((p, j) => (j === i ? { ...p, hat } : p)));

    return (
      <div className="anim-screen mx-auto flex max-w-[620px] flex-col gap-4">
        <Header label={t("tableTitle")} back={onExit} />
        <div>
          <div className={`text-[22px] ${mm ? "mm font-bold leading-[1.6]" : "display"}`} style={{ color: c.ink }}>{t("tableTitle")}</div>
          <div className={`mt-1 text-[14px] ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{t("tableSub")}</div>
        </div>

        <div className="rounded-[14px] border-[1.5px] px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
          <Eyebrow>{t("tableHowTitle")}</Eyebrow>
          <p className={`mt-1.5 text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{t("tableHowBody")}</p>
        </div>

        <Eyebrow>{t("playersLabel")}</Eyebrow>
        <div className="flex flex-col gap-3">
          {players.map((p, i) => {
            const taken = (h: HatId) => players.some((q, j) => j !== i && q.hat === h);
            return (
              <div key={i} className="rounded-[14px] border-[1.5px] p-3" style={{ borderColor: c.hair, background: c.surface }}>
                <div className="flex items-center gap-2.5">
                  <DetectiveMascot size="44px" hat={p.hat} blink={false} label="" />
                  <input value={p.name} onChange={(e) => setName(i, e.target.value)}
                    placeholder={`${t("playerNamePlaceholder")} ${i + 1}`} maxLength={14}
                    className={`min-w-0 flex-1 rounded-[10px] border-[1.5px] px-3 py-2.5 text-[15px] ${mm ? "mm" : ""}`}
                    style={{ borderColor: c.hair, color: c.ink, background: c.surface }} />
                  {players.length > 3 && (
                    <button onClick={() => setPlayers(players.filter((_, j) => j !== i))}
                      aria-label={t("removePlayer")} className="shrink-0 rounded-full px-3 py-2 text-[13px] font-semibold"
                      style={{ color: c.flag }}>×</button>
                  )}
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {HAT_IDS.map((h) => {
                    const sel = p.hat === h;
                    const used = taken(h);
                    return (
                      <button key={h} onClick={() => !used && setHat(i, h)} disabled={used} aria-pressed={sel}
                        aria-label={`${t(HAT_LABEL[h])}${used ? ` — ${t("hatTaken")}` : ""}`}
                        className="rounded-full border-2 p-1 transition-all"
                        style={{
                          borderColor: sel ? c.ink : c.hair,
                          background: sel ? c.sageSoft : c.surface,
                          opacity: used && !sel ? 0.28 : 1,
                        }}>
                        <DetectiveMascot size="30px" hat={h} blink={false} label="" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {players.length < 4 && (
          <button onClick={() => setPlayers([...players, { name: "", hat: HAT_IDS.find((h) => !players.some((p) => p.hat === h))! }])}
            className={`rounded-full border-2 border-dashed p-3 text-[14px] font-semibold ${mm ? "mm" : ""}`}
            style={{ borderColor: c.hair, color: c.muted2 }}>{t("addPlayer")}</button>
        )}

        {!canDeal && <div className={`text-[13px] ${mm ? "mm" : ""}`} style={{ color: c.muted }}>{t("needThreePlayers")}</div>}

        <button onClick={deal} disabled={!canDeal}
          className={`rounded-full p-[15px] text-[15px] ${mm ? "mm font-bold" : "display"}`}
          style={{ background: canDeal ? c.ink : "#e4ede7", color: canDeal ? "#fff" : "#a9bcb0" }}>{t("dealRound")}</button>
      </div>
    );
  }

  /* ---------- private turn ---------- */

  if (phase.k === "handoff") {
    return <Gate name={players[phase.i].name} hint={t("passGate")} onOpen={() => setPhase({ k: "turn", i: phase.i })} />;
  }

  if (phase.k === "turn") {
    const i = phase.i;
    const isManip = i === manipulator;
    const tech = techniqueById(assigned);
    // Detectives and the Manipulator get DIFFERENT helper decks: checkable
    // reasons vs manipulation fragments. That difference is exactly what the
    // room has to detect in the line-up, so it is the point, not a leak.
    const helpers = isManip
      ? FRAGMENTS.map((fr) => ({ id: fr.id, text: mm ? fr.mm : fr.en }))
      : REASON_MOVES.map((r) => ({ id: r.id, text: mm ? r.mm : r.en }));

    return (
      <div className="mx-auto flex max-w-[620px] flex-col gap-3.5">
        <Header label={`${i + 1} / ${players.length}`} />
        <div className="flex items-center gap-2"><Chip p={players[i]} /></div>

        {/* The role, said outright. This card is private — only the player
            holding the phone sees it — so hiding the role here would remove the
            game rather than protect it. */}
        <div className="flex items-center gap-3 rounded-[16px] px-4 py-4"
          style={{ background: isManip ? c.flagSoft : c.sageSoft, border: `2px solid ${isManip ? c.flag : c.forest}` }}>
          <RoleBadge role={isManip ? "manipulator" : "detective"} hat={players[i].hat} size="96px" />
          <div className="min-w-0">
            <div className={`text-[20px] leading-tight ${mm ? "mm font-bold" : "display"}`} style={{ color: isManip ? c.flag : c.forest }}>
              {t(isManip ? "youAreManipulator" : "youAreDetective")}
            </div>
            <p className={`mt-1.5 text-[14px] leading-snug ${mm ? "mm" : ""}`} style={{ color: c.ink }}>
              {t(isManip ? "manipulatorBrief" : "detectiveBrief")}
            </p>
            <p className={`mt-1.5 text-[13px] font-semibold leading-snug ${mm ? "mm" : ""}`} style={{ color: isManip ? c.flag : c.muted2 }}>
              {t(isManip ? "manipulatorWarn" : "detectiveWarn")}
            </p>
          </div>
        </div>

        <div className="rounded-[14px] border-[1.5px] px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
          <Eyebrow>{t("theSituation")}</Eyebrow>
          <p className={`mt-1.5 text-[15px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.ink }}>{f(situation.scene)}</p>
          <div className="mt-3 border-t pt-3" style={{ borderColor: c.hair }}>
            <Eyebrow>{t("everyoneArgues")}</Eyebrow>
            <p className={`mt-1.5 text-[15.5px] leading-relaxed ${mm ? "mm font-semibold" : "font-semibold"}`} style={{ color: c.ink }}>{f(situation.goal)}</p>
          </div>
        </div>

        {isManip && (
          <div className="rounded-[0_14px_14px_0] px-4 py-3.5" style={{ background: c.goldSoft, borderLeft: `4px solid ${c.gold}` }}>
            <Eyebrow>{t("yourTechnique")}</Eyebrow>
            <div className={`mt-1.5 text-[17px] ${mm ? "mm font-bold" : "display"}`} style={{ color: c.ink }}>{mm ? tech.mm : tech.en}</div>
            <div className={`mt-2 text-[12px] tracking-[0.14em] uppercase ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("techniqueLooksLike")}</div>
            <p className={`mt-1 text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{mm ? tech.tellMm : tech.tellEn}</p>
          </div>
        )}

        <Eyebrow>{isManip ? t("techniqueHelpers") : t("reasonHelpers")}</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {helpers.map((h) => (
            <button key={h.id} onClick={() => setDraft((d) => (d ? `${d} ${h.text}` : h.text))}
              className={`rounded-full border-2 px-[15px] py-2.5 text-[13.5px] font-semibold ${mm ? "mm" : ""}`}
              style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{h.text}</button>
          ))}
        </div>

        <Eyebrow>{t("writeOneLine")}</Eyebrow>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} maxLength={180}
          className={`rounded-[14px] border-[1.5px] p-3.5 text-[15px] leading-relaxed ${mm ? "mm" : ""}`}
          style={{ borderColor: c.hair, background: c.surface, color: c.ink }} />

        <button onClick={() => submitLine(i)} disabled={!draft.trim()}
          className={`rounded-full p-[15px] text-[15px] ${mm ? "mm font-bold" : "display"}`}
          style={{ background: draft.trim() ? c.ink : "#e4ede7", color: draft.trim() ? "#fff" : "#a9bcb0", minHeight: 52 }}>{t("doneHide")}</button>
      </div>
    );
  }

  /* ---------- line-up ---------- */

  if (phase.k === "lineup") {
    return (
      <div className="anim-screen mx-auto flex max-w-[620px] flex-col gap-3.5">
        <Header label={t("lineUpTitle")} />
        <div className="rounded-[14px] border-[1.5px] px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
          <Eyebrow>{t("theSituation")}</Eyebrow>
          <p className={`mt-1.5 text-[15px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.ink }}>{f(situation.scene)}</p>
          <div className="mt-3 border-t pt-3" style={{ borderColor: c.hair }}>
            <Eyebrow>{t("everyoneArgues")}</Eyebrow>
            <p className={`mt-1.5 text-[15px] leading-relaxed ${mm ? "mm font-semibold" : "font-semibold"}`} style={{ color: c.ink }}>{f(situation.goal)}</p>
          </div>
        </div>
        <p className={`text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{t("lineUpBody")}</p>
        <div className="flex flex-col gap-2.5">
          {players.map((p, i) => (
            <div key={i} className="rounded-[14px] border-[1.5px] px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
              <Chip p={p} size="30px" />
              <p className={`mt-2 text-[15px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.ink }}>{lines[i]}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase({ k: "voteHandoff", i: 0 })}
          className={`rounded-full p-[15px] text-[15px] text-white ${mm ? "mm font-bold" : "display"}`}
          style={{ background: c.ink, minHeight: 52 }}>{t("talkThenVote")}</button>
      </div>
    );
  }

  /* ---------- vote ---------- */

  if (phase.k === "voteHandoff") {
    return <Gate name={players[phase.i].name} hint={t("voteGate")} onOpen={() => setPhase({ k: "vote", i: phase.i })} />;
  }

  if (phase.k === "vote") {
    const i = phase.i;
    return (
      <div className="mx-auto flex max-w-[620px] flex-col gap-3.5">
        <Header label={`${i + 1} / ${players.length}`} />
        <div className="flex items-center gap-2"><Chip p={players[i]} /></div>
        <div className={`text-[20px] ${mm ? "mm font-bold leading-[1.6]" : "display"}`} style={{ color: c.ink }}>{t("voteTitle")}</div>
        <div className="flex flex-col gap-2.5">
          {players.map((p, j) => {
            if (j === i) return null; // you cannot vote for yourself
            const sel = pick === j;
            return (
              <button key={j} onClick={() => setPick(j)} aria-pressed={sel}
                className="flex items-center gap-3 rounded-[14px] border-2 p-3 text-left transition-all"
                style={{ borderColor: sel ? c.ink : c.hair, background: sel ? c.sageSoft : c.surface, minHeight: 56 }}>
                <DetectiveMascot size="40px" hat={p.hat} blink={false} label="" />
                <span className={`text-[15px] font-semibold ${mm ? "mm" : ""}`} style={{ color: c.ink }}>{p.name}</span>
              </button>
            );
          })}
        </div>
        <button onClick={() => submitVote(i)} disabled={pick === null}
          className={`rounded-full p-[15px] text-[15px] ${mm ? "mm font-bold" : "display"}`}
          style={{ background: pick !== null ? c.ink : "#e4ede7", color: pick !== null ? "#fff" : "#a9bcb0", minHeight: 52 }}>{t("lockVote")}</button>
      </div>
    );
  }

  /* ---------- reveal ---------- */

  // The only number this screen may show, and it comes from real votes (§16.5).
  const detectives = players.map((_, i) => i).filter((i) => i !== manipulator);
  const fooled = detectives.filter((i) => votes[i] !== manipulator).length;
  const fooledLine =
    fooled === 0 ? t("foolCountNone") : fooled === 1 ? t("foolCountOne") : `${fooled} ${t("foolCountMany")}`;

  return (
    <div className="mx-auto flex max-w-[620px] flex-col gap-3.5">
      <Header label={t("revealTitle")} />
      {/* §16.3: light surface card inside forest chrome. NOT a dark full-bleed
          frame — the detective figure is illegible on dark, and Play content
          surfaces stay light for daylight readability. */}
      <div className="anim-fade-150 rounded-[16px] p-1.5" style={{ background: c.forest }}>
        <div className="flex flex-col items-center gap-3 rounded-[12px] px-5 py-7 text-center" style={{ background: c.surface }}>
          <Eyebrow>{t("revealTitle")}</Eyebrow>
          <RoleBadge role="manipulator" hat={players[manipulator].hat} size="130px" />
          <div className={`text-[26px] leading-tight ${mm ? "mm font-bold" : "display"}`} style={{ color: c.ink }}>{players[manipulator].name}</div>
          <div className={`mt-1 text-[12px] tracking-[0.14em] uppercase ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("usedTechnique")}</div>
          <div className={`text-[17px] ${mm ? "mm font-bold" : "display"}`} style={{ color: c.flag }}>{mm ? techniqueById(assigned).mm : techniqueById(assigned).en}</div>
          <p className={`text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{mm ? techniqueById(assigned).tellMm : techniqueById(assigned).tellEn}</p>
        </div>
      </div>

      <div className="rounded-[0_14px_14px_0] px-4 py-3.5" style={{ background: c.flagSoft, borderLeft: `4px solid ${c.flag}` }}>
        <div className={`text-[16px] ${mm ? "mm font-bold" : "display"}`} style={{ color: c.ink }}>{fooledLine}</div>
        <div className={`mt-1 text-[13px] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted2 }}>{t("revealNote")}</div>
      </div>

      <Eyebrow>{t("votedFor")}</Eyebrow>
      <div className="flex flex-col gap-1.5">
        {players.map((p, i) => (
          <div key={i} className="flex items-center justify-between rounded-[10px] border-[1.5px] px-3 py-2" style={{ borderColor: c.hair, background: c.surface }}>
            <Chip p={p} size="26px" />
            <span className={`text-[13.5px] ${mm ? "mm" : ""}`} style={{ color: votes[i] === manipulator ? c.ink : c.muted }}>
              {votes[i] >= 0 ? players[votes[i]].name : "—"}
            </span>
          </div>
        ))}
      </div>

      <button onClick={deal} className={`rounded-full p-[15px] text-[15px] text-white ${mm ? "mm font-bold" : "display"}`}
        style={{ background: c.ink, minHeight: 52 }}>{t("playAgain")}</button>
      <button onClick={() => { reset(); onExit(); }} className={`rounded-full p-3 text-[14px] font-semibold ${mm ? "mm" : ""}`}
        style={{ color: c.muted2 }}>{t("leaveTable")}</button>
    </div>
  );
}
