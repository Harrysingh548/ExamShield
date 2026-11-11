"use client";

import { useEffect, useState } from "react";
import { HallManager } from "@/components/halls/hall-manager";
import { AppShell } from "@/components/ui/app-shell";
import { loadAppState, saveAppState } from "@/lib/storage";
import type { AppState, Hall } from "@/types";

export default function HallsPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  if (!state) return <div className="p-8">Loading…</div>;

  const handleAddHall = (input: {
    name: string;
    rows: number;
    columns: number;
    aisleColumns: string;
    blockedSeats: string;
    department: string;
  }) => {
    const hall: Hall = {
      id: `hall-${Date.now()}`,
      name: input.name,
      rows: input.rows,
      columns: input.columns,
      aisleColumns: input.aisleColumns
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => !Number.isNaN(value)),
      blockedSeats: input.blockedSeats
        .split(",")
        .map((value) => value.trim().toUpperCase())
        .filter(Boolean),
      capacity: input.rows * input.columns - Math.max(1, input.aisleColumns.split(",").length) * input.rows,
      department: input.department as Hall["department"],
    };

    const updated = { ...state, halls: [...state.halls, hall] };
    setState(updated);
    saveAppState(updated);
  };

  const handleRemoveHall = (id: string) => {
    const updated = { ...state, halls: state.halls.filter((hall) => hall.id !== id) };
    setState(updated);
    saveAppState(updated);
  };

  return (
    <AppShell active="/halls" title="Hall Management" subtitle="Configure capacity, aisles, blocked seats, and occupancy rules.">
      <HallManager halls={state.halls} onAdd={handleAddHall} onRemove={handleRemoveHall} />
    </AppShell>
  );
}
