"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Search, Pencil, UserX, UserCheck, Filter } from "lucide-react";
import { getDepartmentStudents, getDepartmentFilterOptions, updateDepartmentStudent, suspendDepartmentUser, activateDepartmentUser, type DepartmentStudent } from "@/actions/department-actions";

export default function StudentsPage() {
  const [students, setStudents] = useState<DepartmentStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [options, setOptions] = useState<{ classGroups: string[]; sections: string[]; batches: string[] }>({ classGroups: [], sections: [], batches: [] });

  // Edit modal
  const [editStudent, setEditStudent] = useState<DepartmentStudent | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editClassGroup, setEditClassGroup] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editBatch, setEditBatch] = useState("");
  const [editError, setEditError] = useState("");
  const [editing, setEditing] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      getDepartmentStudents(filterClass || filterSection || filterBatch ? { classGroup: filterClass || undefined, section: filterSection || undefined, batch: filterBatch || undefined } : undefined),
      getDepartmentFilterOptions(),
    ])
      .then(([s, o]) => { setStudents(s); setOptions(o); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { load(); }, [filterClass, filterSection, filterBatch]);

  const openEditModal = (s: DepartmentStudent) => {
    setEditStudent(s);
    setEditName(s.name);
    setEditEmail(s.email);
    setEditClassGroup(s.classGroup);
    setEditSection(s.section);
    setEditBatch(s.batch);
    setEditError("");
    setEditing(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    setEditError("");
    setEditing(true);
    try {
      await updateDepartmentStudent({
        userId: editStudent.id,
        fullName: editName,
        email: editEmail,
        classGroup: editClassGroup || undefined,
        section: editSection || undefined,
        batch: editBatch || undefined,
      });
      setEditStudent(null);
      const fresh = await getDepartmentStudents(filterClass || filterSection || filterBatch ? { classGroup: filterClass || undefined, section: filterSection || undefined, batch: filterBatch || undefined } : undefined);
      setStudents(fresh);
    } catch (err: any) {
      setEditError(err?.message || "Failed to update student");
    } finally {
      setEditing(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      if (currentStatus === "Active") {
        await suspendDepartmentUser(userId);
      } else {
        await activateDepartmentUser(userId);
      }
      setStudents((prev) => prev.map((s) => s.id === userId ? { ...s, status: currentStatus === "Active" ? "Suspended" : "Active" } : s));
    } catch (err: any) {
      setError(err?.message || "Failed to toggle status");
    }
  };

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading students...</div>;
  if (error) return <div className="border-2 border-[var(--border-primary)] bg-[var(--accent)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">{error}</div>;

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[var(--accent)]" /> Students
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">View and manage department students</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 pl-9 text-xs font-bold" />
        </div>
        <div className="flex gap-2">
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}
            className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold">
            <option value="">All Classes</option>
            {options.classGroups.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)}
            className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold">
            <option value="">All Sections</option>
            {options.sections.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)}
            className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold">
            <option value="">All Batches</option>
            {options.batches.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] text-[10px] uppercase">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Batch</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center font-black">No students found.</td></tr>
            ) : filtered.map((s) => (
              <tr key={s.id} className="border-b border-[var(--border-primary)]">
                <td className="p-3 font-black">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.classGroup || "—"}</td>
                <td className="p-3">{s.section || "—"}</td>
                <td className="p-3">{s.batch || "—"}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${s.status === "Active" ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(s)}
                      className="p-1.5 border border-[var(--border-primary)] bg-blue-200 hover:bg-blue-300" title="Edit student">
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button onClick={() => handleToggleStatus(s.id, s.status)}
                      className={`p-1.5 border border-[var(--border-primary)] ${s.status === "Active" ? "bg-red-200 hover:bg-red-300" : "bg-green-200 hover:bg-green-300"}`}
                      title={s.status === "Active" ? "Suspend" : "Activate"}>
                      {s.status === "Active" ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit student modal */}
      {editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !editing && setEditStudent(null)}>
          <div className="w-full max-w-md border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-[6px_6px_0px_0px_var(--border-primary)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-black uppercase mb-4">Edit Student</h3>
            <form onSubmit={handleEdit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Full Name</label>
                <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Email</label>
                <input type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" placeholder="john@institution.edu" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Class / Course</label>
                <input type="text" value={editClassGroup} onChange={(e) => setEditClassGroup(e.target.value)}
                  className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" placeholder="B.Tech, MBA" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Section</label>
                  <input type="text" value={editSection} onChange={(e) => setEditSection(e.target.value)}
                    className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" placeholder="A, B" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Batch</label>
                  <input type="text" value={editBatch} onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" placeholder="2024-28" />
                </div>
              </div>
              {editError && <p className="text-xs font-bold text-red-600">{editError}</p>}
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setEditStudent(null)} disabled={editing} className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] px-4 py-1.5 text-xs font-black hover:bg-[var(--bg-secondary)] disabled:opacity-40">Cancel</button>
                <button type="submit" disabled={editing} className="border-2 border-[var(--border-primary)] bg-[var(--accent)] px-4 py-1.5 text-xs font-black text-white hover:bg-[var(--accent)] disabled:opacity-40">{editing ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
