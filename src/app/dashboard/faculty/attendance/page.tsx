"use client";

import { useEffect, useState, useCallback } from "react";
import { ClipboardCheck } from "lucide-react";
import { getAttendanceSubjects, getStudentsForAttendance, markAttendance, type AttendanceSubject, type StudentAttendance } from "@/actions/faculty-actions";

export default function FacultyAttendancePage() {
  const [subjects, setSubjects] = useState<AttendanceSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getAttendanceSubjects().then(setSubjects).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const loadStudents = useCallback(async () => {
    if (!selectedSubject) return;
    setLoaded(false);
    try {
      const list = await getStudentsForAttendance(selectedSubject);
      setStudents(list.map((s) => ({ ...s, status: "" })));
      setLoaded(true);
    } catch {
      setMsg("Failed to load students.");
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedSubject) {
      const sub = subjects.find((s) => s.id === selectedSubject);
      setSelectedSubjectName(sub?.name || "");
      loadStudents();
    } else {
      setStudents([]);
      setSelectedSubjectName("");
    }
  }, [selectedSubject, loadStudents, subjects]);

  const toggleStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, status: s.status === "present" ? "absent" : s.status === "absent" ? "leave" : "present" }
          : s
      )
    );
  };

  const handleSave = async () => {
    if (!selectedSubject || !date) return;
    const records = students.filter((s) => s.status).map((s) => ({ studentId: s.id, status: s.status as "present" | "absent" | "leave" }));
    if (records.length === 0) { setMsg("Mark at least one student."); return; }
    setSaving(true);
    try {
      await markAttendance({ subjectId: selectedSubject, subjectName: selectedSubjectName, date, records });
      setMsg("Attendance saved!");
      setStudents((prev) => prev.map((s) => ({ ...s, status: "" })));
    } catch {
      setMsg("Failed to save attendance.");
    }
    setSaving(false);
  };

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-[var(--accent)]" /> Mark Attendance
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Record student attendance for a class</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
          className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold min-w-[180px]">
          <option value="">Select subject</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold" />
      </div>

      {students.length > 0 && (
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)]">
          <div className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] p-2 text-[var(--light-text)] text-xs font-black uppercase flex justify-between">
            <span>Student</span>
            <span>Click to toggle: Present / Absent / Leave</span>
          </div>
          <div className="divide-y divide-black">
            {students.map((s) => (
              <div key={s.id}
                className={`flex justify-between items-center p-2 text-xs font-bold cursor-pointer ${
                  s.status === "present" ? "bg-green-200" : s.status === "absent" ? "bg-red-200" : s.status === "leave" ? "bg-yellow-200" : "bg-[var(--surface-white)]"
                }`}
                onClick={() => toggleStatus(s.id)}
              >
                <span>{s.name}</span>
                <span className="uppercase text-[9px]">{s.status || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {students.length > 0 && (
        <button onClick={handleSave} disabled={saving}
          className="border-2 border-[var(--border-primary)] bg-[var(--accent)] text-[var(--text-primary)] p-3 text-xs font-black uppercase shadow-[3px_3px_0px_0px_var(--border-primary)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50">
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      )}

      {msg && <p className="text-xs font-bold text-gray-600">{msg}</p>}
    </div>
  );
}
