"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { buildSeatLayout } from "@/lib/algorithms/seating";
import { loadAppState, saveAppState } from "@/lib/storage";
import { AppShell } from "@/components/ui/app-shell";
import { SeatGrid } from "@/components/seating/seat-grid";
import type { AppState, Conflict, Seat } from "@/types";

export default function SeatingPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [selectedHallId, setSelectedHallId] = useState<string>("");
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [currentSeatMap, setCurrentSeatMap] = useState<Seat[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  useEffect(() => {
    const initial = loadAppState();
    setState(initial);
    setSelectedHallId(initial.activeHallId || initial.halls[0]?.id || "");
  }, []);

  useEffect(() => {
    if (!state) return;
    const hall = state.halls.find((item) => item.id === selectedHallId) || state.halls[0];
    if (!hall) return;

    const generated = buildSeatLayout(hall, state.allocationRules, state.students);
    const seatMap: Seat[] = generated.seatMap.map((seat) => ({
      ...seat,
      status: (seat.blocked ? "blocked" : seat.occupant ? "assigned" : "available") as Seat["status"],
    }));
    setCurrentSeatMap(seatMap);
    setConflicts(generated.conflicts);
  }, [state, selectedHallId]);

  const activeHall = useMemo(
    () => state?.halls.find((hall) => hall.id === selectedHallId) || state?.halls[0],
    [state, selectedHallId],
  );

  const selectedSeat = currentSeatMap.find((seat) => seat.id === selectedSeatId) || null;

  const handleGenerate = () => {
    if (!state || !activeHall) return;
    const generated = buildSeatLayout(activeHall, state.allocationRules, state.students);
    const updatedStudents = state.students.map((student) => {
      const seat = generated.seatMap.find((item) => item.occupant?.id === student.id);
      return {
        ...student,
        hallId: seat ? activeHall.id : student.hallId,
        seatId: seat ? seat.label : student.seatId,
      };
    });
    const updatedState = { ...state, students: updatedStudents, activeHallId: activeHall.id, conflicts: generated.conflicts };
    setState(updatedState);
    saveAppState(updatedState);
    setCurrentSeatMap(generated.seatMap);
    setConflicts(generated.conflicts);
  };

  const handleMoveStudent = (studentId: string, seatId: string) => {
    if (!state) return;
    const targetSeat = currentSeatMap.find((seat) => seat.id === seatId);
    if (!targetSeat) return;

    const updatedStudents = state.students.map((student) => {
      if (student.id !== studentId) return student;
      return { ...student, hallId: activeHall?.id, seatId: targetSeat.label };
    });

    const updatedSeatMap: Seat[] = currentSeatMap.map((seat) => {
      if (seat.id === seatId) {
        const currentStudent = state.students.find((student) => student.id === studentId);
        return { ...seat, occupant: currentStudent ?? null, status: (currentStudent ? "assigned" : seat.status) as Seat["status"] };
      }
      return seat;
    });

    const updatedState = { ...state, students: updatedStudents };
    setState(updatedState);
    setCurrentSeatMap(updatedSeatMap);
    saveAppState(updatedState);
  };

  if (!state || !activeHall) return <div className="p-8">Loading…</div>;

  return (
    <AppShell active="/seating" title="Seating Arrangement" subtitle="Generate optimized placements while protecting aisle clearance and subject adjacency rules.">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3">
                {state.halls.map((hall) => (
                  <button
                    key={hall.id}
                    type="button"
                    onClick={() => setSelectedHallId(hall.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      selectedHallId === hall.id
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {hall.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-600/20"
              >
                Generate seating
              </button>
            </div>
          </div>

          <SeatGrid
            hall={activeHall}
            seats={currentSeatMap}
            selectedSeatId={selectedSeatId ?? undefined}
            onSeatClick={(seatId) => setSelectedSeatId(seatId)}
            onMoveStudent={handleMoveStudent}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Allocation rules</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                ["preventAdjacentSameSubject", "Avoid adjacent same-subject students"],
                ["preventAdjacentSameDepartment", "Avoid adjacent same-department students"],
                ["alternateSeatAllocation", "Use alternate seat allocation"],
                ["respectAislePositions", "Respect aisle restrictions"],
                ["avoidBlockedSeats", "Skip blocked seats"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean((state.allocationRules as Record<string, boolean>)[key])}
                    onChange={(event) => {
                      const nextRules = { ...state.allocationRules, [key]: event.target.checked };
                      const updated = { ...state, allocationRules: nextRules };
                      setState(updated);
                      saveAppState(updated);
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Seat status</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {[
                { name: "Assigned", color: "bg-emerald-500" },
                { name: "Available", color: "bg-slate-100" },
                { name: "Blocked", color: "bg-slate-300" },
                { name: "Conflict", color: "bg-amber-400" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className={`inline-block h-4 w-4 rounded ${item.color}`} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Conflict detection</h3>
            <div className="mt-4 space-y-3">
              {conflicts.length === 0 ? (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  No seating conflicts detected.
                </div>
              ) : (
                conflicts.map((conflict) => (
                  <button
                    key={conflict.id}
                    type="button"
                    onClick={() => setSelectedSeatId(conflict.seatIds[0] ?? null)}
                    className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-3 text-left text-sm text-amber-800"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{conflict.type}</span>
                    </div>
                    <p className="mt-2">{conflict.message}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {selectedSeat ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Seat details</h3>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Seat: {selectedSeat.label}</p>
                <p>Status: {selectedSeat.status}</p>
                <p>Occupant: {selectedSeat.occupant ? selectedSeat.occupant.name : "Available"}</p>
                <p>Roll: {selectedSeat.occupant ? selectedSeat.occupant.rollNumber : "—"}</p>
                <p>Subject: {selectedSeat.occupant ? selectedSeat.occupant.subject : "—"}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
