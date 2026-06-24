"use client";

import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { getFacultyRoster, type RosterFaculty } from "@/actions/head-actions";

export default function HeadFacultyRosterPage() {
  const [faculty, setFaculty] = useState<RosterFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getFacultyRoster().then(setFaculty).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = faculty.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading roster...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Users className="h-5 w-5 text-[var(--accent)]" /> Faculty Roster
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Overview of all instructors in your department</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search faculty..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 pl-9 text-xs font-bold" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <div className="col-span-full border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-6 text-center text-sm font-bold text-gray-500">
            {search ? "No faculty match your search." : "No faculty in this department."}
          </div>
        )}
        {filtered.map((f) => (
          <div key={f.id} className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
            <h3 className="text-sm font-black">{f.name}</h3>
            <p className="text-[10px] font-bold text-gray-600 mt-0.5 capitalize">{f.role.replace("_", " ")}</p>
            {f.clusters.length > 0 && (
              <div className="mt-2">
                <p className="text-[9px] font-black uppercase text-gray-500">Clusters:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {f.clusters.map((c, i) => (
                    <span key={i} className="text-[9px] bg-[var(--dark-bg)] text-[var(--light-text)] px-1.5 py-0.5 font-bold">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {f.clusters.length === 0 && (
              <p className="text-[9px] text-gray-400 mt-2">Not assigned to any cluster</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
