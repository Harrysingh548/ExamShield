const activities = [
  { title: "Mid Sem exam scheduled", detail: "CS-201 • 120 students • Hall A + B", time: "2h ago" },
  { title: "Seating plan generated", detail: "4 conflicts auto-resolved", time: "5h ago" },
  { title: "Hall D updated", detail: "Aisles adjusted and blocked seats changed", time: "Yesterday" },
  { title: "Report exported", detail: "Department summary CSV downloaded", time: "2 days ago" },
];

export function RecentActivity() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Recent activity</p>
          <h3 className="text-xl font-semibold text-slate-900">Operations log</h3>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.title} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-800">{activity.title}</p>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{activity.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
