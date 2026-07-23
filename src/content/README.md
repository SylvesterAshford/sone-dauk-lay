# Content — for the native-speaker reviewer

All the words users read live in **`pack.ts`**. You can edit the Burmese (`mm`) and
English (`en`) strings freely — you never touch component code. After editing, the app
just plays your new words.

**Everything here is a DRAFT pending native-speaker review.** Fix the Burmese to sound
natural for Myanmar youth/teenagers, in plain, everyday language.

## Where to edit in `pack.ts`

| Section | What it is | Edit |
|---|---|---|
| `TECHNIQUES` | the six manipulation techniques + their one-sentence "tell" | `mm`, `en`, `tellMm`, `tellEn` |
| `TRACKS` | the three Learn track names | `mm`, `en` |
| `SCENARIOS` | the ~20 messages the game shows (See → Name) | `body.mm/en`, `evidence.*` |
| `LESSONS` | the 12 casebook lessons (meet / how / tell / practice / carry) | every `mm`/`en` |
| `LENS_CASES` | the Lens conversation cases | `body`, `q`, `answers`, `check`, `cant` |

Each scenario's `evidence` is the exact fragment that does the manipulating
(`fragmentMm` — must be a phrase that appears in `body.mm`) plus the note explaining it.

## Hard rules (do not break)

1. **No verdicts.** Never write "this is a scam / fake / true / 78% risk." We name the
   technique and the tell. The build fails if a verdict word slips into the UI.
2. **No real entities.** No real people, banks, brands, working links, phone numbers, or
   payment handles. Keep senders fictional but plausible ("KBZ-style", not real KBZ).
3. **Nothing sensitive as a game scenario.** Sextortion, self-harm, "I already sent
   money" — these belong ONLY to the Lens escalation, never `SCENARIOS`.
4. **Burmese first.** Write the `mm` string as the primary voice; `en` is a short gloss.

## The six techniques (keep these words identical everywhere)
urgency · authority · emotion · doctored · expert · context

## After you edit
Nothing to run. The team rebuilds and deploys; your strings ship as-is.
