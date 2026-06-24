"use client";

import { useEffect, useState } from "react";
import { Activity, Search } from "lucide-react";
import { getActivityLog, type ActivityEntry } from "@/actions/institution-actions";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getActivityLog()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading activity log...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Activity className="h-5 w-5 text-[var(--accent)]" /> Activity Log
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Track actions performed within the institution</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search activity..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 pl-9 text-xs font-bold" />
      </div>

      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] text-[10px] uppercase">
              <th className="p-3 text-left">Timestamp</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={3} className="p-6 text-center font-black">No activity logs found.</td></tr>
            ) : filtered.map((l) => (
              <tr key={l.id} className="border-b border-[var(--border-primary)]">
                <td className="p-3 text-[10px]">{l.timestamp}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-[var(--dark-bg)] text-[var(--light-text)] text-[10px] font-black uppercase">{l.action}</span>
                </td>
                <td className="p-3 max-w-[300px] truncate">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
