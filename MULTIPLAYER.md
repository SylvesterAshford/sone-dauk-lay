# Sone Dauk Lay — Multiplayer Design Doc

**Status:** approved direction, not yet built
**Date:** 2026-07-29
**Branch:** nextjs-supabase-rewrite
**Decision:** Approach A — ship an honest Build step now, then pass-and-play multiplayer.

This document is the output of an office-hours session. It contains no code and
authorises none. It records what we decided, what we deliberately are not
building, and what evidence would change the plan.

---

## 1. Why this exists

The Build step tells the player how many people their fake message fooled.
The number is invented:

```ts
// src/components/app/SoneDaukLay.tsx:869
const foolCount = Math.min(5, Math.max(1, chosen.length + 1));
```

It is the count of fragments you tapped, plus one. Nobody was fooled. Nobody
saw the message. In an app whose entire subject is *people who lie to you with
confident numbers*, we ship a confident number that is a lie. That is the bug,
and it is the reason this session happened.

The proposed cure was full online multiplayer. The cure is directionally right
and was, as scoped, far larger than the disease.

## 2. Context that shaped the decision

| Fact | Source | Consequence |
|---|---|---|
| Nobody has played the app yet | stated in session | Cold-start makes online rooms unfillable |
| Players will be 3-4 friends **physically together** | stated in session | Deletes matchmaking, chat, and most safety load |
| Audience is 13-18 minors in Myanmar | PRODUCT.md | Live chat between strangers would be a duty of care, not a feature |
| Hero promises "no account · nothing uploaded · works offline" | current UI | Accounts and servers would break a trust claim we lead with |
| Supabase auth exists but **no root middleware** | `src/lib/supabase/*`, `(app)/page.tsx` | Auth is written but not enforced on the game; it is scaffolding, not a foundation |

### The reframe

Online multiplayer needs servers, accounts, matchmaking and moderation because
the players are strangers scattered across the internet. **Co-located players
supply all of that themselves**: they are the network, they are the social
graph, they are the moderation, and they discuss out loud so no chat feature is
needed. What remains is *shared state*, which is a far smaller problem.

## 3. What we are building

### Phase 1 — an honest Build step (do this first, alone)

Delete `foolCount` and the `{n} of 5 were fooled.` line. Nothing replaces it,
because there is nothing true to put there yet.

What the judged panel says instead is derived entirely from the player's real
choices, so every word of it is checkable:

- which techniques they actually used, named
- which techniques they left on the table
- the existing carry line about recognising it in the wild

Also fix, in the same pass:

- **Lines 896-898 are hardcoded English.** `They named: …`, `missed …`, and the
  whole closing paragraph bypass `t()`. A Burmese player currently hits raw
  English at the emotional peak of the step. This is a language-toggle bug that
  predates the multiplayer question and ships today.

**Ships independently. Depends on nothing below.**

### Phase 2 — pass-and-play imposter round

One phone, 3-4 friends in one room, no network, no accounts, no server.

#### Round structure

1. **Setup.** Enter 3-4 nicknames. The phone secretly assigns one Manipulator.
2. **Private turns.** Each player in sequence takes an identical-looking private
   turn behind a handover gate. This is the existing Build UI and the existing
   `FRAGMENTS` deck, reused.
   - Detectives see a real claim and must relay it *honestly* using fragments.
   - The Manipulator sees the same claim with a secret goal: make the room
     believe the opposite.
3. **Line-up.** All 3-4 composed messages are shown together. One is corrupted.
4. **Discussion.** Off-phone, out loud. The screen just holds the messages.
5. **Vote.** The phone passes again. Each player privately picks the message
   they think is manipulated *and* names the technique.
6. **Score.** The reveal.

#### Why every player takes a turn

If only the Manipulator composed, the others would identify them by who held the
phone longest. Identical turns for everyone removes the timing tell, and it has
a teaching benefit: detectives practise *honest* framing with the same deck the
manipulator abuses, which is the clearest possible demonstration that the
fragments themselves are neutral and the intent is what differs.

#### The handover gate

The single load-bearing component. Nothing secret renders until the named player
confirms they are alone with the screen, and it hides again the instant their
turn ends.

