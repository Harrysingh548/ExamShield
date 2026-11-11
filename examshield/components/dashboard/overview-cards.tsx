import { ArrowUpRight, BookOpen, Building2, ClipboardCheck, Users } from "lucide-react";

const cards = [
  { title: "Total Students", value: "120", delta: "+6%", icon: Users, tone: "blue" },
  { title: "Exam Halls", value: "5", delta: "+1", icon: Building2, tone: "indigo" },
  { title: "Assigned Seats", value: "96%", delta: "+8%", icon: ClipboardCheck, tone: "emerald" },
  { title: "Conflicts", value: "3", delta: "-2", icon: BookOpen, tone: "amber" },
];

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, delta, icon: Icon, tone }) => (
        <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">{title}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-${tone}-100 text-${tone}-600`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight className="h-4 w-4" />
            <span>{delta}</span>
            <span className="text-slate-400">vs last cycle</span>
          </div>
        </div>
      ))}
    </div>
  );
}
