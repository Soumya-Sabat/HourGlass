"use client";

import { useEffect, useState } from "react";
import { Calendar, Filter, GraduationCap, Loader, User } from "lucide-react";
import { getStudentTimetable, type TimetableDay } from "@/actions/student-academic-actions";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const COLORS = ["#e28774", "#eae3cb", "#1a1a14", "#f4ebd0", "#d4cbb3"];

export default function TimetablePage() {
  const [days, setDays] = useState<TimetableDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDay, setFilterDay] = useState<number | null>(null);
  const [filterTeacher, setFilterTeacher] = useState<string>("");

  useEffect(() => {
    getStudentTimetable()
      .then(setDays)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const allTeachers = [...new Set(days.flatMap((d) => d.entries.map((e) => e.facultyName).filter(Boolean)))];

  const filteredDays = days
    .map((day) => ({
      ...day,
      entries: day.entries.filter((e) => {
        if (filterDay !== null && day.dayIndex !== filterDay) return false;
        if (filterTeacher && e.facultyName !== filterTeacher) return false;
        return true;
      }),
    }))
    .filter((d) => d.entries.length > 0);

  const today = new Date().getDay();

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading timetable...</div>;
  if (error) return <div className="border-2 border-[var(--border-primary)] bg-[var(--accent)] p-4 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <GraduationCap className="h-5 w-5" /> MY TIMETABLE
        </h1>
      </div>

      <div className="flex flex-wrap gap-3 border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-4 shadow-[4px_4px_0px_0px_var(--border-primary)]">
        <div className="flex items-center gap-2 text-xs font-black uppercase">
          <Filter className="h-4 w-4" />
          <span>Day:</span>
          <select value={filterDay ?? ""} onChange={(e) => setFilterDay(e.target.value ? Number(e.target.value) : null)} className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] px-2 py-1 text-xs font-black uppercase">
            <option value="">All</option>
            {DAYS.map((d, i) => (<option key={d} value={i}>{d}</option>))}
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs font-black uppercase">
          <User className="h-4 w-4" />
          <span>Teacher:</span>
          <select value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)} className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] px-2 py-1 text-xs font-black uppercase">
            <option value="">All</option>
            {allTeachers.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <span className="text-[10px] font-bold text-gray-600 self-center ml-auto">
          {filteredDays.reduce((a, d) => a + d.entries.length, 0)} entries
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDays.map((day) => (
          <div key={day.dayIndex} className={`border-2 border-[var(--border-primary)] shadow-[4px_4px_0px_0px_var(--border-primary)] ${day.dayIndex === today ? "bg-[var(--accent)]/10 ring-2 ring-[var(--accent)]" : "bg-[var(--bg-secondary)]"}`}>
            <div className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] p-2 text-[var(--light-text)] text-xs font-black uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {day.dayLabel} {day.dayIndex === today && "(Today)"}
            </div>
            <div className="p-3 space-y-2 bg-[var(--surface-white)]">
              {day.entries.map((e) => (
                <div key={e.id} className="border-2 border-[var(--border-primary)] p-2 bg-[var(--bg-primary)]/50">
                  <div className="text-xs font-black">{e.subjectName}</div>
                  <div className="text-[10px] font-bold text-gray-700">{e.startTime} - {e.endTime}</div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-600 mt-1">
                    <span>{e.facultyName}</span>
                    <span>{e.room} • {e.type.toUpperCase()}</span>
                  </div>
                </div>
              ))}
              {day.entries.length === 0 && <div className="text-[10px] font-black text-gray-500 text-center py-4">No classes</div>}
            </div>
          </div>
        ))}
      </div>

      {filteredDays.length === 0 && (
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8 text-center text-xs font-black shadow-[4px_4px_0px_0px_var(--border-primary)]">
          No timetable entries match your filters.
        </div>
      )}
    </div>
  );
}
