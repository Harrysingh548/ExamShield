"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { ReportPanel } from "@/components/reports/report-panel";
import { loadAppState } from "@/lib/storage";
import type { AppState } from "@/types";

export default function ReportsPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  const hallPlan = useMemo(() => {
    if (!state) return [];
    return state.halls.map((hall) => ({
      Hall: hall.name,
      Capacity: hall.capacity,
      Occupancy: Math.min(100, Math.round((state.students.filter((student) => student.hallId === hall.id).length / hall.capacity) * 100)),
    }));
  }, [state]);

  const studentAllocations = useMemo(() => {
    if (!state) return [];
    return state.students.slice(0, 12).map((student) => ({
      Student: student.name,
      Roll: student.rollNumber,
      Subject: student.subject,
      Hall: state.halls.find((hall) => hall.id === student.hallId)?.name || "Unassigned",
      Seat: student.seatId || "—",
    }));
  }, [state]);

  const subjectAllocations = useMemo(() => {
    if (!state) return [];
    const groups: Record<string, number> = {};
    state.students.forEach((student) => {
      groups[student.subject] = (groups[student.subject] || 0) + 1;
    });
    return Object.entries(groups).map(([subject, count]) => ({ Subject: subject, Students: count }));
  }, [state]);

  const capacityUtilization = useMemo(() => {
    if (!state) return [];
    return state.halls.map((hall) => ({
      Hall: hall.name,
      Utilization: `${Math.min(100, Math.round((state.students.filter((student) => student.hallId === hall.id).length / hall.capacity) * 100))}%`,
    }));
  }, [state]);

  const conflictReport = useMemo(() => {
    if (!state) return [];
    return state.conflicts.length
      ? state.conflicts.map((conflict) => ({
          Type: conflict.type,
          Message: conflict.message,
        }))
      : [{ Type: "none", Message: "No seating conflicts detected." }];
  }, [state]);

  const handlePrint = () => window.print();

  const handleExport = () => {
    if (!state) return;
    const csvRows = [
      ["Student", "Roll", "Subject", "Hall", "Seat"],
      ...state.students.map((student) => [student.name, student.rollNumber, student.subject, state.halls.find((hall) => hall.id === student.hallId)?.name || "Unassigned", student.seatId || "—"]),
    ];
    const csv = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "examshield-allocation.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!state) return <div className="p-8">Loading…</div>;

  return (
    <AppShell active="/reports" title="Reports" subtitle="Export, print, and audit all hall and subject allocation reports.">
      <div className="space-y-6">
        <ReportPanel title="Hall-wise seating plan" rows={hallPlan} onPrint={handlePrint} onExport={handleExport} />
        <ReportPanel title="Student-wise seat allocation" rows={studentAllocations} onPrint={handlePrint} onExport={handleExport} />
        <ReportPanel title="Subject-wise allocation" rows={subjectAllocations} onPrint={handlePrint} onExport={handleExport} />
        <ReportPanel title="Hall capacity utilization" rows={capacityUtilization} onPrint={handlePrint} onExport={handleExport} />
        <ReportPanel title="Conflict report" rows={conflictReport} onPrint={handlePrint} onExport={handleExport} />
      </div>
    </AppShell>
  );
}
