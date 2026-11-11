"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { ExamForm } from "@/components/exams/exam-form";
import { loadAppState, saveAppState } from "@/lib/storage";
import type { AppState, Exam } from "@/types";

export default function ExamsPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  if (!state) return <div className="p-8">Loading…</div>;

  const handleCreateExam = (input: {
    name: string;
    subject: string;
    date: string;
    duration: number;
    studentCount: number;
    department: string;
    semester: number;
    rollStart: number;
    hallCount: number;
  }) => {
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      name: input.name,
      subject: input.subject,
      date: input.date,
      duration: input.duration,
      studentCount: input.studentCount,
      department: input.department as Exam["department"],
      semester: input.semester,
      hallIds: state.halls.slice(0, input.hallCount).map((hall) => hall.id),
      rollStart: input.rollStart,
    };

    const updated = { ...state, exams: [newExam, ...state.exams], currentExamId: newExam.id };
    setState(updated);
    saveAppState(updated);
  };

  return (
    <AppShell active="/exams" title="Examination Setup" subtitle="Configure upcoming exams across departments and halls.">
      <div className="space-y-6">
        <ExamForm onCreate={handleCreateExam} />

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Scheduled examinations</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {state.exams.map((exam) => (
              <div key={exam.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-800">{exam.name}</p>
                    <p className="text-sm text-slate-500">{exam.subject}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {exam.department}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Date: {exam.date}</p>
                  <p>Hall count: {exam.hallIds.length}</p>
                  <p>Students: {exam.studentCount}</p>
                  <p>Duration: {exam.duration} mins</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
