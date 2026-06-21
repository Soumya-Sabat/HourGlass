"use client";

import { useEffect, useState } from "react";
import { BellRing, AlertTriangle, Info, AlertCircle, Loader, User, Calendar } from "lucide-react";
import { getStudentNotices, type NoticeInfo } from "@/actions/student-academic-actions";

const PRIORITY_ICONS: Record<string, typeof AlertCircle> = {
  urgent: AlertTriangle,
  high: AlertCircle,
  normal: Info,
  low: Info,
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-red-200 border-red-600 text-red-900",
  high: "bg-orange-200 border-orange-600 text-orange-900",
  normal: "bg-white",
  low: "bg-gray-100",
};

export default function AlertsPage() {
  const [notices, setNotices] = useState<NoticeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>("");

  useEffect(() => {
    getStudentNotices()
      .then(setNotices)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterPriority ? notices.filter((n) => n.priority === filterPriority) : notices;

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-4 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading alerts...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-4 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <BellRing className="h-5 w-5" /> NOTICES / ALERTS
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#1a1a14]">
        <span className="text-xs font-black uppercase self-center">Priority:</span>
        {["", "urgent", "high", "normal", "low"].map((p) => (
          <button key={p} onClick={() => setFilterPriority(filterPriority === p ? "" : p)}
            className={`px-3 py-1 text-[10px] font-black uppercase border-2 border-black ${filterPriority === p ? "bg-[#1a1a14] text-[#f4ebd0]" : "bg-[#f4ebd0] hover:bg-[#eae3cb]"}`}>
            {p || "All"}
          </button>
        ))}
        <span className="text-[10px] font-bold text-gray-500 self-center ml-auto">{filtered.length} notices</span>
      </div>

      <div className="space-y-3">
        {filtered.map((notice) => {
          const PriorityIcon = PRIORITY_ICONS[notice.priority] || Info;
          const colorClass = PRIORITY_COLORS[notice.priority] || PRIORITY_COLORS.normal;

          return (
            <div key={notice.id} className={`border-2 border-black shadow-[3px_3px_0px_0px_#1a1a14] ${colorClass}`}>
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <PriorityIcon className={`h-4 w-4 ${notice.priority === "urgent" || notice.priority === "high" ? "animate-pulse" : ""}`} />
                    <span className="text-xs font-black uppercase">{notice.title}</span>
                  </div>
                  {notice.priority !== "normal" && (
                    <span className="text-[8px] font-black px-1 bg-[#1a1a14] text-[#f4ebd0] shrink-0 uppercase">{notice.priority}</span>
                  )}
                </div>

                <p className="text-[11px] text-gray-700 whitespace-pre-wrap">{notice.content}</p>

                <div className="flex flex-wrap gap-3 text-[9px] font-bold text-gray-600 pt-1 border-t border-gray-300">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {notice.issuerName} ({notice.issuerRole})</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {notice.createdAt}</span>
                  {notice.tags.map((t) => (
                    <span key={t} className="border border-black bg-[#f4ebd0] px-1">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="border-2 border-black bg-[#eae3cb] p-8 text-center text-xs font-black shadow-[4px_4px_0px_0px_#1a1a14]">
          No alerts or notices.
        </div>
      )}
    </div>
  );
}
