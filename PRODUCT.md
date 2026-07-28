# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are **young people in Myanmar, roughly 13–25**, reading and playing
**self-directed on their own budget Android phone** — guest mode, no account, often
on a metered or intermittent 3G connection. They are digitally fluent enough to live
on chat and social apps, but have had little formal instruction in spotting
manipulation in the messages, posts, and media that reach them daily.

The job: build the reflex to **notice and name the technique** being used on them
(fake urgency, manufactured authority, and the other core techniques) in a real
message, before deciding whether to trust it — practised often enough that it
transfers off the app into their actual feed.

Facilitator-led classroom/workshop use and the printed deck exist as **secondary
reach**, not the primary channel. Future work optimizes for the solo-phone case
first.

## Product Purpose

Sone Dauk Lay ("little detective") is a **media-literacy game**, not a security
tool. It teaches young people to recognise the manipulation techniques inside a
message and name them, rather than telling them what is or isn't a scam.

Success is **skill retained and transferred**: a player who can, unprompted, name
the technique at work in a message they encounter in the wild — measured inside the
product as techniques becoming nameable across contexts, never as lessons finished,
rounds played, minutes spent, or a risk score.

## Positioning

The differentiating mechanism is a **deliberate refusal to give verdicts.** The
product never states that something is true, false, fake, or a scam, never shows a
risk score or confidence percentage, and never claims to detect AI generation. It
**names the technique** ("this uses fake urgency") and hands the judgment back to
the person. This is the opposite of every threat-dashboard / scam-detector the
audience has been frightened by, and it is what a neighbouring security product
could not truthfully copy without becoming a different product.

The register reinforces it: a friendly **field notebook with a magnifier who looks
alongside you**, never an antivirus console. When a design decision is ambiguous,
the warmer option wins.

## Operating Context

- Guest-first, self-directed play on a personal phone; progress persists locally
  (no account, nothing uploaded).
- Three modules over one shared spine: **Learn** (casebook lessons), **Play** (the
  game / leveled Mission Map), and **the Lens** (a companion overlay reachable from
  a corner magnifier on every screen, which assists rather than instructs).
- A lesson's practice beat launches a **real game round** — the modules are bridged,
  not siloed.
- Secondary, non-primary: a printed technique deck and facilitator lesson pages;
  "Table mode" lets the game be played on paper. Parity rule: if a game feature
  can't be played on paper, question whether it belongs.

## Capabilities and Constraints

- **Burmese is the primary language; Latin is a gloss.** Type, layout, line-height,
  and truncation decisions start from Myanmar script.
- **Budget Android in daylight** is the device floor: high contrast, large targets,
  no thin weights, tested at 360×640 low-DPI.
- **Offline-first and light:** target under ~500 KB, usable on 3G, functional
  offline. Lectures stream and never bundle; illustration is SVG/CSS, never raster.
- **One vocabulary, one scenario pool, one progress model** across all three modules
  and the print deck — the core anti-fragmentation constraint.
- Progress is modeled as **techniques nameable** (not met → met → practised → named
  across contexts), and levels gate on real mastery, never on a point total.
- Tech stack: Next.js (App Router) + Supabase, deployed to Vercel. Progress today is
  localStorage-backed, no backend account system.

## Brand Commitments

- Name: **Sone Dauk Lay** (the "little detective").
- Character: a single **friendly magnifier mascot** that appears on Home, screen
  headers, and the Lens — never swapped for a different character or a raster/3D
  render on any single screen.
- Voice: plain Burmese, short sentences; **name the technique, never the verdict;
  never grade the person.** Bilingual order is always Burmese first, Latin gloss
  second. The interface speaks candidly about its own limits (the Lens's "what I
  can't know" block is a feature, not a disclaimer).
- Visual identity is documented in `DESIGN.md` (green field-notebook system, warm
  not clinical). Product-truth note: `DESIGN.md` §1 was written for a broader
  mixed-age audience; the confirmed primary target is now youth/teens 13–25, though
  content must still not read as juvenile.

## Evidence on Hand

- Working app (`src/`), design system (`DESIGN.md`), and a bundled content pack
  (`src/content/pack.ts`: techniques, scenarios, lessons, Lens cases) with a
  reviewer guide (`src/content/README.md`).
- **All Burmese content strings are draft, pending native-speaker review** — this
  review is blocking for both app and print (`DESIGN.md` §15). Future work must not
  treat current copy as final or fabricate that a review has happened.
- No real testimonials, user numbers, partner endorsements, or deployment/adoption
  claims exist yet; do not invent any.

## Product Principles

1. **Name the technique, not the verdict.** Refusing to declare "scam / fake / true"
   is the product, not a limitation — write and design it with confidence.
2. **Warmth over authority.** A field notebook, not a threat console; the friendly
   register is what separates this from products the audience already fears. When
   ambiguous, choose warmer.
3. **Skill transfer is the only score.** Optimise for techniques becoming nameable in
   the wild, never for engagement metrics, streaks, points, or completion counts.
4. **Burmese-first, budget-Android, offline-usable are non-negotiable constraints,**
   not aspirations — they gate typography, weight, and asset decisions from the start.
5. **One product across three modules and paper.** Shared vocabulary, scenario pool,
   and progress model; a feature that can't survive greyscale photocopy or paper play
   is suspect.

## Accessibility & Inclusion

- Contrast floor 4.5:1 text / 3:1 interactive boundaries, verified in sunlight not on
  a desk monitor.
- Touch targets ≥44px (48px preferred); visible keyboard focus; full screen-reader
  operability; text resizes to 200% without loss of function.
- **Never colour-only:** technique identity, genuine/manipulated, module, and track
  must each carry an icon or word as well (this content is safety-relevant and ~8% of
  men have red-green colour blindness). The print deck must survive a black-and-white
  photocopier.
- Assume low digital literacy, not low intelligence: label by what things do ("Find
  the technique"), never by system concept.
