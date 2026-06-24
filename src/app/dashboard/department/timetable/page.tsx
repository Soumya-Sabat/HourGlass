"use client";

import { useEffect, useState } from "react";
import { Calendar, BookOpen, Clock } from "lucide-react";
import { getDepartmentSubjects, type DepartmentUser } from "@/actions/department-actions";

export default function TimetablePage() {
  const [subjects, setSubjects] = useState<Awaited<ReturnType<typeof import("@/actions/department-actions").getDepartmentSubjects>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/actions/department-actions").then((m) =>
      m.getDepartmentSubjects().then(setSubjects).catch(() => {}).finally(() => setLoading(false))
    );
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading timetable...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#e28774]" /> Department Timetable
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Subject schedule & faculty assignments</p>
      </div>

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] text-[10px] uppercase">
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Faculty</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr><td colSpan={3} className="p-6 text-center font-black">No subjects assigned yet.</td></tr>
            ) : subjects.map((s) => (
              <tr key={s.id} className="border-b border-black">
                <td className="p-3 font-black flex items-center gap-2">
                  <BookOpen className="h-3 w-3 text-[#e28774]" /> {s.name}
                </td>
                <td className="p-3">{s.code || "—"}</td>
                <td className="p-3">{s.faculty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
