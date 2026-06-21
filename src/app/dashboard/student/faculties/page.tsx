"use client";

import { useEffect, useState } from "react";
import { UsersRound, Mail, Clock, BookOpenText, Loader, MessageSquare } from "lucide-react";
import { getStudentFaculties, type FacultyInfo } from "@/actions/student-academic-actions";

export default function FacultiesPage() {
  const [faculties, setFaculties] = useState<FacultyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getStudentFaculties()
      .then(setFaculties)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = faculties.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-4 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading faculties...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-4 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <UsersRound className="h-5 w-5" /> FACULTIES
        </h1>
      </div>

      <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#1a1a14]">
        <input
          type="text"
          placeholder="Search by name or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-black bg-[#f4ebd0] px-3 py-2 text-xs font-black uppercase outline-none focus:bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((fac) => (
          <div key={fac.id || fac.name} className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] flex flex-col">
            <div className="border-b-2 border-black bg-[#1a1a14] p-3 text-[#f4ebd0] text-xs font-black uppercase flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-[#e28774]" />
              {fac.name}
            </div>
            <div className="p-3 bg-white flex-1 space-y-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/70 flex items-center gap-1">
                  <BookOpenText className="h-3 w-3" /> Subjects
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {fac.subjects.map((s) => (
                    <span key={s} className="border border-black bg-[#f4ebd0] px-2 py-0.5 text-[10px] font-bold">{s}</span>
                  ))}
                  {fac.subjects.length === 0 && <span className="text-[10px] text-gray-400 italic">No subjects assigned</span>}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/70 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Class Times
                </div>
                <div className="mt-1 max-h-24 overflow-y-auto space-y-0.5">
                  {fac.classTimes.map((t, i) => (
                    <div key={i} className="text-[10px] font-bold text-gray-700">{t}</div>
                  ))}
                  {fac.classTimes.length === 0 && <span className="text-[10px] text-gray-400 italic">No scheduled times</span>}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-black">
                {fac.email && (
                  <a href={`mailto:${fac.email}`}
                    className="flex items-center gap-1 border-2 border-black bg-[#f4ebd0] px-2 py-1 text-[10px] font-black uppercase hover:bg-[#eae3cb]">
                    <Mail className="h-3 w-3" /> Email
                  </a>
                )}
                <a href="/dashboard/student/messages"
                  className="flex items-center gap-1 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-2 py-1 text-[10px] font-black uppercase hover:bg-[#2a2a24]">
                  <MessageSquare className="h-3 w-3" /> Message
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="border-2 border-black bg-[#eae3cb] p-8 text-center text-xs font-black shadow-[4px_4px_0px_0px_#1a1a14]">
          No faculties found. {search ? "Try a different search." : ""}
        </div>
      )}
    </div>
  );
}
