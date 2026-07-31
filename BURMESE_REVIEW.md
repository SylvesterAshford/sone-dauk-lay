# Burmese review — how to use this

**Status: blocking for launch (DESIGN.md §15).**

`BURMESE_REVIEW.tsv` lists every Burmese string in the app — 714 of them — with
its English counterpart, its file and line, and an empty `reviewer_fix` column.
Open it in Excel or Google Sheets, fill in `reviewer_fix` where the Burmese is
wrong, and hand it back. No code knowledge is needed and nothing has to be
edited in the codebase.

## The one thing that matters most

Two kinds of Burmese live in this app and they must NOT be judged the same way.

**`IN-WORLD (keep formal)` — 71 strings.**
These are the fake scam messages the player is learning to spot. A bogus bank
notice *should* sound like a stiff official notice, because sounding official
is the trick being taught. **If these read as stilted, that is correct.** Only
flag them if they would not convince anyone.

**`app voice (plain Burmese)` — 643 strings.**
Everything the app itself says: lessons, tells, buttons, explanations. These
must be plain, short, and speakable by a 13-year-old (DESIGN.md §11).
**If any of these sound like a textbook or a government form, they are wrong.**

## What has already been done

An automated register pass converted formal endings to plain ones in app voice
only (`သည်။`→`တယ်။`, `ပါသည်။`→`ပါတယ်။`, `သော `→`တဲ့ `, `ရန် `→`ဖို့ `,
`သို့သော်`→`ဒါပေမဲ့`, `၍ `→`ပြီး `). 26 strings changed. In-world text was left
untouched.

That fixes grammar, not word choice — which is exactly where a machine is
weakest. Two real errors found by a human reader that no automated check
caught:

- `လိမ်လည်မှု` — the formal/legal word for fraud, used in copy aimed at
  teenagers. Now `လှည့်ကွက်`.
- `ဒေါသ သို့ ကြောက်စိတ်` — `သို့` as "or" is written-only; nobody says it.

**Assume there are more of these.** Word choice and register-for-age are the
things to look for, not typos.

## Priority order

1. `src/lib/ui.ts` — buttons and labels; every user sees these on every screen.
2. `src/content/pack.ts` — the six technique names and tells; the app's spine.
3. `src/content/deck-lessons.ts` — lesson bodies.
4. `src/content/round-claims.ts` — table-round text.

## One lesson needs more than a language check

`t1-jobscam` ("The job offer abroad") teaches the fake-job-to-scam-compound
pipeline. It should be read by someone who works with at-risk youth as well as
a native speaker. It must not frighten, must not blame, and must leave the
reader with an action: stop, and tell an adult you trust.
