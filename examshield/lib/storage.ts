"use client";

import type { AppState } from "@/types";
import { generateMockState } from "@/lib/mock-data";

const STORAGE_KEY = "examshield-state-v1";

export function loadAppState(): AppState {
  if (typeof window === "undefined") {
    return generateMockState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateMockState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw) as AppState;
    return parsed;
  } catch {
    const initial = generateMockState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function saveAppState(state: AppState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function resetToDemoData() {
  const state = generateMockState();
  saveAppState(state);
  return state;
}
