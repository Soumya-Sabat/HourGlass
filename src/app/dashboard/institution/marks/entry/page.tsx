"use client";

import { useEffect, useState } from "react";
import { PenLine, Save, Loader, Search } from "lucide-react";
import { getExamBlueprints, getMarksForExam, saveMarksEntry, getInstitutionSubjects, type ExamBlueprint, type SubjectInfo, type MarksEntryRow } from "@/actions/institution-actions";

export default function GradeEntryPage() {
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [blueprints, setBlueprints] = useState<ExamBlueprint[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [rows, setRows] = useState<MarksEntryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    Promise.all([getInstitutionSubjects(), getExamBlueprints()])
      .then(([subs, bps]) => { setSubjects(subs); setBlueprints(bps); })
      .catch(console.error)
      .finally(() => setInitialLoading(false));
  }, []);

  const bp = blueprints.find((b) => b.subjectId === selectedSubject);
  const exams = bp?.exams || [];

  const loadMarks = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    try {
      const data = await getMarksForExam(selectedSubject);
      setRows(data.rows);
      if (data.blueprint && !selectedExam && data.blueprint.exams.length > 0) {
        setSelectedExam(data.blueprint.exams[0].name);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (selectedSubject) loadMarks(); }, [selectedSubject]);

  const updateMark = (studentId: string, examName: string, value: string, total: number) => {
    setRows(rows.map((r) => {
      if (r.studentId !== studentId) return r;
      const obtained = Math.min(Math.max(Number(value) || 0, 0), total);
      return { ...r, marks: { ...r.marks, [examName]: { obtained, total } } };
    }));
  };

  const handleSaveAll = async () => {
    if (!selectedSubject || !selectedExam) return;
    setSaving(true);
    try {
      for (const row of rows) {
        const mark = row.marks[selectedExam];
        if (mark) {
          await saveMarksEntry({
            subjectId: selectedSubject,
            examName: selectedExam,
            studentId: row.studentId,
            marksObtained: mark.obtained,
            totalMarks: mark.total,
          });
        }
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (initialLoading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]"><Loader className="h-4 w-4 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <PenLine className="h-5 w-5 text-[var(--accent)]" /> Grade Entry
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Fill marks for students per exam column</p>
        </div>
        <button onClick={handleSaveAll} disabled={saving || !selectedSubject || !selectedExam}
          className="flex items-center gap-2 border-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] px-4 py-2 text-xs font-black uppercase hover:bg-[var(--bg-primary)] disabled:opacity-50">
          {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : `Save ${selectedExam}`}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-black uppercase block mb-1">Subject</label>
          <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedExam(""); }}
            className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold">
            <option value="">Select subject...</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} (Sem {s.semester})</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase block mb-1">Exam Column</label>
          <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold">
            <option value="">Select exam...</option>
            {exams.map((e) => <option key={e.name} value={e.name}>{e.name} ({e.totalMarks} marks)</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <div className="text-[10px] font-black text-gray-600 p-2">
            {rows.length > 0 ? `${rows.length} student(s)` : "No data"}
          </div>
        </div>
      </div>

      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] text-[10px] uppercase">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Student</th>
              {exams.map((e) => (
                <th key={e.name} className={`p-3 text-center ${selectedExam === e.name ? "bg-[var(--accent)] text-[var(--text-primary)]" : ""}`}>
                  {e.name}<br /><span className="text-[8px]">({e.totalMarks})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2 + exams.length} className="p-6 text-center"><Loader className="h-4 w-4 animate-spin mx-auto" /></td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={2 + exams.length} className="p-6 text-center font-black">Select a subject to load students.</td></tr>
            ) : rows.map((row, idx) => (
              <tr key={row.studentId} className="border-b border-[var(--border-primary)]">
                <td className="p-3 text-[10px]">{idx + 1}</td>
                <td className="p-3 font-black">{row.studentName}</td>
                {exams.map((e) => {
                  const mark = row.marks[e.name];
                  return (
                    <td key={e.name} className={`p-2 text-center ${selectedExam === e.name ? "bg-[var(--bg-primary)]" : ""}`}>
                      <input
                        type="number"
                        min={0}
                        max={e.totalMarks}
                        value={mark?.obtained ?? 0}
                        onChange={(v) => updateMark(row.studentId, e.name, v.target.value, e.totalMarks)}
                        className={`w-20 border-2 border-[var(--border-primary)] p-1.5 text-center text-xs font-bold ${selectedExam === e.name ? "bg-[var(--surface-white)]" : "bg-[var(--bg-secondary)] opacity-60"}`}
                        disabled={selectedExam !== e.name}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
