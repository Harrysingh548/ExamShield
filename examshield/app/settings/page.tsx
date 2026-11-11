"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { loadAppState, resetToDemoData, saveAppState } from "@/lib/storage";
import type { AppState } from "@/types";

export default function SettingsPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  if (!state) return <div className="p-8">Loading…</div>;

  const handleToggle = (key: keyof AppState["allocationRules"]) => {
    const nextRules = { ...state.allocationRules, [key]: !state.allocationRules[key] };
    const updated = { ...state, allocationRules: nextRules };
    setState(updated);
    saveAppState(updated);
  };

  const handleReset = () => {
    const demo = resetToDemoData();
    setState(demo);
  };

  return (
    <AppShell active="/settings" title="Settings" subtitle="Tune system preferences and restore demo data.">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Seating safeguards</h3>
          <div className="mt-5 space-y-3">
            {Object.entries(state.allocationRules).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                <span>{key}</span>
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={() => handleToggle(key as keyof AppState["allocationRules"])}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">System actions</h3>
          <div className="mt-5 space-y-4">
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500"
            >
              Reset demo data
            </button>
            <button
              type="button"
              onClick={() => saveAppState(state)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Save current settings
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
