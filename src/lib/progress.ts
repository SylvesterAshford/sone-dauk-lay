"use client";

import { useSyncExternalStore } from "react";
import { TECHNIQUES, type TechniqueId } from "@/content/pack";

// ONE progress model, measured in techniques NAMEABLE (design v4 §6).
// not_met -> met (encountered) -> practised (named 3x) -> mastered (named across
// >=2 platforms). Guest-first: persisted to localStorage. No scores, no risk tiers.
const KEY = "sdl.progress.v1";

export type MasteryState = "not_met" | "met" | "practised" | "mastered";
type TechRecord = {
  seen: boolean;
  correct: number;
  platforms: string[];
  /** Times this technique appeared in a case the player answered. Without it,
      "met" could not tell "saw it once" from "saw it 20 times and never got
      it" — the count only ever went up on success. */
  attempts?: number;
};

/** A dated thing the player actually finished. Kept so progress can be shown
    as a history, not just a set of current states. */
export type ProgressEvent = { t: number; kind: "lesson" | "level"; id: string };
export type ProgressData = {
  tech: Partial<Record<TechniqueId, TechRecord>>;
  genuineSeen: number;
  genuineTrusted: number;
  // Cases completed per level (memory for "finished a level" — design_v4 §7.1
  // open question, resolved: fixed count, no visible number, icon+word only).
  levelCases: Partial<Record<number, number>>;
  // Lessons the player has actually read to the end. Previously nothing was
  // recorded for Learn at all: a lesson's badge was derived from PLAY mastery,
  // so finishing a lesson left no trace and every card kept saying NEW.
  lessonsDone: string[];
  /** Newest last. Capped in recordEvent so a long-lived profile cannot grow
      without bound in localStorage. */
  history: ProgressEvent[];
};

const EMPTY: ProgressData = { tech: {}, genuineSeen: 0, genuineTrusted: 0, levelCases: {}, lessonsDone: [], history: [] };

let cache: ProgressData = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function isProgressShape(v: unknown): v is ProgressData {
  if (!v || typeof v !== "object") return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.tech === "object" &&
    p.tech !== null &&
    typeof p.genuineSeen === "number" &&
    typeof p.genuineTrusted === "number"
  );
}

function read(): ProgressData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      // Validate shape, not just that JSON.parse succeeded — a corrupted or
      // foreign value here must fall back to a fresh player, never throw
      // downstream when components read p.tech[id].
      if (isProgressShape(parsed)) return { ...EMPTY, ...parsed };
    }
  } catch {
    // ignore malformed storage
  }
  return EMPTY;
}

function persist(next: ProgressData) {
  cache = next;
  hydrated = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore write failures (private mode)
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    cache = read();
    hydrated = true;
  }
  listeners.add(cb);
  cb();
  return () => listeners.delete(cb);
}

export function stateFor(rec?: TechRecord): MasteryState {
  if (!rec || !rec.seen) return "not_met";
  if (rec.platforms.length >= 2 && rec.correct >= 3) return "mastered";
  if (rec.correct >= 3) return "practised";
  return "met";
}

/** Approximate 0-100 fill for the You bars, derived from mastery (never a score). */
export function fillFor(rec?: TechRecord): number {
  const s = stateFor(rec);
  if (s === "mastered") return 100;
  if (s === "practised") return 70;
  if (s === "met") return Math.min(55, 20 + (rec?.correct ?? 0) * 12);
  return 12;
}

function ensure() {
  if (!hydrated) {
    cache = read();
    hydrated = true;
  }
}

// Called by the round engine after each scenario is resolved.
export function recordName(scenarioTechniques: TechniqueId[], picked: TechniqueId[], platform: string) {
  ensure();
  const tech = { ...cache.tech };
  for (const id of scenarioTechniques) {
    const rec = tech[id] ?? { seen: false, correct: 0, platforms: [] };
    const named = picked.includes(id);
    tech[id] = {
      seen: true,
      attempts: (rec.attempts ?? 0) + 1,
      correct: rec.correct + (named ? 1 : 0),
      platforms:
        named && !rec.platforms.includes(platform)
          ? [...rec.platforms, platform]
          : rec.platforms,
    };
  }
  persist({ ...cache, tech });
}

export function recordGenuine(trusted: boolean) {
  ensure();
  persist({
    ...cache,
    genuineSeen: cache.genuineSeen + 1,
    genuineTrusted: cache.genuineTrusted + (trusted ? 1 : 0),
  });
}

export function resetProgress() {
  persist({ ...EMPTY });
}

export function useProgress(): ProgressData {
  return useSyncExternalStore(
    subscribe,
    () => cache,
    () => EMPTY
  );
}

// Synchronous read (used to detect rank-ups right after recordName).
export function getProgress(): ProgressData {
  ensure();
  return cache;
}

// --- Ranks & levels (game language over the same mastery data; no points) ---
export const RANKS = [
  "Detective Rookie",
  "Field Detective",
  "Senior Detective",
  "Master Detective",
] as const;
const RANK_NEED = [0, 2, 4, 6]; // # techniques at practised+ to reach each rank

