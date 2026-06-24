"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { getFacultyTimetable, type FacultyTimetableEntry } from "@/actions/faculty-actions";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function FacultyTimetablePage() {
  const [entries, setEntries] = useState<FacultyTimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyTimetable().then(setEntries).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading timetable...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[var(--accent)]" /> Teaching Schedule
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Your weekly class timetable</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.length === 0 && (
          <div className="col-span-full border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-6 text-center text-sm font-bold text-gray-500">
            No classes scheduled.
          </div>
        )}
        {DAYS.map((day, idx) => {
          const dayEntries = entries.filter((e) => e.dayOfWeek === idx);
          if (dayEntries.length === 0) return null;
          return (
            <div key={idx} className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)]">
              <div className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] p-2 text-[var(--light-text)] text-xs font-black uppercase">{day}</div>
              <div className="p-2 space-y-2">
                {dayEntries.map((e) => (
                  <div key={e.id} className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-[10px] font-bold">
                    <span className="font-black">{e.subject}</span>
                    <br />{e.startTime}-{e.endTime}
                    <br />{e.batch}{e.room ? ` · ${e.room}` : ""}
                    <br /><span className="uppercase text-[9px]">{e.type}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