```
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  Pass to ဇော်ဇော်  │   │  YOUR ROLE       │   │  Pass to နှင်းနှင်း  │
│                  │ → │  (secret)        │ → │                  │
│  [ Tap when only │   │  compose…        │   │  [ Tap when only │
│    you can see ] │   │  [ Done → hide ] │   │    you can see ] │
└──────────────────┘   └──────────────────┘   └──────────────────┘
```

This is the standard pattern in Werewolf, Mafia and Spyfall apps. It is why they
work on one device.

#### The payoff

**The fooled count becomes true.** After the vote, "how many did you fool" is
literally the number of players who failed to identify the manipulated message.
Same sentence, same position in the flow, now computed from real human votes.
The step the user distrusted becomes the most honest screen in the app.

## 4. What we are deliberately not building

| Not building | Why |
|---|---|
| Online rooms / matchmaking | At zero users every room is empty. An empty lobby teaches players the app is dead. |
| In-app chat or voice | Players are in the same room. Adding it would make us a moderator of minors' conversations in Burmese, around the clock. |
| Email/password accounts | Breaks the "no account needed" promise and adds signup friction to a game played once at break. |
| A custom game server | Nothing here needs one. Phase 2 needs no network at all. |
| Enforcing the existing Supabase auth | It is unused scaffolding. Wiring it up now would add a login wall to a guest-first product for no gain. |

**Deferred, not rejected — Approach C (room code, own phones, Supabase
Realtime).** Genuinely better ergonomics: your secret role stays on your own
screen and no phone gets passed. Uses infrastructure already in the stack, still
needs no custom server, still needs no chat. It becomes worth building on the
evidence in §5, and not before.

## 5. Signals — what would change this plan

**Build Approach C when:**
- A group has played Phase 2 end-to-end at least twice without being asked to,
  and passing the phone is the thing they complain about.

**Abandon multiplayer entirely if:**
- Groups play once and do not ask for a second round. The format, not the
  plumbing, would be the problem, and no amount of Realtime fixes that.

**Revisit the classroom variant if:**
- A teacher or youth-group leader wants to run it with a whole class. That
  changes the design more than it changes the architecture, and it is the single
  most promising distribution channel available at zero users.

**The honest test for Phase 2:** it needs four teenagers, one phone, one room,
and no internet. There is no reason that test cannot happen the day it is built.

## 6. Open risks

1. **Reading load.** Four composed messages plus a technique vote is a lot of
   Burmese text on one phone screen. Sequencing and typography are the risk here,
   not logic. DESIGN.md §13 a11y floor applies.
2. **Group size of 3.** With three players the manipulator has a 1-in-3 prior.
   Whether that is too easy needs playtesting, not theory.
3. **Native-speaker review is still a launch blocker** (DESIGN.md §15) and every
   new string in Phase 2 adds to that queue.
4. **Phase 2 is meaningfully more UI than Phase 1.** It should not be started
   until Phase 1 is deployed, or the fake number rides along on a longer branch.

## 7. Adversarial review of this spec

Arguments against the plan, stated as strongly as I can make them:

- *"Phase 1 makes the Build step less exciting."* Correct, and accepted. A dull
  true screen beats a thrilling false one, and Phase 2 restores the excitement
  with a number that has earned it.
- *"You are assuming friends-together, but teens are mostly alone on their
  phones."* Real risk. It is exactly what the §5 signals are for. If nobody ever
  assembles a group, Phase 2 is dead weight — which is why it is small and
  network-free rather than a backend investment.
- *"Reusing the Build UI for the private turn may be a false economy."* Possible.
  The compose interaction is right; the framing around it is new. Treat the reuse
  as a starting point, not a constraint.
- *"Skipping competitor research was a shortcut."* Yes. Judgement call: the
  hidden-role handover pattern is well established and the Myanmar co-located
  constraint is specific enough that generic research would not have moved the
  decision.

## 8. Art direction

A party game earns visual energy that a lesson screen does not. The current
restraint is correct for Learn and wrong for a round played out loud with
friends. But the energy has to go somewhere specific, and DESIGN.md still binds.

### What the invariants actually forbid

