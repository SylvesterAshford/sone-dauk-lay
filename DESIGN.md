# design.md — Sone Dauk Lay

**Version:** 4.1 · Companion to `PRD_San_Dauk_Lay_v3.md`, `spec_lens_and_lectures.md`, `wireframes_v2.html`
**Scope:** visual system for three modules — Learn, Play, the Lens — plus the printed deck.

**Changed in v4:** palette replaced with the green system actually built (§3) · monospace given a defined job (§5) · Module C, the Lens (§9) · video & audio lecture components (§8.4) · "correct" is no longer a colour (§3).
**Changed in v4.1** (from `/plan-design-review` on the Mission Map, 2026-07-24): added §7.1 Mission Map · added §3 sub-rule generalizing illustration-vs-score · fixed the padlock/§14 conflict (see §7.1).

---

## 1. What this product looks like, and why

San Dauk Lay is a **little detective**, not a security console. The audience includes people nervous about technology who have been burned by it; anything resembling a threat dashboard — red alerts, percentage gauges, warning triangles — makes them feel accused rather than equipped.

The direction is **a field notebook, not an antivirus scanner.** Soft paper, ink, a highlighter, hand-annotated evidence, and a friendly magnifier who does the looking with you.

The built landing page settles the register: **pale green, rounded type, a smiling lens.** That warmth is doing real work — it is what separates this from every security product the audience has been frightened by. Protect it. When a decision is ambiguous, choose the warmer option.

Three constraints drive every decision, in order:

1. **Burmese is primary.** Latin is the gloss. Type decisions start from Myanmar script.
2. **A budget Android in daylight.** High contrast, large targets, no thin weights.
3. **Under 500 KB, usable on 3G, functional offline.** This is why lectures stream and never bundle, and why illustration is SVG/CSS, never raster (see §7.1).

---

## 2. The three modules

```
                 HOME
    ┌──────────────┼──────────────┐
  LEARN           PLAY          THE LENS
 casebook        the game       companion
  daylight       evening         overlay
    └──────────────┼──────────────┘
              SHARED SPINE
   six techniques · one scenario pool
   the tell · mastery progress · the deck
```

Learn and Play are **destinations**. The Lens is an **overlay** — it has no home screen and no tab, only the corner magnifier present on every screen. That difference must be visible: destinations own the full screen; the Lens always sits on top of something else, because it assists rather than instructs.

**Rules that keep three modules from becoming three products:**

- **One vocabulary.** The same six techniques, same Burmese labels, same tells — in lessons, rounds, Lens replies, and printed cards. No module introduces a term the others don't use.
- **One scenario pool.** Authored once, available to a lesson, a round, and a card.
- **One progress model.** All three feed the same mastery states.
- **The bridge is mandatory.** A lesson's beat 4 launches a real game round (§8.3).

---

## 3. Colour

The green system as built. Green is the **brand**, which means green cannot also mean "correct" — a signal that matches the background signals nothing.

| Token | Hex | Use |
|---|---|---|
| `--mist` | `#E9F1EA` | Page background |
| `--surface` | `#FFFFFF` | Cards, sheets, reading surfaces |
| `--sage` | `#85B491` | The mascot, illustration fill, Lens accents |
| `--sage-soft` | `#D3E5D7` | Selected chips, user bubbles, subtle fills |
| `--forest` | `#2C4433` | Play chrome, secondary dark surfaces |
| `--ink` | `#1B2A1F` | Primary text, primary buttons |
| `--muted` | `#6B7D6F` | Secondary text, labels (min 13px — never smaller) |
| `--hairline` | `#CFDDD2` | Borders, dividers |

**Functional colours — only two, and neither is green:**

| Token | Hex | Use |
|---|---|---|
| `--amber` | `#C8871F` | **The highlighter.** Marks the tell and the evidence fragment. Nothing else. |
| `--amber-soft` | `#FBEFD8` | Highlight background behind a tell |
| `--clay` | `#B0453F` | Manipulation technique markers, Villain's Seat watermark |

**Correctness has no colour.** Genuine content, correct answers, and completed states are marked by **icon and word only** (`✓ genuine`, `named`). This is deliberate: it keeps the palette to two functional hues, and it stops the interface from turning into a scoreboard of right and wrong.

**Track accents** — 3px rules on track headers and lesson cards only. Never fills, never text colour.

