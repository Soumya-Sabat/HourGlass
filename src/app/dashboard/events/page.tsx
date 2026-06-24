"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { getPublicEvents, type DepartmentEvent } from "@/actions/department-actions";

const eventTypeColors: Record<string, string> = {
  academic: "bg-blue-200",
  cultural: "bg-purple-200",
  sports: "bg-green-200",
  meeting: "bg-amber-200",
  holiday: "bg-red-200",
  general: "bg-gray-200",
};

export default function PublicEventsPage() {
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicEvents()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading events...</div>;
  if (error) return <div className="border-2 border-[var(--border-primary)] bg-[var(--accent)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[var(--accent)]" /> Events
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Upcoming institution events</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {events.length === 0 && (
          <div className="col-span-full border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-6 text-center text-sm font-bold text-gray-500">
            No upcoming events.
          </div>
        )}
        {events.map((e) => (
          <div key={e.id} className={`${eventTypeColors[e.eventType] || "bg-gray-200"} border-2 border-[var(--border-primary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-white/60 border border-[var(--border-primary)]">{e.eventType}</span>
                  <span className="text-[10px] font-bold text-gray-600">{e.eventDate}</span>
                </div>
                <h3 className="text-sm font-black mt-1 break-words">{e.title}</h3>
                {e.description && <p className="text-xs font-bold mt-1 text-gray-700 break-words">{e.description}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
