"use client";

import { useEffect, useState } from "react";
import { ScrollText, Search } from "lucide-react";

type Notice = { id: string; title: string; content: string; priority: string; tags: string; createdAt: string };

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/institution/notices");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setNotices(data.notices || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = notices.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading notices...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-[var(--accent)]" /> Notices
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Official notices and alerts</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search notices..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 pl-9 text-xs font-bold" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-6 text-center text-xs font-black">No notices found.</div>
        ) : filtered.map((n) => (
          <div key={n.id} className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
            <div className="flex items-start gap-3">
              <div className={`p-1.5 ${n.priority === "high" ? "bg-red-200" : n.priority === "medium" ? "bg-yellow-200" : "bg-green-200"} border border-[var(--border-primary)]`}>
                <ScrollText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase">{n.title}</h3>
                <p className="text-xs font-bold mt-1">{n.content}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-gray-500">
                  <span>{n.createdAt}</span>
                  {n.tags && <span>Tags: {n.tags}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
