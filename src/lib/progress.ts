"use client";

import { useSyncExternalStore } from "react";
import type { MasteryState, TechniqueId } from "@/content/pack";

// ONE progress model, measured in techniques NAMEABLE (design v4 §6).
// not_met -> met (encountered) -> practised (named 3x) -> mastered (named across >=2 platforms).
// Guest-first: persisted to localStorage; mirrored to backend only when signed in.
const KEY = "sdl.progress.v1";

type TechRecord = {
  seen: boolean;
  correct: number;
  platforms: string[]; // distinct platforms where named correctly
};
type ProgressData = {
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

function emit() {
  listeners.forEach((l) => l());
}

function persist(next: ProgressData) {
  cache = next;
  hydrated = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore write failures
  }
  emit();
}

function subscribe(cb: () => void) {
  if (listeners.size === 0 && !hydrated) {
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

// Called by the round engine after each scenario is resolved.
export function recordEncounter(id: TechniqueId) {
  const rec = cache.tech[id] ?? { seen: false, correct: 0, platforms: [] };
  persist({ ...cache, tech: { ...cache.tech, [id]: { ...rec, seen: true } } });
}

export function recordNamed(id: TechniqueId, platform: string) {
  const rec = cache.tech[id] ?? { seen: false, correct: 0, platforms: [] };
  const platforms = rec.platforms.includes(platform)
    ? rec.platforms
    : [...rec.platforms, platform];
  persist({
    ...cache,
    tech: {
      ...cache.tech,
      [id]: { seen: true, correct: rec.correct + 1, platforms },
    },
  });
}

export function recordGenuine(trusted: boolean) {
  persist({
    ...cache,
    genuineSeen: cache.genuineSeen + 1,
    genuineTrusted: cache.genuineTrusted + (trusted ? 1 : 0),
  });
}

export function useProgress() {
  return useSyncExternalStore(
    subscribe,
    () => cache,
    () => EMPTY
  );
}
