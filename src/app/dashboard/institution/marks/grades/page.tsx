"use client";

import { useEffect, useState } from "react";
import { BarChart3, Loader, BookOpen } from "lucide-react";
import { getGradebook } from "@/actions/institution-actions";

type GradebookEntry = {
  subjectId: string;
  subjectName: string;
  semester: number;
  department: string;
  academicYear: string;
  exams: string[];
  studentCount: number;
  avgMarks: Array<{ examName: string; average: number; totalMarks: number }>;
};

export default function GradebookPage() {
  const [data, setData] = useState<GradebookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getGradebook();
        setData(result);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]"><Loader className="h-4 w-4 animate-spin" /> Loading gradebook...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#e28774]" /> Gradebook
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Aggregate marks and performance data</p>
      </div>

      {data.length === 0 ? (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-8 text-center text-xs font-black">
          No gradebook data available. Create exam blueprints and enter marks first.
        </div>
      ) : data.map((entry) => (
        <div key={entry.subjectId} className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
          <div className="border-b-2 border-black p-3 bg-[#1a1a14] text-[#f4ebd0] flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#e28774]" /> {entry.subjectName}
            </h2>
            <span className="text-[10px] text-gray-400">Sem {entry.semester} | {entry.academicYear} | {entry.studentCount} students</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {entry.avgMarks.map((avg) => {
                const pct = avg.totalMarks > 0 ? Math.round((avg.average / avg.totalMarks) * 100) : 0;
                return (
                  <div key={avg.examName} className="border border-black bg-[#f4ebd0] p-3">
                    <div className="text-[10px] font-black uppercase mb-1">{avg.examName}</div>
                    <div className="text-lg font-black">{avg.average.toFixed(1)}</div>
                    <div className="text-[10px] font-bold text-gray-600">out of {avg.totalMarks} ({pct}%)</div>
                    <div className="mt-2 h-2 bg-[#eae3cb] border border-black">
                      <div className="h-full bg-[#e28774] transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
