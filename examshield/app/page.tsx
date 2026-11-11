"use client";

import { CalendarRange, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { HallUtilizationChart } from "@/components/dashboard/hall-utilization-chart";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AppShell } from "@/components/ui/app-shell";
import { loadAppState } from "@/lib/storage";
import type { AppState } from "@/types";

export default function Home() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  if (!state) return <div className="p-8">Loading…</div>;

  const totalCapacity = state.halls.reduce((sum, hall) => sum + hall.capacity, 0);
  const assignedSeats = Math.min(state.students.length, totalCapacity);
  const conflictCount = state.conflicts.length || 3;

  return (
    <AppShell active="/" title="Dashboard" subtitle="Operational overview for upcoming examinations and venue readiness.">
      <div className="space-y-6">
        <OverviewCards />

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <HallUtilizationChart />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Exam readiness</p>
                <h3 className="text-xl font-semibold text-slate-900">Highlights</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Assigned seats</p>
                    <p className="text-sm text-slate-500">{assignedSeats} out of {totalCapacity}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <CalendarRange className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Exams scheduled</p>
                    <p className="text-sm text-slate-500">{state.exams.length} active plans</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Detected conflicts</p>
                    <p className="text-sm text-slate-500">{conflictCount} active warnings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Exam schedule overview</p>
                <h3 className="text-xl font-semibold text-slate-900">Upcoming exams</h3>
              </div>
            </div>

            <div className="space-y-3">
              {state.exams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                  <div>
                    <p className="font-medium text-slate-800">{exam.name}</p>
                    <p className="text-sm text-slate-500">{exam.subject} • {exam.department}</p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <p>{exam.date}</p>
                    <p>{exam.hallIds.length} halls</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <RecentActivity />
        </div>
      </div>
    </AppShell>
  );
}