| Track | Token | Hex |
|---|---|---|
| 1 · Techniques | `--track-1` | `#2C4433` |
| 2 · AI & synthetic media | `--track-2` | `#5A5A7A` |
| 3 · Information integrity | `--track-3` | `#2C6068` |
| 4 · Act | `--track-4` | `#8A5A3B` |

**Rules**

- **Never colour-only.** Technique identity, genuine/manipulated, module identity, track identity must each carry an icon or word as well. ~8% of men have red-green colour blindness and this content is safety-relevant.
- **`--clay` marks the manipulation, never the person's mistake.** A wrong answer gets neutral treatment plus the explanation.
- **No risk tiers.** v1's green/yellow/red is gone with the score it encoded. There are named techniques, not threat levels.
- Contrast floor **4.5:1** text, **3:1** interactive boundaries. Verify in sunlight, not on a desk monitor — `--muted` on `--mist` is the pairing most likely to fail.

### 3.1 Illustration vs. score — the general rule

*(Added v4.1, generalized from the Mission Map review. Applies everywhere, not just Play.)*

Game-like presentation is not banned; **accumulable numeric display** is. Apply this mechanical test to any new visual element:

> **Does it render a number, token, currency, or fill-meter the user is meant to watch go up?**
> If yes — banned, no matter what it's called. Renaming "points" to "mastery %" or "XP" to "insight" does not launder it.
> If no — it's dressing, and dressing is allowed, even encouraged.

Concretely:

| Allowed (dressing — adds *place*) | Banned (score — adds *number*) |
|---|---|
| Illustrated terrain, a path, character presence, chapter framing | Any "`N/M`" or "`⭐ N`" counter |
| A qualitative, skill-derived title ("Detective Rookie" → "Master Detective") | A currency or gem counter |
| An object that *represents* a milestone (a drawn case file, a closed folder) | A reward object gated behind a numeric threshold ("open the chest at 30 XP") |
| One-time celebration on crossing a real mastery threshold | A live counter, a streak, a timer, a leaderboard |

This is the same test that already justified §6's "no badges, streaks, points, timers, or confetti" — §3.1 exists so implementers have a *test*, not just a list of banned nouns, when a new feature invents a new kind of visual.

---

## 4. Module identity — one palette, re-weighted

| | **Learn** | **Play** | **Lens** |
|---|---|---|---|
| Register | Daylight — reading | Evening — casework | A companion leaning in |
| Chrome | `--mist` header, `--ink` text | `--forest` header, reversed | Sheet over whatever's beneath |
| Content surface | `--surface` | `--surface` | `--surface` |
| Accent role | Amber marks the tell | Amber marks evidence | Sage marks the companion |
| Density | Airy, generous | Tighter | Conversational |

**Play is not a dark theme.** Forest appears in headers, nav, and mode cards only. Content surfaces stay light, because budget Androids in daylight need the contrast and scenario cards must look like real messages — a dark scenario card breaks the realism the whole See step depends on.

---

## 5. Typography

```css
--font-display: "Poppins", "Nunito", system-ui, sans-serif;  /* subset, headings only */
--font-body:    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
--font-mono:    ui-monospace, "SF Mono", Menlo, Consolas, monospace;
--font-mm:      "Padauk", "Noto Sans Myanmar", "Myanmar Text", sans-serif;
```

**Three faces, three jobs.** The rounded display face is what makes the product feel friendly rather than clinical — it is a deliberate choice and worth its cost, but **subset it to headings only** (~20 KB). Body text uses the system stack; Roboto ships on every Android target and buys back ~180 KB.

**Monospace has a defined job**, established by the landing page and now codified: mono is **the system speaking about itself.** Eyebrow labels, meta-statements, and honesty disclosures — *"no account needed · nothing is uploaded · works offline."* It reads as an evidence label in a case file, which fits the metaphor exactly.

Mono is therefore the correct face for the Lens's *"what I can't know"* block (§9.5). Never use mono for content the user is meant to learn from — only for the interface being candid about itself.

**Burmese** uses Padauk or Noto Sans Myanmar throughout — self-hosted, regular and semibold only, hinted woff2. Padauk is also the **print** face.

### Burmese rules — functional requirements, not preferences

