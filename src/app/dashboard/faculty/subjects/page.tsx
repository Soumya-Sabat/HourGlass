"use client";

import { useEffect, useState } from "react";
import { BookOpenText, Search } from "lucide-react";
import { getFacultySubjects, type FacultySubject } from "@/actions/faculty-actions";

export default function FacultySubjectsPage() {
  const [subjects, setSubjects] = useState<FacultySubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getFacultySubjects().then(setSubjects).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading subjects...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <BookOpenText className="h-5 w-5 text-[var(--accent)]" /> My Subjects
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Subjects assigned to you</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search subjects..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 pl-9 text-xs font-bold" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <div className="col-span-full border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-6 text-center text-sm font-bold text-gray-500">
            {search ? "No subjects match your search." : "No subjects assigned yet."}
          </div>
        )}
        {filtered.map((s) => (
          <div key={s.id} className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
            <h3 className="text-sm font-black">{s.name}</h3>
            <p className="text-[10px] font-bold text-gray-600 mt-0.5">{s.code}</p>
            {s.batch && <p className="text-[10px] font-bold mt-1">Batch: {s.batch}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
