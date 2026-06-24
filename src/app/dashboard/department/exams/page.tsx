"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { getDepartmentExams, getDepartmentSubjects, createDepartmentExam, deleteDepartmentExam, type DepartmentUser } from "@/actions/department-actions";

type Exam = Awaited<ReturnType<typeof getDepartmentExams>>[number];
type Subject = Awaited<ReturnType<typeof getDepartmentSubjects>>[number];

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newMaxMarks, setNewMaxMarks] = useState("100");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getDepartmentExams(), getDepartmentSubjects()])
      .then(([e, s]) => { setExams(e); setSubjects(s); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createDepartmentExam({ title: newTitle, subject: newSubject, examDate: newDate, startTime: newStart || undefined, endTime: newEnd || undefined, maxMarks: Number(newMaxMarks) || 100 });
      setShowAdd(false);
      setNewTitle(""); setNewSubject(""); setNewDate(""); setNewStart(""); setNewEnd(""); setNewMaxMarks("100");
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartmentExam(id);
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading exams...</div>;
  if (error) return <div className="border-2 border-[var(--border-primary)] bg-[var(--accent)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[var(--accent)]" /> Exam Schedules
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Manage exam timings and schedules</p>
      </div>

      <button onClick={() => setShowAdd(true)}
        className="flex items-center gap-1.5 border-2 border-[var(--border-primary)] bg-[var(--accent)] px-4 py-2 text-xs font-black text-white hover:bg-[var(--accent)]">
        <Plus className="h-3.5 w-3.5" /> Schedule Exam
      </button>

      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] text-[10px] uppercase">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center font-black">No exams scheduled.</td></tr>
            ) : exams.map((e) => (
              <tr key={e.id} className="border-b border-[var(--border-primary)]">
                <td className="p-3 font-black">{e.title}</td>
                <td className="p-3">{e.subject}</td>
                <td className="p-3">{e.date}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(e.id)} className="p-1.5 border border-[var(--border-primary)] bg-red-200 hover:bg-red-300" title="Delete">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-[6px_6px_0px_0px_var(--border-primary)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-black uppercase mb-4">Schedule Exam</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Exam Title</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" placeholder="Mid Term Exam" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Subject</label>
                <select required value={newSubject} onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold">
                  <option value="">Select subject...</option>
                  {subjects.map((s) => <option key={s.id} value={s.name}>{s.name} ({s.code})</option>)}
                </select>
                {subjects.length === 0 && <p className="text-[9px] font-bold text-red-600 mt-0.5">No subjects available. Contact institution admin.</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Date</label>
                <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Start Time</label>
                  <input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)}
                    className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">End Time</label>
                  <input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Max Marks</label>
                <input type="number" value={newMaxMarks} onChange={(e) => setNewMaxMarks(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" />
              </div>
              {error && <p className="text-xs font-bold text-red-600">{error}</p>}
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowAdd(false)} disabled={saving} className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] px-4 py-1.5 text-xs font-black hover:bg-[var(--bg-secondary)] disabled:opacity-40">Cancel</button>
                <button type="submit" disabled={saving} className="border-2 border-[var(--border-primary)] bg-[var(--accent)] px-4 py-1.5 text-xs font-black text-white hover:bg-[var(--accent)] disabled:opacity-40">{saving ? "Scheduling..." : "Schedule"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