- **Line-height 1.7–1.8 minimum.** Myanmar script has tall ascenders and stacked medials; Latin's 1.4–1.5 clips diacritics. Reserve this in every layout from the start.
- **No italics.** Myanmar script has no italic form; browsers synthesise a broken oblique. Emphasise with weight or `--amber-soft`.
- **No all-caps, no letter-spacing.** Meaningless in Myanmar script, and letter-spacing breaks conjunct rendering. *(This is why mono eyebrows are Latin-only.)*
- **Minimum 16px** Burmese body; 14px acceptable for Latin.
- **Never truncate Burmese mid-word with ellipsis.** Word boundaries aren't space-marked as in Latin; truncation produces nonsense. Wrap, or clip whole lines.
- Test every string at **360×640, low DPI** — the realistic device floor.

### Scale

| Role | Latin | Burmese | Face | Weight |
|---|---|---|---|---|
| Hero / screen title | 22px | 24px / 1.7 | display | 600 |
| Eyebrow / meta | 11px | — | **mono** | 400 |
| Body | 15px | 16px / 1.75 | body | 400 |
| **The tell** | 16px | 18px / 1.8 | body | 500 |
| Technique name | 15px | 17px | body | 600 |
| Caption | 13px | 14px | body | 400 |

### Long-form reading (Learn only)

- **Measure 28–36 Burmese characters per line.** Myanmar script is denser and taller; the Latin 45–75 rule produces exhausting lines. Cap the reader column on wider screens.
- **Line-height 1.8** for prose. Paragraph spacing 1.2em, **no first-line indent** — indents are a Latin print convention and read as an error in Burmese digital text.
- **Maximum 3 paragraphs per beat screen.** More means the lesson is too long; split or cut.
- **No justified text** — Myanmar script lacks the spacing flexibility and justification produces rivers.
- **Bold one phrase per paragraph maximum.** Myanmar semibold is visually heavier than Latin bold.
- **No English translation under body prose.** Gloss the tell and technique names only; translating prose doubles the load for bilingual readers and helps nobody.

---

## 6. Shared spine components

**Scenario card** — must read as a believable message, not a quiz item. Mimics its source platform closely enough to be recognisable, with a persistent unobtrusive `example` marker in mono. `--surface`, 8px radius, hairline border. Identical across Learn, Play, the Lens, and print.

**Technique chip** — bilingual, Burmese primary. Selected: `--sage-soft` fill, `--forest` border, **plus a checkmark**. Minimum 44×44px, 48px preferred.

**The tell panel** — the product's most important component. `--amber-soft` background, 3px `--amber` left rule, Burmese first, Latin gloss below. One sentence; if it needs two, it isn't finished. 32px clearance above and below — it earns the space.

**Evidence highlight** — inline `--amber-soft` behind the exact fragment doing the manipulating, annotation beneath in `--clay`. The signature move: show the mechanism *inside* the message, not beside it.

**Vote buttons** — trust / not sure / doubt, equal weight, never pre-selected. Styling "doubt" as the safe choice trains reflexive suspicion, which is the failure mode this whole product designs against.

**Progress** — measured in **techniques nameable**: *not met · met · practised · named across contexts.* Never lessons completed, rounds played, minutes, or streaks. All three modules feed one model.

**No badges, streaks, points, timers, or confetti.** They reward return visits over retained skill and read as juvenile to the adult half of the audience. (See §3.1 for the general test this implies.)

---

## 7. Play module components

**Mode cards** on `--forest` chrome: *Solo case* · *Villain's Seat* (locked until one round is complete — the lock **explains itself**, never just greys out) · *Table mode* (an equal, not a fallback).

**Round progress** — segmented bar, one segment per scenario, filled segments carrying a technique glyph so the bar doubles as a record. **No timer**: time pressure teaches guessing.

**Score** — shown only at round end, never live. A live counter pulls attention from the message to the number. The summary reports, in order: techniques named · techniques missed (neutral, each routing to its lesson) · **genuine messages you trusted**. That last line is a score line *on purpose* — correctly trusting real content is a skill, and displaying it is how the design resists training paranoia.

**Villain's Seat** — full-width `--clay` band plus diagonal repeating `GAME CONTENT` pattern behind the compose field, visible in any screenshot; selection, copy, and share disabled; slot-filled from curated fragments; no real people, brands, working URLs, or payment handles; every round closes back to defence.

### 7.1 Mission Map (added v4.1)

