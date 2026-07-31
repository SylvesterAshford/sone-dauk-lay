"use client";

import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { Mascot, MascotMark, DetectiveMascot, CartoonDetective, PokeMascot, HAT_IDS } from "@/components/Mascot";
import { PassAndPlay } from "./PassAndPlay";
import { LensCheck } from "./LensCheck";
import { TechniqueIcon } from "@/components/TechniqueIcon";
import { StageMap } from "@/components/StageMap";
import {
  TECHNIQUES,
  TRACKS,
  LESSONS,
  LENS_CASES,
  ROLES,
  FRAGMENTS,
  techniqueById,
  pickCase,
  lessonForTechnique,
  type TechniqueId,
  type Scenario,
  type Card,
} from "@/content/pack";
import { recordName, recordGenuine, useProgress, stateFor, rankFor, RANKS, levelUnlocked, getProgress, takeNewlyUnlockedLevel, recordCaseComplete, levelCleared, casesCleared, LEVEL_CLEAR_TARGET, recordLessonDone, lessonDone, lessonsDoneCount, historyDesc, techAccuracy } from "@/lib/progress";
import { useLang, setLang } from "@/lib/lang";
import { useT } from "@/lib/ui";

// Exact port of the confirmed design's single guided flow (San Dauk Lay.dc.html):
// entry → see → seeResult → namePick → nameResult → buildSetup → buildCompose →
// progress, plus hub → lesson, and the conversational Lens. Tabs: HQ · Learn ·
// See · Name · Build · You.

type Screen =
  | "entry" | "map" | "stages" | "table" | "see" | "seeResult" | "namePick" | "nameResult"
  | "buildSetup" | "buildCompose" | "progress" | "hub" | "lesson";

// Burmese is the primary language (PRODUCT.md, design §11); Latin is the gloss.
// mm/mmSub strings here are DRAFT, pending native-speaker review (design §15).
const LEVELS = [
  { level: 1, name: "Warm-up cases", sub: "The obvious ones. Learn the moves.", tag: "warm-up",
    mm: "အခြေခံ အမှုများ", mmSub: "အထင်ရှားဆုံးတွေ။ လှည့်ကွက်တွေ လေ့လာပါ။" },
  { level: 2, name: "Trickier cases", sub: "Subtler tells, stacked tricks.", tag: "trickier",
    mm: "ခက်ခဲတဲ့ အမှုများ", mmSub: "သိမ်မွေ့တဲ့ လက္ခဏာ၊ ထပ်ဆင့် လှည့်ကွက်။" },
  { level: 3, name: "Master cases", sub: "The ones that fool almost everyone.", tag: "master",
    mm: "ကျွမ်းကျင် အမှုများ", mmSub: "လူတော်တော်များများကို လှည့်နိုင်တဲ့ အမှုတွေ။" },
];

const V = "var";
const c = {
  ink: `${V}(--color-ink)`, surface: `${V}(--color-surface)`, hair: `${V}(--color-hairline)`,
  green: `${V}(--color-green)`, greenDeep: `${V}(--color-green-deep)`, gold: `${V}(--color-amber)`,
  goldSoft: `${V}(--color-amber-soft)`, muted: `${V}(--color-meta)`, muted2: `${V}(--color-muted)`,
  flag: `${V}(--color-clay)`, flagSoft: `${V}(--color-clay-soft)`, sageSoft: `${V}(--color-sage-soft)`,
  forest: `${V}(--color-forest)`,
};

// Mascot bubble lines — mm drafts pending native review (§15).
const MLINES: Record<Screen, { mm: string; en: string }> = {
  entry: { mm: "အဆင်သင့်လား၊ စုံထောက်။", en: "Ready, detective?" },
  map: { mm: "အဆင့် ရွေးပါ၊ စုံထောက်။", en: "Pick your level, detective." },
  stages: { mm: "ဘယ်အဆင့်က စမလဲ။", en: "Which stage next?" },
  table: { mm: "သူငယ်ချင်းတွေ ခေါ်ပါ။", en: "Grab your friends." },
  see: { mm: "သံသယနဲ့ ဖတ်ကြည့်ပါ…", en: "Read it like a suspect…" },
  seeResult: { mm: "လှည့်ကွက် တွေ့လား။", en: "Spot the trick?" },
  namePick: { mm: "အဲဒီ လှည့်ကွက်ကို အမည်တပ်ပါ။", en: "Name that move!" },
  nameResult: { mm: "မှန်သွားပြီ။", en: "Nailed it!" },
  buildSetup: { mm: "ဟေး… နည်းနည်း ကောက်ကျစ်ကြရအောင်။", en: "Heh… let's get sneaky." },
  buildCompose: { mm: "အတုကို တည်ဆောက်ပါ — လေ့လာဖို့ပါ။", en: "Build the fake — for science!" },
  progress: { mm: "မျက်စိ ဘယ်လောက် ရှင်းလာလဲ ကြည့်ပါ။", en: "Look how sharp you are!" },
  hub: { mm: "မှတ်စုစာအုပ်ပါ၊ စုံထောက်။", en: "The casebook, detective." },
  lesson: { mm: "ဖတ်ပြီး သက်သေပြပါ။", en: "Read it, then prove it." },
};

// Four tabs (design_v4.md §2). See/Name/Build are steps INSIDE Play, not tabs.
// mm labels are draft, pending native review (§15).
const NAV: { id: string; label: string; mm: string; to: Screen }[] = [
  { id: "home", label: "HQ", mm: "ပင်မ", to: "entry" },
  { id: "learn", label: "Learn", mm: "လေ့လာ", to: "hub" },
  { id: "play", label: "Play", mm: "ကစား", to: "map" },
  { id: "you", label: "You", mm: "မှတ်တမ်း", to: "progress" },
];
const NAV_MAP: Record<Screen, string> = {
  entry: "home", map: "play", stages: "play", table: "play", see: "play", seeResult: "play", namePick: "play", nameResult: "play",
  buildSetup: "play", buildCompose: "play", progress: "you", hub: "learn", lesson: "learn",
};

// The Play loop is three macro-steps. Returns 0=See, 1=Name, 2=Build, or null.
const LOOP_STEP: Partial<Record<Screen, 0 | 1 | 2>> = {
  see: 0, seeResult: 0, namePick: 1, nameResult: 1, buildSetup: 2, buildCompose: 2,
};

