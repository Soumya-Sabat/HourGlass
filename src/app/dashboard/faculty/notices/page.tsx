"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getFacultyNotices, type FacultyNotice } from "@/actions/faculty-actions";

export default function FacultyNoticesPage() {
  const [notices, setNotices] = useState<FacultyNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getFacultyNotices().then(setNotices).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading notices...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#e28774]" /> Notices
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Department announcements</p>
      </div>

      {notices.length === 0 && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-6 text-center text-sm font-bold text-gray-500">
          No notices yet.
        </div>
      )}

      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n.id}
            className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] cursor-pointer"
            onClick={() => setExpanded(expanded === n.id ? null : n.id)}
          >
            <div className="border-b-2 border-black bg-[#1a1a14] p-2 text-[#f4ebd0] text-xs font-black uppercase flex justify-between items-center">
              <span>{n.title}</span>
              <span className="text-[9px] text-gray-400">{n.date}</span>
            </div>
            <div className="p-3 text-xs font-bold">
              {expanded === n.id ? n.content : n.content.length > 120 ? n.content.slice(0, 120) + "..." : n.content}
              {n.issuer && <p className="text-[9px] text-gray-500 mt-2">Issued by: {n.issuer}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
