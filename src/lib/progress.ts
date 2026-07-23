"use client";

import { useSyncExternalStore } from "react";
import type { TechniqueId } from "@/content/pack";

// ONE progress model, measured in techniques NAMEABLE (design v4 §6).
// not_met -> met (encountered) -> practised (named 3x) -> mastered (named across
// >=2 platforms). Guest-first: persisted to localStorage. No scores, no risk tiers.
const KEY = "sdl.progress.v1";

export type MasteryState = "not_met" | "met" | "practised" | "mastered";
type TechRecord = { seen: boolean; correct: number; platforms: string[] };
export type ProgressData = {
  tech: Partial<Record<TechniqueId, TechRecord>>;
  genuineSeen: number;
  genuineTrusted: number;
};

const EMPTY: ProgressData = { tech: {}, genuineSeen: 0, genuineTrusted: 0 };

let cache: ProgressData = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function read(): ProgressData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
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
  persist({ tech: {}, genuineSeen: 0, genuineTrusted: 0 });
}

export function useProgress(): ProgressData {
  return useSyncExternalStore(
    subscribe,
    () => cache,
    () => EMPTY
  );
}