function Stepper({ step }: { step: 0 | 1 | 2 }) {
  const t = useT();
  const labels = [t("stepSee"), t("stepName"), t("stepBuild")];
  const frames = [t("frameSee"), t("frameName"), t("frameBuild")];
  return (
    <div className="mx-auto mb-5 max-w-[640px]">
      <div className="flex items-center gap-2">
        {labels.map((label, i) => {
          const done = i < step;
          const now = i === step;
          return (
            <div key={label} className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold"
                  style={{
                    background: done || now ? c.forest : "transparent",
                    border: done || now ? "none" : `1.5px solid ${c.hair}`,
                    color: done || now ? "#fff" : c.muted,
                  }}>
                  {done ? "✓" : i + 1}
                </span>
                <span className="text-[12.5px] font-bold" style={{ color: now ? c.ink : c.muted }}>{label}</span>
              </div>
              <div className="h-[3px] rounded-full" style={{ background: done || now ? c.forest : c.hair }} />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[13.5px]" style={{ color: c.muted2 }}>{frames[step]}</p>
    </div>
  );
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="font-mono text-[12px] uppercase tracking-[0.12em]" style={{ color: c.muted }}>
    {children}
  </div>
);

const PLATFORM_LABEL: Record<string, string> = {
  sms: "SMS", facebook: "Facebook", messenger: "Messenger", telegram: "Telegram",
  viber: "Viber", call: "a phone call", tiktok: "TikTok",
};

// Highlight the manipulating fragment inside the Burmese body.
function Highlight({ text, fragment }: { text: string; fragment?: string }) {
  const i = fragment ? text.indexOf(fragment) : -1;
  if (!fragment || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ background: c.goldSoft, boxShadow: `0 0 0 3px ${c.goldSoft}`, borderRadius: 3 }}>{fragment}</span>
      {text.slice(i + fragment.length)}
    </>
  );
}

export function SoneDaukLay() {
  const lang = useLang();
  const mm = lang === "mm";
  const t = useT();
  const [screen, setScreen] = useState<Screen>("entry");
  const [vote, setVote] = useState<string | null>(null);
  const [named, setNamed] = useState<TechniqueId[]>([]);
  const [whereOpen, setWhereOpen] = useState(false);
  const [buildRole, setBuildRole] = useState<string | null>(null);
  const [buildTechs, setBuildTechs] = useState<TechniqueId[]>([]);
  const [buildFrags, setBuildFrags] = useState<string[]>([]);
  const [buildJudged, setBuildJudged] = useState(false);
  const [caseScenario, setCaseScenario] = useState<Scenario>(() => pickCase());
  // Every case served in this level-run, so a run never repeats while unseen
  // cases remain.
  const [seenCases, setSeenCases] = useState<string[]>([]);
  const [caseNo, setCaseNo] = useState(1);
  const [caseLevel, setCaseLevel] = useState(1);
  const [levelUp, setLevelUp] = useState<{ name: string } | null>(null);
  const [justCleared, setJustCleared] = useState<{ level: number; name: string } | null>(null);
  const [hubTrack, setHubTrack] = useState(1);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [beat, setBeat] = useState(0);
  const [practicePick, setPracticePick] = useState<TechniqueId | null>(null);
  const [carryCopied, setCarryCopied] = useState(false);
  // Lens
  const [lensOpen, setLensOpen] = useState(false);
  const [lensCase, setLensCase] = useState<string | null>(null);
  const [lensPhase, setLensPhase] = useState(0);
  const [lensAnswer, setLensAnswer] = useState<string | null>(null);
  const [lensInput, setLensInput] = useState("");
  const [lensCustom, setLensCustom] = useState("");
  // Corner mascot: dismissible per screen (never-nags, §9.1) so it can never
  // permanently block a control it happens to sit over; reappears fresh on
  // the next screen since this only remembers the screen it was closed on.
  const [mascotDismissedOn, setMascotDismissedOn] = useState<Screen | null>(null);

  const go = (s: Screen) => setScreen(s);
  // Tapping Play always restarts the loop cleanly at step 1 (See).
  // Enter a level from the mission map: fresh loop at that difficulty.
  const startLevel = (level: number, stage = 0) => {
    setVote(null); setNamed([]); setWhereOpen(false);
    setBuildRole(null); setBuildTechs([]); setBuildFrags([]); setBuildJudged(false);
    setCaseLevel(level);
    const first = pickCase(level);
    setSeenCases([first.id]);
    setCaseScenario(first);
    // Resume where they left off. casesCleared() was already persisted; only
    // the on-screen counter was being thrown away, which made a returning
    // player look like they were starting over.
    setCaseNo(Math.min(stage, LEVEL_CLEAR_TARGET - 1) + 1);
    setScreen("see");
  };
  // "Next case" draws a fresh scenario at the current level (avoids repeating).
  const nextCase = () => {
    setVote(null); setNamed([]); setWhereOpen(false);
    setCaseScenario((prev) => {
      const next = pickCase(caseLevel, [...seenCases, prev.id]);
      setSeenCases((ids) => [...new Set([...ids, prev.id, next.id])]);
      return next;
    });
    setCaseNo((n) => n + 1);
    setScreen("see");
  };
  const checkName = () => {
    if (caseScenario.genuine) {
      recordGenuine(vote === "trust");
    } else {
      const before = rankFor(getProgress()).index;
      recordName(caseScenario.techniques, named, caseScenario.platform);
      const after = rankFor(getProgress());
      if (after.index > before) setLevelUp({ name: after.name });
    }
    // Every resolved case counts toward this level's clear — the "memory"
    // that was missing (design_v4 §7.1). Level-up (rank) and level-clear are
    // independent; both can fire off the same case.
    const justClearedThisLevel = recordCaseComplete(caseLevel);
    if (justClearedThisLevel) {
      const lv = LEVELS.find((l) => l.level === caseLevel);
      if (lv) setJustCleared({ level: caseLevel, name: lv.name });
    }
    go("nameResult");
  };
  const openLesson = (id: string) => {
    const apply = () => { setLessonId(id); setBeat(0); setPracticePick(null); setCarryCopied(false); setScreen("lesson"); };
    // Progressive enhancement only — the one View Transitions "wow" moment
    // in the app (card → detail header). Older Android WebView and
    // prefers-reduced-motion both fall through to an instant, unanimated
    // navigation with no layout shift.
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }
  };
  const step = LOOP_STEP[screen];
  const resetLens = () => { setLensCase(null); setLensPhase(0); setLensAnswer(null); setLensInput(""); setLensCustom(""); };
  const closeLens = () => { setLensOpen(false); resetLens(); };

  return (
    <div className="min-h-screen">
      {/* header */}
      <header className="sticky top-0 z-20 border-b" style={{ borderColor: c.hair, background: "rgba(238,244,239,.82)", backdropFilter: "blur(10px)" }}>
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
          <button onClick={() => go("entry")} className="mr-auto flex items-center gap-2.5">
            <MascotMark size={32} />
            <span className="text-left">
              <span className="display block text-[18px] leading-none" style={{ color: c.ink }}>Sone&nbsp;Dauk Lay</span>
              <span className="block font-mono text-[10px] tracking-[0.08em]" style={{ color: c.muted }}>LITTLE DETECTIVE</span>
            </span>
          </button>
          {/* When the header wraps, the nav takes its own full-width row — so spread
              across it instead of clustering at the left with dead space on the
              right. On wide screens it sits inline beside the logo as before. */}
          <nav className="no-scrollbar -mx-1 flex w-full flex-nowrap items-center justify-between gap-0.5 overflow-x-auto px-1 sm:mx-0 sm:w-auto sm:justify-normal sm:gap-1 sm:px-0">
            {NAV.map((n) => {
              const on = NAV_MAP[screen] === n.id;
              return (
                <button key={n.id} onClick={() => go(n.to)}
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-bold transition-colors sm:gap-2 sm:px-3.5 sm:py-2 sm:text-[13.5px] ${mm ? "mm" : ""}`}
                  style={{ background: on ? c.sageSoft : "transparent", color: on ? c.ink : c.muted }}>
                  {mm ? n.mm : n.label}
                  <span className="block h-[5px] w-[5px] rounded-full" style={{ background: on ? c.greenDeep : "transparent" }} />
                </button>
              );
            })}
            {/* app-wide language toggle — Burmese default, switch to English (§11) */}
            <div className="ml-auto inline-flex shrink-0 overflow-hidden rounded-full border-[1.5px] text-[11px] font-bold sm:ml-2" style={{ borderColor: c.hair }} aria-label="Language">
              <button onClick={() => setLang("mm")} aria-pressed={mm} className="mm px-2.5 py-1.5" style={{ background: mm ? c.forest : "transparent", color: mm ? "#fff" : c.muted }}>မြန်မာ</button>
              <button onClick={() => setLang("en")} aria-pressed={!mm} className="px-2.5 py-1.5" style={{ background: !mm ? c.forest : "transparent", color: !mm ? "#fff" : c.muted }}>EN</button>
            </div>
          </nav>
        </div>
      </header>

      {/* pb clears the corner mascot's full stack (56px mascot + gap + a
          possibly-two-line bubble + 16px inset, ~150px) so the last CTA on
          any screen — Doubt it, Check, Next case, the fool-count button —
          never ends up underneath it (critique P1). */}
      <main className="mx-auto max-w-[1000px] px-4 pb-[150px] pt-8 sm:px-10">
        {step !== undefined && <Stepper step={step} />}
        {screen === "entry" && <Entry onPlay={() => go("map")} go={go} openLens={() => setLensOpen(true)} />}
        {screen === "map" && <MissionMap onStart={(lv) => { setCaseLevel(lv); go("stages"); }} onTable={() => go("table")} />}
        {screen === "stages" && <Stages level={caseLevel} onPlay={(stage) => startLevel(caseLevel, stage)} onBack={() => go("map")} />}
        {screen === "table" && <PassAndPlay onExit={() => go("map")} />}
        {screen === "see" && <See key={caseNo} scenario={caseScenario} caseNo={caseNo} level={caseLevel} onVote={(v) => { setVote(v); go("seeResult"); }} />}
        {screen === "seeResult" && <SeeResult scenario={caseScenario} caseNo={caseNo} vote={vote} onNext={() => go("namePick")} onBack={() => go("see")} />}
        {screen === "namePick" && (
          <NamePick scenario={caseScenario} named={named}
            onToggle={(id) => setNamed((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
            onCheck={checkName}
            onPaste={() => setLensOpen(true)} />
        )}
        {screen === "nameResult" && (
          <NameResult scenario={caseScenario} picked={named} whereOpen={whereOpen} onToggleWhere={() => setWhereOpen((o) => !o)}
            onWhy={() => openLesson(lessonForTechnique(caseScenario.techniques[0]) ?? "t1-urgency")}
            onBuild={() => go("buildSetup")} onNextCase={nextCase} onBack={() => go("namePick")} />
        )}
        {screen === "buildSetup" && (
          <BuildSetup role={buildRole} setRole={setBuildRole} techs={buildTechs}
            toggleTech={(id) => setBuildTechs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
            onWrite={() => { if (buildRole && buildTechs.length) go("buildCompose"); }} />
        )}
        {screen === "buildCompose" && (
          <BuildCompose role={buildRole} frags={buildFrags} judged={buildJudged}
            toggleFrag={(id) => { setBuildFrags((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])); setBuildJudged(false); }}
            onJudge={() => setBuildFrags((f) => { if (f.length) setBuildJudged(true); return f; })}
            onDone={() => go("progress")} onBack={() => go("buildSetup")} />
        )}
        {screen === "progress" && <Progress onNextCase={nextCase} />}
        {screen === "hub" && (
          <Hub hubTrack={hubTrack} setHubTrack={setHubTrack} onOpen={openLesson} onWhy={() => openLesson("t1-urgency")} />
        )}
        {screen === "lesson" && lessonId && (
          <Lesson id={lessonId} beat={beat} setBeat={setBeat} practicePick={practicePick} setPracticePick={setPracticePick}
            carryCopied={carryCopied} setCarryCopied={setCarryCopied} onHub={() => go("hub")} onLoop={() => go("see")} />
        )}
      </main>

      {/* corner mascot + line — 56px, 16px inset (design §9.1). Dismissible so
          it can never permanently sit on top of a control (critique P1); it
          comes back on its own on the next screen since the dismissal is
          keyed to the current screen, not stored for the session. */}
      {mascotDismissedOn !== screen && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
          <div className="flex max-w-[230px] items-start gap-1.5 rounded-[16px_16px_5px_16px] border py-2 pl-3.5 pr-2 shadow-lg" style={{ background: c.surface, borderColor: c.hair }}>
            <span className={`text-[13px] ${mm ? "mm font-semibold leading-[1.6]" : "display leading-snug"}`} style={{ color: c.ink }}>{mm ? MLINES[screen].mm : MLINES[screen].en}</span>
            <button onClick={() => setMascotDismissedOn(screen)} aria-label="Hide for this screen"
              className="pointer-events-auto relative grid h-5 w-5 shrink-0 place-items-center rounded-full text-[12px] font-bold"
              style={{ color: c.muted }}>
              {/* expands the tap target to the 44px floor (§13) without growing the visual glyph */}
              <span className="absolute -inset-3" aria-hidden="true" />
              ×
            </button>
          </div>
          <button onClick={() => setLensOpen(true)} aria-label="Ask the Lens" className="pointer-events-auto">
            <Mascot size="56px" pulse />
          </button>
        </div>
      )}

      {lensOpen && (
        <Lens caseId={lensCase} phase={lensPhase} answer={lensAnswer} custom={lensCustom}
          input={lensInput} onInput={setLensInput}
          onSubmit={(v) => { setLensCustom(v); setLensCase("custom"); setLensPhase(2); setLensInput(""); }}
          onPickCase={(id) => { if (id === "escalation") { setLensCase("escalation"); } else { setLensCase(id); setLensPhase(1); setLensAnswer(null); } }}
          onAnswer={(a) => { setLensAnswer(a); setLensPhase(2); }}
          onReset={resetLens}
          onClose={closeLens} />
      )}

      {levelUp && (
        <Celebration eyebrow={t("rankUp")} lead={t("youreNowA")} highlight={levelUp.name}
          body={t("rankUpBody")} cta={t("keepGoing")} onDismiss={() => setLevelUp(null)} />
      )}
      {justCleared && (
        <Celebration eyebrow={t("levelCleared")} lead={t("youCleared")} highlight={justCleared.name}
          body={t("levelClearedBody")} cta={t("nice")} onDismiss={() => setJustCleared(null)} />
      )}

      <div className={`mx-auto max-w-[1000px] px-4 pb-10 text-center text-[11.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted }}>
        {t("footerNote")}
      </div>
    </div>
  );
}

/* ---------- ENTRY (HQ) ---------- */
function Entry({ onPlay, go, openLens }: { onPlay: () => void; go: (s: Screen) => void; openLens: () => void }) {
  const rank = rankFor(useProgress());
  const mm = useLang() === "mm"; // app-wide language; mm strings draft pending review (§15)
  const t = useT();
  const LOOP = [
    { step: "STEP 1", title: "See", mm: "မြင်", sub: "Meet manipulation in the wild — react before being told.", mmSub: "လိမ်လည်မှုကို သဘာဝအတိုင်း တွေ့ — မပြောခင် တုံ့ပြန်ကြည့်ပါ။", id: "see" as const },
    { step: "STEP 2", title: "Name", mm: "အမည်တပ်", sub: "Identify which of six techniques is at work, learn the tell.", mmSub: "နည်းစနစ် ခြောက်ခုထဲက ဘယ်ဟာလဲ ခွဲခြား၊ လက္ခဏာကို လေ့လာပါ။", id: "name" as const },
    { step: "STEP 3", title: "Build", mm: "တည်ဆောက်", sub: "Take the manipulator's seat once — the step that makes it stick.", mmSub: "လိမ်သူနေရာမှာ တစ်ခါ ထိုင်ကြည့် — မှတ်မိစေတဲ့ အဆင့်။", id: "build" as const },
  ];
  const glyph: Record<string, React.ReactNode> = {
    see: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>,
    name: <TechniqueIcon id="urgency" size={26} />,
    build: <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" /></svg>,
  };
  return (
    <div className="anim-screen">
      <div className="flex flex-wrap items-center gap-8 sm:gap-14">
        <div className="min-w-[280px] flex-1">
          <Eyebrow>MINGALABA, DETECTIVE</Eyebrow>
          <div className="mt-2"><span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ background: c.sageSoft, color: c.forest }}><MascotMark size={16} /> {rank.name}</span></div>
          {mm ? (
            <>
              <h1 className="mm m-0 mt-3 mb-1.5 text-[clamp(26px,6.4vw,40px)] font-semibold leading-[1.75]" style={{ color: c.ink }}>
                လှည့်ကွက်ကို မခံရခင် ကြိုသိပါ။
              </h1>
              <div className="text-[clamp(15px,3vw,20px)] font-bold leading-[1.25]" style={{ color: c.muted2 }}>
                Learn the trick before it reaches you.
              </div>
              <p className="mm m-0 mt-[18px] mb-6 max-w-[42ch] text-[15px] leading-[1.75]" style={{ color: c.muted2 }}>
                Sone Dauk Lay က သင့်ဖုန်းထဲက စုံထောက်လေးပါ။ လာတဲ့စာတွေထဲက လှည့်ကွက်ကို ရှာ၊ ဘယ်လှည့်ကွက်လဲ နာမည်တပ်၊ ပြီးရင် ကိုယ်တိုင် တစ်ခါ လုပ်ကြည့်ပါ။ ကိုယ်တိုင်လုပ်ကြည့်တော့ ပိုမှတ်မိတယ်။
              </p>
            </>
          ) : (
            <>
              <h1 className="display m-0 mt-3 mb-1.5 text-[clamp(28px,7vw,44px)] font-bold leading-[1.1]" style={{ color: c.ink }}>
                Learn the trick before it reaches you.
              </h1>
              <div className="mm text-[clamp(16px,3.4vw,22px)] font-semibold leading-[1.7]" style={{ color: c.muted2 }}>
                လှည့်ကွက်ကို မခံရခင် ကြိုသိပါ။
              </div>
              <p className="m-0 mt-[18px] mb-6 max-w-[46ch] text-[15px] leading-relaxed" style={{ color: c.muted2 }}>
                Sone Dauk Lay is a little detective for your pocket. Meet manipulation in the wild, name the technique behind it, then take the manipulator&rsquo;s seat once — the move that makes it stick.
              </p>
            </>
          )}
          <div className="flex flex-wrap gap-2.5">
            <button onClick={onPlay} className={mm ? "mm rounded-full px-7 py-3.5 text-[15px] font-bold text-white" : "display rounded-full px-7 py-3.5 text-[15px] text-white"} style={{ background: c.ink }}>{mm ? "စကစားရအောင် →" : "Start a case →"}</button>
            <button onClick={openLens} className={mm ? "mm rounded-full border-[1.5px] bg-transparent px-6 py-3.5 text-[15px] font-bold" : "display rounded-full border-[1.5px] bg-transparent px-6 py-3.5 text-[15px]"} style={{ borderColor: c.hair, color: c.ink }}>{mm ? "စာတစ်စောင် ကူးထည့်ပါ" : "Paste a message"}</button>
          </div>
          <div className="mt-[18px] font-mono text-[11.5px]" style={{ color: c.muted }}>no account needed · nothing is uploaded · works offline</div>
        </div>
        {/* HQ hero: the detailed cartoon detective. The Play tab keeps the
            simpler flat DetectiveMascot unchanged (user request). */}
        <div className="relative mx-auto shrink-0 p-4">
          <PokeMascot label={t("pokeMascot")}><CartoonDetective size="clamp(170px,40vw,240px)" float /></PokeMascot>
        </div>
      </div>

      <button onClick={() => go("hub")} className="anim-rise mt-8 flex w-full flex-wrap items-center gap-6 rounded-[24px] p-6 text-left text-white transition-transform hover:-translate-y-0.5 sm:mt-13 sm:p-8"
        style={{ background: "linear-gradient(135deg,#2c4433 0%,#31564a 48%,#1f6f78 100%)" }}>
        <div className="min-w-[230px] flex-1">
          <div className="font-mono text-[11.5px] tracking-[0.12em]" style={{ color: "rgba(255,255,255,.65)" }}>THE CASEBOOK · START HERE</div>
          <div className={mm ? "mm mt-1.5 text-[clamp(21px,3.4vw,27px)] font-semibold leading-[1.55]" : "display mt-1.5 text-[clamp(24px,3.6vw,30px)] leading-[1.12]"}>{mm ? "လှည့်ကွက်တွေ ဘာကြောင့် အလုပ်ဖြစ်လဲ။" : "Learn why the tricks work."}</div>
          <div className={mm ? "mm mt-2 max-w-[44ch] text-[14px] leading-[1.7]" : "mt-2 max-w-[48ch] text-[14px] leading-relaxed"} style={{ color: "rgba(255,255,255,.82)" }}>{mm ? "သင်ခန်းစာ တို ၁၂ ခု — အလိမ်အညာ၊ AI နဲ့ တု ပုံသံ၊ သတင်း ဘယ်လို ပျံ့နှံ့လဲ။ တစ်ခုစီ လက်တွေ့နဲ့ ဆုံးတယ်။" : "12 short lessons — scams, AI & synthetic media, and how information travels. Each ends in practice, never a checkbox."}</div>
          <div className="mt-4 flex flex-wrap gap-[7px]">
            {(mm ? ["နည်းစနစ် ခြောက်ခု", "AI နဲ့ တု ပုံသံ", "သတင်း မှန်ကန်မှု"] : ["Six techniques", "AI & synthetic media", "Information integrity"]).map((x) => (
              <span key={x} className={mm ? "mm rounded-full px-[13px] py-1.5 text-[12.5px] font-semibold" : "rounded-full px-[13px] py-1.5 text-[12.5px] font-semibold"} style={{ border: "1px solid rgba(255,255,255,.28)" }}>{x}</span>
            ))}
          </div>
          <span className={mm ? "mm mt-[18px] inline-block rounded-full bg-white px-[22px] py-3 text-[14.5px] font-bold" : "display mt-[18px] inline-block rounded-full bg-white px-[22px] py-3 text-[14.5px]"} style={{ color: "#1b2a1f" }}>{mm ? "သင်ခန်းစာ ဖွင့်ပါ →" : "Open the Hub →"}</span>
        </div>
      </button>

      <div className="mt-8 sm:mt-11">
        <Eyebrow>THE 3-STEP LOOP · PRACTISE WHAT YOU LEARN</Eyebrow>
        <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LOOP.map((l, i) => (
            <button key={l.title} onClick={onPlay}
              className="anim-card-enter card-tactile rounded-[20px] border-[1.5px] p-6 text-left"
              style={{ borderColor: c.hair, background: c.surface, animationDelay: `${i * 0.06}s` }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px]" style={{ color: c.muted }}>{l.step}</span>
                <span style={{ color: c.greenDeep }}>{glyph[l.id]}</span>
              </div>
              <div className={mm ? "mm mt-3.5 text-[19px] font-semibold" : "display mt-3.5 text-[22px]"} style={{ color: c.ink }}>{mm ? l.mm : l.title}</div>
              <div className={mm ? "mm mt-1 text-[13.5px]" : "mt-1 text-[14px]"} style={{ color: c.muted2 }}>{mm ? l.mmSub : l.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- MISSION MAP ---------- */
// Each level is an illustrated PLACE, not a repeated icon (design §7.1 allows
// "illustrated terrain / character presence" as dressing; the single magnifier
// mascot stays in the header only, never duplicated here). Greyscale-safe,
// aria-hidden, inline SVG — zero raster, matching the offline/budget constraint.
// A climb from a sunny trailhead (level 1) into foggy woods (2) toward a distant
// summit (3). Locked state dims via the parent, never a padlock (§14).
function LevelScene({ level }: { level: number }) {
  if (level === 1) {
    // sunny meadow trailhead with a little signpost flag
    return (
      <svg viewBox="0 0 76 108" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
        <rect width="76" height="108" fill="#dcebe0" />
        <circle cx="58" cy="20" r="10" fill="#f0e2b8" />
        <path d="M0 78 Q38 60 76 80 L76 108 L0 108 Z" fill="#bcdcc4" />
        <path d="M0 92 Q38 78 76 94 L76 108 L0 108 Z" fill="#a6cfb0" />
        <path d="M20 108 Q34 84 30 70" stroke="#8aa891" strokeWidth="2.5" strokeDasharray="2 4" fill="none" />
        <path d="M46 74 l0 -12 l9 4 l-9 4" fill="#2c4433" />
        <rect x="45" y="72" width="2" height="10" fill="#2c4433" />
      </svg>
    );
  }
  if (level === 2) {
    // foggy woods — trees behind drifting mist bands, the path getting murkier
    return (
      <svg viewBox="0 0 76 108" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
        <rect width="76" height="108" fill="#cfe2d5" />
        <path d="M20 92 l7 -30 l7 30 z" fill="#84a98d" />
        <path d="M40 96 l9 -40 l9 40 z" fill="#6f977a" />
        <rect x="26" y="90" width="2.5" height="6" fill="#5c7a63" />
        <rect x="47.5" y="94" width="2.5" height="6" fill="#5c7a63" />
        <path d="M4 40 q18 -6 34 2 M8 54 q20 -6 40 2 M2 68 q22 -6 44 3" stroke="#eef4ef" strokeWidth="3" strokeLinecap="round" opacity="0.8" fill="none" />
        <path d="M14 108 q20 -20 30 -46" stroke="#8aa891" strokeWidth="2.5" strokeDasharray="2 4" fill="none" />
      </svg>
    );
  }
  // distant summit with a small flag at the peak, clouds drifting past
  return (
    <svg viewBox="0 0 76 108" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
      <rect width="76" height="108" fill="#e4ebe6" />
      <path d="M0 84 L26 40 L44 66 L60 30 L76 84 Z" fill="#c3d3c8" />
      <path d="M60 30 l0 -12 l11 5 l-11 5" fill="#9fb3a6" />
      <rect x="59" y="28" width="2" height="12" fill="#9fb3a6" />
      <path d="M8 24 q14 6 22 0 M40 18 q14 6 24 0" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" fill="none" />
    </svg>
  );
}

function MissionMap({ onStart, onTable }: { onStart: (level: number) => void; onTable: () => void }) {
  const progress = useProgress();
  const rank = rankFor(progress);
  const unlockedLevels = LEVELS.filter((lv) => levelUnlocked(progress, lv.level)).map((lv) => lv.level);
  // Computed once per mount: which level (if any) opened since the map was
  // last visited, so it gets the one-shot "just unlocked" treatment.
  const [justUnlocked] = useState(() => takeNewlyUnlockedLevel(unlockedLevels));
  const mm = useLang() === "mm"; // app-wide language (header toggle), Burmese default
  const t = useT();
  // The first unlocked-but-not-cleared level is where the player picks up next —
  // it gets the one amber "next" accent (§3: amber is the highlighter, nothing else).
  const nextLevel = LEVELS.find((lv) => levelUnlocked(progress, lv.level) && !levelCleared(progress, lv.level))?.level;

  return (
    <div className="anim-screen mx-auto max-w-[560px]">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative shrink-0"><PokeMascot label={t("pokeMascot")}><DetectiveMascot size="86px" /></PokeMascot></div>
        <div>
          <p className="eyebrow m-0">mission map</p>
          <h1 className={mm ? "mm m-0 text-[22px] font-semibold" : "display m-0 text-[24px]"} style={{ color: c.ink }}>{mm ? "အမှု အဆင့် ရွေးပါ" : "Choose a case level"}</h1>
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ background: c.sageSoft, color: c.forest }}>
            <MascotMark size={16} /> {rank.name}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col gap-4">
        {/* winding trail spine — decorative; real semantics live in the cards */}
        <svg aria-hidden="true" className="absolute left-[38px] top-2 h-[calc(100%-52px)] w-[70px]" style={{ zIndex: 0, transform: "translateX(-50%)" }} viewBox="0 0 70 520" preserveAspectRatio="none" fill="none">
          <path d="M35 8 C 60 70, 10 120, 35 190 S 60 300, 35 360 S 10 450, 35 512" stroke="#9cc4a9" strokeWidth="3" strokeDasharray="2 11" strokeLinecap="round" />
        </svg>

        {LEVELS.map((lv) => {
          const unlocked = levelUnlocked(progress, lv.level);
          const cleared = unlocked && levelCleared(progress, lv.level);
          const isNext = lv.level === nextLevel;
          const isNew = justUnlocked === lv.level;
          const unlockNote = mm
            ? (lv.level === 2 ? "နည်းစနစ် ၃ ခု တွေ့ပြီး ဖွင့်ပါ" : "နည်းစနစ် ၃ ခု လေ့ကျင့်ပြီး ဖွင့်ပါ")
            : (lv.level === 2 ? "Meet 3 techniques to unlock" : "Practise 3 techniques to unlock");
          // discrete state chip — not-yet (neutral) · next (amber) · open (sage).
          // Where you are INSIDE this level, in words. §7.1 forbids a number
          // here and §3.1 forbids a fill-meter, but "you cannot tell how far
          // you are" was a real complaint — a phrase answers it without
          // reintroducing a score.
          const done = casesCleared(progress, lv.level);
          const posKey =
            done <= 0 ? "lvlNotStarted"
            : done === 1 ? "lvlJustStarted"
            : done >= LEVEL_CLEAR_TARGET - 1 ? "lvlNearly"
            : "lvlHalfway";
          const chip = !unlocked
            ? { label: t("lvlNotYet"), bg: "#eef1f0", fg: c.muted }
            : cleared
            ? { label: t("lvlCleared"), bg: c.sageSoft, fg: c.forest }
            : isNext
            ? { label: t(posKey), bg: c.goldSoft, fg: "#8a5a12" }
            : { label: t(posKey), bg: c.sageSoft, fg: c.forest };
          return (
            <div key={lv.level} className="flex items-stretch gap-3.5" style={{ position: "relative", zIndex: 1 }}>
              {/* illustrated place; stretches to the card height */}
              <span aria-hidden="true" className="w-[76px] shrink-0 self-stretch overflow-hidden rounded-[16px]"
                style={{ border: `${unlocked ? 2 : 1.5}px ${unlocked ? "solid" : "dashed"} ${unlocked ? c.forest : c.hair}`, filter: unlocked ? undefined : "grayscale(0.4)", opacity: unlocked ? 1 : 0.7, animation: isNew ? "pop .5s ease both" : undefined }}>
                <LevelScene level={lv.level} />
              </span>
              <button disabled={!unlocked} onClick={() => unlocked && onStart(lv.level)}
                className="card-tactile flex-1 rounded-[16px] px-4 py-3.5 text-left disabled:cursor-default"
                style={{ border: `${unlocked ? 2 : 1.5}px solid ${unlocked ? c.forest : c.hair}`, background: c.surface, opacity: unlocked ? 1 : 0.64, boxShadow: unlocked ? undefined : "none" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className={mm ? "mm text-[16.5px] font-semibold leading-[1.45]" : "display text-[18px]"} style={{ color: unlocked ? c.ink : c.muted2 }}>{mm ? lv.mm : lv.name}</div>
                    <div className="mt-0.5 text-[11.5px] font-semibold" style={{ color: c.muted }}>{mm ? lv.name : lv.mm}</div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.05em]" style={{ background: chip.bg, color: chip.fg }}>
                    {cleared && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>}
                    {chip.label}
                  </span>
                </div>
                <p className={mm ? "mm m-0 mt-1.5 text-[13px]" : "m-0 mt-1.5 text-[13px]"} style={{ color: c.muted2 }}>{mm ? lv.mmSub : lv.sub}</p>
                {unlocked ? (
                  <span className={mm ? "mm mt-2.5 inline-flex items-center gap-1.5 text-[14px] font-bold" : "mt-2.5 inline-flex items-center gap-1.5 text-[14px] font-bold"} style={{ color: c.forest }}>
                    {done > 0 && done < LEVEL_CLEAR_TARGET ? t("resumeLevel") : mm ? "စတင်ပါ" : "Play"}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                ) : (
                  <span className={mm ? "mm mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold" : "mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] font-semibold"} style={{ color: c.muted }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" strokeDasharray="2.5 2.5" /><path d="M12 8v4l3 2" /></svg>
                    {unlockNote}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* The table round sits below the solo levels and is never locked: it needs
          friends, not progress. Four hats shown so the offer is legible before
          you tap it (DESIGN.md §16). */}
      <button onClick={onTable} className="card-tactile mt-4 w-full rounded-[16px] px-4 py-4 text-left"
        style={{ border: `2px solid ${c.forest}`, background: c.surface, position: "relative", zIndex: 1 }}>
        <div className="flex items-center gap-1">
          {HAT_IDS.map((h) => <DetectiveMascot key={h} size="34px" hat={h} blink={false} label="" />)}
        </div>
        <div className={mm ? "mm mt-2 text-[16.5px] font-semibold leading-[1.45]" : "display mt-2 text-[18px]"} style={{ color: c.ink }}>{t("tableTitle")}</div>
        <p className={mm ? "mm m-0 mt-1 text-[13px]" : "m-0 mt-1 text-[13px]"} style={{ color: c.muted2 }}>{t("tableSub")}</p>
        <span className={mm ? "mm mt-2.5 inline-flex items-center gap-1.5 text-[14px] font-bold" : "mt-2.5 inline-flex items-center gap-1.5 text-[14px] font-bold"} style={{ color: c.forest }}>
          {t("tableStart")}
        </span>
      </button>

      <p className={mm ? "mm mt-6 text-center text-[11.5px]" : "mt-6 text-center font-mono text-[11px]"} style={{ color: c.muted }}>{mm ? "အမှတ်မရှိ၊ အချိန်မရှိ — မျက်စိ ပိုရှင်းအောင်သာ" : "no points, no timers — just sharper eyes"}</p>
    </div>
  );
}

/* ---------- LEVEL-UP MOMENT ---------- */
// Shared full-screen celebration — reused for both a rank-up (technique
// mastery crossing a threshold) and a level-clear (finished N cases at a
// level). Same restrained treatment either way: one mascot, one line, no
// numbers, dismiss and keep going.
function Celebration({
  eyebrow, lead, highlight, body, cta, onDismiss,
}: {
  eyebrow: string; lead: string; highlight: string; body: string; cta: string; onDismiss: () => void;
}) {
  const mm = useLang() === "mm";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0" style={{ background: "rgba(27,42,31,.55)" }} onClick={onDismiss} />
      <div className="anim-rise relative w-full max-w-[360px] rounded-3xl p-8 text-center text-white" style={{ background: "linear-gradient(135deg,#2c4433 0%,#31564a 48%,#1f6f78 100%)" }}>
        <div className="anim-floaty mx-auto mb-4 w-fit"><Mascot size="88px" /></div>
        <p className={`m-0 text-[11px] tracking-[0.12em] ${mm ? "mm" : "font-mono uppercase"}`} style={{ color: "rgba(255,255,255,.7)" }}>{eyebrow}</p>
        <div className={`mt-1 text-[24px] ${mm ? "mm font-semibold leading-[1.6]" : "display"}`}>{lead}</div>
        <div className={`text-[26px] ${mm ? "mm font-semibold leading-[1.6]" : "display"}`} style={{ color: "#a6d9b4" }}>{highlight}</div>
        <p className={`mx-auto mt-3 max-w-[26ch] text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: "rgba(255,255,255,.82)" }}>{body}</p>
        <button onClick={onDismiss} className={`mt-5 rounded-full bg-white px-6 py-3 text-[15px] ${mm ? "mm font-bold" : "display"}`} style={{ color: c.ink }}>{cta}</button>
      </div>
    </div>
  );
}

/* ---------- SEE ---------- */
function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <div className="overflow-hidden rounded-[16px] border-[1.5px]" style={{ borderColor: c.hair, background: c.surface, boxShadow: "0 10px 26px -18px rgba(35,55,44,.3)" }}>
      <div className="flex items-center gap-3 border-b px-4 py-3.5" style={{ borderColor: c.hair }}>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-bold" style={{ background: "#e8f2ec", color: c.greenDeep }}>{scenario.sender.trim().charAt(0).toUpperCase()}</span>
        <span className="min-w-0"><span className="block truncate text-[15px] font-bold" style={{ color: c.ink }}>{scenario.sender}</span><span className="block truncate text-[12.5px]" style={{ color: c.muted }}>{scenario.meta}</span></span>
        <span className="ml-auto shrink-0 rounded border px-[7px] py-[3px] font-mono text-[10px] tracking-[0.08em]" style={{ borderColor: c.hair, color: c.muted }}>EXAMPLE</span>
      </div>
      <div className="relative overflow-hidden px-[18px] py-4">
        <div className="pointer-events-none absolute inset-y-0 w-[42%]" style={{ background: "linear-gradient(90deg,transparent,rgba(88,176,139,.16),transparent)", animation: "scan 2.8s ease-in-out infinite" }} />
        <div className="mm relative text-[17px] leading-[1.85]" style={{ color: c.ink }}>{scenario.body.mm}</div>
        <div className="mt-2 text-[13.5px] leading-relaxed" style={{ color: c.muted }}>{scenario.body.en}</div>
      </div>
    </div>
  );
}

function See({ scenario, caseNo, level, onVote }: { scenario: Scenario; caseNo: number; level: number; onVote: (v: string) => void }) {
  const lv = LEVELS.find((l) => l.level === level) ?? LEVELS[0];
  const t = useT();
  const mm = useLang() === "mm";
  return (
    <div className="anim-screen mx-auto flex max-w-[600px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className={`font-mono text-[12px] font-medium tracking-[0.14em] ${mm ? "mm" : ""}`} style={{ color: c.muted }}>{t("stepSee")} · {t("seeCase")} {caseNo}</span>
        <div className="flex gap-[5px]">{[0,1,2,3,4,5,6,7].map((i) => <span key={i} className="block h-[5px] w-[18px] rounded-[3px]" style={{ background: i < Math.min(caseNo, 8) ? c.green : c.hair }} />)}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.06em] ${mm ? "mm" : "font-mono uppercase"}`} style={{ background: c.sageSoft, color: c.forest }}>{mm ? lv.mm : `Level ${level} · ${lv.tag}`}</span>
        <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-[0.08em] text-white ${mm ? "mm" : "font-mono uppercase"}`} style={{ background: c.greenDeep, animation: "pop .35s ease both" }}>{t("newCase")}</span>
      </div>
      <Eyebrow>{t("arrivedOn")} {PLATFORM_LABEL[scenario.platform] ?? scenario.platform}</Eyebrow>
      <ScenarioCard scenario={scenario} />
      <div className={`mt-1 text-[16px] ${mm ? "mm font-semibold" : "display"}`} style={{ color: c.ink }}>{t("whatWouldYouDo")}</div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
        {[["trust",t("voteTrust")],["notsure",t("voteNotSure")],["doubt",t("voteDoubt")]].map(([v,l]) => (
          <button key={v} onClick={() => onVote(v)} className={`rounded-full border-[1.5px] p-3.5 text-[14.5px] font-bold transition-all hover:-translate-y-0.5 ${mm ? "mm" : ""}`} style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{l}</button>
        ))}
      </div>
      <div className={`text-center text-[12.5px] ${mm ? "mm" : ""}`} style={{ color: c.muted }}>{t("noPenalty")}</div>
    </div>
  );
}

/* ---------- SEE RESULT ---------- */
function SeeResult({ scenario, caseNo, vote, onNext, onBack }: { scenario: Scenario; caseNo: number; vote: string | null; onNext: () => void; onBack: () => void }) {
  const genuine = scenario.genuine;
  const ev = scenario.evidence;
  const t = useT();
  const mm = useLang() === "mm";
  const calib = genuine
    ? vote === "doubt"
      ? { head: t("realHead"), body: t("realBody") }
      : { head: t("genuineHead"), body: t("genuineBody") }
    : vote === "trust"
      ? { head: t("closerHead"), body: t("closerBody") }
      : vote === "notsure"
        ? { head: t("confusingHead"), body: t("confusingBody") }
        : { head: t("instinctHead"), body: t("instinctBody") };
  return (
    <div className="anim-screen mx-auto flex max-w-[600px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className={`inline-flex items-center gap-1 rounded-full border-[1.5px] px-3.5 text-[14px] font-semibold ${mm ? "mm" : ""}`} style={{ borderColor: c.hair, background: c.surface, color: c.ink, minHeight: 44 }}>{t("back")}</button>
        <span className={`text-[12px] tracking-[0.14em] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("stepSee")} · {t("seeCase")} {caseNo}</span>
      </div>
      <div className="anim-rise rounded-[0_14px_14px_0] border-[1.5px] p-4 px-[18px]" style={{ borderColor: c.hair, borderLeft: `4px solid ${c.green}`, background: c.surface }}>
        <div className={`text-[17px] ${mm ? "mm font-semibold" : "display"}`} style={{ color: c.ink }}>{calib.head}</div>
        <div className={`mt-1 text-[14px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{calib.body}</div>
      </div>
      {!genuine && ev && (
        <>
          <Eyebrow>{t("lookCloser")}</Eyebrow>
          <div className="rounded-[16px] border-[1.5px] p-[18px]" style={{ borderColor: c.hair, background: c.surface }}>
            <div className="mm text-[17px] leading-[2]" style={{ color: c.ink }}>
              <Highlight text={scenario.body.mm} fragment={ev.fragmentMm} />
            </div>
            <div className="mt-4 flex gap-2.5 border-t border-dashed pt-3.5" style={{ borderColor: c.hair }}>
              <div className="w-[3px] shrink-0 rounded-[2px]" style={{ background: c.gold }} />
              <div>
                <div className="mm text-[14px] leading-[1.8]" style={{ color: c.ink }}>{ev.noteMm}</div>
                <div className="mt-1 text-[12.5px] leading-relaxed" style={{ color: c.muted }}>{ev.noteEn}</div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className={`rounded-[14px] px-[18px] py-[15px] text-[13.5px] leading-[1.7] ${mm ? "mm" : ""}`} style={{ background: "#e8f2ec", color: c.greenDeep }}>
        {genuine ? t("balanceGenuine") : t("balanceFake")}
      </div>
      <button onClick={onNext} className={`rounded-full p-[15px] text-[15px] text-white ${mm ? "mm font-bold" : "display"}`} style={{ background: c.ink }}>{t("nameTechniqueCta")}</button>
    </div>
  );
}

/* ---------- NAME PICK ---------- */
function NamePick({ scenario, named, onToggle, onCheck, onPaste }: { scenario: Scenario; named: TechniqueId[]; onToggle: (id: TechniqueId) => void; onCheck: () => void; onPaste: () => void }) {
  const t = useT();
  const mm = useLang() === "mm";
  return (
    <div className="anim-screen mx-auto flex max-w-[640px] flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <span className={`text-[12px] tracking-[0.14em] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("stepName")}</span>
        <button onClick={onPaste} className={`text-[13.5px] font-bold ${mm ? "mm" : ""}`} style={{ color: c.greenDeep }}>{t("pasteYourOwn")}</button>
      </div>
      <ScenarioCard scenario={scenario} />
      <div className={`text-[22px] ${mm ? "mm font-semibold leading-[1.6]" : "display"}`} style={{ color: c.ink }}>{t("whichTechnique")}</div>
      <div className={`-mt-2 text-[13.5px] ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{t("pickAsMany")}</div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
        {TECHNIQUES.map((t) => {
          const sel = named.includes(t.id);
          return (
            <button key={t.id} onClick={() => onToggle(t.id)} aria-pressed={sel}
              className="flex min-h-[82px] flex-col gap-2 rounded-[16px] border-2 p-[14px_13px] text-left transition-all hover:-translate-y-0.5"
              style={{ borderColor: sel ? c.forest : c.hair, background: sel ? c.sageSoft : c.surface }}>
              <div className="flex items-center justify-between">
                <span className="flex" style={{ color: sel ? c.forest : c.muted }}><TechniqueIcon id={t.id} size={22} bg={sel ? c.sageSoft : c.surface} /></span>
                {sel && <span className="grid h-5 w-5 place-items-center rounded-full text-[12px] font-extrabold text-white" style={{ background: c.forest, animation: "pop .25s ease" }}>✓</span>}
              </div>
              <div><div className="mm text-[14px] font-semibold leading-[1.7]" style={{ color: c.ink }}>{t.mm}</div><div className="text-[12.5px]" style={{ color: c.muted }}>{t.en}</div></div>
            </button>
          );
        })}
      </div>
      <button onClick={onCheck} className={`mt-1 rounded-full p-[15px] text-[15px] text-white ${mm ? "mm font-bold" : "display"}`} style={{ background: c.ink }}>
        {named.length ? t("check") : t("looksGenuine")}
      </button>
    </div>
  );
}

/* ---------- NAME RESULT ---------- */
function NameResult({ scenario, picked, onWhy, onBuild, onNextCase, onBack }: { scenario: Scenario; picked: TechniqueId[]; whereOpen: boolean; onToggleWhere: () => void; onWhy: () => void; onBuild: () => void; onNextCase: () => void; onBack: () => void }) {
  // Build (Villain's Seat) is an optional detour per case, not a mandatory
  // gate — design_v4 §7 treats it as its own mode, not a chained step.
  const t = useT();
  const mm = useLang() === "mm";
  const forward = (
    <div className="flex gap-2.5">
      <button onClick={onNextCase} className={`flex-1 rounded-full border-[1.5px] p-[15px] text-[15px] ${mm ? "mm font-bold" : "display"}`} style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{t("nextCase")}</button>
      <button onClick={onBuild} className={`flex-1 rounded-full p-[15px] text-[15px] text-white ${mm ? "mm font-bold" : "display"}`} style={{ background: c.ink }}>{t("tryBuilding")}</button>
    </div>
  );
  const header = (
    <div className="flex items-center justify-between">
      <button onClick={onBack} className={`inline-flex items-center gap-1 rounded-full border-[1.5px] px-3.5 text-[14px] font-semibold ${mm ? "mm" : ""}`} style={{ borderColor: c.hair, background: c.surface, color: c.ink, minHeight: 44 }}>{t("back")}</button>
      <span className={`text-[12px] tracking-[0.14em] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("stepName")}</span>
    </div>
  );

  // Genuine message: reward trusting it (picking none).
  if (scenario.genuine) {
    const right = picked.length === 0;
    return (
      <div className="anim-screen mx-auto flex max-w-[600px] flex-col gap-4">
        {header}
        <Outcome ok={right}
          title={t(right ? "outcomeTrusted" : "outcomeOverCalled")}
          sub={t(right ? "outcomeTrustedSub" : "outcomeOverCalledSub")} />
        <div className="rounded-[16px] border-[1.5px] p-[18px]" style={{ borderColor: c.hair, background: c.surface }}>
          <div className="mm text-[16px] leading-[1.85]" style={{ color: c.ink }}>
            {right
              ? "ဒါ တကယ့်စာပါ။ ဘာမှ မထင်ပဲ ယုံလိုက်တာ မှန်ပါတယ်။"
              : "ဒါ တကယ့်စာပါ။ နည်းစနစ် ရှာမတွေ့တာ သဘာဝပါ — ဒါက ရိုးရိုးစာ ဖြစ်လို့။"}
          </div>
          <div className="mt-2 text-[13.5px] leading-relaxed" style={{ color: c.muted2 }}>
            {right ? "This one's real — trusting it was the right call." : "This one's real; there was no technique to find. Trusting true things is a skill."}
          </div>
        </div>
        {forward}
      </div>
    );
  }

  const techs = scenario.techniques;
  const primary = techniqueById(techs[0]);
  const others = techs.slice(1);
  const gotPrimary = picked.includes(techs[0]);
  return (
    <div className="anim-screen mx-auto flex max-w-[600px] flex-col gap-4">
      {header}
      <Outcome ok={gotPrimary}
        title={t(gotPrimary ? "outcomeNamed" : "outcomeMissed")}
        sub={t(gotPrimary ? "outcomeNamedSub" : "outcomeMissedSub")} />
      <div className="flex items-center gap-4 rounded-[16px] border-[1.5px] p-[18px]" style={{ borderColor: c.hair, background: c.surface }}>
        <span className="shrink-0" style={{ color: c.flag }}><TechniqueIcon id={primary.id} size={34} /></span>
        <div><div className="mm text-[19px] font-semibold leading-[1.7]" style={{ color: c.ink }}>{primary.mm}</div><div className="display text-[15px] font-bold" style={{ color: c.muted2 }}>{primary.en}</div></div>
      </div>
      <Eyebrow>{t("theTell")}</Eyebrow>
      <div className="anim-rise rounded-[0_16px_16px_0] p-[18px]" style={{ background: c.goldSoft, borderLeft: `4px solid ${c.gold}` }}>
        <div className="mm text-[18px] font-medium leading-[1.9]" style={{ color: c.ink }}>{primary.tellMm}</div>
        <div className="mt-2.5 text-[14px] leading-relaxed" style={{ color: c.muted2 }}>{primary.tellEn}</div>
      </div>
      <button onClick={onWhy} className={`self-start text-[13.5px] font-bold ${mm ? "mm" : ""}`} style={{ color: c.greenDeep }}>{t("whyDoesThisWork")}</button>
      {others.length > 0 && (
        <>
          <Eyebrow>{t("alsoPresent")}</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {others.map((id) => {
              const t = techniqueById(id);
              return (
                <div key={id} className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] px-[15px] py-2.5" style={{ borderColor: c.hair }}>
                  <span className="flex" style={{ color: c.flag }}><TechniqueIcon id={id} size={18} /></span>
                  <span className="mm text-[14px] leading-[1.7]" style={{ color: c.ink }}>{t.mm}</span><span className="text-[12.5px]" style={{ color: c.muted }}>{t.en}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
      {forward}
    </div>
  );
}

/* ---------- STAGE ROADMAP (inside one difficulty) ---------- */
function Stages({ level, onPlay, onBack }: { level: number; onPlay: (stage: number) => void; onBack: () => void }) {
  const t = useT();
  const mm = useLang() === "mm";
  const progress = useProgress();
  const lv = LEVELS.find((x) => x.level === level) ?? LEVELS[0];
  const done = Math.min(casesCleared(progress, level), LEVEL_CLEAR_TARGET);
  return (
    <div className="anim-screen mx-auto flex max-w-[560px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className={`inline-flex items-center gap-1 rounded-full border-[1.5px] px-3.5 text-[14px] font-semibold ${mm ? "mm" : ""}`}
          style={{ borderColor: c.hair, background: c.surface, color: c.ink, minHeight: 44 }}>{t("back")}</button>
        <span className={`text-[12px] tracking-[0.14em] uppercase ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("stageLabel")}</span>
      </div>
      <div>
        <div className={`text-[22px] ${mm ? "mm font-semibold leading-[1.6]" : "display"}`} style={{ color: c.ink }}>{mm ? lv.mm : lv.name}</div>
        <div className={`mt-0.5 text-[13.5px] ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{mm ? lv.mmSub : lv.sub}</div>
      </div>
      <StageMap total={LEVEL_CLEAR_TARGET} done={done} onPlay={onPlay} />
      <p className={`text-center text-[12px] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("stagesHint")}</p>
    </div>
  );
}

/* ---------- CASE OUTCOME ---------- */
// Test players said they could not tell whether they had got it right. This is
// the answer: a mascot that reacts, an icon, and a word. Deliberately NOT
// colour-coded — §3 says correctness has no colour, so both states use the same
// ink/surface treatment and differ by mood, icon and text.
function Outcome({ ok, title, sub }: { ok: boolean; title: string; sub: string }) {
  const mm = useLang() === "mm";
  return (
    <div className="anim-rise flex items-center gap-3.5 rounded-[16px] border-2 p-4"
      style={{ borderColor: c.ink, background: c.surface }}>
      <DetectiveMascot size="76px" mood={ok ? "happy" : "thinking"} blink={false} label="" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: c.ink }}>{ok ? "\u2713" : "?"}</span>
          <span className={`text-[19px] leading-tight ${mm ? "mm font-bold" : "display"}`} style={{ color: c.ink }}>{title}</span>
        </div>
        <p className={`mt-1 text-[13.5px] leading-snug ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{sub}</p>
      </div>
    </div>
  );
}

/* ---------- BUILD SETUP ---------- */
function BuildSetup({ role, setRole, techs, toggleTech, onWrite }: { role: string | null; setRole: (r: string) => void; techs: TechniqueId[]; toggleTech: (id: TechniqueId) => void; onWrite: () => void }) {
  const canWrite = !!role && techs.length >= 1;
  const t = useT();
  const mm = useLang() === "mm";
  const picked = ROLES.find((r) => r.id === role);
  const goal = picked ? (mm ? picked.goalMm : picked.goalEn) : t("goalFallback");
  return (
    <div className="anim-screen mx-auto flex max-w-[620px] flex-col gap-3.5">
      <span className={`text-[12px] tracking-[0.14em] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("stepBuild")}</span>
      <div className="rounded-[0_14px_14px_0] px-[18px] py-[15px]" style={{ background: c.flagSoft, borderLeft: `4px solid ${c.flag}` }}>
        <div className={`text-[15.5px] ${mm ? "mm font-semibold leading-[1.6]" : "display"}`} style={{ color: c.flag }}>{mm ? "ဒီအကြိမ်မှာ သင်က လိမ်သူပါ။" : "You’re the manipulator this round."}</div>
        <div className={`mt-1 text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.ink }}>{mm ? "ဒီမှာ လုပ်တာ ဘာမှ ကူးလို့၊ မျှလို့ မရပါ၊ ဒီစာမျက်နှာက မထွက်ပါ။ တစ်ခါ တည်ဆောက်ကြည့်တာက မြင်တတ်ဖို့ နည်းလမ်းပါ။" : "Nothing you make here can be copied, shared, or leaves this screen. Building one is how you learn to spot it."}</div>
      </div>
      <Eyebrow>{t("pickRole")}</Eyebrow>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
        {ROLES.map((r) => { const sel = role === r.id; return (
          <button key={r.id} onClick={() => setRole(r.id)} aria-pressed={sel} className={`rounded-full border-2 p-3.5 text-[14px] font-bold transition-all ${mm ? "mm" : ""}`}
            style={{ borderColor: sel ? c.ink : c.hair, background: sel ? "#e8f2ec" : c.surface, color: c.ink }}>{mm ? r.mm : r.en}</button>
        ); })}
      </div>
      <Eyebrow>{t("pickTechniques")}</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {/* `tc`, not `t` — a param named `t` here would shadow the translator. */}
        {TECHNIQUES.map((tc) => { const sel = techs.includes(tc.id); return (
          <button key={tc.id} onClick={() => toggleTech(tc.id)} aria-pressed={sel} className={`rounded-full border-2 px-4 py-2.5 text-[14px] leading-[1.7] transition-all ${mm ? "mm" : ""}`}
            style={{ borderColor: sel ? c.ink : c.hair, background: sel ? c.ink : c.surface, color: sel ? "#fff" : c.ink }}>{mm ? tc.mm : tc.en}</button>
        ); })}
      </div>
      <Eyebrow>{t("yourGoal")}</Eyebrow>
      <div className="rounded-[14px] border-[1.5px] px-4 py-3.5 text-[14.5px] leading-relaxed" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{goal}</div>
      <button onClick={onWrite} disabled={!canWrite} className={`rounded-full p-[15px] text-[15px] ${mm ? "mm font-bold" : "display"}`} style={{ background: canWrite ? c.ink : "#e4ede7", color: canWrite ? "#fff" : "#a9bcb0" }}>{t("writeIt")}</button>
    </div>
  );
}

/* ---------- BUILD COMPOSE ---------- */
function BuildCompose({ role, frags, judged, toggleFrag, onJudge, onDone, onBack }: { role: string | null; frags: string[]; judged: boolean; toggleFrag: (id: string) => void; onJudge: () => void; onDone: () => void; onBack: () => void }) {
  const t = useT();
  const mm = useLang() === "mm";
  const chosen = FRAGMENTS.filter((f) => frags.includes(f.id));
  const picked = ROLES.find((r) => r.id === role);
  const goal = picked ? (mm ? picked.goalMm : picked.goalEn) : "";
  const composeText = chosen.length ? `${chosen.map((f) => `[${mm ? f.mm : f.en}]`).join(" + ")} — ${goal}` : t("buildEmptyHint");
  // No invented audience and no invented number. A fabricated "N of 5 were
  // fooled" used to live here — it was just `chosen.length + 1`, shipped to
  // every player as if real people had been surveyed. In an app about people
  // who lie with confident numbers, do not reintroduce it. The honest fooled
  // count arrives with multiplayer, computed from real votes (MULTIPLAYER.md).
  const used = [...new Set(chosen.map((f) => f.tech))];
  const unused = TECHNIQUES.filter((tc) => !used.includes(tc.id));
  const techName = (id: TechniqueId) => (mm ? techniqueById(id).mm : techniqueById(id).en);
  return (
    <div className="anim-screen mx-auto flex max-w-[620px] flex-col gap-3.5 select-none">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className={`inline-flex items-center gap-1 rounded-full border-[1.5px] px-3.5 text-[14px] font-semibold ${mm ? "mm" : ""}`} style={{ borderColor: c.hair, background: c.surface, color: c.ink, minHeight: 44 }}>{t("back")}</button>
        <span className={`text-[12px] tracking-[0.14em] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("stepBuild")}</span>
      </div>
      <div className={`rounded-[10px] px-3.5 py-2.5 text-center text-[11px] font-medium tracking-[0.1em] text-white ${mm ? "mm" : "font-mono"}`} style={{ background: c.flag }}>{t("gameContentBanner")}</div>
      <div className="relative overflow-hidden rounded-[16px] border-[1.5px]" style={{ borderColor: c.hair, background: c.surface }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "repeating-linear-gradient(135deg, transparent, transparent 16px, rgba(194,84,56,.06) 16px, rgba(194,84,56,.06) 32px)" }} />
        <div className="relative min-h-[100px] p-4"><div className="mm text-[16px] leading-[1.9]" style={{ color: c.ink }}>{composeText}</div></div>
      </div>
      <Eyebrow>{t("fillFromDeck")}</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {FRAGMENTS.map((f) => { const sel = frags.includes(f.id); return (
          <button key={f.id} onClick={() => toggleFrag(f.id)} aria-pressed={sel} className={`rounded-full border-2 px-[15px] py-2.5 text-[13.5px] font-semibold transition-all ${mm ? "mm" : ""}`}
            style={{ borderColor: sel ? c.flag : c.hair, background: sel ? c.flagSoft : c.surface, color: sel ? c.flag : c.ink }}>{mm ? f.mm : f.en}</button>
        ); })}
      </div>
      <button onClick={onJudge} disabled={!chosen.length} className={`rounded-full p-[15px] text-[15px] ${mm ? "mm font-bold" : "display"}`} style={{ background: chosen.length ? c.ink : "#e4ede7", color: chosen.length ? "#fff" : "#a9bcb0" }}>{t("seeIfFool")}</button>
      {judged && (
        <div className="anim-rise flex flex-col gap-2.5">
          <div className="rounded-[0_14px_14px_0] border-[1.5px] px-4 py-3.5" style={{ borderColor: c.hair, borderLeft: `4px solid ${c.ink}`, background: c.surface }}>
            <Eyebrow>{t("buildUses")}</Eyebrow>
            <div className={`mt-1.5 text-[15.5px] leading-relaxed ${mm ? "mm font-semibold" : "display"}`} style={{ color: c.ink }}>
              {used.map(techName).join(" · ")}
            </div>
            {unused.length > 0 && (
              <div className={`mt-2.5 text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>
                {t("buildNotUsed")} — {unused.map((tc) => techName(tc.id)).join(" · ")}
              </div>
            )}
          </div>
          <div className={`rounded-[0_14px_14px_0] px-4 py-3.5 text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ background: c.flagSoft, borderLeft: `4px solid ${c.flag}`, color: c.ink }}>{t("buildStickNote")}</div>
          <button onClick={onDone} className={`rounded-full p-3.5 text-[14.5px] text-white ${mm ? "mm font-bold" : "display"}`} style={{ background: c.ink }}>{t("backToDefence")}</button>
        </div>
      )}
    </div>
  );
}

/* ---------- PROGRESS (You) ---------- */
const STATE_TAG: Record<string, string> = { mastered: "mastered", practised: "practised", met: "met", not_met: "new" };
function Progress({ onNextCase }: { onNextCase: () => void }) {
  const progress = useProgress();
  const hist = historyDesc(progress);
  const rank = rankFor(progress);
  const t = useT();
  const mm = useLang() === "mm";
  return (
    <div className="anim-screen mx-auto flex max-w-[640px] flex-col gap-4">
      <span className={`text-[12px] tracking-[0.14em] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("youTab")}</span>
      <div className="flex items-center gap-3 rounded-[16px] p-[16px] text-white" style={{ background: c.forest }}>
        <Mascot size="52px" />
        <div className="min-w-0 flex-1">
          <div className="display text-[18px]">{rank.name}</div>
          {/* Rank ladder: which of the four named ranks is reached, discrete
              steps only — the same dot+line device the Play stepper already
              uses. No interpolated fill, no percentage (§3.1). */}
          <div className="mt-2.5 flex items-center gap-1.5">
            {RANKS.map((_, i) => (
              <div key={i} className={i < RANKS.length - 1 ? "flex flex-1 items-center gap-1.5" : "flex items-center"}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: i <= rank.index ? "#fff" : "rgba(255,255,255,.28)" }} />
                {i < RANKS.length - 1 && <span className="h-[1.5px] flex-1" style={{ background: i < rank.index ? "#fff" : "rgba(255,255,255,.28)" }} />}
              </div>
            ))}
          </div>
          <div className={`mt-1.5 text-[10.5px] ${mm ? "mm" : "font-mono"}`} style={{ color: "rgba(255,255,255,.7)" }}>
            {rank.index >= RANKS.length - 1 ? t("topRank") : `${t("nextRank")}: ${RANKS[rank.index + 1]}`}
          </div>
        </div>
      </div>
      <div className={`text-[22px] ${mm ? "mm font-semibold leading-[1.6]" : "display"}`} style={{ color: c.ink }}>{t("techniquesYouCanName")}</div>
      <div className={`-mt-2.5 text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{t("progressNote")}</div>
      <div className="flex flex-col gap-3.5 rounded-[16px] border-[1.5px] p-[18px]" style={{ borderColor: c.hair, background: c.surface }}>
        {TECHNIQUES.map((tech) => {
          const rec = progress.tech[tech.id];
          const st = stateFor(rec);
          const acc = techAccuracy(rec);
          // A badge per technique, not a meter: mastered = solid (the
          // strongest mark this system owns), practised = the same
          // sage-soft+forest treatment a selected chip gets (§6), met =
          // neutral surface with the amber "seen the tell" tint, not_met =
          // a dashed outline — the Mission Map's own "not yet" language
          // (§7.1), never a padlock. Discrete states only, no fill-meter (§3.1).
          const badge =
            st === "mastered"
              ? { bg: c.ink, border: "none", fg: "#fff" }
              : st === "practised"
              ? { bg: c.sageSoft, border: `1.5px solid ${c.forest}`, fg: c.forest }
              : st === "met"
              ? { bg: c.surface, border: `1.5px solid ${c.hair}`, fg: c.gold }
              : { bg: "transparent", border: `1.5px dashed ${c.hair}`, fg: "#9aa89e" };
          return (
            <div key={tech.id} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: badge.bg, border: badge.border, color: badge.fg }}>
                <TechniqueIcon id={tech.id} size={18} bg={badge.bg === "transparent" ? c.surface : badge.bg} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2"><span className={`text-[13.5px] font-semibold ${mm ? "mm leading-[1.6]" : ""}`} style={{ color: c.ink }}>{mm ? tech.mm : tech.en}</span><span className="font-mono text-[11px]" style={{ color: c.muted }}>{STATE_TAG[st]}</span></div>
                {/* The number behind the label. Without it "met" is opaque —
                    it cannot tell one sighting from twenty misses, because
                    only successes were ever counted. */}
                {acc.attempts > 0 && (
                  <div className={`mt-0.5 text-[11.5px] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>
                    {acc.correct} / {acc.attempts} {t("namedOutOf")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {progress.genuineSeen > 0 && (
        <div className="rounded-[16px] border-[1.5px] px-[18px] py-[15px]" style={{ borderColor: c.hair, background: c.surface }}>
          <div className={`text-[11px] tracking-[0.08em] ${mm ? "mm" : "font-mono uppercase"}`} style={{ color: c.muted }}>{t("genuineTrusted")}</div>
          <div className="mm mt-1 text-[16px]" style={{ color: c.ink }}>✓ {progress.genuineTrusted} / {progress.genuineSeen}<span className={`ml-2 text-[13px] ${mm ? "mm" : ""}`} style={{ color: c.muted }}>{t("trustingIsSkill")}</span></div>
        </div>
      )}
      {/* A dated record of what the player actually finished, newest first.
          States tell you where you are; a history tells you that you got
          there — which is what "I can't see my progress" was asking for. */}
      <div className="rounded-[16px] border-[1.5px] p-4" style={{ borderColor: c.hair, background: c.surface }}>
        <div className={`text-[11px] tracking-[0.08em] ${mm ? "mm" : "font-mono uppercase"}`} style={{ color: c.muted }}>{t("historyLabel")}</div>
        {hist.length === 0 ? (
          <div className={`mt-2 text-[13.5px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{t("historyEmpty")}</div>
        ) : (
          <ul className="mt-2.5 flex flex-col gap-2">
            {hist.slice(0, 12).map((e) => {
              const lesson = e.kind === "lesson" ? LESSONS.find((l) => l.id === e.id) : null;
              const lvl = e.kind === "level" ? LEVELS.find((x) => x.level === Number(e.id)) : null;
              const days = Math.floor((Date.now() - e.t) / 86400000);
              const when = days <= 0 ? t("timeToday") : days === 1 ? t("timeYesterday") : `${days} ${t("timeDaysAgo")}`;
              return (
                <li key={`${e.kind}-${e.id}`} className="flex items-center gap-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ background: c.sageSoft, color: c.forest }}>
                    {lesson ? <TechniqueIcon id={lesson.technique} size={15} bg="#d3e5d7" /> : <span className="text-[12px] font-bold">{"\u2713"}</span>}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={`text-[13.5px] font-semibold leading-snug ${mm ? "mm" : ""}`} style={{ color: c.ink }}>
                      {lesson ? (mm ? lesson.title.mm : lesson.title.en) : lvl ? (mm ? lvl.mm : lvl.name) : e.id}
                    </div>
                    <div className={`text-[11.5px] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>
                      {t(e.kind === "lesson" ? "histLesson" : "histLevel")} · {when}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Learn and Play progress, both real. Before this the profile showed
          technique mastery only, so a player who had read lessons and cleared
          levels saw no trace of either. */}
      <div className="rounded-[16px] border-[1.5px] p-4" style={{ borderColor: c.hair, background: c.surface }}>
        <div className={`text-[11px] tracking-[0.08em] ${mm ? "mm" : "font-mono uppercase"}`} style={{ color: c.muted }}>{t("lessonsReadLabel")}</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {LESSONS.map((l) => {
            const done = lessonDone(progress, l.id);
            return (
              <span key={l.id} title={l.title.en}
                className="grid h-8 w-8 place-items-center rounded-[9px]"
                style={{ background: done ? c.sageSoft : "#eef1f0", color: done ? c.forest : "#b6c4bb", opacity: done ? 1 : 0.75 }}>
                <TechniqueIcon id={l.technique} size={17} bg={done ? "#d3e5d7" : "#eef1f0"} />
              </span>
            );
          })}
        </div>
        <div className={`mt-2 text-[13px] ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>
          {lessonsDoneCount(progress)} {t("ofLessons")} {LESSONS.length}
        </div>

        <div className={`mt-4 text-[11px] tracking-[0.08em] ${mm ? "mm" : "font-mono uppercase"}`} style={{ color: c.muted }}>{t("levelsClearedLabel")}</div>
        <div className="mt-1.5 flex flex-col gap-1.5">
          {LEVELS.map((lv) => {
            const open = levelUnlocked(progress, lv.level);
            const cleared = levelCleared(progress, lv.level);
            return (
              <div key={lv.level} className="flex items-center gap-2.5 rounded-[10px] px-3 py-2"
                style={{ background: cleared ? c.sageSoft : "#f4f7f5", opacity: open ? 1 : 0.6 }}>
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px]"
                  style={{ background: cleared ? c.forest : "transparent", color: cleared ? "#fff" : c.muted, border: cleared ? "none" : `1.5px dashed ${c.hair}` }}>
                  {cleared ? "\u2713" : ""}
                </span>
                <span className={`flex-1 text-[13.5px] font-semibold ${mm ? "mm" : ""}`} style={{ color: c.ink }}>{mm ? lv.mm : lv.name}</span>
                <span className={`text-[11.5px] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>
                  {cleared ? t("lvlCleared") : open ? `${casesCleared(progress, lv.level)} / ${LEVEL_CLEAR_TARGET}` : t("lvlNotYet")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={onNextCase} className={`rounded-full p-[15px] text-[15px] text-white ${mm ? "mm font-bold" : "display"}`} style={{ background: c.ink }}>{t("nextCase")}</button>
      <Eyebrow>{t("forFacilitators")}</Eyebrow>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
        {[t("fiveQuestionCheck"), t("printDeck")].map((l) => (
          <button key={l} className={`rounded-[12px] border-[1.5px] px-4 py-3.5 text-left text-[14px] font-bold ${mm ? "mm" : ""}`} style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

/* ---------- HUB ---------- */
function Hub({ hubTrack, setHubTrack, onOpen, onWhy }: { hubTrack: number; setHubTrack: (n: number) => void; onOpen: (id: string) => void; onWhy: () => void }) {
  const stateBg: Record<string, string> = { mastered: c.ink, practised: "#f5e9c8", not_met: "#eef1f0", met: "#eef1f0", read: "#d3e5d7" };
  const stateFg: Record<string, string> = { mastered: "#ffffff", practised: "#a5761c", not_met: "#7d9285", met: "#7d9285", read: "#2c4433" };
  const stateLabel: Record<string, string> = { mastered: "MASTERED", practised: "PRACTISED", not_met: "NEW", met: "MET", read: "READ" };
  // REAL progress, not a hardcoded content field. Every lesson names a
  // technique, and the technique's mastery is what the player actually earned
  // (progress.ts). A lesson badge must never claim something the person did
  // not do — this app refuses fabricated verdicts about content, and a
  // fabricated verdict about the learner is no better.
  const progress = useProgress();
  // On a LESSON list the question is "have I read this?", so reading wins.
  // Technique mastery is a different fact and has its own section in the
  // profile; showing it here made a lesson you had finished say "MET", which
  // answers a question nobody asked on this screen.
  const lessonState = (l: { id: string; technique: TechniqueId }) =>
    lessonDone(progress, l.id) ? "read" : stateFor(progress.tech[l.technique]);
  const t = useT();
  const mm = useLang() === "mm";
  const deck = LESSONS.filter((l) => l.track === hubTrack);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [deckAt, setDeckAt] = useState(0);
  // Index follows real scroll position, so a thumb swipe and the arrows stay
  // in sync with the dots.
  const onDeckScroll = () => {
    const el = deckRef.current;
    if (!el) return;
    const w = el.clientWidth + 12; // card width + gap
    setDeckAt(Math.max(0, Math.min(deck.length - 1, Math.round(el.scrollLeft / w))));
  };
  const step = (d: number) => {
    const el = deckRef.current;
    if (!el) return;
    el.scrollTo({ left: (el.clientWidth + 12) * (deckAt + d), behavior: "smooth" });
  };

  // Auto-advance. This is the one piece of ambient looping motion outside the
  // idle bob, so it is heavily guarded (DESIGN.md §10, WCAG 2.2.2):
  //   * 3s per card (product-owner decision; see DESIGN.md §10)
  //   * pauses while hovered or focused
  //   * STOPS for good on any real interaction — swipe, arrow, or tap. Someone
  //     who has started steering should never have the deck move under them.
  //   * an explicit pause control, because touch has no hover
  //   * off entirely under prefers-reduced-motion
  const [auto, setAuto] = useState(true);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!auto || hold || deck.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const el = deckRef.current;
      if (!el) return;
      const w = el.clientWidth + 12;
      const to = (Math.round(el.scrollLeft / w) + 1) % deck.length;
      el.scrollTo({ left: w * to, behavior: "smooth" });
    }, 3000);
    return () => clearInterval(id);
  }, [auto, hold, deck.length]);
  return (
    <div className="anim-screen mx-auto flex max-w-[700px] flex-col gap-6">
      <div>
        <span className={`text-[12px] tracking-[0.14em] ${mm ? "mm" : "font-mono uppercase"}`} style={{ color: c.muted }}>{t("theCasebook")}</span>
        <h1 className={`m-0 mt-2 mb-1.5 text-[26px] ${mm ? "mm font-semibold leading-[1.6]" : "display"}`} style={{ color: c.ink }}>{t("whyTricksWork")}</h1>
        <p className={`m-0 max-w-[54ch] text-[14px] leading-relaxed ${mm ? "mm" : ""}`} style={{ color: c.muted2 }}>{t("hubIntro")}</p>
      </div>
      {/* Swipeable deck: one lesson at a time. Real horizontal scroll-snap so
          a thumb swipe works natively on a phone; the arrows are the keyboard
          and desktop path to the same thing. */}
      <div className="flex gap-1 rounded-[12px] p-1" style={{ background: "#e4ede7" }}>
        {TRACKS.map((tr) => { const on = tr.n === hubTrack; return (
          <button key={tr.n} onClick={() => { setHubTrack(tr.n); setDeckAt(0); deckRef.current?.scrollTo({ left: 0 }); }}
            className={`flex-1 rounded-[9px] px-2 py-2.5 text-[12.5px] font-semibold transition-colors ${mm ? "mm" : ""}`}
            style={{ background: on ? "#fff" : "transparent", color: on ? "#1b2a1f" : "#6b7d6f", boxShadow: on ? "0 1px 3px rgba(27,42,31,.12)" : "none" }}>
            {mm ? tr.mm : tr.en}
          </button>
        ); })}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => { setAuto(false); step(-1); }} disabled={deckAt === 0} aria-label={t("prevLesson")}
          className="grid shrink-0 place-items-center rounded-full border-[1.5px] text-[20px]"
          style={{ width: 44, height: 44, borderColor: c.hair, background: c.surface, color: c.ink, opacity: deckAt === 0 ? 0.35 : 1 }}>‹</button>

        <div ref={deckRef} onScroll={onDeckScroll}
          onPointerDown={() => setAuto(false)}
          onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}
          onFocusCapture={() => setHold(true)} onBlurCapture={() => setHold(false)}
          className="no-scrollbar flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth">
          {deck.map((l) => {
            const tr = TRACKS.find((x) => x.n === l.track) ?? TRACKS[0];
            return (
              <button key={l.id} onClick={() => onOpen(l.id)}
                className="card-tactile flex w-full shrink-0 snap-center flex-col items-center gap-3 rounded-[18px] border-2 p-6 text-center"
                style={{ borderColor: c.forest, background: c.surface, ["viewTransitionName" as string]: `lesson-card-${l.id}` }}>
                <span className="grid h-[92px] w-[92px] shrink-0 place-items-center rounded-[24px]" style={{ background: c.sageSoft, color: tr.accent }}>
                  <TechniqueIcon id={l.technique} size={48} bg="#d3e5d7" />
                </span>
                <div>
                  <div className="mm text-[19px] font-semibold leading-[1.55]" style={{ color: c.ink }}>{l.title.mm}</div>
                  <div className="text-[13.5px]" style={{ color: c.muted }}>{l.title.en}</div>
                </div>
                <span className="rounded-[5px] px-2 py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.05em]"
                  style={{ background: stateBg[lessonState(l)], color: stateFg[lessonState(l)] }}>{stateLabel[lessonState(l)]}</span>
                {l.deck && l.deck.length > 0 && (
                  <div className={`text-[12px] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{l.deck.length} {t("cardsCount")}</div>
                )}
                <span className={`mt-1 inline-block rounded-full px-5 text-[15px] text-white ${mm ? "mm font-bold" : "display"}`}
                  style={{ background: c.ink, lineHeight: "44px" }}>{t("startLesson")}</span>
              </button>
            );
          })}
        </div>

        <button onClick={() => { setAuto(false); step(1); }} disabled={deckAt >= deck.length - 1} aria-label={t("nextLesson")}
          className="grid shrink-0 place-items-center rounded-full border-[1.5px] text-[20px]"
          style={{ width: 44, height: 44, borderColor: c.hair, background: c.surface, color: c.ink, opacity: deckAt >= deck.length - 1 ? 0.35 : 1 }}>›</button>
      </div>

      {/* position dots — wayfinding, not a score (§3.1: no number to watch climb) */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex gap-1.5" aria-hidden="true">
          {deck.map((l, i) => (
            <span key={l.id} className="rounded-full transition-all"
              style={{ width: i === deckAt ? 18 : 7, height: 7, background: i === deckAt ? c.forest : "#cfddd2" }} />
          ))}
        </div>
        {deck.length > 1 && (
          <button onClick={() => setAuto((v) => !v)} aria-label={t(auto ? "pauseAuto" : "playAuto")}
            className="grid shrink-0 place-items-center rounded-full border-[1.5px]"
            style={{ width: 44, height: 44, borderColor: c.hair, background: c.surface, color: c.muted2 }}>
            <span className="text-[12px] leading-none">{auto ? "\u2016" : "\u25B6"}</span>
          </button>
        )}
      </div>
      <button onClick={onWhy} className="hidden">why</button>
    </div>
  );
}

/* ---------- LESSON READER ---------- */
// Every step of a lesson is a CARD in one deck (design §8.5, revised v4.4).
// Previously a lesson was six beats with six unrelated layouts (scenario card,
// prose + media row, flip card, amber panel, quiz grid, reversed card). That
// produced two competing progress bars and two competing "next" buttons on the
// same screen. Now: one card shape, one progress row, one advance action.
type LessonStep =
  | { k: "scenario" }
  | { k: "concept"; card: Card }
  | { k: "tell" }
  | { k: "practice" }
  | { k: "carry" };

function Lesson({ id, beat, setBeat, practicePick, setPracticePick, carryCopied, setCarryCopied, onHub, onLoop }: {
  id: string; beat: number; setBeat: (n: number) => void; practicePick: TechniqueId | null; setPracticePick: (t: TechniqueId) => void;
  carryCopied: boolean; setCarryCopied: (b: boolean) => void; onHub: () => void; onLoop: () => void;
}) {
  const L = LESSONS.find((l) => l.id === id)!;
  const t = useT();
  const mm = useLang() === "mm";
  const [flipped, setFlipped] = useState(false);

  // The explanation becomes a flip card like every other concept, so the deck
  // has one grammar throughout: ask on the front, reveal on the back.
  const howCard: Card = { front: { mm: t("howQuestion"), en: t("howQuestion") }, back: L.how };
  const steps: LessonStep[] = [
    { k: "scenario" },
    { k: "concept", card: howCard },
    ...(L.deck ?? []).map((card) => ({ k: "concept" as const, card })),
    { k: "tell" },
    { k: "practice" },
    { k: "carry" },
  ];
  const i = Math.min(Math.max(beat, 0), steps.length - 1);
  const step = steps[i];
  const isLast = i === steps.length - 1;
  // Reaching the final card is what counts as having read the lesson. Before
  // this, Learn recorded nothing at all and every card stayed NEW forever.
  useEffect(() => { if (isLast) recordLessonDone(L.id); }, [isLast, L.id]);
  const answered = practicePick != null;
  const correct = practicePick === L.practice.answer;
  const at = techniqueById(L.practice.answer);
  const opts = [L.practice.answer, ...TECHNIQUES.map((tc) => tc.id).filter((x) => x !== L.practice.answer)].slice(0, 4) as TechniqueId[];
  const nextBlocked = step.k === "practice" && !answered;

  const go = (n: number) => { setFlipped(false); setBeat(Math.min(Math.max(n, 0), steps.length - 1)); };
  // The carry line is the one thing in this app meant to leave it (§14). Plain
  // copy only: the app is not connected to any messaging app, so a "send"
  // affordance would promise a hand-off it cannot guarantee.
  const copyCarry = () => {
    navigator.clipboard?.writeText(mm ? L.carry.mm : L.carry.en);
    setCarryCopied(true);
  };
  const kindLabel = step.k === "scenario" ? t("meetIt")
    : step.k === "concept" ? t("kindConcept")
    : step.k === "tell" ? t("theTell")
    : step.k === "practice" ? t("practice")
    : t("carryIt");

  // one shared shell for every step
  const shell = (inner: React.ReactNode, extra?: React.CSSProperties, onDark?: boolean) => (
    <div key={i} className="anim-card-in rounded-[16px] border-[1.5px] p-5"
      style={{ borderColor: c.hair, background: c.surface, boxShadow: "0 10px 26px -18px rgba(35,55,44,.3)", minHeight: 250, display: "flex", flexDirection: "column", justifyContent: "center", ...extra }}>
      <div className={`mb-2.5 text-center text-[9.5px] font-bold tracking-[0.12em] ${mm ? "mm" : "font-mono uppercase"}`} style={{ color: onDark ? "rgba(255,255,255,.6)" : c.muted }}>{kindLabel}</div>
      {inner}
    </div>
  );

  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-3.5">
      {/* ONE progress row for the whole lesson */}
      <div className="flex items-center gap-3">
        <button onClick={onHub} className={`inline-flex items-center gap-1 rounded-full border-[1.5px] px-3.5 text-[14px] font-semibold ${mm ? "mm" : ""}`} style={{ borderColor: c.hair, background: c.surface, color: c.ink, minHeight: 44 }}>{t("casebookBack")}</button>
        <div className="flex flex-1 gap-1">
          {steps.map((_, n) => <span key={n} className="block h-1 flex-1 rounded-[2px]" style={{ background: n < i ? "#c9d6ce" : n === i ? c.greenDeep : "#e4ede7", transition: "background .3s" }} />)}
        </div>
      </div>

      {/* lesson title stays above every card (orientation) */}
      <div style={{ ["viewTransitionName" as string]: `lesson-card-${L.id}` }}>
        <div className="mm text-[15px] font-semibold leading-[1.5]" style={{ color: c.ink }}>{L.title.mm}</div>
        <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: c.muted }}>{L.title.en}</div>
      </div>

      {step.k === "scenario" && shell(
        <>
          <div className="overflow-hidden rounded-[12px] border-[1.5px]" style={{ borderColor: c.hair }}>
            <div className="flex items-center gap-2.5 border-b px-3 py-2.5" style={{ borderColor: c.hair }}>
              <span className="h-[26px] w-[26px] shrink-0 rounded-full" style={{ background: "#e8f2ec" }} />
              <span className="min-w-0"><span className="block text-[12.5px] font-bold" style={{ color: c.ink }}>{L.meet.sender}</span><span className="block text-[10.5px]" style={{ color: c.muted }}>{L.meet.meta}</span></span>
              <span className="ml-auto shrink-0 rounded border px-[6px] py-[2px] font-mono text-[8.5px] tracking-[0.08em]" style={{ borderColor: c.hair, color: c.muted }}>EXAMPLE</span>
            </div>
            <div className="p-3"><div className="mm text-[15.5px] leading-[1.85]" style={{ color: c.ink }}>{L.meet.mm}</div>
              <div className="mt-1.5 text-[12px] leading-relaxed" style={{ color: c.muted }}>{L.meet.en}</div></div>
          </div>
          <div className={`mt-3 text-center text-[11px] ${mm ? "mm" : ""}`} style={{ color: c.muted }}>{t("readAsArrives")}</div>
        </>
      )}

      {step.k === "concept" && (
        <button onClick={() => setFlipped((f) => !f)} aria-expanded={flipped} className="card-flip w-full text-left">
          <div className="card-flip-inner" style={{ transform: flipped ? "rotateY(180deg)" : undefined }}>
            <div className="card-face">
              {shell(
                <>
                  <div className="mx-auto mb-3 grid h-[62px] w-[62px] place-items-center rounded-full" style={{ background: c.sageSoft, color: c.forest }} aria-hidden="true">
                    <TechniqueIcon id={L.technique} size={30} bg={c.sageSoft} />
                  </div>
                  <div className="mm text-center text-[19px] font-semibold leading-[1.75]" style={{ color: c.ink }}>{step.card.front.mm}</div>
                  {step.card.front.en !== step.card.front.mm && <div className="mt-1.5 text-center text-[12.5px]" style={{ color: c.muted }}>{step.card.front.en}</div>}
                  <div className={`mt-4 text-center text-[10.5px] ${mm ? "mm" : "font-mono"}`} style={{ color: c.muted }}>{t("tapToFlip")}</div>
                </>
              )}
            </div>
            <div className="card-face card-face-back">
              {shell(
                <>
                  <div className="mm text-[15px] leading-[1.85]" style={{ color: c.ink }}>{step.card.back.mm}</div>
                  <div className="mt-2 text-[12px] leading-relaxed" style={{ color: c.muted2 }}>{step.card.back.en}</div>
                  {step.card.example && (
                    <div className="mt-3 rounded-[0_12px_12px_0] px-3 py-2.5" style={{ background: c.goldSoft, borderLeft: `4px solid ${c.gold}` }}>
                      <div className="mm text-[13px] leading-[1.8]" style={{ color: c.ink }}>{step.card.example.mm}</div>
                      <div className="mt-1 text-[11.5px] leading-relaxed" style={{ color: c.muted2 }}>{step.card.example.en}</div>
                    </div>
                  )}
                </>,
                { borderColor: c.forest, borderWidth: 2 }
              )}
            </div>
          </div>
        </button>
      )}

      {step.k === "tell" && shell(
        <>
          <div className="mm text-center text-[19px] font-semibold leading-[1.85]" style={{ color: c.ink }}>{L.tell.mm}</div>
          <div className="mt-2 text-center text-[12.5px] leading-relaxed" style={{ color: c.muted2 }}>{L.tell.en}</div>
          <div className={`mt-4 text-center text-[11px] ${mm ? "mm" : ""}`} style={{ color: c.muted }}>{t("tellNote")}</div>
        </>,
        { background: c.goldSoft, borderColor: "#e8d5a8" }
      )}

      {step.k === "practice" && shell(
        <>
          <div className="mm text-center text-[16.5px] leading-[1.85]" style={{ color: c.ink }}>{L.practice.mm}</div>
          <div className="mt-1.5 text-center text-[12px] leading-relaxed" style={{ color: c.muted }}>{L.practice.en}</div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {opts.map((oid) => {
              const tq = techniqueById(oid); const picked = practicePick === oid; const isAns = oid === L.practice.answer;
              // Correctness carries by ink weight + icon + the reveal below, never
              // colour (§3). A wrong pick stays neutral — clay marks manipulation,
              // never the person's mistake.
              const bor = answered && isAns ? c.ink : picked ? c.muted : c.hair;
              const mark = answered && isAns ? c.ink : c.muted;
              return (
                <button key={oid} onClick={() => { if (practicePick == null) setPracticePick(oid); }} className="flex items-center gap-2 rounded-[12px] border-2 px-2.5 py-[10px] text-left transition-all" style={{ borderColor: bor, background: c.surface }}>
                  <span className="flex shrink-0" style={{ color: mark }}><TechniqueIcon id={oid} size={17} bg={c.surface} /></span>
                  <span className="min-w-0"><span className="mm block text-[12.5px] font-semibold leading-[1.55]" style={{ color: c.ink }}>{tq.mm}</span><span className="text-[10.5px]" style={{ color: c.muted }}>{tq.en}</span></span>
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="anim-rise mt-3 rounded-[0_12px_12px_0] px-3.5 py-3" style={{ background: c.goldSoft, borderLeft: `4px solid ${c.gold}` }}>
              <div className={`text-[13px] font-bold ${mm ? "mm" : ""}`} style={{ color: c.ink }}>{correct ? t("namedIt") : `${t("theMoveHere")} ${mm ? at.mm : at.en}`}</div>
              <div className="mm mt-1.5 text-[14px] leading-[1.8]" style={{ color: c.ink }}>{at.tellMm}</div>
              <div className="mt-1 text-[12px] leading-relaxed" style={{ color: c.muted2 }}>{at.tellEn}</div>
            </div>
          )}
        </>
      )}

      {step.k === "carry" && shell(
        <>
          <div className="mm text-center text-[19px] font-medium leading-[1.85] text-white">{L.carry.mm}</div>
          <div className="mt-2 text-center text-[12.5px] leading-relaxed" style={{ color: "rgba(255,255,255,.72)" }}>{L.carry.en}</div>
          <div className={`mt-3 text-center text-[11.5px] leading-[1.7] ${mm ? "mm" : ""}`} style={{ color: "rgba(255,255,255,.72)" }}>{t("carryWhatFor")}</div>
          <button onClick={copyCarry}
            className={`mx-auto mt-4 rounded-full bg-white px-6 py-2.5 text-[13.5px] font-bold ${mm ? "mm" : "display"}`} style={{ color: c.ink }}>
            {carryCopied ? `${t("copied")} ✓` : t("copyLine")}
          </button>
        </>,
        { background: c.forest, borderColor: c.forest },
        true
      )}

      {/* ONE advance action */}
      {!isLast ? (
        <div className="flex gap-2.5">
          {i > 0 && <button onClick={() => go(i - 1)} className={`rounded-full border-[1.5px] px-5 py-3.5 text-[14.5px] ${mm ? "mm font-bold" : "display"}`} style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{t("cardPrev")}</button>}
          <button onClick={() => { if (!nextBlocked) go(i + 1); }} className={`flex-1 rounded-full p-3.5 text-[15px] ${mm ? "mm font-bold" : "display"}`} style={{ background: nextBlocked ? "#e4ede7" : c.ink, color: nextBlocked ? "#a9bcb0" : "#fff" }}>
            {nextBlocked ? t("pickOneToContinue") : t("continue")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <button onClick={onLoop} className={`rounded-full p-[15px] text-[15px] text-white ${mm ? "mm font-bold" : "display"}`} style={{ background: c.ink }}>{t("practiseInLoop")}</button>
          <button onClick={onHub} className={`rounded-full border-[1.5px] p-3.5 text-[14px] ${mm ? "mm font-bold" : "display"}`} style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{t("backToCasebook")}</button>
        </div>
      )}
    </div>
  );
}

/* ---------- THE LENS ---------- */
function Lens({ caseId, phase, answer, custom, input, onInput, onSubmit, onPickCase, onAnswer, onReset, onClose }: {
  caseId: string | null; phase: number; answer: string | null; custom: string;
  input: string; onInput: (v: string) => void; onSubmit: (v: string) => void;
  onPickCase: (id: string) => void; onAnswer: (a: string) => void; onReset: () => void; onClose: () => void;
}) {
  const tt = useT();
  const mmL = useLang() === "mm";
  const esc = caseId === "escalation";
  const isCustom = caseId === "custom";
  const lc = caseId && !esc && !isCustom ? LENS_CASES.find((x) => x.id === caseId) : null;
  const t = lc ? techniqueById(lc.tech) : null;
  const footer: "cases" | "answers" | "done" | "escalation" = esc ? "escalation" : isCustom ? "done" : !lc ? "cases" : phase >= 2 ? "done" : "answers";
  const submit = () => { const v = input.trim(); if (v) onSubmit(v); };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0" style={{ background: "rgba(27,42,31,.42)" }} onClick={onClose} />
      <div className="anim-rise relative mx-auto flex h-[76vh] w-full max-w-[600px] flex-col rounded-t-[22px]" style={{ background: c.surface, boxShadow: "0 -20px 50px -20px rgba(27,42,31,.5)" }}>
        {/* Escalation drops the mascot and "The Lens" chrome entirely — §9.6
            wants it visually obvious the game stopped, not a companion
            leaning in on a crisis. */}
        {esc ? (
          <div className="flex shrink-0 items-center border-b px-[18px] py-4" style={{ borderColor: c.hair }}>
            <div className="text-[13px] font-bold uppercase tracking-[0.06em]" style={{ color: c.ink }}>{tt("lensHelp")}</div>
            <button onClick={onClose} className="ml-auto px-2 py-1 text-[22px] leading-none" style={{ color: c.muted }}>✕</button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-3 border-b px-[18px] py-4" style={{ borderColor: c.hair }}>
            <Mascot size="34px" />
            <div className="min-w-0"><div className="display text-[16px] leading-none" style={{ color: c.ink }}>{tt("lensTitle")}</div><div className="mt-0.5 font-mono text-[10.5px] tracking-[0.04em]" style={{ color: c.muted }}>{tt("lensSub")}</div></div>
            <button onClick={onClose} className="ml-auto px-2 py-1 text-[22px] leading-none" style={{ color: c.muted }}>✕</button>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-[18px]">
          {esc ? (
            <div className="anim-rise rounded-[16px] border-2 p-5" style={{ borderColor: c.ink, background: c.surface }}>
              <div className="mm text-[19px] font-semibold leading-[1.7]" style={{ color: c.ink }}>အရင်ဆုံး ဒါတွေ လုပ်ပါ။ ဖြည်းဖြည်း လုပ်ရင် ရပါတယ်။</div>
              <div className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: c.muted2 }}>Do these first. Step by step is fine.</div>
              <div className="mt-[18px] flex flex-col gap-3">
                {[["1", "သင့်ဘဏ်ကို ချက်ချင်း ဖုန်းဆက်ပြီး ငွေလွှဲမှုကို ရပ်ခိုင်းပါ။", "Call your bank now and ask them to stop the transfer."],
                  ["2", "လွှဲပြောင်းမှု အသေးစိတ်ကို မှတ်ထားပါ။", "Note the transfer details (time, amount, account)."],
                  ["3", "ယုံကြည်ရသူ တစ်ဦးကို အခု အကြောင်းကြားပါ။", "Tell someone you trust, right now."]].map(([n, mm, en]) => (
                  <div key={n} className="flex items-start gap-3"><span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-[13px] font-bold text-white" style={{ background: c.ink }}>{n}</span><div><div className="mm text-[16px] leading-[1.75]" style={{ color: c.ink }}>{mm}</div><div className="text-[12.5px]" style={{ color: c.muted }}>{en}</div></div></div>
                ))}
              </div>
              <div className="mt-[18px] flex flex-col gap-2">
                {[["Your bank hotline", "to be added"], ["Local police", "to be added"]].map(([l, n]) => (
                  <div key={l} className="flex items-center justify-between rounded-[12px] border-[1.5px] px-[15px] py-3" style={{ borderColor: c.hair }}><span className="text-[13.5px] font-semibold" style={{ color: c.muted2 }}>{l}</span><span className="font-mono text-[15px]" style={{ color: c.ink }}>{n}</span></div>
                ))}
              </div>
              <div className="mt-3.5 font-mono text-[10.5px] leading-relaxed" style={{ color: c.muted }}>Example structure — a real build verifies current local numbers with a person.</div>
            </div>
          ) : isCustom ? (
            <>
              <UserBubble text={custom} />
              {/* Guided check: six categorisation steps the PLAYER answers.
                  Replaces the old keyword sniff, which guessed a technique from
                  regex and told the user about it. This asks instead, and never
                  rules on truth (§14). */}
              <div className="w-full self-start"><LensCheck text={custom} /></div>
            </>
          ) : !lc ? (
            <LensText mm="ဘာကို ကြည့်ကြမလဲ? ပြပါ၊ အတူတူ ကြည့်ရအောင်။" en="What are we looking at? Show me and we'll look together." />
          ) : (
            <>
              <LensText mm="ဘာကို ကြည့်ကြမလဲ?" en="What are we looking at?" />
              <UserBubble text={lc.chip} />
              <LensScenario sender={lc.sender} meta={lc.meta} mm={lc.body.mm} en={lc.body.en} />
              <LensText mm={lc.q.mm} en={lc.q.en} />
              {phase >= 2 && t && (
                <>
                  <UserBubble text={answer ?? ""} />
                  <div className="flex w-full flex-col gap-2.5 self-start">
                    <div className="flex items-center gap-3 rounded-[14px] border-[1.5px] px-[15px] py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
                      <span className="flex shrink-0" style={{ color: c.flag }}><TechniqueIcon id={t.id} size={24} /></span>
                      <div><div className="mm text-[17px] font-semibold leading-[1.7]" style={{ color: c.ink }}>{t.mm}</div><div className="text-[13px]" style={{ color: c.muted2 }}>{t.en}</div></div>
                    </div>
                    <div className="rounded-[0_14px_14px_0] px-4 py-3.5" style={{ background: c.goldSoft, borderLeft: `4px solid ${c.gold}` }}>
                      <div className="mm text-[17px] font-medium leading-[1.85]" style={{ color: c.ink }}>{t.tellMm}</div>
                      <div className="mt-1.5 text-[13px] leading-relaxed" style={{ color: c.muted2 }}>{t.tellEn}</div>
                    </div>
                  </div>
                  <div className="w-full self-start rounded-[14px] border-[1.5px] px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: c.muted }}>{tt("whatYouCanCheck")}</div>
                    <div className="mt-2.5 flex flex-col gap-2.5">{lc.check.map((x, i) => <div key={i} className="flex items-start gap-2.5"><span className="shrink-0 font-bold" style={{ color: c.greenDeep }}>✓</span><span className="mm text-[14.5px] leading-[1.75]" style={{ color: c.ink }}>{x}</span></div>)}</div>
                  </div>
                  <div className="w-full self-start rounded-[12px] border px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: c.muted }}>{tt("whatICantKnow")}</div>
                    <div className="mm mt-2 text-[14.5px] leading-[1.8]" style={{ color: c.muted2 }}>{lc.cant.mm}</div>
                    <div className="mt-2 font-mono text-[11.5px] leading-relaxed" style={{ color: c.muted }}>{lc.cant.en}</div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="shrink-0 border-t px-[18px] py-3.5" style={{ borderColor: c.hair }}>
          {footer === "cases" && (
            <div className="flex flex-col gap-2.5">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.06em]" style={{ color: c.muted }}>{tt("lensPick")}</div>
              <div className="flex flex-wrap gap-2">{LENS_CASES.map((x) => <button key={x.id} onClick={() => onPickCase(x.id)} className="rounded-full border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{x.chip}</button>)}</div>
              <button onClick={() => onPickCase("escalation")} className="self-start pt-1 text-[13px] font-bold" style={{ color: c.flag }}>{tt("lensSentMoney")}</button>
            </div>
          )}
          {footer === "answers" && lc && (
            <div className="flex flex-wrap gap-2">{lc.answers.map((a) => <button key={a} onClick={() => onAnswer(a)} className="mm rounded-full border-[1.5px] px-4 py-2.5 text-[14px] font-semibold leading-[1.7]" style={{ borderColor: c.hair, background: c.sageSoft, color: c.ink }}>{a}</button>)}</div>
          )}
          {footer === "done" && (
            <div className="flex flex-wrap items-center gap-3"><button onClick={onReset} className="display rounded-full px-5 py-3 text-[14px] text-white" style={{ background: c.ink }}>{tt("lensLookAnother")}</button><span className="min-w-[140px] flex-1 text-[12px] leading-[1.5]" style={{ color: c.muted }}>Same six techniques as the loop and the deck — the words travel with you.</span></div>
          )}
          {footer === "escalation" && (
            <button onClick={onClose} className="display w-full rounded-full border-[1.5px] p-3.5 text-[14px]" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{tt("lensClose")}</button>
          )}
          {(footer === "cases" || footer === "done") && (
            <div className="mt-3.5 flex gap-2 border-t border-dashed pt-3.5" style={{ borderColor: c.hair }}>
              <input value={input} onChange={(e) => onInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                placeholder={mmL ? tt("lensAskPlaceholder") : "ask in your own words"}
                className="mm min-w-0 flex-1 rounded-full border-[1.5px] px-4 py-2.5 text-[14px] outline-none"
                style={{ borderColor: c.hair, background: c.surface, color: c.ink }} />
              <button onClick={submit} className="display shrink-0 rounded-full px-5 text-[14px] text-white" style={{ background: c.ink }}>{tt("lensAsk")}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const LensText = ({ mm, en }: { mm: string; en: string }) => (
  <div className="max-w-[90%] self-start"><div className="mm text-[15px] leading-[1.8]" style={{ color: c.ink }}>{mm}</div><div className="mt-0.5 text-[12.5px]" style={{ color: c.muted }}>{en}</div></div>
);
const UserBubble = ({ text }: { text: string }) => (
  <div className="max-w-[82%] self-end rounded-[16px_16px_4px_16px] px-3.5 py-2.5 text-[14px] font-semibold" style={{ background: c.sageSoft, color: c.ink }}>{text}</div>
);
const LensScenario = ({ sender, meta, mm, en }: { sender: string; meta: string; mm: string; en: string }) => (
  <div className="w-full self-start overflow-hidden rounded-[14px] border-[1.5px]" style={{ borderColor: c.hair, background: c.surface }}>
    <div className="flex items-center gap-2.5 border-b px-3.5 py-3" style={{ borderColor: c.hair }}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold" style={{ background: "#e8f2ec", color: c.greenDeep }}>•</span><span className="min-w-0"><span className="block text-[13.5px] font-bold" style={{ color: c.ink }}>{sender}</span><span className="block text-[11.5px]" style={{ color: c.muted }}>{meta}</span></span><span className="ml-auto rounded border px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.06em]" style={{ borderColor: c.hair, color: c.muted }}>EXAMPLE</span></div>
    <div className="px-[15px] py-3"><div className="mm text-[15.5px] leading-[1.8]" style={{ color: c.ink }}>{mm}</div><div className="mt-1.5 text-[12.5px] leading-[1.55]" style={{ color: c.muted }}>{en}</div></div>
  </div>
);
