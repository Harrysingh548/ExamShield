"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { loadAppState } from "@/lib/storage";
import type { AppState } from "@/types";

export default function StudentsPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setState(loadAppState());
  }, []);

  const results = useMemo(() => {
    if (!state) return [];
    const value = query.trim().toLowerCase();
    if (!value) return state.students.slice(0, 20);

    return state.students.filter((student) => {
      const hallName = state.halls.find((hall) => hall.id === student.hallId)?.name || "";
      return [
        student.rollNumber,
        student.name,
        student.subject,
        hallName,
      ].some((field) => field.toLowerCase().includes(value));
    });
  }, [query, state]);

  if (!state) return <div className="p-8">Loading…</div>;

  return (
    <AppShell active="/students" title="Student Search" subtitle="Search assignments by roll number, student name, subject, or hall.">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by roll, name, subject, or hall"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Hall</th>
                <th className="px-4 py-3">Seat</th>
              </tr>
            </thead>
            <tbody>
              {results.map((student) => {
                const hallName = state.halls.find((hall) => hall.id === student.hallId)?.name || "Unassigned";
                return (
                  <tr key={student.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">{student.rollNumber}</td>
                    <td className="px-4 py-3">{student.subject}</td>
                    <td className="px-4 py-3">{hallName}</td>
                    <td className="px-4 py-3">{student.seatId || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