The level-select screen for Play. Approved direction from `/plan-design-review`,
2026-07-24 — mockup at
`~/.gstack/projects/tunaunglwin-dev-LittleDetective/designs/mission-map-restyle-20260724/mockup-middle-path.png`.

**What it is:** a screen that feels like *a place*, not a settings list — without
becoming a scoreboard. Levels gate on real mastery (`levelUnlocked()`), never on
a point total.

- **Trail** — a winding, hand-drawn-style dotted SVG path (not a straight line)
  connecting the level nodes. Inline SVG only, `stroke-dasharray`, no raster asset.
- **Platform icons** — each level gets a custom small inline SVG icon at its node
  (e.g. a magnifier-ring, a stack of case-files, a closed case-file box),
  matching the greyscale-safe style already used for `TechniqueIcon` (§12). Not a
  plain numbered circle.
- **Unlocked-card weight** — the single playable level gets `--sage-soft` fill and
  a `--forest` 2px border so it visually wins the scan immediately; locked cards
  stay `--surface` / hairline / 65% opacity. (Reuses the existing "selected"
  treatment from Technique chip §6 — no new token.)
- **Locked state icon — NOT a padlock.** §14 already bans padlock/shield/siren
  iconography as security-console framing; the Mission Map must not reintroduce
  it. Use a dim, dashed-outline rendering of the level's *own* platform icon
  instead — "not yet," not "locked out."
- **Chapter mascot** — the existing `Mascot` component rendered larger on this
  screen only (reuse its `float`/`ring` props, same as the HQ hero), with a small
  drawn vignette ring. Same magnifier character, more presence — never a
  different character, never 3D/raster art.
- **Unlock moment** — when a level newly unlocks, animate that one node on
  return to the map (existing `anim-rise`/`pop` keyframes — dissolve from the dim
  "not yet" icon to its full unlocked platform treatment). This is the map's own
  "something changed" signal, distinct from the rank-up modal.
- **No numeric display anywhere on this screen** — no `N/M`, no star count, no
  gem/currency counter, no treasure-chest-as-reward. Apply §3.1's test to any
  future addition here.
- **Palette stays green.** No purple, no palette swap for this screen — the
  magnifier mascot appears on Home, the header, and the Lens; a different
  palette/character here fractures brand identity rather than creating a themed
  sub-world.
- **Budget:** everything on this screen is inline SVG/CSS. Zero new raster
  assets — this is a hard constraint, not a preference, on an offline-first,
  budget-Android, Myanmar-bandwidth target (§1).
- **Accessibility:** trail and platform-icon SVGs are decorative — `aria-hidden="true"`.
  All real semantics (level name, lock state, unlock requirement) live in the
  existing text/button markup. SVGs use `viewBox` so they scale rather than
  needing separate mobile art. Verified at 360×640 (§5 floor).

---

## 8. Learn module components

**8.1 Track header** — 3px track-accent rule, track name, lesson count, mastery state (`4 of 6 practised`). No ring, no percentage.

**8.2 Lesson card** — `--surface`, 8px radius, 3px track-accent left rule. Burmese title 17px/600, English gloss 13px `--muted`, one-word state. **No duration estimate** — "4 min" invites people to decide they haven't got 4 minutes.

**8.3 Beats** — five, one per screen, five-segment bar at top. **Tap-forward only, no swipe** (unreliable on cheap touchscreens; collides with Android back-gestures).

| Beat | Treatment |
|---|---|
| Meet it | Full-bleed scenario on `--mist`. No chrome, no title — the scenario is the whole screen. |
| How it works | `--surface`, prose column, §5 reading rules. The only long-reading screen in the product. |
| The tell | The tell panel alone, centred, generous space. |
| **Practice** | **Launches a real game round** — Play chrome, no lesson framing, no "practice mode" badge, no reduced scoring. Returns to beat 5 automatically. **If this bridge is cut for scope, cut the Learn module with it.** |
| Carry it | `--forest` reversed, one sentence, 20px/1.8, copy button. The **only** copyable text in the product — deliberately opposite to Build output, and the difference must be legible at a glance. |

**8.4 Lecture affordance (video & audio)** — attaches to **beat 2 only**, never replacing it.

