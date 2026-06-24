"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, MessageSquare } from "lucide-react";
import { getMyClusters, type FacultyCluster } from "@/actions/faculty-actions";

export default function FacultyClustersPage() {
  const [clusters, setClusters] = useState<FacultyCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getMyClusters()
      .then((data) => {
        setClusters(data);
        if (data.length === 0) setError("No clusters found.");
        else setError(null);
      })
      .catch((e) => setError(e?.message || "Failed to load clusters."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      {error && (
        <div className="border-2 border-black bg-[#e28774] p-3 text-xs font-bold shadow-[3px_3px_0px_0px_#1a1a14]">
          {error}
        </div>
      )}
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#e28774]" /> My Clusters
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Teaching groups you belong to</p>
      </div>

      {!error && clusters.length === 0 && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-6 text-center text-sm font-bold text-gray-500">
          You are not part of any cluster yet.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {clusters.map((c) => (
          <div key={c.id}
            className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14]">
            <div className="border-b-2 border-black bg-[#1a1a14] p-2 text-[#f4ebd0] text-xs font-black uppercase">
              {c.name}
            </div>
            <div className="p-3 space-y-2">
              <div className="text-[10px] font-bold text-gray-600">
                Subject: {c.subjectName || "N/A"}
                <br />Lead: {c.leadName}
                <br />Members: {c.memberCount}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  className="text-[9px] font-black uppercase border border-black px-2 py-1 bg-white hover:bg-[#e28774] transition-colors">
                  {expanded === c.id ? "Hide Members" : "Show Members"}
                </button>
                <Link href={`/dashboard/faculty/clusters/${c.id}`}
                  className="text-[9px] font-black uppercase border border-black px-2 py-1 bg-white hover:bg-[#e28774] transition-colors flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Chat
                </Link>
              </div>
              {expanded === c.id && (
                <div className="border border-black bg-white p-2 space-y-1">
                  {c.members.map((m) => (
                    <div key={m.userId} className="text-[10px] font-bold">{m.name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
