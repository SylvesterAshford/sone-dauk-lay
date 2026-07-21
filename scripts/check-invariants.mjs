// Invariant 1 guard (spec §12): no user-facing string may carry a VERDICT.
// The product names techniques and shows tells — it never says true/false/fake/
// real/scam/misinformation, and never shows a risk score / % / threat tier.
// Fails the build on any leak. Run: node scripts/check-invariants.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("../src", import.meta.url).pathname;

// The ban is on VERDICTS about content, not on bare words: "Fake urgency" is a
// technique name and "genuine messages you trusted" is the design's own mechanic.
// So we match verdict PHRASES (calling the content itself fake/real/a scam) and
// any score / % / risk-tier / confidence value (EN — Burmese added with review).
const VERDICT =
  /(this is (a |an )?(scam|fake|real|genuine|misinformation|hoax)|it'?s (a |an )?(scam|fake|real|genuine|misinformation)|definitely (fake|real|a scam)|is (fake|a scam|misinformation))/i;
const SCORE =
  /(\b\d{1,3}\s?%|risk score|threat level|risk tier|confidence (score|level|value|%)|high risk|low risk|medium risk|% (sure|confident|likely))/i;

// Paths where the vocabulary is discussed on purpose (spec §12 allowlist).
const ALLOW_PATHS = [
  "content/pack.ts", // lesson prose + tells discuss the concepts (Track 1-3)
  "check-invariants",
];

/** naive string/JSX-text literal scan */
function offendingLines(text) {
  const hits = [];
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    // skip imports/comments
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("import")) return;
    for (const re of [VERDICT, SCORE]) {
      const m = line.match(re);
      if (m) hits.push({ n: i + 1, term: m[0], line: trimmed.slice(0, 100) });
    }
  });
  return hits;
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if ([".ts", ".tsx"].includes(extname(p))) acc.push(p);
  }
  return acc;
}

let failures = 0;
for (const file of walk(ROOT)) {
  const rel = file.slice(ROOT.length - 3);
  if (ALLOW_PATHS.some((a) => file.includes(a))) continue;
  const hits = offendingLines(readFileSync(file, "utf8"));
  for (const h of hits) {
    failures += 1;
    console.error(`✗ ${rel}:${h.n} — verdict term "${h.term}"  |  ${h.line}`);
  }
}

if (failures) {
  console.error(`\nInvariant 1 FAILED: ${failures} verdict-term leak(s). No verdicts, ever.`);
  process.exit(1);
}
console.log("✓ Invariant 1: no verdict terms in user-facing strings.");
