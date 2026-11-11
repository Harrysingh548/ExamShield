"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";

const defaultValues = {
  name: "",
  subject: "Data Structures",
  date: "2026-11-15",
  duration: 90,
  studentCount: 60,
  department: "CSE",
  semester: 5,
  rollStart: 21001,
  hallCount: 2,
};

export function ExamForm({ onCreate }: { onCreate: (input: typeof defaultValues) => void }) {
  const [form, setForm] = useState(defaultValues);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    onCreate(form);
    setForm(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <PlusCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Create new</p>
          <h3 className="text-xl font-semibold text-slate-900">Examination setup</h3>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm text-slate-600">
          Examination name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none ring-0 transition focus:border-blue-400"
            placeholder="Mid Semester" 
          />
        </label>
        <label className="text-sm text-slate-600">
          Subject
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
          >
            {[
              "Data Structures",
              "Operating Systems",
              "DBMS",
              "Computer Networks",
              "Microprocessors",
              "Machine Learning",
            ].map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-600">
          Exam date
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
          />
        </label>
        <label className="text-sm text-slate-600">
          Duration (minutes)
          <input
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
          />
        </label>
        <label className="text-sm text-slate-600">
          Student count
          <input
            type="number"
            value={form.studentCount}
            onChange={(e) => setForm({ ...form, studentCount: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
          />
        </label>
        <label className="text-sm text-slate-600">
          Roll start
          <input
            type="number"
            value={form.rollStart}
            onChange={(e) => setForm({ ...form, rollStart: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
          />
        </label>
        <label className="text-sm text-slate-600">
          Department
          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
          >
            {['CSE', 'ECE', 'ME', 'EEE', 'MBA', 'Civil', 'IT'].map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-600">
          Semester
          <input
            type="number"
            min={1}
            max={8}
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
          />
        </label>
        <label className="text-sm text-slate-600">
          Number of halls
          <input
            type="number"
            min={1}
            max={5}
            value={form.hallCount}
            onChange={(e) => setForm({ ...form, hallCount: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
          />
        </label>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
        >
          Save examination
        </button>
      </div>
    </form>
  );
}
