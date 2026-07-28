---
target: the whole ui, ux of our app
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-07-28T10-32-46Z
slug: src-components-app-sonedauklay-tsx
---
# Critique — Sone Dauk Lay (whole app UI/UX)

Method: dual-agent (A: ad4de13ca00bb4df6 · B: a94646abb68f3f5eb)
Target: `src/components/app/SoneDaukLay.tsx` (the monolithic app surface) · Mode: Operate · Viewport inspected: 390×844 mobile

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Stepper/beat bars/rank clear; fabricated "3 of 5 fooled" + animated "New case" badge muddy it |
| 2 | Match System / Real World | 3 | Scenario cards convincingly real, Burmese-first content; but "HQ" jargon + English chrome |
| 3 | User Control and Freedom | 3 | Back links, dismissible Lens, tap-forward; corner mascot can't be dismissed/moved, no progress reset |
| 4 | Consistency and Standards | 2 | Green means brand AND selected AND correct AND mastered — one hue, four meanings |
| 5 | Error Prevention | 3 | No timers, no pre-selected votes, "no penalty" — genuinely good; invented fool-stat misleads |
| 6 | Recognition Rather Than Recall | 3 | Six techniques persist with icons + tells; strong |
| 7 | Flexibility and Efficiency | 3 | Answer chips + free text in Lens, paste-your-own, print/table parity |
| 8 | Aesthetic and Minimalist Design | 3 | Clean and airy, but infinite scan/float/ring/blink motion + progress bars add banned chrome |
| 9 | Error Recovery | 3 | "Something here is designed to work on you" is gentle; practice grid marks your wrong tap clay-red (punitive) |
| 10 | Help and Documentation | 2 | No first-timer onboarding; "HQ", "the loop", the unlabeled magnifier, six bare icons unexplained |
| **Total** | | **28/40** | **Good — solid foundation, address weak areas** |

## Design Specificity Verdict

**Authored in its soul, generic in load-bearing details.**

**LLM assessment (A):** The signature moments are unmistakably *this* product and could not be lifted into a generic app — the Lens "what I can't know" block, the amber evidence-highlight *inside* the message, the winding Mission Map with non-padlock locked states, the restrained no-confetti level-clear, Burmese-first cards. A neighbouring scam-detector genuinely could not reuse these. But the chrome imports generic-SaaS defaults that fight the brief: the mandated rounded display face is **not loaded at all** (headings render in Inter — the exact clinical neutrality the brand is defined against); correctness is colour-coded green/red like every quiz app; progress shows as percentage fill-bars; the nav shell is English. The concept is specific; the execution leaks toward the antivirus-console flatness §1 exists to protect against.

**Deterministic scan (B):** `detect.mjs` — 13 static findings, **all in `SoneDaukLay.tsx`** (`src/app` scanned clean): `side-tab` ×11 (thick one-side borders, lines 584/706/739/794/798/877/909/978/1007/1095/1133) and `layout-transition` ×2 (`transition: width`, lines 819/837). The live browser overlay pass found **15** runtime anti-patterns the static scan can't see: `low-contrast` ×2 (3.3:1, `#7d9285` on white), `gpt-thin-border-wide-shadow` ×2 (1px border + 40px shadow), `undersized-ui-text` (10px "LITTLE DETECTIVE"), `tiny-text` (10.5px/11.5px), `overused-font` (Inter 65%), and `text-occlusion` (celebration text "Look how sharp you are!" 100% covered by a button).

**Where they agree / diverge:** The detector's `layout-transition` on width (lines 819/837) is the *same* progress-fill-meter that A independently flags as a §3.1 invariant violation — strong agreement, and the single most corroborated issue. The `low-contrast` and typography findings corroborate A's contrast/typography calls with hard numbers. The `text-occlusion` finding corroborates A's mascot-occlusion theme. **False positive:** `side-tab` ×11 is the deliberate case-file/dossier "evidence tab" motif of a detective game (line 584 pairs the 4px left border with a squared-off left radius) — a coherent repeated language, not AI slop; the rule misfires here. The two `layout-transition` flags are real but low-impact (a `transform: scaleX` refactor satisfies them).

