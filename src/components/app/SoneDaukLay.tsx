"use client";

import { useState } from "react";
import { Mascot, MascotMark } from "@/components/Mascot";
import { TechniqueIcon } from "@/components/TechniqueIcon";
import {
  TECHNIQUES,
  TRACKS,
  LESSONS,
  LENS_CASES,
  ROLES,
  FRAGMENTS,
  techniqueById,
  type TechniqueId,
} from "@/content/pack";

// Exact port of the confirmed design's single guided flow (San Dauk Lay.dc.html):
// entry → see → seeResult → namePick → nameResult → buildSetup → buildCompose →
// progress, plus hub → lesson, and the conversational Lens. Tabs: HQ · Learn ·
// See · Name · Build · You.

type Screen =
  | "entry" | "see" | "seeResult" | "namePick" | "nameResult"
  | "buildSetup" | "buildCompose" | "progress" | "hub" | "lesson";

const SEE = {
  sender: "KBZ Support",
  meta: "+95 9 4•• ••• 231 · now",
  mm: "သင့်အကောင့်ကို ၂၄ နာရီအတွင်း ပိတ်ပါမည်။ ချက်ချင်း အတည်ပြုပါ။",
  en: '"Your account will be closed within 24 hours. Confirm immediately."',
  link: "secure-kbz-verify.link",
};

const V = "var";
const c = {
  ink: `${V}(--color-ink)`, surface: `${V}(--color-surface)`, hair: `${V}(--color-hairline)`,
  green: `${V}(--color-green)`, greenDeep: `${V}(--color-green-deep)`, gold: `${V}(--color-amber)`,
  goldSoft: `${V}(--color-amber-soft)`, muted: `${V}(--color-meta)`, muted2: `${V}(--color-muted)`,
  flag: `${V}(--color-clay)`, flagSoft: `${V}(--color-clay-soft)`, sageSoft: `${V}(--color-sage-soft)`,
};

const MLINES: Record<Screen, string> = {
  entry: "Ready, detective?", see: "Read it like a suspect…", seeResult: "Spot the trick?",
  namePick: "Name that move!", nameResult: "Nailed it!", buildSetup: "Heh… let's get sneaky.",
  buildCompose: "Build the fake — for science!", progress: "Look how sharp you are!",
  hub: "The casebook, detective.", lesson: "Read it, then prove it.",
};

const NAV: { id: string; label: string; to: Screen }[] = [
  { id: "home", label: "HQ", to: "entry" },
  { id: "learn", label: "Learn", to: "hub" },
  { id: "see", label: "See", to: "see" },
  { id: "name", label: "Name", to: "namePick" },
  { id: "build", label: "Build", to: "buildSetup" },
  { id: "you", label: "You", to: "progress" },
];
const NAV_MAP: Record<Screen, string> = {
  entry: "home", see: "see", seeResult: "see", namePick: "name", nameResult: "name",
  buildSetup: "build", buildCompose: "build", progress: "you", hub: "learn", lesson: "learn",
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="font-mono text-[12px] uppercase tracking-[0.12em]" style={{ color: c.muted }}>
    {children}
  </div>
);

