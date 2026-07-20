"use client";

import { useSyncExternalStore } from "react";

// Academy progress is intentionally client-side only (per PRD it does not persist
// server-side). We keep it in localStorage — shared between the Desk badge and the
// Academy page — and expose it through an external store so React stays in sync
// without effects.
const KEY = "sdl-lessons";
const EMPTY: boolean[] = [false, false, false, false, false, false];

let cache: boolean[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function parse(raw: string | null): boolean[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 6) return parsed.map(Boolean);
  } catch {
    // ignore malformed storage
  }
  return EMPTY;
}

function equal(a: boolean[], b: boolean[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function emit() {
  listeners.forEach((l) => l());
}

function hydrate() {
  if (typeof window === "undefined") return;
  const next = parse(localStorage.getItem(KEY));
  if (!hydrated || !equal(next, cache)) {
    cache = next;
    hydrated = true;
  }
}

function subscribe(cb: () => void) {
  if (listeners.size === 0) {
    hydrate();
    window.addEventListener("storage", onStorage);
  }
  listeners.add(cb);
  // Reflect any value hydrated on first subscribe.
  cb();
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function onStorage(e: StorageEvent) {
  if (e.key === KEY) {
    hydrate();
    emit();
  }
}

function write(next: boolean[]) {
  cache = next;
  hydrated = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore write failures (private mode, etc.)
  }
  emit();
}

export function useAcademy() {
  const lessons = useSyncExternalStore(
    subscribe,
    () => cache,
    () => EMPTY
  );

  const toggle = (i: number) =>
    write(lessons.map((v, j) => (j === i ? !v : v)));
  const reset = () => write([...EMPTY]);
  const doneCount = lessons.filter(Boolean).length;

  return { lessons, doneCount, toggle, reset };
}