## Overall Impression

The product's *thesis* — refuse verdicts, name the technique, hand judgment back — is beautifully realized exactly where it's deliberate (the Lens). But that same thesis is quietly undone by the default chrome everywhere else: a green=correct scoreboard, percentage meters, and "this one's real" verdicts reintroduce the pass/fail frame the whole product exists to refuse. **The single biggest opportunity: make the rest of the app as principled as the Lens** — strip the accidental scoreboard, and the design snaps into alignment with its own argument.

## What's Working

1. **The Lens honesty block** — "What you can check yourself" (agency) + "What I can't know" in mono ("I can't tell you whether this is true — only how it's built"). The product's argument made tangible, warm rather than apologetic. Best-in-class execution of §9.5.
2. **Evidence-highlight inside the message** — the amber highlight lands on the *exact* manipulating fragment with the annotation beneath. Teaches the mechanism in situ, never a verdict beside it. Pedagogically sharp and specific.
3. **Mission Map** — winding dotted trail, custom greyscale-safe platform icons, locked states as dashed versions of their *own* icon (not padlocks), zero numbers. Reads as a *place*. Faithful to §7.1 and hard to copy.

## Priority Issues

**[P0] Green means "correct" — systemic invariant violation.**
Selected technique chips get green border + green fill + green ✓; NameResult "Technique found" is green; the practice grid auto-greens the right answer and turns the user's wrong pick clay-red; the You-tab shows green fill-bars; Hub shows a green "MASTERED" tag; the map shows green "Cleared." DESIGN §3/§14 are explicit hard bans — *"green is the brand so it can't also be a signal," "correctness has no colour — icon and word only," "clay marks the manipulation, never the person's mistake."* Breaks the safety signal for the ~8% red-green colourblind male teens and turns the anti-scoreboard product into a scoreboard.
*Fix:* selected = sage-soft + forest border + ✓ only (§6); result/mastery = icon+word on neutral surface; wrong practice pick = neutral, never clay; reserve clay strictly for the manipulation fragment.

**[P1] The fixed corner mascot occludes primary CTAs on nearly every screen.**
Confirmed covering the "Doubt it" vote (See), "See if it would fool people" + fool-count (Build), the "False authority" chip (NamePick), the "Out of context" row + track tabs (Hub), and "Next case" (You). It sits in the bottom-right thumb zone, can't be dismissed or moved. The detector independently flagged `text-occlusion` on a celebration line covered by a button — same class of overlap bug. Casey (one-handed) and the cracked-screen daylight teen literally cannot tap covered controls.
*Fix:* collision-offset or auto-hide the bubble when a CTA occupies the bottom zone; make the mascot dismissible; reserve bottom padding so it never overlaps interactive elements.

**[P1] Progress rendered as percentage fill-meters.**
The You-tab draws six green gradient bars (`fillFor` → % width) plus a "progress to next rank" bar (`toNextPct`) — `progress.ts` even comments "never a score" while rendering a `%` width. §3.1's mechanical test bans any "fill-meter the user is meant to watch go up"; §14 bans percentages. This is also the detector's `layout-transition` finding (lines 819/837) — the one issue both passes caught.
*Fix:* replace bars with the four named states (not met / met / practised / named) as icon+word rows; show rank progression qualitatively (which techniques remain), no bar.

**[P2] Typography drops the warm face and ships webfonts against the budget.**
Loaded faces are Inter (body, many weights) + IBM Plex Mono, both webfonts; the mandated Poppins/Nunito display face is absent so every heading falls back to Inter. Detector corroborates: `overused-font` (Inter 65%), `undersized-ui-text` (10px), `tiny-text` (10.5/11.5px). §5 requires the rounded display face for warmth + the *system stack* for body ("Roboto ships on every Android, buys back ~180KB"); §1 caps total <500KB on 3G. Result: headings read clinical *and* the app pays webfont KB it was told to avoid.
*Fix:* subset the rounded display face for headings only; drop Inter/Plex for the system stack; raise sub-11px text to floor; verify under budget.

