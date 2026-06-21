"use client";

import { useEffect, useState } from "react";
import { Download, Loader, Award, BookOpen } from "lucide-react";
import { getStudentMarksheet, type MarksheetData } from "@/actions/student-academic-actions";

export default function MarksheetPage() {
  const [data, setData] = useState<MarksheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudentMarksheet()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-4 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading marksheet...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-4 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5" /> MARKSHEET
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Academic performance across all examinations</p>
        </div>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase hover:bg-[#2a2a24]">
          <Download className="h-4 w-4" /> Print
        </button>
      </div>

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-black">
          <thead>
            <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0]">
              <th className="p-3 text-left uppercase tracking-wider border-r border-[#f4ebd0]/20">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#e28774]" />
                  Subject
                </div>
              </th>
              {data.examNames.map((exam) => (
                <th key={exam} className="p-3 text-center uppercase tracking-wider border-r border-[#f4ebd0]/20">
                  {exam}
                </th>
              ))}
              <th className="p-3 text-center uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => {
              const totalObtained = row.marks.reduce((s, m) => s + m.obtained, 0);
              const totalPossible = row.marks.reduce((s, m) => s + m.total, 0);
              const pct = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;

              return (
                <tr key={row.subjectName} className={`border-b border-black ${idx % 2 === 0 ? "bg-white" : "bg-[#f4ebd0]/30"}`}>
                  <td className="p-3 font-black border-r border-black">{row.subjectName}</td>
                  {row.marks.map((m, mi) => (
                    <td key={mi} className="p-3 text-center border-r border-black">
                      <span className={m.obtained === 0 ? "text-gray-400" : ""}>
                        {m.obtained}/{m.total}
                      </span>
                    </td>
                  ))}
                  <td className="p-3 text-center font-black">
                    <span className={pct < 40 ? "text-red-600" : pct < 60 ? "text-orange-600" : "text-green-700"}>
                      {totalObtained}/{totalPossible} ({pct}%)
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {data.rows.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-black bg-[#eae3cb]">
                <td className="p-3 font-black uppercase">Grand Total</td>
                {data.examNames.map((exam, ei) => {
                  const colTotal = data.rows.reduce((s, r) => s + (r.marks[ei]?.obtained || 0), 0);
                  const colMax = data.rows.reduce((s, r) => s + (r.marks[ei]?.total || 0), 0);
                  return (
                    <td key={exam} className="p-3 text-center border-r border-black font-black">
                      {colTotal}/{colMax}
                    </td>
                  );
                })}
                <td className="p-3 text-center font-black">
                  {(() => {
                    const gt = data.rows.reduce((s, r) => s + r.marks.reduce((a, m) => a + m.obtained, 0), 0);
                    const gm = data.rows.reduce((s, r) => s + r.marks.reduce((a, m) => a + m.total, 0), 0);
                    const gp = gm > 0 ? Math.round((gt / gm) * 100) : 0;
                    return `${gt}/${gm} (${gp}%)`;
                  })()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>

        {data.rows.length === 0 && (
          <div className="p-8 text-center text-xs font-black">No marksheet data available.</div>
        )}
      </div>
    </div>
  );
}
