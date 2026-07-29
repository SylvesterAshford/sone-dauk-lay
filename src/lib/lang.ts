"use client";

import { useSyncExternalStore } from "react";

// App-wide language: Burmese is the default (PRODUCT.md, design §11). The user
// can switch the whole app to English. Persisted locally, guest-first, no
// account — same model as progress.ts.
//
// Note on §11: the design system says "Burmese first, Latin gloss second". A
// one-language-at-a-time toggle is a deliberate product choice on top of that —
// the DEFAULT stays Burmese-first; English is opt-in. Where a Latin gloss still
// adds value under a chosen language (e.g. the six technique names people must
// learn to say), a screen may still show both regardless of `lang`.

export type Lang = "mm" | "en";
const KEY = "sdl.lang.v1";

let cache: Lang = "mm";
let hydrated = false;
const listeners = new Set<() => void>();

function read(): Lang {
  if (typeof window === "undefined") return "mm";
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === "en" || raw === "mm") return raw;
  } catch {
    // ignore malformed / unavailable storage
  }
  return "mm";
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    cache = read();
    hydrated = true;
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setLang(next: Lang) {
  cache = next;
  hydrated = true;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // ignore write failures (private mode)
  }
  listeners.forEach((l) => l());
}

// Reactive read. SSR + first client render both return "mm" (the default),
// so hydration is stable; the stored value is picked up on subscribe.
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, () => cache, () => "mm");
}

// Convenience: pick the string for the current language. `en` may be omitted
// for strings that are intentionally identical in both (rare).
export function pick<T>(lang: Lang, mm: T, en: T): T {
  return lang === "mm" ? mm : en;
}
