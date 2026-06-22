"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Search, Loader } from "lucide-react";
import { getInstitutionSubjects, createSubject, deleteSubject, getDepartments, type SubjectInfo, type DepartmentInfo } from "@/actions/institution-actions";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSubjects = () => {
    getInstitutionSubjects()
      .then(setSubjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([getInstitutionSubjects(), getDepartments()])
      .then(([subs, depts]) => { setSubjects(subs); setDepartments(depts); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !code.trim()) { setError("Name and code are required."); return; }
    setSaving(true);
    try {
      await createSubject({
        name: name.trim(),
        code: code.trim(),
        credits: credits ? Number(credits) : undefined,
        semester: semester ? Number(semester) : undefined,
        department: department.trim() || undefined,
      });
      setName(""); setCode(""); setCredits(""); setSemester(""); setDepartment("");
      setShowForm(false);
      fetchSubjects();
    } catch (err: any) {
      setError(err?.message || "Failed to create subject.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id);
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]"><Loader className="h-4 w-4 animate-spin inline" /> Loading subjects...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#e28774]" /> Subjects
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Manage subjects offered by the institution</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-3 py-2 text-xs font-black uppercase hover:bg-[#2a2a24]">
          <Plus className="h-3 w-3" /> {showForm ? "Cancel" : "Add Subject"}
        </button>
      </div>

      {showForm && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 space-y-3">
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Subject Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" placeholder="Data Structures" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Subject Code *</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} required
                className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold uppercase" placeholder="CS201" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Credits</label>
              <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} min={0} max={20}
                className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" placeholder="4" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Semester</label>
              <input type="number" value={semester} onChange={(e) => setSemester(e.target.value)} min={1} max={12}
                className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" placeholder="3" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}
                className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold">
                <option value="">Select department...</option>
                {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" disabled={saving}
                className="border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase hover:bg-[#2a2a24] disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase hover:bg-[#eae3cb]">
                Cancel
              </button>
            </div>
          </form>
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search subjects..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-black bg-[#f4ebd0] p-2 pl-9 text-xs font-bold" />
      </div>

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] text-[10px] uppercase">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Semester</th>
              <th className="p-3 text-left">Credits</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center font-black">No subjects found.</td></tr>
            ) : filtered.map((s) => (
              <tr key={s.id} className="border-b border-black">
                <td className="p-3 font-black">{s.name}</td>
                <td className="p-3 font-mono">{s.code}</td>
                <td className="p-3">Sem {s.semester}</td>
                <td className="p-3">{s.credits}</td>
                <td className="p-3">{s.department || "—"}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(s.id)}
                    className="p-1.5 border border-black bg-red-200 hover:bg-red-300">
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