export function practisedCount(p: ProgressData): number {
  return TECHNIQUES.filter((t) => {
    const s = stateFor(p.tech[t.id]);
    return s === "practised" || s === "mastered";
  }).length;
}
export function metCount(p: ProgressData): number {
  return TECHNIQUES.filter((t) => stateFor(p.tech[t.id]) !== "not_met").length;
}
export function rankFor(p: ProgressData) {
  const pr = practisedCount(p);
  let index = 0;
  for (let i = 0; i < RANK_NEED.length; i++) if (pr >= RANK_NEED[i]) index = i;
  const need = RANK_NEED[index];
  const nextNeed = RANK_NEED[Math.min(index + 1, RANK_NEED.length - 1)];
  const toNextPct =
    index >= RANKS.length - 1
      ? 100
      : Math.round(((pr - need) / Math.max(1, nextNeed - need)) * 100);
  return { name: RANKS[index], index, toNextPct, practised: pr };
}
// Two routes open a level, and BOTH must exist. Skill is the intended route;
// clearing the previous level is the guarantee.
//
// The bug this fixes: unlocking was gated purely on technique mastery, which
// needs 3 correct answers on the SAME technique. Because cases are drawn at
// random, a player could clear level 1 AND level 2 — ten cases — and still be
// locked out of level 3, with the map showing two "cleared" ticks and a shut
// door. Finishing the thing in front of you must always move you forward.
export function levelUnlocked(p: ProgressData, level: number): boolean {
  if (level <= 1) return true;
  if (level === 2) return metCount(p) >= 3 || levelCleared(p, 1);
  return practisedCount(p) >= 3 || levelCleared(p, 2);
}

// A level "clears" after this many resolved cases (any outcome — genuine or
// not — counts). Fixed count, not skill-gated: predictable and easy for a
// returning player to remember. No number is ever shown in the UI (§3.1) —
// only a binary icon+word "cleared" once the count is reached.
export const LEVEL_CLEAR_TARGET = 5;

export function casesCleared(p: ProgressData, level: number): number {
  return p.levelCases[level] ?? 0;
}
export function levelCleared(p: ProgressData, level: number): boolean {
  return casesCleared(p, level) >= LEVEL_CLEAR_TARGET;
}

// Called once per resolved case (checkName). Returns true if this case is the
// one that just crossed the clear threshold, so the caller can celebrate the
// moment instead of silently incrementing.
const HISTORY_CAP = 200;
function recordEvent(kind: ProgressEvent["kind"], id: string) {
  const hist = cache.history ?? [];
  if (hist.some((e) => e.kind === kind && e.id === id)) return; // once each
  const next = [...hist, { t: Date.now(), kind, id }].slice(-HISTORY_CAP);
  persist({ ...cache, history: next });
}

/** Newest first, for display. */
export function historyDesc(p: ProgressData): ProgressEvent[] {
  return [...(p.history ?? [])].sort((a, b) => b.t - a.t);
}

/** How often a technique was correctly named, out of times it came up. */
export function techAccuracy(rec?: TechRecord): { correct: number; attempts: number } {
  return { correct: rec?.correct ?? 0, attempts: rec?.attempts ?? 0 };
}

export function lessonDone(p: ProgressData, id: string): boolean {
  return (p.lessonsDone ?? []).includes(id);
}
export function lessonsDoneCount(p: ProgressData): number {
  return (p.lessonsDone ?? []).length;
}
/** Called when a player reaches the end of a lesson deck. Idempotent. */
export function recordLessonDone(id: string) {
  ensure();
  const done = cache.lessonsDone ?? [];
  if (done.includes(id)) return;
  persist({ ...cache, lessonsDone: [...done, id] });
  recordEvent("lesson", id);
}

export function recordCaseComplete(level: number): boolean {
  ensure();
  const before = casesCleared(cache, level);
  const after = before + 1;
  persist({ ...cache, levelCases: { ...cache.levelCases, [level]: after } });
  const justCleared = before < LEVEL_CLEAR_TARGET && after >= LEVEL_CLEAR_TARGET;
  if (justCleared) recordEvent("level", String(level));
  return justCleared;
}

// Which of `unlockedLevels` opened since the map was last shown — one shot per
// unlock, so the map can animate the moment instead of silently showing it
// already-open on return (design_v4 §7.1). Not itself a score; a session note.
const UNLOCK_SEEN_KEY = "sdl.map.unlockedSeen.v1";
function readSeenLevels(): number[] {
  if (typeof window === "undefined") return [1];
  try {
    const raw = localStorage.getItem(UNLOCK_SEEN_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.every((n) => typeof n === "number")) return parsed;
  } catch {
    // ignore malformed storage
  }
  return [1];
}
export function takeNewlyUnlockedLevel(unlockedLevels: number[]): number | null {
  const seen = readSeenLevels();
  const fresh = unlockedLevels.find((l) => !seen.includes(l)) ?? null;
  try {
    localStorage.setItem(UNLOCK_SEEN_KEY, JSON.stringify(unlockedLevels));
  } catch {
    // ignore write failures
  }
  return fresh;
}
