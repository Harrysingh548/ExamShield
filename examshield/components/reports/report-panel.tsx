"use client";

import { Download, Printer } from "lucide-react";

export function ReportPanel({
  title,
  rows,
  onPrint,
  onExport,
}: {
  title: string;
  rows: Array<Record<string, string | number>>;
  onPrint: () => void;
  onExport: () => void;
}) {
  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm text-white"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-slate-200">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${title}-${index}`} className="border-t border-slate-200">
                {columns.map((column) => (
                  <td key={`${title}-${column}-${index}`} className="px-4 py-3">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
