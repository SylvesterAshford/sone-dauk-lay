"use client";

import { CartoonDetective, MascotMark, PokeMascot } from "@/components/Mascot";
import { useProgress, rankFor } from "@/lib/progress";
import { useLang } from "@/lib/lang";
import { useT } from "@/lib/ui";

type LandingPageProps = {
  onPlay: () => void;
  go: (screen: "hub" | "map") => void;
  openLens: () => void;
};

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ScrollArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ToolIcon({ kind }: { kind: "casebook" | "lens" }) {
  if (kind === "lens") {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="21" cy="21" r="11" />
        <path d="m29 29 10 10" />
        <path d="M17 17c2-2 5-3 8-1" opacity=".65" />
        <path d="M17 34h8" opacity=".55" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13.5A4.5 4.5 0 0 1 14.5 9H37v25H14.5A4.5 4.5 0 0 0 10 38.5z" />
      <path d="M10 13.5v25" />
      <path d="M18 16h12M18 21h14M18 26h9" opacity=".68" />
      <path d="M37 9v25" />
    </svg>
  );
}

function IssueIcon({ kind }: { kind: "rush" | "source" | "trust" }) {
  if (kind === "source") return <span aria-hidden="true" className="landing-issue-symbol">?</span>;
  if (kind === "trust") return <span aria-hidden="true" className="landing-issue-symbol">✓</span>;
  return <span aria-hidden="true" className="landing-issue-symbol">!</span>;
}