export function SoneDaukLay() {
  const [screen, setScreen] = useState<Screen>("entry");
  const [vote, setVote] = useState<string | null>(null);
  const [named, setNamed] = useState<TechniqueId[]>([]);
  const [whereOpen, setWhereOpen] = useState(false);
  const [buildRole, setBuildRole] = useState<string | null>(null);
  const [buildTechs, setBuildTechs] = useState<TechniqueId[]>([]);
  const [buildFrags, setBuildFrags] = useState<string[]>([]);
  const [buildJudged, setBuildJudged] = useState(false);
  const [practiced, setPracticed] = useState<Record<string, boolean>>({});
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

  const go = (s: Screen) => setScreen(s);
  const openLesson = (id: string) => {
    setLessonId(id); setBeat(0); setPracticePick(null); setCarryCopied(false); setScreen("lesson");
  };
  const closeLens = () => { setLensOpen(false); setLensCase(null); setLensPhase(0); setLensAnswer(null); };

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
          <nav className="flex flex-wrap gap-0.5">
            {NAV.map((n) => {
              const on = NAV_MAP[screen] === n.id;
              return (
                <button key={n.id} onClick={() => go(n.to)}
                  className="flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-bold transition-colors"
                  style={{ background: on ? c.sageSoft : "transparent", color: on ? c.ink : c.muted }}>
                  {n.label}
                  <span className="block h-[5px] w-[5px] rounded-full" style={{ background: on ? c.greenDeep : "transparent" }} />
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-4 pb-24 pt-8 sm:px-10">
        {screen === "entry" && <Entry go={go} openLens={() => setLensOpen(true)} />}
        {screen === "see" && <See onVote={(v) => { setVote(v); go("seeResult"); }} />}
        {screen === "seeResult" && <SeeResult vote={vote} onNext={() => go("namePick")} onBack={() => go("see")} />}
        {screen === "namePick" && (
          <NamePick named={named}
            onToggle={(id) => setNamed((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
            onCheck={() => { if (named.length) { setPracticed((p) => ({ ...p, urgency: true, authority: true })); go("nameResult"); } }}
            onPaste={() => setLensOpen(true)} />
        )}
        {screen === "nameResult" && (
          <NameResult whereOpen={whereOpen} onToggleWhere={() => setWhereOpen((o) => !o)}
            onWhy={() => openLesson("t1-urgency")} onBuild={() => go("buildSetup")} onBack={() => go("namePick")} />
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
        {screen === "progress" && <Progress practiced={practiced} onPractise={() => go("see")} />}
        {screen === "hub" && (
          <Hub hubTrack={hubTrack} setHubTrack={setHubTrack} onOpen={openLesson} onWhy={() => openLesson("t1-urgency")} />
        )}
        {screen === "lesson" && lessonId && (
          <Lesson id={lessonId} beat={beat} setBeat={setBeat} practicePick={practicePick} setPracticePick={setPracticePick}
            carryCopied={carryCopied} setCarryCopied={setCarryCopied} onHub={() => go("hub")} onLoop={() => go("see")} />
        )}
      </main>

      {/* corner mascot + line */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2">
        <div className="rounded-[16px_16px_5px_16px] border px-3.5 py-2 shadow-lg" style={{ background: c.surface, borderColor: c.hair }}>
          <span className="display text-[13px]" style={{ color: c.ink }}>{MLINES[screen]}</span>
        </div>
        <button onClick={() => setLensOpen(true)} aria-label="Ask the Lens" className="pointer-events-auto anim-floaty">
          <Mascot size="62px" />
        </button>
      </div>

      {lensOpen && (
        <Lens caseId={lensCase} phase={lensPhase} answer={lensAnswer}
          onPickCase={(id) => { if (id === "escalation") { setLensCase("escalation"); } else { setLensCase(id); setLensPhase(1); setLensAnswer(null); } }}
          onAnswer={(a) => { setLensAnswer(a); setLensPhase(2); }}
          onReset={() => { setLensCase(null); setLensPhase(0); setLensAnswer(null); }}
          onClose={closeLens} />
      )}

      <div className="mx-auto max-w-[1000px] px-4 pb-10 text-center text-[11.5px] leading-relaxed" style={{ color: c.muted }}>
        No risk tiers, no verdicts — only named techniques and their tells. Burmese strings are drafts pending native-speaker review.
      </div>
    </div>
  );
}

/* ---------- ENTRY (HQ) ---------- */
function Entry({ go, openLens }: { go: (s: Screen) => void; openLens: () => void }) {
  const LOOP = [
    { step: "STEP 1", title: "See", sub: "Meet manipulation in the wild — react before being told.", id: "see" as const },
    { step: "STEP 2", title: "Name", sub: "Identify which of six techniques is at work, learn the tell.", id: "name" as const },
    { step: "STEP 3", title: "Build", sub: "Take the manipulator's seat once — the step that makes it stick.", id: "build" as const },
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
          <h1 className="mm m-0 mt-3.5 mb-1.5 text-[clamp(28px,7vw,44px)] font-semibold leading-[1.6]" style={{ color: c.ink }}>
            လိမ်လည်မှုကို မခံခင် ကြိုသိအောင်။
          </h1>
          <div className="display text-[clamp(20px,3.4vw,28px)] font-bold leading-[1.2]" style={{ color: c.muted2 }}>
            Learn the trick before it reaches you.
          </div>
          <p className="m-0 mt-[18px] mb-6 max-w-[46ch] text-[15px] leading-relaxed" style={{ color: c.muted2 }}>
            Sone Dauk Lay is a little detective for your pocket. Meet manipulation in the wild, name the technique behind it, then take the manipulator&rsquo;s seat once — the move that makes it stick.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <button onClick={() => go("see")} className="display rounded-full px-7 py-3.5 text-[15px] text-white" style={{ background: c.ink }}>Start a case →</button>
            <button onClick={openLens} className="display rounded-full border-[1.5px] bg-transparent px-6 py-3.5 text-[15px]" style={{ borderColor: c.hair, color: c.ink }}>Paste a message</button>
          </div>
          <div className="mt-[18px] font-mono text-[11.5px]" style={{ color: c.muted }}>no account needed · nothing is uploaded · works offline</div>
        </div>
        <div className="relative mx-auto shrink-0 p-4"><Mascot size="clamp(132px,32vw,196px)" ring float /></div>
      </div>

      <button onClick={() => go("hub")} className="anim-rise mt-8 flex w-full flex-wrap items-center gap-6 rounded-[24px] p-6 text-left text-white transition-transform hover:-translate-y-0.5 sm:mt-13 sm:p-8"
        style={{ background: "linear-gradient(135deg,#2c4433 0%,#31564a 48%,#1f6f78 100%)" }}>
        <div className="min-w-[230px] flex-1">
          <div className="font-mono text-[11.5px] tracking-[0.12em]" style={{ color: "rgba(255,255,255,.65)" }}>THE CASEBOOK · START HERE</div>
          <div className="display mt-1.5 text-[clamp(24px,3.6vw,30px)] leading-[1.12]">Learn why the tricks work.</div>
          <div className="mt-2 max-w-[48ch] text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,.82)" }}>12 short lessons — scams, AI &amp; synthetic media, and how information travels. Each ends in practice, never a checkbox.</div>
          <div className="mt-4 flex flex-wrap gap-[7px]">
            {["Six techniques", "AI & synthetic media", "Information integrity"].map((x) => (
              <span key={x} className="rounded-full px-[13px] py-1.5 text-[12.5px] font-semibold" style={{ border: "1px solid rgba(255,255,255,.28)" }}>{x}</span>
            ))}
          </div>
          <span className="display mt-[18px] inline-block rounded-full bg-white px-[22px] py-3 text-[14.5px]" style={{ color: "#1b2a1f" }}>Open the Hub →</span>
        </div>
      </button>

      <div className="mt-8 sm:mt-11">
        <Eyebrow>THE 3-STEP LOOP · PRACTISE WHAT YOU LEARN</Eyebrow>
        <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LOOP.map((l, i) => (
            <button key={l.title} onClick={() => go(l.id === "see" ? "see" : l.id === "name" ? "namePick" : "buildSetup")}
              className="anim-rise rounded-[20px] border-[1.5px] p-6 text-left transition-all hover:-translate-y-1"
              style={{ borderColor: c.hair, background: c.surface, animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px]" style={{ color: c.muted }}>{l.step}</span>
                <span style={{ color: c.greenDeep }}>{glyph[l.id]}</span>
              </div>
              <div className="display mt-3.5 text-[22px]" style={{ color: c.ink }}>{l.title}</div>
              <div className="mt-1 text-[14px]" style={{ color: c.muted2 }}>{l.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- SEE ---------- */
function See({ onVote }: { onVote: (v: string) => void }) {
  return (
    <div className="anim-screen mx-auto flex max-w-[600px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] font-medium tracking-[0.14em]" style={{ color: c.muted }}>SEE · 3 OF 8</span>
        <div className="flex gap-[5px]">{[0,1,2,3,4,5,6,7].map((i) => <span key={i} className="block h-[5px] w-[18px] rounded-[3px]" style={{ background: i < 3 ? c.green : c.hair }} />)}</div>
      </div>
      <Eyebrow>This arrived on Viber</Eyebrow>
      <div className="overflow-hidden rounded-[16px] border-[1.5px]" style={{ borderColor: c.hair, background: c.surface, boxShadow: "0 10px 26px -18px rgba(35,55,44,.3)" }}>
        <div className="flex items-center gap-3 border-b px-4 py-3.5" style={{ borderColor: c.hair }}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-bold" style={{ background: "#e8f2ec", color: c.greenDeep }}>KB</span>
          <span className="min-w-0"><span className="block text-[15px] font-bold" style={{ color: c.ink }}>{SEE.sender}</span><span className="block text-[12.5px]" style={{ color: c.muted }}>{SEE.meta}</span></span>
          <span className="ml-auto rounded border px-[7px] py-[3px] font-mono text-[10px] tracking-[0.08em]" style={{ borderColor: c.hair, color: c.muted }}>EXAMPLE</span>
        </div>
        <div className="relative overflow-hidden px-[18px] py-4">
          <div className="pointer-events-none absolute inset-y-0 w-[42%]" style={{ background: "linear-gradient(90deg,transparent,rgba(88,176,139,.16),transparent)", animation: "scan 2.8s ease-in-out infinite" }} />
          <div className="mm relative text-[17px] leading-[1.85]" style={{ color: c.ink }}>{SEE.mm}</div>
          <div className="mt-2 text-[13.5px] leading-relaxed" style={{ color: c.muted }}>{SEE.en}</div>
          <div className="mt-3.5 flex h-[34px] items-center rounded-lg px-3.5 text-[12.5px] font-semibold" style={{ background: "#e8f2ec", color: c.greenDeep }}>🔗 {SEE.link}</div>
          <div className="mt-3.5 flex justify-between text-[12.5px]" style={{ color: c.muted }}><span>4.2K seen</span><span>8.7K forwards</span></div>
        </div>
      </div>
      <div className="display mt-1 text-[16px]" style={{ color: c.ink }}>What would you do?</div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
        {[["trust","Trust it"],["notsure","Not sure"],["doubt","Doubt it"]].map(([v,l]) => (
          <button key={v} onClick={() => onVote(v)} className="rounded-full border-[1.5px] p-3.5 text-[14.5px] font-bold transition-all hover:-translate-y-0.5" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{l}</button>
        ))}
      </div>
      <div className="text-center text-[12.5px]" style={{ color: c.muted }}>No penalty for looking closer. Pick honestly.</div>
    </div>
  );
}

/* ---------- SEE RESULT ---------- */
function SeeResult({ vote, onNext, onBack }: { vote: string | null; onNext: () => void; onBack: () => void }) {
  const calib = vote === "trust"
    ? { head: "Worth a closer look.", body: "This one is built to rush you — let’s see the part doing that." }
    : vote === "notsure"
    ? { head: "Fair — it’s designed to be confusing.", body: "Here’s the fragment that tips it." }
    : { head: "Good instinct.", body: "Something here is designed to rush you." };
  return (
    <div className="anim-screen mx-auto flex max-w-[600px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[13.5px] font-semibold" style={{ color: c.muted }}>‹ Back</button>
        <span className="font-mono text-[12px] tracking-[0.14em]" style={{ color: c.muted }}>SEE · 3 OF 8</span>
      </div>
      <div className="anim-rise rounded-[0_14px_14px_0] border-[1.5px] p-4 px-[18px]" style={{ borderColor: c.hair, borderLeft: `4px solid ${c.green}`, background: c.surface }}>
        <div className="display text-[17px]" style={{ color: c.ink }}>{calib.head}</div>
        <div className="mt-1 text-[14px] leading-relaxed" style={{ color: c.muted2 }}>{calib.body}</div>
      </div>
      <Eyebrow>Now look closer</Eyebrow>
      <div className="rounded-[16px] border-[1.5px] p-[18px]" style={{ borderColor: c.hair, background: c.surface }}>
        <div className="mm text-[17px] leading-[2]" style={{ color: c.ink }}>
          သင့်အကောင့်ကို <span style={{ background: c.goldSoft, boxShadow: `0 0 0 3px ${c.goldSoft}`, borderRadius: 3 }}>၂၄ နာရီအတွင်း</span> ပိတ်ပါမည်။
        </div>
        <div className="mt-4 flex gap-2.5 border-t border-dashed pt-3.5" style={{ borderColor: c.hair }}>
          <div className="w-[3px] shrink-0 rounded-[2px]" style={{ background: c.gold }} />
          <div className="text-[13.5px] leading-relaxed" style={{ color: c.ink }}>A <b>countdown</b> — this fragment is doing the work. It&rsquo;s built to make you act before you think.</div>
        </div>
      </div>
      <div className="rounded-[14px] px-[18px] py-[15px] text-[13.5px] leading-[1.7]" style={{ background: "#e8f2ec", color: c.greenDeep }}>
        <b>4 of 8</b> messages in this set are genuine. Calling a real message fake costs accuracy too — the goal is a sharp eye, not blanket suspicion.
      </div>
      <button onClick={onNext} className="display rounded-full p-[15px] text-[15px] text-white" style={{ background: c.ink }}>Name the technique →</button>
    </div>
  );
}

/* ---------- NAME PICK ---------- */
function NamePick({ named, onToggle, onCheck, onPaste }: { named: TechniqueId[]; onToggle: (id: TechniqueId) => void; onCheck: () => void; onPaste: () => void }) {
  return (
    <div className="anim-screen mx-auto flex max-w-[640px] flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] tracking-[0.14em]" style={{ color: c.muted }}>NAME</span>
        <button onClick={onPaste} className="text-[13.5px] font-bold" style={{ color: c.greenDeep }}>Paste your own ›</button>
      </div>
      <div className="display text-[22px]" style={{ color: c.ink }}>Which technique is this using?</div>
      <div className="-mt-2 text-[13.5px]" style={{ color: c.muted2 }}>Pick as many as apply — real messages stack tricks.</div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
        {TECHNIQUES.map((t) => {
          const sel = named.includes(t.id);
          return (
            <button key={t.id} onClick={() => onToggle(t.id)} aria-pressed={sel}
              className="flex min-h-[82px] flex-col gap-2 rounded-[16px] border-2 p-[14px_13px] text-left transition-all hover:-translate-y-0.5"
              style={{ borderColor: sel ? c.greenDeep : c.hair, background: sel ? "#e8f5ee" : c.surface }}>
              <div className="flex items-center justify-between">
                <span className="flex" style={{ color: sel ? c.greenDeep : c.muted }}><TechniqueIcon id={t.id} size={22} bg={sel ? "#e8f5ee" : c.surface} /></span>
                {sel && <span className="grid h-5 w-5 place-items-center rounded-full text-[12px] font-extrabold text-white" style={{ background: c.greenDeep, animation: "pop .25s ease" }}>✓</span>}
              </div>
              <div><div className="mm text-[14px] font-semibold leading-[1.7]" style={{ color: c.ink }}>{t.mm}</div><div className="text-[12.5px]" style={{ color: c.muted }}>{t.en}</div></div>
            </button>
          );
        })}
      </div>
      <button onClick={onCheck} disabled={!named.length} className="display mt-1 rounded-full p-[15px] text-[15px]"
        style={{ background: named.length ? c.ink : "#e4ede7", color: named.length ? "#fff" : "#a9bcb0" }}>Check</button>
    </div>
  );
}

/* ---------- NAME RESULT ---------- */
function NameResult({ whereOpen, onToggleWhere, onWhy, onBuild, onBack }: { whereOpen: boolean; onToggleWhere: () => void; onWhy: () => void; onBuild: () => void; onBack: () => void }) {
  const u = techniqueById("urgency");
  const a = techniqueById("authority");
  return (
    <div className="anim-screen mx-auto flex max-w-[600px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[13.5px] font-semibold" style={{ color: c.muted }}>‹ Back</button>
        <span className="font-mono text-[12px] tracking-[0.14em]" style={{ color: c.muted }}>NAME</span>
      </div>
      <div className="anim-rise flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: c.greenDeep }}>
        <span className="grid h-[18px] w-[18px] place-items-center rounded-full text-[11px] text-white" style={{ background: c.greenDeep }}>✓</span> Technique found
      </div>
      <div className="flex items-center gap-4 rounded-[16px] border-[1.5px] p-[18px]" style={{ borderColor: c.hair, background: c.surface }}>
        <span className="shrink-0" style={{ color: c.flag }}><TechniqueIcon id="urgency" size={34} /></span>
        <div><div className="mm text-[19px] font-semibold leading-[1.7]" style={{ color: c.ink }}>{u.mm}</div><div className="display text-[15px] font-bold" style={{ color: c.muted2 }}>{u.en}</div></div>
      </div>
      <Eyebrow>The tell</Eyebrow>
      <div className="anim-rise rounded-[0_16px_16px_0] p-[18px]" style={{ background: c.goldSoft, borderLeft: `4px solid ${c.gold}` }}>
        <div className="mm text-[18px] font-medium leading-[1.9]" style={{ color: c.ink }}>{u.tellMm}</div>
        <div className="mt-2.5 text-[14px] leading-relaxed" style={{ color: c.muted2 }}>{u.tellEn}</div>
      </div>
      <button onClick={onWhy} className="self-start text-[13.5px] font-bold" style={{ color: c.greenDeep }}>Why does this work? Read the lesson ›</button>
      <Eyebrow>Also present in this message</Eyebrow>
      <div className="inline-flex items-center gap-2.5 self-start rounded-full border-[1.5px] px-[15px] py-2.5" style={{ borderColor: c.hair }}>
        <span className="flex" style={{ color: c.flag }}><TechniqueIcon id="authority" size={18} /></span>
        <span className="mm text-[14px] leading-[1.7]" style={{ color: c.ink }}>{a.mm}</span><span className="text-[12.5px]" style={{ color: c.muted }}>{a.en}</span>
      </div>
      <button onClick={onToggleWhere} className="flex items-center justify-between rounded-[12px] border-[1.5px] px-4 py-3.5 text-[14px] font-bold" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>
        Where else you&rsquo;ll meet this <span className="text-[18px]" style={{ color: c.muted }}>{whereOpen ? "–" : "+"}</span>
      </button>
      {whereOpen && (
        <div className="anim-rise rounded-[14px] border-[1.5px]" style={{ borderColor: c.hair, background: c.surface }}>
          {["Deepfake videos with a “share before it’s deleted” countdown.", "Rumours that spike right before an election or payday.", "Manufactured outrage designed to travel faster than a correction."].map((t, i, arr) => (
            <div key={i} className="px-3.5 py-3 text-[13.5px] leading-relaxed" style={{ color: c.ink, borderBottom: i < arr.length - 1 ? `1px solid ${c.hair}` : "none" }}>{t}</div>
          ))}
        </div>
      )}
      <button onClick={onBuild} className="display rounded-full p-[15px] text-[15px] text-white" style={{ background: c.ink }}>Now try building one →</button>
    </div>
  );
}

/* ---------- BUILD SETUP ---------- */
function BuildSetup({ role, setRole, techs, toggleTech, onWrite }: { role: string | null; setRole: (r: string) => void; techs: TechniqueId[]; toggleTech: (id: TechniqueId) => void; onWrite: () => void }) {
  const canWrite = !!role && techs.length >= 1;
  const goal = ROLES.find((r) => r.id === role)?.goal ?? "Pick a role above to set your goal.";
  return (
    <div className="anim-screen mx-auto flex max-w-[620px] flex-col gap-3.5">
      <span className="font-mono text-[12px] tracking-[0.14em]" style={{ color: c.muted }}>BUILD</span>
      <div className="rounded-[0_14px_14px_0] px-[18px] py-[15px]" style={{ background: c.flagSoft, borderLeft: `4px solid ${c.flag}` }}>
        <div className="display text-[15.5px]" style={{ color: c.flag }}>You&rsquo;re the manipulator this round.</div>
        <div className="mt-1 text-[13.5px] leading-relaxed" style={{ color: c.ink }}>Nothing you make here can be copied, shared, or leaves this screen. Building one is how you learn to spot it.</div>
      </div>
      <Eyebrow>Your role</Eyebrow>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
        {ROLES.map((r) => { const sel = role === r.id; return (
          <button key={r.id} onClick={() => setRole(r.id)} aria-pressed={sel} className="rounded-full border-2 p-3.5 text-[14px] font-bold transition-all"
            style={{ borderColor: sel ? c.ink : c.hair, background: sel ? "#e8f2ec" : c.surface, color: c.ink }}>{r.label}</button>
        ); })}
      </div>
      <Eyebrow>Pick 2–3 techniques</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {TECHNIQUES.map((t) => { const sel = techs.includes(t.id); return (
          <button key={t.id} onClick={() => toggleTech(t.id)} aria-pressed={sel} className="mm rounded-full border-2 px-4 py-2.5 text-[14px] leading-[1.7] transition-all"
            style={{ borderColor: sel ? c.ink : c.hair, background: sel ? c.ink : c.surface, color: sel ? "#fff" : c.ink }}>{t.mm}</button>
        ); })}
      </div>
      <Eyebrow>Your goal</Eyebrow>
      <div className="rounded-[14px] border-[1.5px] px-4 py-3.5 text-[14.5px] leading-relaxed" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{goal}</div>
      <button onClick={onWrite} disabled={!canWrite} className="display rounded-full p-[15px] text-[15px]" style={{ background: canWrite ? c.ink : "#e4ede7", color: canWrite ? "#fff" : "#a9bcb0" }}>Write it →</button>
    </div>
  );
}

/* ---------- BUILD COMPOSE ---------- */
function BuildCompose({ role, frags, judged, toggleFrag, onJudge, onDone, onBack }: { role: string | null; frags: string[]; judged: boolean; toggleFrag: (id: string) => void; onJudge: () => void; onDone: () => void; onBack: () => void }) {
  const chosen = FRAGMENTS.filter((f) => frags.includes(f.id));
  const goal = ROLES.find((r) => r.id === role)?.goal ?? "";
  const composeText = chosen.length ? `⚠ ${chosen.map((f) => `[${f.label}]`).join(" + ")} — ${goal}` : "Tap fragments below to assemble a fake message. It stays locked to this screen.";
  const foolCount = Math.min(5, Math.max(1, chosen.length + 1));
  const used = [...new Set(chosen.map((f) => f.tech))];
  const namedTech = used[0] ? techniqueById(used[0]).en.toLowerCase() : "a technique";
  const miss = TECHNIQUES.find((t) => !used.includes(t.id));
  return (
    <div className="anim-screen mx-auto flex max-w-[620px] flex-col gap-3.5 select-none">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[13.5px] font-semibold" style={{ color: c.muted }}>‹ Back</button>
        <span className="font-mono text-[12px] tracking-[0.14em]" style={{ color: c.muted }}>BUILD</span>
      </div>
      <div className="rounded-[10px] px-3.5 py-2.5 text-center font-mono text-[11px] font-medium tracking-[0.1em] text-white" style={{ background: c.flag }}>🎭 GAME CONTENT — FAKE · CANNOT BE COPIED OR SHARED</div>
      <div className="relative overflow-hidden rounded-[16px] border-[1.5px]" style={{ borderColor: c.hair, background: c.surface }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "repeating-linear-gradient(135deg, transparent, transparent 16px, rgba(194,84,56,.06) 16px, rgba(194,84,56,.06) 32px)" }} />
        <div className="relative min-h-[100px] p-4"><div className="mm text-[16px] leading-[1.9]" style={{ color: c.ink }}>{composeText}</div></div>
      </div>
      <Eyebrow>Fill from the deck</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {FRAGMENTS.map((f) => { const sel = frags.includes(f.id); return (
          <button key={f.id} onClick={() => toggleFrag(f.id)} aria-pressed={sel} className="rounded-full border-2 px-[15px] py-2.5 text-[13.5px] font-semibold transition-all"
            style={{ borderColor: sel ? c.flag : c.hair, background: sel ? c.flagSoft : c.surface, color: sel ? c.flag : c.ink }}>{f.label}</button>
        ); })}
      </div>
      <button onClick={onJudge} disabled={!chosen.length} className="display rounded-full p-[15px] text-[15px]" style={{ background: chosen.length ? c.ink : "#e4ede7", color: chosen.length ? "#fff" : "#a9bcb0" }}>See if it would fool people</button>
      {judged && (
        <div className="anim-rise flex flex-col gap-2.5">
          <div className="rounded-[0_14px_14px_0] border-[1.5px] px-4 py-3.5" style={{ borderColor: c.hair, borderLeft: `4px solid ${c.ink}`, background: c.surface }}>
            <div className="display text-[16px]" style={{ color: c.ink }}>{foolCount} of 5 were fooled.</div>
            <div className="mt-1 text-[13.5px] leading-relaxed" style={{ color: c.muted2 }}>They named: {namedTech} ✓{miss ? ` · missed ${miss.en.toLowerCase()}` : ""}.</div>
          </div>
          <div className="rounded-[0_14px_14px_0] px-4 py-3.5 text-[13.5px] leading-relaxed" style={{ background: c.flagSoft, borderLeft: `4px solid ${c.flag}`, color: c.ink }}>Now you&rsquo;ve built one, you&rsquo;ll recognise it in the wild. That&rsquo;s the whole point of the seat.</div>
          <button onClick={onDone} className="display rounded-full p-3.5 text-[14.5px] text-white" style={{ background: c.ink }}>Back to defence — see your progress →</button>
        </div>
      )}
    </div>
  );
}

/* ---------- PROGRESS (You) ---------- */
function Progress({ practiced, onPractise }: { practiced: Record<string, boolean>; onPractise: () => void }) {
  const base: Record<string, number> = { urgency: 20, authority: 15, emotion: 30, doctored: 12, expert: 25, context: 20 };
  if (practiced.urgency) base.urgency = 88;
  if (practiced.authority) base.authority = 58;
  return (
    <div className="anim-screen mx-auto flex max-w-[640px] flex-col gap-4">
      <span className="font-mono text-[12px] tracking-[0.14em]" style={{ color: c.muted }}>YOU</span>
      <div className="display text-[22px]" style={{ color: c.ink }}>Techniques you can name</div>
      <div className="-mt-2.5 text-[13.5px] leading-relaxed" style={{ color: c.muted2 }}>Progress is measured by the skill you carry — not points or lessons finished.</div>
      <div className="flex flex-col gap-3.5 rounded-[16px] border-[1.5px] p-[18px]" style={{ borderColor: c.hair, background: c.surface }}>
        {TECHNIQUES.map((t) => {
          const pct = base[t.id];
          const tag = pct >= 70 ? "strong" : pct >= 40 ? "getting there" : "new";
          const mark = pct >= 70 ? c.greenDeep : pct >= 40 ? c.gold : "#9aa89e";
          return (
            <div key={t.id} className="flex items-center gap-3">
              <span className="flex shrink-0" style={{ color: mark }}><TechniqueIcon id={t.id} size={20} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2"><span className="text-[13.5px] font-semibold" style={{ color: c.ink }}>{t.en}</span><span className="font-mono text-[11px]" style={{ color: c.muted }}>{tag}</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-[5px]" style={{ background: "#e4ede7" }}><div className="h-2 rounded-[5px]" style={{ background: "linear-gradient(90deg,#58b08b,#7fcfa9)", width: `${pct}%`, transition: "width .6s" }} /></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3.5 rounded-[16px] px-[18px] py-[15px]" style={{ background: c.goldSoft }}>
        <div className="min-w-[180px] flex-1 text-[13.5px] leading-[1.55]" style={{ color: c.ink }}><b>Weakest: Doctored media.</b><br /><br />3 fresh scenarios ready to practise.</div>
        <button onClick={onPractise} className="display whitespace-nowrap rounded-full px-[18px] py-2.5 text-[13.5px] text-white" style={{ background: c.ink }}>Practise</button>
      </div>
      <Eyebrow>For facilitators</Eyebrow>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
        {["Run the 5-question check", "Print the card deck (PDF)"].map((l) => (
          <button key={l} className="rounded-[12px] border-[1.5px] px-4 py-3.5 text-left text-[14px] font-bold" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

/* ---------- HUB ---------- */
function Hub({ hubTrack, setHubTrack, onOpen, onWhy }: { hubTrack: number; setHubTrack: (n: number) => void; onOpen: (id: string) => void; onWhy: () => void }) {
  const stateBg: Record<string, string> = { mastered: "#e8f5ee", practised: "#f5e9c8", not_met: "#eef1f0", met: "#eef1f0" };
  const stateFg: Record<string, string> = { mastered: "#3f9e6e", practised: "#a5761c", not_met: "#7d9285", met: "#7d9285" };
  const stateLabel: Record<string, string> = { mastered: "MASTERED", practised: "PRACTISED", not_met: "NEW", met: "MET" };
  const track = TRACKS.find((t) => t.n === hubTrack)!;
  const lessons = LESSONS.filter((l) => l.track === hubTrack);
  const featured = LESSONS.find((l) => l.state === "not_met") ?? LESSONS[0];
  const tabShort: Record<number, string> = { 1: "Techniques", 2: "AI & media", 3: "Integrity" };
  const done = lessons.filter((l) => l.state !== "not_met").length;
  return (
    <div className="anim-screen mx-auto flex max-w-[700px] flex-col gap-6">
      <div>
        <span className="font-mono text-[12px] tracking-[0.14em]" style={{ color: c.muted }}>THE CASEBOOK</span>
        <h1 className="display m-0 mt-2 mb-1.5 text-[26px]" style={{ color: c.ink }}>Why the tricks work.</h1>
        <p className="m-0 max-w-[54ch] text-[14px] leading-relaxed" style={{ color: c.muted2 }}>Short lessons behind the loop — about four minutes each. Every lesson ends in <b>practice, never a checkbox</b>. Reading alone changes nothing; naming a technique in the wild does.</p>
      </div>
      <button onClick={() => onOpen(featured.id)} className="flex items-center gap-4 rounded-[18px] p-[18px_20px] text-left transition-transform hover:translate-x-[3px]" style={{ background: c.goldSoft, borderLeft: `5px solid ${c.gold}` }}>
        <span className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-[15px] bg-white" style={{ color: c.gold }}><TechniqueIcon id={featured.technique} size={26} bg="#fff" /></span>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10.5px] tracking-[0.1em]" style={{ color: c.gold }}>RECOMMENDED NEXT</div>
          <div className="mm mt-0.5 text-[17px] font-semibold leading-[1.6]" style={{ color: c.ink }}>{featured.title.mm}</div>
          <div className="text-[13px]" style={{ color: c.muted2 }}>{featured.title.en}</div>
        </div>
        <span className="display shrink-0 whitespace-nowrap text-[14.5px]" style={{ color: c.ink }}>Start →</span>
      </button>
      <div className="rounded-[16px] border-[1.5px] p-[16px_18px]" style={{ borderColor: c.hair, background: c.surface }}>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.09em]" style={{ color: c.muted }}>Techniques you can name</div>
        <div className="mt-3 grid gap-x-[18px] gap-y-[11px]" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))" }}>
          {TECHNIQUES.map((t) => (
            <div key={t.id} className="flex items-center gap-2.5"><span className="flex shrink-0" style={{ color: c.ink }}><TechniqueIcon id={t.id} size={19} /></span>
              <div className="min-w-0 flex-1"><div className="text-[13px] font-semibold leading-tight" style={{ color: c.ink }}>{t.en}</div><div className="font-mono text-[10px]" style={{ color: c.muted }}>new</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-1 rounded-[12px] p-1" style={{ background: "#e4ede7" }}>
        {TRACKS.map((tr) => { const on = tr.n === hubTrack; return (
          <button key={tr.n} onClick={() => setHubTrack(tr.n)} className="flex-1 rounded-[9px] px-2 py-2.5 text-[12.5px] font-semibold transition-colors"
            style={{ background: on ? "#fff" : "transparent", color: on ? "#1b2a1f" : "#6b7d6f", boxShadow: on ? "0 1px 3px rgba(27,42,31,.12)" : "none" }}>{tabShort[tr.n]}</button>
        ); })}
      </div>
      <div className="anim-slide flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3 pt-3" style={{ borderTop: `3px solid ${track.accent}` }}>
          <div className="min-w-[180px] flex-1"><div className="mm text-[16.5px] font-semibold" style={{ color: c.ink }}>{track.mm}</div><div className="text-[13.5px] font-semibold" style={{ color: c.muted2 }}>Track {track.n} · {track.en}</div></div>
          <div className="font-mono text-[11px]" style={{ color: c.muted }}>{done} of {lessons.length} practised</div>
        </div>
        <div className="flex flex-col gap-2">
          {lessons.map((l) => (
            <button key={l.id} onClick={() => onOpen(l.id)} className="flex items-center gap-3 rounded-[12px] border-[1.5px] py-3 pl-[15px] pr-4 text-left transition-all hover:translate-x-[3px]" style={{ borderColor: c.hair, background: c.surface, borderLeft: `4px solid ${track.accent}` }}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px]" style={{ background: "#eef1f0", color: track.accent }}><TechniqueIcon id={l.technique} size={21} bg="#eef1f0" /></span>
              <div className="min-w-0 flex-1"><div className="mm text-[15.5px] font-semibold leading-[1.65]" style={{ color: c.ink }}>{l.title.mm}</div><div className="text-[12.5px]" style={{ color: c.muted }}>{l.title.en}</div></div>
              <span className="shrink-0 whitespace-nowrap rounded-[5px] px-2 py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.05em]" style={{ background: stateBg[l.state], color: stateFg[l.state] }}>{stateLabel[l.state]}</span>
              <span className="shrink-0 text-[20px]" style={{ color: c.muted }}>›</span>
            </button>
          ))}
        </div>
      </div>
      <button onClick={onWhy} className="hidden">why</button>
    </div>
  );
}

/* ---------- LESSON READER ---------- */
function Lesson({ id, beat, setBeat, practicePick, setPracticePick, carryCopied, setCarryCopied, onHub, onLoop }: {
  id: string; beat: number; setBeat: (n: number) => void; practicePick: TechniqueId | null; setPracticePick: (t: TechniqueId) => void;
  carryCopied: boolean; setCarryCopied: (b: boolean) => void; onHub: () => void; onLoop: () => void;
}) {
  const L = LESSONS.find((l) => l.id === id)!;
  const bk = ["meet", "how", "tell", "practice", "carry"][beat];
  const answered = practicePick != null;
  const correct = practicePick === L.practice.answer;
  const at = techniqueById(L.practice.answer);
  const opts = [L.practice.answer, ...TECHNIQUES.map((t) => t.id).filter((x) => x !== L.practice.answer)].slice(0, 4) as TechniqueId[];
  const nextBlocked = bk === "practice" && practicePick == null;
  const isLast = beat === 4;
  return (
    <div className="anim-screen mx-auto flex max-w-[600px] flex-col gap-[18px]">
      <div className="flex items-center gap-3.5">
        <button onClick={onHub} className="whitespace-nowrap text-[13.5px] font-semibold" style={{ color: c.muted }}>‹ Casebook</button>
        <div className="flex flex-1 gap-[5px]">{[0,1,2,3,4].map((i) => <span key={i} className="block h-[5px] flex-1 rounded-[3px]" style={{ background: i < beat ? "#c9d6ce" : i === beat ? c.greenDeep : "#e4ede7", transition: "background .3s" }} />)}</div>
      </div>
      <div><div className="mm text-[15px] font-semibold leading-[1.6]" style={{ color: c.muted2 }}>{L.title.mm}</div><div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: c.muted }}>{L.title.en}</div></div>

      {bk === "meet" && (
        <div className="anim-slide flex flex-col gap-3">
          <Eyebrow>Meet it</Eyebrow>
          <div className="overflow-hidden rounded-[16px] border-[1.5px]" style={{ borderColor: c.hair, background: c.surface, boxShadow: "0 10px 26px -18px rgba(35,55,44,.3)" }}>
            <div className="flex items-center gap-3 border-b px-4 py-3.5" style={{ borderColor: c.hair }}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-bold" style={{ background: "#e8f2ec", color: c.greenDeep }}>•</span>
              <span className="min-w-0"><span className="block text-[14.5px] font-bold" style={{ color: c.ink }}>{L.meet.sender}</span><span className="block text-[12px]" style={{ color: c.muted }}>{L.meet.meta}</span></span>
              <span className="ml-auto rounded border px-[7px] py-[3px] font-mono text-[10px] tracking-[0.08em]" style={{ borderColor: c.hair, color: c.muted }}>EXAMPLE</span>
            </div>
            <div className="px-[18px] py-4"><div className="mm text-[17px] leading-[1.85]" style={{ color: c.ink }}>{L.meet.mm}</div><div className="mt-2 text-[13px] leading-relaxed" style={{ color: c.muted }}>{L.meet.en}</div></div>
          </div>
          <div className="text-[12.5px]" style={{ color: c.muted }}>Read it the way it would arrive — no framing yet.</div>
        </div>
      )}
      {bk === "how" && (
        <div className="anim-slide flex flex-col gap-3">
          <Eyebrow>How it works</Eyebrow>
          <div className="flex gap-2.5">
            {[["▶", "Watch · 90s", "Burmese subs"], ["♪", "Listen", "~1 MB"]].map(([ic, a, b]) => (
              <div key={a} className="flex flex-1 items-center gap-2.5 rounded-[12px] border-[1.5px] px-[11px] py-2.5" style={{ borderColor: c.hair, background: c.surface }}>
                <span className="grid h-8 w-11 place-items-center rounded-md text-[14px]" style={{ background: c.sageSoft, color: c.greenDeep }}>{ic}</span>
                <span className="font-mono text-[11px] leading-[1.45]" style={{ color: c.muted }}>{a}<br />{b}</span>
              </div>
            ))}
          </div>
          <div className="rounded-[16px] border-[1.5px] p-[20px_22px]" style={{ borderColor: c.hair, background: c.surface }}>
            <p className="mm m-0 text-[16px] leading-[1.85]" style={{ color: c.ink }}>{L.how.mm}</p>
            <p className="m-0 mt-3.5 text-[13.5px] leading-relaxed" style={{ color: c.muted2 }}>{L.how.en}</p>
          </div>
        </div>
      )}
      {bk === "tell" && (
        <div className="anim-slide flex flex-col gap-3 py-3">
          <Eyebrow>The tell</Eyebrow>
          <div className="rounded-[0_16px_16px_0] p-[22px]" style={{ background: c.goldSoft, borderLeft: `4px solid ${c.gold}` }}>
            <div className="mm text-[19px] font-medium leading-[1.9]" style={{ color: c.ink }}>{L.tell.mm}</div>
            <div className="mt-2.5 text-[14px] leading-relaxed" style={{ color: c.muted2 }}>{L.tell.en}</div>
          </div>
          <div className="text-[12.5px]" style={{ color: c.muted }}>One sentence. If you remember only this, that&rsquo;s enough.</div>
        </div>
      )}
      {bk === "practice" && (
        <div className="anim-slide flex flex-col gap-3">
          <Eyebrow>Practice — name the technique</Eyebrow>
          <div className="rounded-[14px] border-[1.5px] px-[17px] py-[15px]" style={{ borderColor: c.hair, background: c.surface }}>
            <div className="mm text-[16px] leading-[1.85]" style={{ color: c.ink }}>{L.practice.mm}</div>
            <div className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: c.muted }}>{L.practice.en}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {opts.map((oid) => {
              const t = techniqueById(oid); const picked = practicePick === oid; const isAns = oid === L.practice.answer;
              const bor = answered && isAns ? c.greenDeep : picked ? "#c25438" : c.hair;
              const bg = answered && isAns ? "#e8f5ee" : picked && !isAns ? c.flagSoft : c.surface;
              const mark = answered && isAns ? c.greenDeep : picked ? "#c25438" : c.muted;
              return (
                <button key={oid} onClick={() => { if (practicePick == null) setPracticePick(oid); }} className="flex items-center gap-2.5 rounded-[12px] border-2 px-3 py-[11px] text-left transition-all" style={{ borderColor: bor, background: bg }}>
                  <span className="flex shrink-0" style={{ color: mark }}><TechniqueIcon id={oid} size={18} bg={bg} /></span>
                  <span className="min-w-0"><span className="mm block text-[13.5px] font-semibold leading-[1.6]" style={{ color: c.ink }}>{t.mm}</span><span className="text-[11px]" style={{ color: c.muted }}>{t.en}</span></span>
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="anim-rise rounded-[0_14px_14px_0] px-4 py-3.5" style={{ background: c.goldSoft, borderLeft: `4px solid ${c.gold}` }}>
              <div className="display text-[14px]" style={{ color: c.greenDeep }}>{correct ? "Named it — that's the move." : `The move here is ${at.en}.`}</div>
              <div className="mm mt-1.5 text-[15px] leading-[1.8]" style={{ color: c.ink }}>{at.tellMm}</div>
              <div className="mt-1 text-[13px] leading-relaxed" style={{ color: c.muted2 }}>{at.tellEn}</div>
            </div>
          )}
        </div>
      )}
      {bk === "carry" && (
        <div className="anim-slide flex flex-col gap-3">
          <Eyebrow>Carry it</Eyebrow>
          <div className="rounded-[18px] p-6 text-white" style={{ background: c.ink }}>
            <div className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,.6)" }}>Say this to someone</div>
            <div className="mm mt-3 text-[20px] font-medium leading-[1.85]">{L.carry.mm}</div>
            <div className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: "rgba(255,255,255,.7)" }}>{L.carry.en}</div>
            <button onClick={() => { navigator.clipboard?.writeText(L.carry.mm); setCarryCopied(true); }} className="display mt-[18px] rounded-full bg-white px-[22px] py-3 text-[14px]" style={{ color: c.ink }}>{carryCopied ? "Copied ✓" : "Copy this sentence"}</button>
          </div>
          <div className="text-[12.5px] leading-[1.55]" style={{ color: c.muted }}>The only thing in Sone Dauk Lay you&rsquo;re meant to share. Pass it on.</div>
        </div>
      )}

      {!isLast ? (
        <div className="flex gap-2.5">
          {beat > 0 && <button onClick={() => setBeat(beat - 1)} className="display rounded-full border-[1.5px] px-[22px] py-3.5 text-[14.5px]" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>Back</button>}
          <button onClick={() => { if (!nextBlocked && beat < 4) setBeat(beat + 1); }} className="display flex-1 rounded-full p-3.5 text-[15px]" style={{ background: nextBlocked ? "#e4ede7" : c.ink, color: nextBlocked ? "#a9bcb0" : "#fff" }}>{bk === "practice" && nextBlocked ? "Pick one to continue" : "Continue →"}</button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <button onClick={onLoop} className="display rounded-full p-[15px] text-[15px] text-white" style={{ background: c.ink }}>Practise this in the loop →</button>
          <button onClick={onHub} className="display rounded-full border-[1.5px] p-3.5 text-[14px]" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>Back to the casebook</button>
        </div>
      )}
    </div>
  );
}

/* ---------- THE LENS ---------- */
function Lens({ caseId, phase, answer, onPickCase, onAnswer, onReset, onClose }: {
  caseId: string | null; phase: number; answer: string | null;
  onPickCase: (id: string) => void; onAnswer: (a: string) => void; onReset: () => void; onClose: () => void;
}) {
  const esc = caseId === "escalation";
  const lc = caseId && caseId !== "escalation" ? LENS_CASES.find((x) => x.id === caseId) : null;
  const t = lc ? techniqueById(lc.tech) : null;
  const footer: "cases" | "answers" | "done" | "escalation" = esc ? "escalation" : !lc ? "cases" : phase >= 2 ? "done" : "answers";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0" style={{ background: "rgba(27,42,31,.42)" }} onClick={onClose} />
      <div className="anim-rise relative mx-auto flex h-[76vh] w-full max-w-[600px] flex-col rounded-t-[22px]" style={{ background: c.surface, boxShadow: "0 -20px 50px -20px rgba(27,42,31,.5)" }}>
        <div className="flex shrink-0 items-center gap-3 border-b px-[18px] py-4" style={{ borderColor: c.hair }}>
          <Mascot size="34px" />
          <div className="min-w-0"><div className="display text-[16px] leading-none" style={{ color: c.ink }}>The Lens</div><div className="mt-0.5 font-mono text-[10.5px] tracking-[0.04em]" style={{ color: c.muted }}>looks with you · never a verdict</div></div>
          <button onClick={onClose} className="ml-auto px-2 py-1 text-[22px] leading-none" style={{ color: c.muted }}>✕</button>
        </div>

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
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: c.muted }}>What you can check yourself</div>
                    <div className="mt-2.5 flex flex-col gap-2.5">{lc.check.map((x, i) => <div key={i} className="flex items-start gap-2.5"><span className="shrink-0 font-bold" style={{ color: c.greenDeep }}>✓</span><span className="mm text-[14.5px] leading-[1.75]" style={{ color: c.ink }}>{x}</span></div>)}</div>
                  </div>
                  <div className="w-full self-start rounded-[12px] border px-4 py-3.5" style={{ borderColor: c.hair, background: c.surface }}>
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: c.muted }}>What I can&rsquo;t know</div>
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
              <div className="font-mono text-[10.5px] uppercase tracking-[0.06em]" style={{ color: c.muted }}>Pick something to look at together</div>
              <div className="flex flex-wrap gap-2">{LENS_CASES.map((x) => <button key={x.id} onClick={() => onPickCase(x.id)} className="rounded-full border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>{x.chip}</button>)}</div>
              <button onClick={() => onPickCase("escalation")} className="self-start pt-1 text-[13px] font-bold" style={{ color: c.flag }}>I already sent money →</button>
            </div>
          )}
          {footer === "answers" && lc && (
            <div className="flex flex-wrap gap-2">{lc.answers.map((a) => <button key={a} onClick={() => onAnswer(a)} className="mm rounded-full border-[1.5px] px-4 py-2.5 text-[14px] font-semibold leading-[1.7]" style={{ borderColor: c.hair, background: c.sageSoft, color: c.ink }}>{a}</button>)}</div>
          )}
          {footer === "done" && (
            <div className="flex flex-wrap items-center gap-3"><button onClick={onReset} className="display rounded-full px-5 py-3 text-[14px] text-white" style={{ background: c.ink }}>Look at another →</button><span className="min-w-[140px] flex-1 text-[12px] leading-[1.5]" style={{ color: c.muted }}>Same six techniques as the loop and the deck — the words travel with you.</span></div>
          )}
          {footer === "escalation" && (
            <button onClick={onClose} className="display w-full rounded-full border-[1.5px] p-3.5 text-[14px]" style={{ borderColor: c.hair, background: c.surface, color: c.ink }}>Close</button>
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