- A single row **above** the prose: static thumbnail (no embedded player until tapped — players cost KB), `▶ Watch · 90s` and `♪ Listen` in mono, `--muted`.
- **No autoplay, ever.** On a metered connection, tapping shows an estimated size first.
- The text lesson is already on screen beneath it, so **a failed video has no error state** — there is no dependency to break.
- Audio player is a single hairline bar: play/pause, scrub, elapsed. No waveform, no artwork.
- **A lesson is never video-only.** Text is the path; lectures are enrichment.

---

## 9. The Lens (Module C)

### 9.1 The corner magnifier
56px mascot, bottom-right, 16px inset, sitting above any nav. Present on every screen.

- States: **idle** (neutral smile) · **thinking** (slow single pulse) · **has reply** (small `--sage` dot). Nothing else. No loops.
- **Never auto-opens. Never nags.** One contextual invitation is permitted — after a missed technique: *"Want to look at that one together?"* — dismissible permanently, never repeated.
- Respects `prefers-reduced-motion` by dropping the pulse entirely.

### 9.2 The sheet
Opens to ~70% height over the current screen; the screen beneath stays visible and dimmed. The mascot shrinks to a 32px sheet header. Dismisses back into the corner. Context persists within a session, clears on close.

The Lens **always sits on top of something**. It never becomes a full screen, because it assists rather than instructs — and the layering is what communicates that.

### 9.3 Turns — asymmetric on purpose
- **User:** `--sage-soft` bubble, right-aligned, 16px radius.
- **The Lens:** **no bubble.** Plain text on `--surface`, left-aligned.

This asymmetry is deliberate. Bubbles on both sides read as two friends chatting; the Lens is the notebook thinking out loud, not a companion to confide in. It quietly discourages the parasocial framing that a mascot otherwise invites, and it costs nothing to implement.

### 9.4 Suggested replies
The Lens's Socratic questions carry 2–3 tappable answer chips (`--sage-soft`, 44px minimum). Typing Burmese on a budget phone is slow; the chips are what make the conversation usable for the target audience. Free text stays available underneath.

### 9.5 The "what I can't know" block
The signature component of the Lens, and always the last thing in a reply.

- Hairline box, `--surface`, **mono type**, `--muted`.
- Ties honesty to the system voice already established by the landing page.
- Given real space — it is a feature, not a footnote or a disclaimer.
- Never collapsed, never behind a "more" link, never smaller than 13px.

**Technique results inside the Lens reuse the standard technique card and tell panel** from §6 without modification. Consistency across surfaces is exactly what makes the vocabulary portable off the app.

### 9.6 Escalation mode
When escalation triggers (money already sent, crisis language, someone in danger), the Lens **changes mode completely**:

- **No mascot, no chat bubbles, no techniques, no lesson framing.**
- A single high-contrast `--surface` card: what to do, in order, in plain Burmese. Phone numbers as large tap targets.
- Calm, not alarmed. No `--clay`, no warning iconography — a frightened person needs steadiness.
- It must be visually obvious that the game stopped. Someone mid-emergency needs help, not media literacy.

---

## 10. Layout & motion

- **Single column, mobile-first.** A max-width wrapper suffices on larger screens; reader column capped per §5.
- 4px base; 16px gutters; 12px between related elements, 24px between sections; 32px around the tell panel.
- Radius: 8px cards, 4px inputs, 16px bubbles, 22px chips, pill buttons (as built). No radius on printed cards — 3mm bleed and cut marks instead.
- **Motion near-zero.** 150ms fade on technique reveal, 120ms beat slide, one Lens pulse, one Mission Map unlock dissolve (§7.1). Nothing else. `prefers-reduced-motion` disables all of it.

---

## 11. Voice

- **Plain Burmese, short sentences.** Written for someone reading on a cracked screen in a hurry.
- **Name the technique, never the verdict.** "This uses fake urgency" — never "this is a scam," never a percentage. A copy rule as much as a product rule.
- **Never grade the person.** "Something here is designed to rush you," not "WRONG."
- **The Lens asks before it tells**, and admits what it can't know. Its refusal to give verdicts is the product's most differentiated behaviour — write it with confidence, never apology.
- **Mono is the honest voice.** When the interface speaks about its own limits, it speaks in mono.
- **Active voice, consistent verbs.** *Find the technique* produces *Technique found.*
- Bilingual order always **Burmese first, Latin gloss second** — app, deck, guide, and proposal screenshots.

