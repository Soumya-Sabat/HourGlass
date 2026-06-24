"use client";

import { useEffect, useState } from "react";
import { ClipboardList, BookMarked, PenLine, BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";

export default function MarksMainPage() {
  const cards = [
    { label: "Subjects", desc: "Add and manage subjects offered by the institution", href: "/dashboard/institution/marks/subjects", icon: BookOpen, color: "bg-orange-700" },
    { label: "Exam Setup", desc: "Create exam blueprints and define columns per subject/semester", href: "/dashboard/institution/marks/exams", icon: BookMarked, color: "bg-purple-700" },
    { label: "Grade Entry", desc: "Faculty fills marks for each student per exam column", href: "/dashboard/institution/marks/entry", icon: PenLine, color: "bg-blue-700" },
    { label: "Gradebook", desc: "View aggregate marks, averages, and performance data", href: "/dashboard/institution/marks/grades", icon: BarChart3, color: "bg-green-700" },
  ];

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[var(--accent)]" /> Marks & Exams
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Manage exam structures, mark entry, and gradebook</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}
            className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--border-primary)] transition-all block">
            <div className={`p-2 ${card.color} text-white rounded-sm w-fit mb-3`}>
              <card.icon className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-black uppercase mb-1">{card.label}</h2>
            <p className="text-[10px] font-bold text-gray-600">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-5">
        <h2 className="text-sm font-black uppercase mb-2">How It Works</h2>
        <ol className="list-decimal list-inside space-y-2 text-xs font-bold">
          <li><span className="font-black">Admin creates exam columns</span> &mdash; Define which exams exist per subject/semester (e.g., Midterm 1, Midterm 2, Final) with max marks and order.</li>
          <li><span className="font-black">Faculty fills marks</span> &mdash; Teachers select a subject and enter marks for each student against each exam column.</li>
          <li><span className="font-black">Students view marks</span> &mdash; Students can see their marksheet with all exam columns and totals.</li>
        </ol>
      </div>
    </div>
  );
}
