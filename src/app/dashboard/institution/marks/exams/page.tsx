"use client";

import { useEffect, useState } from "react";
import { BookMarked, Plus, Trash2, Save, Loader, X } from "lucide-react";
import { getExamBlueprints, createExamBlueprint, deleteExamBlueprint, getInstitutionSubjects, type ExamBlueprint, type SubjectInfo } from "@/actions/institution-actions";

type ExamField = { name: string; totalMarks: number; order: number };

export default function ExamSetupPage() {
  const [blueprints, setBlueprints] = useState<ExamBlueprint[]>([]);
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    subjectId: "",
    semester: 1,
    department: "",
    academicYear: "2026-27",
    exams: [] as ExamField[],
  });

  useEffect(() => {
    Promise.all([getExamBlueprints(), getInstitutionSubjects()])
      .then(([bps, subs]) => { setBlueprints(bps); setSubjects(subs); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addExamField = () => {
    setForm({ ...form, exams: [...form.exams, { name: "", totalMarks: 100, order: form.exams.length + 1 }] });
  };

  const updateExamField = (index: number, field: Partial<ExamField>) => {
    const updated = form.exams.map((e, i) => i === index ? { ...e, ...field } : e);
    setForm({ ...form, exams: updated });
  };

  const removeExamField = (index: number) => {
    setForm({ ...form, exams: form.exams.filter((_, i) => i !== index).map((e, i) => ({ ...e, order: i + 1 })) });
  };

  const handleCreate = async () => {
    if (!form.subjectId || form.exams.length === 0) return;
    setSaving(true);
    try {
      const subject = subjects.find((s) => s.id === form.subjectId);
      await createExamBlueprint({
        subjectId: form.subjectId,
        subjectName: subject?.name || "",
        semester: form.semester,
        department: form.department || subject?.department || "",
        academicYear: form.academicYear,
        exams: form.exams,
      });
      const updated = await getExamBlueprints();
      setBlueprints(updated);
      setShowForm(false);
      setForm({ subjectId: "", semester: 1, department: "", academicYear: "2026-27", exams: [] });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExamBlueprint(id);
      setBlueprints(blueprints.filter((b) => b.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]"><Loader className="h-4 w-4 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-[var(--accent)]" /> Exam Setup
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Define exam columns per subject and semester</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 border-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] px-3 py-2 text-xs font-black uppercase hover:bg-[var(--bg-primary)]">
          {showForm ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          {showForm ? "Cancel" : "New Blueprint"}
        </button>
      </div>

      {showForm && (
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase block mb-1">Subject</label>
              <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold">
                <option value="">Select subject...</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} (Sem {s.semester})</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase block mb-1">Semester</label>
              <input type="number" value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black uppercase">Exam Columns</label>
              <button onClick={addExamField} className="text-[10px] font-black uppercase text-[var(--accent)] hover:underline">
                + Add Exam
              </button>
            </div>
            {form.exams.length === 0 && <p className="text-xs font-bold text-gray-500">No exams defined yet. Click &quot;Add Exam&quot; to create columns.</p>}
            {form.exams.map((exam, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black w-6">#{exam.order}</span>
                <input placeholder="Exam name (e.g. Midterm 1)" value={exam.name} onChange={(e) => updateExamField(i, { name: e.target.value })}
                  className="flex-1 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold" />
                <input type="number" placeholder="Max marks" value={exam.totalMarks} onChange={(e) => updateExamField(i, { totalMarks: Number(e.target.value) })}
                  className="w-24 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold" />
                <button onClick={() => removeExamField(i)} className="p-1.5 border border-[var(--border-primary)] bg-red-200 hover:bg-red-300">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleCreate} disabled={saving || !form.subjectId || form.exams.length === 0}
            className="flex items-center gap-2 border-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] px-4 py-2 text-xs font-black uppercase hover:bg-[var(--bg-primary)] disabled:opacity-50">
            {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Creating..." : "Create Blueprint"}
          </button>
        </div>
      )}

      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] text-[10px] uppercase">
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Sem</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">Exam Columns</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blueprints.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center font-black">No exam blueprints created yet.</td></tr>
            ) : blueprints.map((bp) => (
              <tr key={bp.id} className="border-b border-[var(--border-primary)]">
                <td className="p-3 font-black">{bp.subjectName}</td>
                <td className="p-3">{bp.semester}</td>
                <td className="p-3 text-[10px]">{bp.academicYear}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {bp.exams.map((e) => (
                      <span key={e.name} className="px-2 py-0.5 bg-[var(--dark-bg)] text-[var(--light-text)] text-[9px] font-black uppercase">
                        {e.name} ({e.totalMarks})
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${bp.isActive ? "bg-green-200 text-green-900" : "bg-gray-200 text-gray-600"}`}>
                    {bp.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(bp.id)} className="p-1.5 border border-[var(--border-primary)] bg-red-200 hover:bg-red-300">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