Worth being precise, because it is less than it sounds. DESIGN.md bans
**dishonest ornament**: badges, streaks, points, timers, percentages, fill
meters, correctness signalled by colour, green used as anything but brand,
padlock/shield/siren iconography. It does **not** ban character, illustration,
drama, or motion. There is a great deal of room inside those rules.

### The one big graphics ask: four hats, not a cast

> **Superseded 2026-07-30 by `/design-consultation`. See DESIGN.md §16.**
> This section originally called for "4-6 distinct characters." That was wrong —
> it contradicted DESIGN.md §14 ("do not introduce a third character"), which I
> failed to check before writing it. The corrected version is below.

Single-player needs one mascot. Multiplayer needs **four variants of that same
mascot** — one Little Detective, four hats: deerstalker, bobble beanie, newsboy,
visor.

**A hidden-role game requires visually identical players.** If the Manipulator
looked different from the Detectives, the design would leak the role before
anyone spoke. So the one-character rule is not an obstacle here; it is a
requirement of the format, and it solves the "don't make the Manipulator look
cool" problem structurally instead of by restraint.

Constraints they must meet, inherited from the existing work:

- Inline SVG, same flat construction language as `DetectiveMascot` — no raster,
  no library, no network request (PRODUCT.md: <500KB, 3G, budget Android)
- On-palette, greyscale-safe, readable at 44px and at 200px
- Distinct **by silhouette**, never by colour alone (DESIGN.md §3, §13)
- The magnifier appears in every variant (§14), so props cannot differentiate

Four is the cap because rounds cap at four players. Bucket hat and trilby were
drawn and cut — at 44px they were indistinguishable from the deerstalker.

Players pick a hat at setup. The reveal shows characters, not nicknames.

### Where the energy goes, screen by screen

| Screen | Energy | Why |
|---|---|---|
| Setup / pick hat | Warm, playful | First contact, sets the tone as a game |
| **Handover gate** | **Deliberately plain** | It is a privacy screen passed 8+ times a round. Ornament here becomes friction fast. |
| **Role reveal** | **Maximum — this is the hero moment** | Light `--surface` card in `--forest` chrome, character large, one line of text. *(Corrected: "full-bleed dark" broke §14 and §4 — see DESIGN.md §16.3.)* |
| Private compose | Focused, close to today's Build UI | The work happens here; it should feel like concentration |
| Line-up | Evidence board — pinned notes, slight rotation, physical | Four messages must feel like objects to compare, not a list |
| Vote | Calm, high-legibility | A real decision, and correctness must never read by colour |
| **Reveal / score** | **High — the payoff** | The moment the true fooled-count lands |

### Visual concept: cards as physical objects

The game is dealing, hiding, and revealing. Lean into it — shadow, weight,
slight rotation off-axis, a real deal motion. The existing `.card-flip` already
establishes a 3D flip; this extends the same physical language rather than
inventing a second one.

### Motion budget

> **Superseded 2026-07-30. See DESIGN.md §16.4.**

**No new motion.** The deal/flip/reveal choreography proposed here was withdrawn:
§10 says motion is near-zero and enumerates what is permitted, and this surface
does not need an exception. The role reveal reuses the existing **150ms fade**;
the handover gate has **no motion at all**, because it is passed 8+ times a round
and instant beats animated.

### The risk nobody has raised yet

**Do not make the Manipulator look cool.** This is a media-literacy product for
minors, and the villain seat is the most design-attractive role in any imposter
game. A sleek shadowy trickster teaches teens that manipulation is stylish. The
Manipulator should read as *someone doing a job you can learn to spot* — the
existing red `gameContentBanner` framing is the right instinct, and the
character design has to carry it too. This is a product-safety constraint, not a
taste preference.

### Process note

This section is direction, not a spec. The cast and the reveal frame should go
through `/design-consultation` before any of it is built, and DESIGN.md needs an
addendum covering the multiplayer surface — the current document has no section
that anticipates a game played by four people around one screen.

## 9. Immediate next action

Fix `foolCount` and the three untranslated lines in `BuildCompose`
(`src/components/app/SoneDaukLay.tsx:869`, `896-898`). That is Phase 1, it is
small, and it removes a fabricated number from production.

Phase 2 starts after Phase 1 is deployed.
