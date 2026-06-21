"use client";

import { useEffect, useState } from "react";
import { BookOpenText, Download, Loader, FileText } from "lucide-react";
import { getStudentSubjects, type SubjectInfo } from "@/actions/student-academic-actions";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null);

  useEffect(() => {
    getStudentSubjects()
      .then(setSubjects)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const semesters = [...new Set(subjects.map((s) => s.semester))].sort();
  const filtered = semesterFilter ? subjects.filter((s) => s.semester === semesterFilter) : subjects;

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-4 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading subjects...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-4 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <BookOpenText className="h-5 w-5" /> SUBJECTS
        </h1>
      </div>

      <div className="flex flex-wrap gap-3 border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#1a1a14]">
        <span className="text-xs font-black uppercase self-center">Filter Semester:</span>
        {semesters.map((sem) => (
          <button key={sem} onClick={() => setSemesterFilter(semesterFilter === sem ? null : sem)}
            className={`px-3 py-1 text-xs font-black uppercase border-2 border-black ${semesterFilter === sem ? "bg-[#1a1a14] text-[#f4ebd0]" : "bg-[#f4ebd0] hover:bg-[#eae3cb]"}`}>
            Sem {sem}
          </button>
        ))}
        {semesters.length === 0 && <span className="text-xs font-bold text-gray-500">No semesters assigned</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((subj) => (
          <div key={subj.id} className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] flex flex-col">
            <div className="border-b-2 border-black bg-[#1a1a14] p-2 text-[#f4ebd0] text-xs font-black uppercase flex items-center justify-between">
              <span>{subj.code}</span>
              <span className="text-[9px] bg-[#e28774] text-[#1a1a14] px-1">Sem {subj.semester}</span>
            </div>
            <div className="p-3 bg-white flex-1 space-y-2">
              <div className="text-sm font-black">{subj.name}</div>
              <div className="text-[10px] font-bold text-gray-600">Credits: {subj.credits}</div>

              {subj.syllabus && (
                <div className="border-2 border-black bg-[#f4ebd0] p-2 text-[10px] font-bold">
                  <FileText className="h-3 w-3 inline mr-1" />
                  {subj.syllabus.length > 120 ? subj.syllabus.slice(0, 120) + "..." : subj.syllabus}
                </div>
              )}

              {subj.syllabusFile && (
                <a href={subj.syllabusFile} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-3 py-2 text-xs font-black uppercase hover:bg-[#2a2a24] mt-2">
                  <Download className="h-4 w-4" /> Download Syllabus
                </a>
              )}

              {!subj.syllabus && !subj.syllabusFile && (
                <div className="text-[10px] font-bold text-gray-400 italic">No syllabus uploaded yet.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="border-2 border-black bg-[#eae3cb] p-8 text-center text-xs font-black shadow-[4px_4px_0px_0px_#1a1a14]">
          No subjects found.
        </div>
      )}
    </div>
  );
}
