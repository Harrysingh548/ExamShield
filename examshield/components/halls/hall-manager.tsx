"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const defaultHall = {
  name: "",
  rows: 5,
  columns: 10,
  aisleColumns: "5",
  blockedSeats: "A3, C7, E9",
  department: "CSE",
};

export function HallManager({
  halls,
  onAdd,
  onRemove,
}: {
  halls: Array<{ id: string; name: string; rows: number; columns: number; aisleColumns: number[]; blockedSeats: string[]; capacity: number; department: string }>;
  onAdd: (input: typeof defaultHall) => void;
  onRemove: (id: string) => void;
}) {
  const [form, setForm] = useState(defaultHall);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    onAdd(form);
    setForm(defaultHall);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Hall configuration</p>
            <h3 className="text-xl font-semibold text-slate-900">Add examination hall</h3>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            Hall name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
              placeholder="Main Hall A"
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
            Rows
            <input
              type="number"
              min={3}
              max={8}
              value={form.rows}
              onChange={(e) => setForm({ ...form, rows: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
            />
          </label>
          <label className="text-sm text-slate-600">
            Columns
            <input
              type="number"
              min={6}
              max={12}
              value={form.columns}
              onChange={(e) => setForm({ ...form, columns: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
            />
          </label>
          <label className="text-sm text-slate-600 md:col-span-2">
            Aisle positions (comma separated columns)
            <input
              value={form.aisleColumns}
              onChange={(e) => setForm({ ...form, aisleColumns: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
              placeholder="5"
            />
          </label>
          <label className="text-sm text-slate-600 md:col-span-2">
            Blocked seats (comma separated, e.g. A3, C7)
            <input
              value={form.blockedSeats}
              onChange={(e) => setForm({ ...form, blockedSeats: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-blue-400"
              placeholder="A3, C7"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-500">
            Add hall
          </button>
        </div>
      </form>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">Hall inventory</h3>
        <div className="mt-4 space-y-3">
          {halls.map((hall) => (
            <div key={hall.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
              <div>
                <p className="font-medium text-slate-800">{hall.name}</p>
                <p className="text-xs text-slate-500">{hall.rows} x {hall.columns} • {hall.capacity} seats</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(hall.id)}
                className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                aria-label={`Remove ${hall.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
