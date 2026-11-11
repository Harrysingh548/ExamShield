"use client";

import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { hall: "Hall A", percentage: 82 },
  { hall: "Hall B", percentage: 72 },
  { hall: "Hall C", percentage: 90 },
  { hall: "Hall D", percentage: 65 },
  { hall: "Hall E", percentage: 76 },
];

export function HallUtilizationChart() {
  return (
    <div className="h-72 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Hall utilization</p>
          <h3 className="text-xl font-semibold text-slate-900">Seat occupancy</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="86%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="hall" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} unit="%" />
          <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
          <Bar dataKey="percentage" radius={[8, 8, 0, 0]} fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
