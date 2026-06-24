"use client";

import { useEffect, useState } from "react";
import { ScrollText, CheckCircle2, XCircle, AlertCircle, Loader, BarChart3 } from "lucide-react";
import { getStudentAttendance, type AttendanceSummary } from "@/actions/student-academic-actions";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudentAttendance()
      .then(setAttendance)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const overall = attendance.reduce((acc, s) => ({
    present: acc.present + s.present,
    absent: acc.absent + s.absent,
    total: acc.total + s.total,
  }), { present: 0, absent: 0, total: 0 });
  const overallPct = overall.total > 0 ? Math.round((overall.present / overall.total) * 100) : 0;
  const critical = attendance.filter((s) => s.percentage < 75);

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading attendance...</div>;
  if (error) return <div className="border-2 border-[var(--border-primary)] bg-[var(--accent)] p-4 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <ScrollText className="h-5 w-5" /> ATTENDANCE
        </h1>
      </div>

      {/* Overall KPI */}
      <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-4 shadow-[4px_4px_0px_0px_var(--border-primary)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase text-gray-600">Overall Attendance</div>
            <div className="text-3xl font-black">{overallPct}%</div>
            <div className="text-[10px] font-bold text-gray-600">{overall.present} present / {overall.total} total</div>
          </div>
          <div className={`p-3 border-2 border-[var(--border-primary)] ${overallPct >= 75 ? "bg-green-200" : "bg-[var(--accent)]"}`}>
            <BarChart3 className="h-8 w-8" />
          </div>
        </div>
        {critical.length > 0 && (
          <div className="mt-3 border-t border-[var(--border-primary)] pt-3 text-[10px] font-black text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 animate-pulse" />
            {critical.length} subject{critical.length > 1 ? "s" : ""} below 75% threshold
          </div>
        )}
      </div>

      {/* Subject-wise */}
      <div className="space-y-3">
        {attendance.map((item) => {
          const isLow = item.percentage < 75;
          return (
            <div key={item.subjectName} className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)]">
              <div className="p-3 bg-[var(--surface-white)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isLow ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-700" />
                    )}
                    <span className="text-xs font-black uppercase">{item.subjectName}</span>
                  </div>
                  <span className={`text-sm font-black ${isLow ? "text-red-600" : "text-green-700"}`}>
                    {item.percentage}%
                  </span>
                </div>

                <div className="w-full bg-[var(--bg-primary)] h-4 border border-[var(--border-primary)] rounded-none overflow-hidden">
                  <div
                    className={`h-full border-r border-[var(--border-primary)] transition-all duration-500 ${isLow ? "bg-[var(--accent)]" : "bg-[var(--dark-bg)]"}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-[9px] font-bold text-gray-600 mt-1">
                  <span>Present: {item.present}</span>
                  <span>Absent: {item.absent}</span>
                  <span>Total: {item.total}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {attendance.length === 0 && (
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8 text-center text-xs font-black shadow-[4px_4px_0px_0px_var(--border-primary)]">
          No attendance records found.
        </div>
      )}
    </div>
  );
}
