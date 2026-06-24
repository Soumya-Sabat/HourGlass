"use client";

import { useEffect, useState } from "react";
import { Calendar, Plus, Trash2, TimerOff } from "lucide-react";
import { getDepartmentEvents, createDepartmentEvent, deleteDepartmentEvent, type DepartmentEvent } from "@/actions/department-actions";

const eventTypeColors: Record<string, string> = {
  academic: "bg-blue-200",
  cultural: "bg-purple-200",
  sports: "bg-green-200",
  meeting: "bg-amber-200",
  holiday: "bg-red-200",
  general: "bg-gray-200",
};

export default function EventsPage() {
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTermination, setNewTermination] = useState("");
  const [newType, setNewType] = useState("general");
  const [saving, setSaving] = useState(false);

  const load = () => getDepartmentEvents().then(setEvents).catch((err) => setError(err.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createDepartmentEvent({
        title: newTitle,
        description: newDesc,
        eventDate: newDate,
        terminationDate: newTermination || undefined,
        eventType: newType,
      });
      setShowAdd(false);
      setNewTitle(""); setNewDesc(""); setNewDate(""); setNewTermination(""); setNewType("general");
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartmentEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading events...</div>;
  if (error) return <div className="border-2 border-[var(--border-primary)] bg-[var(--accent)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[var(--accent)]" /> Events & Alerts
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Manage department events and send notifications</p>
      </div>

      <button onClick={() => setShowAdd(true)}
        className="flex items-center gap-1.5 border-2 border-[var(--border-primary)] bg-[var(--accent)] px-4 py-2 text-xs font-black text-white hover:bg-[var(--accent)]">
        <Plus className="h-3.5 w-3.5" /> Add Event
      </button>

      <div className="grid gap-3 sm:grid-cols-2">
        {events.length === 0 && (
          <div className="col-span-full border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-6 text-center text-sm font-bold text-gray-500">
            No events scheduled.
          </div>
        )}
        {events.map((e) => (
          <div key={e.id} className={`${eventTypeColors[e.eventType] || "bg-gray-200"} border-2 border-[var(--border-primary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-white/60 border border-[var(--border-primary)]">{e.eventType}</span>
                  <span className="text-[10px] font-bold text-gray-600">{e.eventDate}</span>
                  {e.terminationDate && (
                    <span className="text-[9px] font-bold text-red-600 flex items-center gap-0.5">
                      <TimerOff className="h-3 w-3" /> Expires {e.terminationDate}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-black mt-1 break-words">{e.title}</h3>
                {e.description && <p className="text-xs font-bold mt-1 text-gray-700 break-words">{e.description}</p>}
                <p className="text-[9px] font-bold text-gray-500 mt-1">{e.createdAt}</p>
              </div>
              <div className="flex gap-1 shrink-0 ml-2">
                  <button onClick={() => handleDelete(e.id)} className="p-1.5 border border-[var(--border-primary)] bg-red-200 hover:bg-red-300" title="Delete">
                    <Trash2 className="h-3 w-3" />
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-[6px_6px_0px_0px_var(--border-primary)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-black uppercase mb-4">New Event</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Event Title</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" placeholder="Annual Day" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Description</label>
                <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" placeholder="Event description..." />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Event Date</label>
                <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Auto-Termination Date <span className="text-gray-500">(optional — event auto-deletes after this)</span></label>
                <input type="date" value={newTermination} onChange={(e) => setNewTermination(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" />
                {!newTermination && <p className="text-[9px] font-bold text-gray-500 mt-0.5">If not set, admins can delete manually.</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold">
                  <option value="academic">Academic</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="meeting">Meeting</option>
                  <option value="holiday">Holiday</option>
                  <option value="general">General</option>
                </select>
              </div>
              {error && <p className="text-xs font-bold text-red-600">{error}</p>}
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowAdd(false)} disabled={saving} className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] px-4 py-1.5 text-xs font-black hover:bg-[var(--bg-secondary)] disabled:opacity-40">Cancel</button>
                <button type="submit" disabled={saving} className="border-2 border-[var(--border-primary)] bg-[var(--accent)] px-4 py-1.5 text-xs font-black text-white hover:bg-[var(--accent)] disabled:opacity-40">{saving ? "Adding..." : "Add Event"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
