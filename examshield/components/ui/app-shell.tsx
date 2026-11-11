"use client";

import Link from "next/link";
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Exams", href: "/exams", icon: FileText },
  { label: "Seating Plans", href: "/seating", icon: ClipboardList },
  { label: "Schedule", href: "/schedule", icon: BookOpen },
  { label: "Halls", href: "/halls", icon: Building2 },
  { label: "Students", href: "/students", icon: Users },
  { label: "Reports", href: "/reports", icon: BriefcaseBusiness },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppShell({
  title,
  subtitle,
  active,
  children,
}: {
  title: string;
  subtitle?: string;
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-[#0c1832] p-5 text-slate-100 lg:flex">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/40">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">ExamShield</p>
              <p className="text-xs text-slate-300">Campus control center</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
                    isActive
                      ? "bg-white/10 text-white shadow-inner shadow-slate-500/20"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-blue-400/20 bg-blue-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Status</p>
            <p className="mt-2 text-lg font-semibold text-white">Healthy</p>
            <p className="mt-1 text-sm text-slate-300">All exam halls synchronized</p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Administration</p>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
                  <Search className="h-4 w-4" />
                  <span>Search students, halls, reports</span>
                </div>
                <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none">
                  <option>Mid Sem Examination</option>
                  <option>End Sem Examination</option>
                  <option>Practical Assessment</option>
                </select>
                <button className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:bg-slate-100">
                  <Bell className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-semibold text-white">
                    AD
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-slate-800">Admin Desk</p>
                    <p className="text-xs text-slate-500">Exam control</p>
                  </div>
                </div>
              </div>
            </div>

            {subtitle ? (
              <div className="mt-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-sky-200">
                {subtitle}
              </div>
            ) : null}
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