export function LandingPage({ onPlay, go, openLens }: LandingPageProps) {
  const mm = useLang() === "mm";
  const t = useT();
  const rank = rankFor(useProgress());

  const copy = mm
    ? {
        heroKicker: "သတင်းမှန် စစ်ဆေးရေး လေ့လာမှု",
        heroTitle: "လှည့်ကွက်ကို မခံရခင် ကြိုသိပါ။",
        heroSub: "Learn the trick before it reaches you.",
        heroBody: "သံသယဖြစ်စရာ စာ၊ ပို့စ်နဲ့ ပုံတွေကို မမျှဝေခင် ခဏရပ်ပြီး ကြည့်တတ်အောင် လေ့ကျင့်ပါ။",
        start: "အမှု စတင်ပါ →",
        explore: "အောက်သို့ ကြည့်ရန်",
        trust: "အကောင့် မလို · ဘာမှ မတင်ပို့ · အင်တာနက်မရှိလည်း ရ",
        problemKicker: "ဘာကြောင့်လိုအပ်လဲ",
        problemTitle: "မျှဝေဖို့လွယ်ပေမယ့် ပြန်ပြင်ဖို့ခက်ပါတယ်။",
        problemBody: "လှည့်ကွက်တစ်ခုက မိသားစု၊ ကျောင်းနဲ့ သူငယ်ချင်းအဖွဲ့ထဲကို မြန်မြန်ရောက်နိုင်ပါတယ်။ ဒီနေရာမှာ အရင်းအမြစ်၊ အချိန်နဲ့ သက်သေကို စစ်တဲ့အလေ့အကျင့်ကို နူးညံ့စွာ လေ့ကျင့်ပေးပါတယ်။",
        issues: ["အမြန် ပျံ့နှံ့ခြင်း", "ရင်းမြစ် မရှင်းခြင်း", "ယုံကြည်မှု ထိခိုက်ခြင်း"],
        toolsKicker: "စုံထောက်ရဲ့ ကိရိယာများ",
        toolsTitle: "သင်ယူပါ။ စစ်ဆေးပါ။ လက်တွေ့လုပ်ကြည့်ပါ။",
        toolsBody: "သင်ယူတဲ့အရာနဲ့ အပြင်မှာတွေ့တဲ့စာတွေကြားက အကွာအဝေးကို တစ်ချက်ချင်း ဖြတ်ပေးတဲ့ နေရာနှစ်ခု။",
        casebook: "စုံထောက် မှတ်စုစာအုပ်",
        casebookBody: "လှည့်ကွက်တွေ ဘာကြောင့် အလုပ်ဖြစ်လဲကို တိုတိုနဲ့ လေ့လာပြီး လက်တွေ့အမှုနဲ့ အဆုံးသတ်ပါ။",
        casebookBadge: "သင်ခန်းစာ ၁၂ ခု",
        casebookCta: "သင်ယူရန် ဖွင့်ပါ",
        lens: "The Lens",
        lensBody: "သင်တွေ့ထားတဲ့ စာကို ကူးထည့်ပြီး လှည့်ကွက်ကို ဘယ်လိုကြည့်ရမလဲ တစ်ဆင့်ချင်း မေးကြည့်ပါ။",
        lensBadge: "ကူးထည့်ပြီး စစ်ပါ",
        lensCta: "စာတစ်စောင် စစ်ပါ",
        gameKicker: "အမှု စစ်ဆေးရေး လမ်းကြောင်း",
        gameTitle: "သင်ယူတာကို တစ်မှုနဲ့ မှတ်မိအောင်လုပ်ပါ။",
        gameBody: "See → Name → Build လမ်းကြောင်းအတိုင်း သွားပြီး လှည့်ကွက်ကို တွေ့၊ အမည်တပ်၊ ပြီးရင် ကိုယ်တိုင် တည်ဆောက်ကြည့်ပါ။",
        gameFeatures: ["အမှုထဲက သက်သေကို ရှာပါ", "နည်းစနစ်ကို အမည်တပ်ပါ", "ကိုယ်တိုင် လက်တွေ့လုပ်ကြည့်ပါ"],
        gameCta: "အမှု ကစားရန်",
        finalKicker: "ဒီနေ့ စတင်ပါ",
        finalTitle: "မမျှဝေခင် စုံထောက်လေးနဲ့ တစ်ချက်စစ်ပါ။",
        finalBody: "အမှုတစ်ခုကနေ စပြီး သင့်မျက်စိကို နည်းနည်း ပိုရှင်းလာအောင် လေ့ကျင့်ပါ။",
        finalCta: "ပထမအမှု စတင်ပါ",
        footer: "မြန်မာနိုင်ငံအတွက် သတင်းမှန် စစ်ဆေးရေး လေ့လာမှု",
      }
    : {
        heroKicker: "Myanmar misinformation literacy",
        heroTitle: "Learn the trick before it reaches you.",
        heroSub: "လှည့်ကွက်ကို မခံရခင် ကြိုသိပါ။",
        heroBody: "A calm, practical place to pause over suspicious messages, spot the tell, and decide what deserves your trust.",
        start: "Start a case →",
        explore: "Explore the notebook",
        trust: "no account needed · nothing is uploaded · works offline",
        problemKicker: "THE PROBLEM",
        problemTitle: "Sharing is easy. Repairing trust is hard.",
        problemBody: "A manipulation tactic can move through a family chat, classroom, or community group in seconds. Sone Dauk Lay makes the pause feel small enough to practise.",
        issues: ["Fast spread", "Unclear source", "Damaged trust"],
        toolsKicker: "THE DETECTIVE'S KIT",
        toolsTitle: "Learn the move. Check the message. Make it stick.",
        toolsBody: "Two gentle ways to turn a lesson into a habit you can use in the wild.",
        casebook: "The Casebook",
        casebookBody: "Short lessons on the moves behind scams, synthetic media, and information that travels too fast.",
        casebookBadge: "12 short lessons",
        casebookCta: "Open the casebook",
        lens: "The Lens",
        lensBody: "Paste in a message you are unsure about and ask for a calm second look, one clue at a time.",
        lensBadge: "Paste and check",
        lensCta: "Check a message",
        gameKicker: "THE CASE LOOP",
        gameTitle: "Turn one lesson into a case you remember.",
        gameBody: "Follow See → Name → Build: meet the trick, name the technique, then take the manipulator's seat once so the tell sticks.",
        gameFeatures: ["Spot the evidence", "Name the technique", "Practise the move"],
        gameCta: "Play a case",
        finalKicker: "START HERE",
        finalTitle: "Check before you share with your little detective.",
        finalBody: "Begin with one case, then come back whenever a message makes you pause.",
        finalCta: "Start your first case",
        footer: "A field notebook for misinformation literacy in Myanmar",
      };

  return (
    <div className="landing-page" lang={mm ? "my" : "en"}>
      <section className="landing-hero">
        <img className="landing-reference-hero" src="/landing/bridge.jpg" alt="" aria-hidden="true" />
        <div className="landing-hero-wash" aria-hidden="true" />
        <div className="landing-hero-grid" aria-hidden="true" />

        <div className="landing-hero-inner">
          <div className="landing-hero-copy">
            <span className={`landing-pill ${mm ? "mm" : ""}`}>
              <span className="landing-pill-dot" />
              {copy.heroKicker}
            </span>
            <h1 className={mm ? "mm" : "display"}>{copy.heroTitle}</h1>
            <p className={`landing-hero-sub ${mm ? "mm" : ""}`}>{copy.heroSub}</p>
            <p className={`landing-hero-body ${mm ? "mm" : ""}`}>{copy.heroBody}</p>
            <div className="landing-hero-actions">
              <button type="button" onClick={onPlay} className={`landing-button landing-button-gold ${mm ? "mm" : ""}`}>
                {copy.start}
              </button>
              <a href="#landing-problem" className={`landing-button landing-button-ghost ${mm ? "mm" : ""}`}>
                {copy.explore}
              </a>
            </div>
            <div className={`landing-trust ${mm ? "mm" : ""}`}>{copy.trust}</div>
          </div>

          <div className="landing-hero-art" aria-label={t("pokeMascot")}>
            <div className="landing-hero-orbit landing-hero-orbit-one" aria-hidden="true" />
            <div className="landing-hero-orbit landing-hero-orbit-two" aria-hidden="true" />
            <div className="landing-hero-label landing-hero-label-top" aria-hidden="true">
              <span>CASE 001</span>
              <strong>LOOK CLOSER</strong>
            </div>
            <div className="landing-hero-label landing-hero-label-bottom" aria-hidden="true">
              <span>FIELD NOTE</span>
              <strong>PAUSE · NOTICE · NAME</strong>
            </div>
            <div className="landing-hero-mascot">
              <PokeMascot label={t("pokeMascot")}>
                <CartoonDetective size="clamp(220px, 36vw, 360px)" float />
              </PokeMascot>
            </div>
            <span className="landing-hero-spark landing-hero-spark-one" aria-hidden="true">✦</span>
            <span className="landing-hero-spark landing-hero-spark-two" aria-hidden="true">·</span>
          </div>
        </div>

        <a href="#landing-problem" className="landing-scroll-cue" aria-label={copy.explore}>
          <span>{mm ? "အောက်သို့" : "SCROLL TO EXPLORE"}</span>
          <ScrollArrow />
        </a>
      </section>

      <div className="landing-content">
        <section id="landing-problem" className="landing-section landing-problem-section">
          <div className="landing-section-grid">
            <div className="landing-section-copy">
              <p className={`landing-eyebrow ${mm ? "mm" : ""}`}>{copy.problemKicker}</p>
              <h2 className={mm ? "mm" : "display"}>{copy.problemTitle}</h2>
              <p className={mm ? "mm" : ""}>{copy.problemBody}</p>
              <div className="landing-issue-grid">
                {copy.issues.map((issue, index) => (
                  <article key={issue} className="landing-issue-card">
                    <IssueIcon kind={index === 0 ? "rush" : index === 1 ? "source" : "trust"} />
                    <h3 className={mm ? "mm" : ""}>{issue}</h3>
                  </article>
                ))}
              </div>
            </div>

            <div className="landing-evidence-board" aria-label="A field notebook with clues to inspect">
              <img className="landing-reference-photo" src="/landing/community.jpg" alt="A community learning together" />
              <div className="landing-board-tape landing-board-tape-one" aria-hidden="true" />
              <div className="landing-board-tape landing-board-tape-two" aria-hidden="true" />
              <div className="landing-board-pin landing-board-pin-one" aria-hidden="true" />
              <div className="landing-board-pin landing-board-pin-two" aria-hidden="true" />
              <div className="landing-board-note landing-board-note-main">
                <span className="landing-board-kicker">FIELD NOTE · 01</span>
                <strong className={mm ? "mm" : ""}>{mm ? "မမျှဝေခင် ခဏရပ်ပါ" : "Pause before you pass it on"}</strong>
                <div className="landing-board-lines" aria-hidden="true"><i /><i /><i /></div>
              </div>
              <div className="landing-board-note landing-board-note-small">
                <span className="landing-board-kicker">CLUE</span>
                <strong>{mm ? "ရင်းမြစ်?" : "Source?"}</strong>
                <span>{mm ? "ဘယ်က လာတာလဲ" : "Where did it begin?"}</span>
              </div>
              <div className="landing-board-sticker landing-board-sticker-amber">?</div>
              <div className="landing-board-sticker landing-board-sticker-sage">✓</div>
              <span className="landing-board-string landing-board-string-one" aria-hidden="true" />
              <span className="landing-board-string landing-board-string-two" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="landing-section landing-tools-section">
          <div className="landing-tools-heading">
            <div>
              <p className={`landing-eyebrow ${mm ? "mm" : ""}`}>{copy.toolsKicker}</p>
              <h2 className={mm ? "mm" : "display"}>{copy.toolsTitle}</h2>
              <p className={mm ? "mm" : ""}>{copy.toolsBody}</p>
            </div>
            <span className="landing-rank-chip"><MascotMark size={17} /> {rank.name}</span>
          </div>

          <div className="landing-tool-grid">
            <button type="button" onClick={() => go("hub")} className="landing-tool-card landing-tool-card-casebook">
              <div className="landing-tool-card-top">
                <span className="landing-tool-icon"><ToolIcon kind="casebook" /></span>
                <span className={`landing-tool-badge ${mm ? "mm" : ""}`}>{copy.casebookBadge}</span>
              </div>
              <h3 className={mm ? "mm" : "display"}>{copy.casebook}</h3>
              <p className={mm ? "mm" : ""}>{copy.casebookBody}</p>
              <span className={`landing-tool-preview ${mm ? "mm" : ""}`}><span />{mm ? "နည်းစနစ် ခြောက်ခု" : "Six techniques to learn"}</span>
              <span className={`landing-tool-preview ${mm ? "mm" : ""}`}><span />{mm ? "လက်တွေ့အမှုနဲ့ အဆုံးသတ်" : "Practice at the end of every lesson"}</span>
              <span className={`landing-card-link ${mm ? "mm" : ""}`}>{copy.casebookCta} <Arrow /></span>
            </button>

            <button type="button" onClick={openLens} className="landing-tool-card landing-tool-card-lens">
              <div className="landing-tool-card-top">
                <span className="landing-tool-icon"><ToolIcon kind="lens" /></span>
                <span className={`landing-tool-badge ${mm ? "mm" : ""}`}>{copy.lensBadge}</span>
              </div>
              <h3 className={mm ? "mm" : "display"}>{copy.lens}</h3>
              <p className={mm ? "mm" : ""}>{copy.lensBody}</p>
              <span className={`landing-tool-preview ${mm ? "mm" : ""}`}><span />{mm ? "စာတစ်စောင် ကူးထည့်ပါ" : "Paste the message you are unsure about"}</span>
              <span className={`landing-tool-preview ${mm ? "mm" : ""}`}><span />{mm ? "အေးဆေးတဲ့ ဒုတိယအမြင်" : "A calm second look, one clue at a time"}</span>
              <span className={`landing-card-link ${mm ? "mm" : ""}`}>{copy.lensCta} <Arrow /></span>
            </button>
          </div>
        </section>

        <section className="landing-section landing-loop-section">
          <div className="landing-loop-panel">
            <div className="landing-loop-copy">
              <p className={`landing-eyebrow landing-eyebrow-light ${mm ? "mm" : ""}`}>{copy.gameKicker}</p>
              <h2 className={mm ? "mm" : "display"}>{copy.gameTitle}</h2>
              <p className={mm ? "mm" : ""}>{copy.gameBody}</p>
              <div className="landing-loop-features">
                {copy.gameFeatures.map((feature, index) => (
                  <div key={feature} className={`landing-loop-feature ${mm ? "mm" : ""}`}>
                    <span>0{index + 1}</span>{feature}
                  </div>
                ))}
              </div>
              <button type="button" onClick={onPlay} className={`landing-button landing-button-gold ${mm ? "mm" : ""}`}>{copy.gameCta}</button>
            </div>

            <button type="button" onClick={onPlay} className="landing-loop-art" aria-label={copy.gameCta}>
              <div className="landing-loop-grid" aria-hidden="true" />
              <div className="landing-loop-route landing-loop-route-one" aria-hidden="true" />
              <div className="landing-loop-route landing-loop-route-two" aria-hidden="true" />
              <div className="landing-loop-clue landing-loop-clue-one">SEE</div>
              <div className="landing-loop-clue landing-loop-clue-two">NAME</div>
              <div className="landing-loop-clue landing-loop-clue-three">BUILD</div>
              <div className="landing-loop-gate">✓</div>
              <div className="landing-loop-figure"><CartoonDetective size="clamp(100px, 15vw, 160px)" float /></div>
              <span className="landing-loop-stamp">CASE<br />READY</span>
            </button>
          </div>
        </section>

        <section className="landing-final-section">
          <div className="landing-final-card">
            <img className="landing-reference-final" src="/landing/bagan.jpg" alt="" aria-hidden="true" />
            <div className="landing-final-wash" aria-hidden="true" />
            <div className="landing-final-copy">
              <p className={`landing-eyebrow landing-eyebrow-light ${mm ? "mm" : ""}`}>{copy.finalKicker}</p>
              <h2 className={mm ? "mm" : "display"}>{copy.finalTitle}</h2>
              <p className={mm ? "mm" : ""}>{copy.finalBody}</p>
              <button type="button" onClick={onPlay} className={`landing-button landing-button-white ${mm ? "mm" : ""}`}>{copy.finalCta} <Arrow /></button>
            </div>
            <div className="landing-final-mascot" aria-hidden="true"><CartoonDetective size="clamp(150px, 23vw, 220px)" float /></div>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="landing-footer-brand">
            <MascotMark size={30} />
            <span>
              <strong>Sone Dauk Lay</strong>
              <small className="mm">စုံထောက်လေး</small>
            </span>
          </div>
          <p className={mm ? "mm" : ""}>{copy.footer}</p>
          <nav aria-label="Footer">
            <button type="button" onClick={() => go("map")}>{mm ? "ကစားရန်" : "Play"}</button>
            <button type="button" onClick={() => go("hub")}>{mm ? "သင်ယူရန်" : "Learn"}</button>
            <button type="button" onClick={openLens}>{mm ? "Lens" : "The Lens"}</button>
          </nav>
        </footer>
      </div>
    </div>
  );
}