**[P2] Chrome and technique summaries are English-only — breaks Burmese-first.**
Nav (HQ/Learn/Play/You), section labels, most buttons, and — worst — both "Techniques you can name" panels (You and Hub) list the six technique names in English only, while lesson cards elsewhere are correctly bilingual. These six names are the exact vocabulary the product wants "nameable in Burmese, in the wild." §1/§11 require Burmese-first + Latin gloss.
*Fix:* Burmese-first on nav and both technique-summary panels at minimum; localize section labels.

## Persona Red Flags

**Jordan (confused first-timer):** HQ presents no single "start here" — hero, rank pill, "Start a case" vs "Paste a message", full-width casebook banner, and three loop cards all shout at once. "HQ"/"the loop" unexplained; the corner magnifier is unlabeled and never opens itself, so **the Lens (the whole differentiator) is effectively undiscoverable**; the first Name decision shows six unlabeled icons with no teaching.

**Casey (distracted, one-handed, 3G):** the mascot bubble covers the Doubt-it vote and Next-case CTA in the thumb zone; Inter+Plex webfonts delay first paint on 3G; the infinite scan-shimmer over every scenario card burns cycles and *reads like an antivirus scanning bar* — the exact console cue to avoid.

**Sam (screen-reader / keyboard / low-vision):** practice grid conveys right/wrong largely by green-vs-clay (invisible to red-green colourblind); green-on-green reassurance boxes and muted `#6B7D6F`/`#7d9285`-on-mist glosses fall below the 4.5:1 daylight floor (detector: 3.3:1); nav tabs are **32px** (below 44px); decorative mascot lines may be announced as content.

**Myanmar teen, cracked screen, daylight budget Android (project persona):** low-contrast muted greys wash out in sunlight; 32px tabs hard to hit on a cracked digitizer; English nav wraps Burmese content; on 3G the "friendly face" is a font that never arrives (headings stay Inter).

## Minor Observations

- Literal **⚠ warning-triangle** glyph and a **🎭 emoji** in Build compose output — §14 explicitly bans warning triangles; both off-system.
- **Motion is not "near-zero"** (§10): `floaty`, `scan`, `ringspin` (22s), `blink` all loop infinitely by default (disabled under `prefers-reduced-motion`, but the default is far past "one 150ms fade"). The scan-shimmer reads like a scanning bar.
- Detector: `gpt-thin-border-wide-shadow` ×2 (1px border + 40px shadow) — a generic-SaaS tell against the field-notebook brief.
- **Escalation mode keeps the mascot + "The Lens" header** inside the normal sheet; §9.6 wants the mascot gone and the game visibly stopped.
- **English gloss under "How it works" prose** contradicts §5 ("no English translation under body prose").
- **"This one's real / genuine"** states a truth-verdict — reconcile with the "never true/false" stance (the mechanic is defensible; the wording verges on the verdict the product refuses).
- Hero Burmese `h1` uses `leading-[1.6]`, under the 1.7–1.8 Burmese floor (§5).

## Questions to Consider

1. If the Lens is the whole differentiator, why is it a 56px unlabeled corner icon that never announces itself — while "Play" gets a top-level tab? The hierarchy sells the game and hides the thesis.
2. Can you honestly keep "green means brand" *and* green ✓ for correct answers? Green is doing four jobs; pick one and the system gets more honest.
3. The product refuses verdicts — so what is "3 of 5 were fooled" (a fabricated statistic) doing in Build?
4. If a teen learns the six technique names only in English, has the app taught the thing it measures — techniques *nameable in Burmese, in the wild*?
