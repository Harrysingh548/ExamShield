"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { loadAppState } from "@/lib/storage";
import type { AppState } from "@/types";

export default function SchedulePage() {
  const [state, setState] = useState<AppState | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    setState(loadAppState());
  }, []);

  if (!state) return <div className="p-8">Loading…</div>;

  const exams = state.exams.filter((exam) => {
    const matchesDepartment = departmentFilter === "All" || exam.department === departmentFilter;
    const matchesSemester = semesterFilter === "All" || String(exam.semester) === semesterFilter;
    const matchesDate = !dateFilter || exam.date === dateFilter;
    return matchesDepartment && matchesSemester && matchesDate;
  });

  return (
    <AppShell active="/schedule" title="Examination Schedule" subtitle="Monitor exam timelines across dates, departments, and halls.">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option value="All">Department: All</option>
            {['CSE', 'ECE', 'ME', 'EEE', 'MBA', 'Civil', 'IT'].map((department) => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
          <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option value="All">Semester: All</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
              <option key={semester} value={String(semester)}>{semester}</option>
            ))}
          </select>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>

        <div className="space-y-3">
          {exams.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-slate-600">No exam schedule matches these filters.</div>
          ) : (
            exams.map((exam) => (
              <div key={exam.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-800">{exam.name}</p>
                  <p className="text-sm text-slate-500">{exam.subject} • {exam.department} • Sem {exam.semester}</p>
                </div>
                <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-4">
                  <span>Date: {exam.date}</span>
                  <span>Hall: {exam.hallIds.length}</span>
                  <span>Students: {exam.studentCount}</span>
                  <span>Duration: {exam.duration} mins</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