---

## 12. Print parity

**Cards** — 63×88mm, 9 per A4, 3mm bleed, visible cut lines. **Must survive a black-and-white photocopier**, which is how the deck actually propagates in Myanmar: every technique carries a distinct **icon and pattern**, never colour alone. Test as pure greyscale before locking. Print face Padauk, embedded. Card back: flat `--forest` with the mark. Ship an uncut, no-bleed A4 version for low-spec printers.

**Facilitator lesson pages** — one lesson, one A4 page: scenario, mechanism, the tell, two practice items, three discussion prompts. Single column, 11pt Padauk, 1.8 line-height. Track accent as a **greyscale header band with the track number**, never colour.

**Parity rule:** the printed deck is Table mode without a phone. If a game feature can't be played on paper, question whether it belongs in the game.

---

## 13. Accessibility floor

- Touch targets ≥44px, 48px preferred. Lens chips and the corner magnifier included.
- Visible keyboard focus everywhere (`2px --forest`, 2px offset).
- Whole flow operable by screen reader; technique chips are real checkboxes with labels, not styled divs. The Lens sheet traps focus and returns it to the magnifier on close.
- Text resizes to 200% without loss of function — **no fixed-height containers in the lesson reader or the Lens sheet**, the two likeliest places to break this.
- Beat and round progress are real lists with `aria-current` on the active step.
- Assume **low digital literacy, not low intelligence**: label by what things do (*Find the technique*), never by system concept (*Analyze input*).

---

## 14. Do not

- Do not show a risk score, percentage, confidence bar, or threat level — anywhere, including the Lens.
- **Do not let the Lens state that something is true, false, fake, or a scam**, or claim to detect AI generation. Its refusal is the feature.
- Do not label anything "AI" unless a model produced it. The offline checklist is a checklist and says so.
- **Do not use warning triangles, sirens, shields, or padlocks** — security-console iconography frightens this audience and misframes the product as cybersecurity rather than media literacy. *(This includes locked-level states in Play — see §7.1 for the non-padlock alternative.)*
- Do not let Build output be copyable, exportable, or shareable, ever. *("Carry it" is the sole intentional exception, and looks nothing like it.)*
- Do not add badges, streaks, points, timers, or duration estimates. (General test: §3.1.)
- **Do not let a lesson end without launching a real game round.**
- **Do not let a lesson be video-only.** Text is always the complete path.
- Do not let the modules diverge in vocabulary, scenario pool, or progress model.
- Do not make green mean "correct" — green is the brand, so it can't also be a signal.
- Do not add a fourth core colour, a second display face, or a decorative illustration style without removing something first.
- **Do not swap the core palette on any single screen** — a themed sub-world stays in the brand's own dialect (§7.1); a palette swap is a brand substitution, not a theme.
- **The mascot has two forms, and only these two** (revised v4.2): (1) the **plain magnifier** — the header logo, the corner **Lens** (§9.1), and any small chrome mark; it *is* the lens tool. (2) the **Little Detective character** — a round green figure wearing a forest cap and **holding the same magnifier** — used only for the big "center" moments (Home hero, Mission Map header, celebrations) so those screens aren't yet another lone lens. Both are the same character in spirit (the magnifier is always present); this is an evolution of the single-mascot rule, not a second brand. Do not introduce a *third* character, and do not use the detective figure on dark surfaces (its forest cap and ink outline blend) — the magnifier form covers dark chrome. Both forms stay on-palette, greyscale-safe, and inline-SVG (zero raster).

---

## 15. Open

1. **Native-speaker review** of six technique names, six tells, all lesson bodies, and the Lens honesty script — **blocking** for app and print.
2. Burmese names for the three modules and for the Lens. They must feel like parts of one object, not four apps.
3. Icon set: draw six custom marks, or subset a licensed open set? Custom is ~half a day and guarantees the greyscale-photocopy test passes. *(Extends to the 3 Mission Map platform icons, §7.1 — same exercise, same session.)*
4. Confirm the display face licence permits self-hosting and subsetting.
5. Landing-page copy: **"nothing is uploaded" stops being true once the Lens makes API calls.** Revise before launch — an inaccurate privacy claim costs more with this audience than a caveated one.
6. Does the deck need a Shan or Mon variant for the pilot region, or is Burmese sufficient for v1?
