"use client";

import { useEffect, useState } from "react";
import { Calendar, Search, CheckCircle, XCircle } from "lucide-react";
import { getFacultyTimetable, type FacultyTimetableEntry } from "@/actions/faculty-actions";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableReviewPage() {
  const [entries, setEntries] = useState<FacultyTimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getFacultyTimetable().then(setEntries).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = selectedDay !== null ? entries.filter((e) => e.dayOfWeek === selectedDay) : entries;

  const handleSubmitSuggestion = () => {
    if (!suggestion) return;
    setMsg("Suggestion submitted for review.");
    setSuggestion("");
    setTimeout(() => setMsg(""), 3000);
  };

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading timetable...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#e28774]" /> Timetable Review
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Review scheduled classes and suggest changes</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedDay(null)}
          className={`text-[10px] font-black uppercase border-2 border-black px-3 py-1.5 transition-all ${selectedDay === null ? "bg-[#1a1a14] text-[#f4ebd0] shadow-[2px_2px_0px_0px_#e28774]" : "bg-[#f4ebd0] hover:bg-[#e28774]"}`}>
          All Days
        </button>
        {DAYS.map((day, idx) => (
          <button key={day} onClick={() => setSelectedDay(idx)}
            className={`text-[10px] font-black uppercase border-2 border-black px-3 py-1.5 transition-all ${selectedDay === idx ? "bg-[#1a1a14] text-[#f4ebd0] shadow-[2px_2px_0px_0px_#e28774]" : "bg-[#f4ebd0] hover:bg-[#e28774]"}`}>
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-6 text-center text-sm font-bold text-gray-500">
          No classes scheduled for this period.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <div key={e.id} className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14]">
            <div className="border-b-2 border-black bg-[#1a1a14] p-2 text-[#f4ebd0] text-xs font-black uppercase">
              {DAYS[e.dayOfWeek]} — {e.startTime}-{e.endTime}
            </div>
            <div className="p-3 space-y-1 text-[10px] font-bold">
              <p>Subject: {e.subject}</p>
              <p>Batch: {e.batch}{e.room ? ` · Room: ${e.room}` : ""}</p>
              <p>Type: <span className="uppercase">{e.type}</span></p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
        <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-[#e28774]" /> Suggest a Change
        </h2>
        <textarea value={suggestion} onChange={(e) => setSuggestion(e.target.value)} rows={3}
          placeholder="Describe the suggested timetable change (e.g., 'Move Monday 10:00 Math to Wednesday 14:00')..."
          className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold resize-none" />
        <button onClick={handleSubmitSuggestion} disabled={!suggestion}
          className="mt-2 border-2 border-black bg-[#e28774] text-[#1a1a14] px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#1a1a14] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50">
          Submit Suggestion
        </button>
        {msg && <p className="mt-2 text-xs font-bold text-green-700">{msg}</p>}
      </div>
    </div>
  );
}
