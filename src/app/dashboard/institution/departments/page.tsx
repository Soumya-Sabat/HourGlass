"use client";

import { useEffect, useState } from "react";
import { Layers, Plus, Trash2, Loader } from "lucide-react";
import { getDepartments, createDepartment, deleteDepartment, type DepartmentInfo } from "@/actions/institution-actions";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", head: "" });

  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    try {
      await createDepartment(form);
      setDepartments([...departments, { id: form.name, name: form.name, head: form.head, facultyCount: 0 }]);
      setForm({ name: "", head: "" });
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartment(id);
      setDepartments(departments.filter((d) => d.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]"><Loader className="h-4 w-4 animate-spi" /> Loading...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#e28774]" /> Departments
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Manage departments and their heads</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-3 py-2 text-xs font-black uppercase hover:bg-[#2a2a24]">
          <Plus className="h-3 w-3" /> {showForm ? "Cancel" : "Add"}
        </button>
      </div>

      {showForm && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 space-y-3">
          <input placeholder="Department Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
          <input placeholder="Department Head Name" value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })}
            className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
          <button onClick={handleAdd}
            className="border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase">
            Save Department
          </button>
        </div>
      )}

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] text-[10px] uppercase">
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Head</th>
              <th className="p-3 text-left">Faculty</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center font-black">No departments found.</td></tr>
            ) : departments.map((d) => (
              <tr key={d.id} className="border-b border-black">
                <td className="p-3 font-black">{d.name}</td>
                <td className="p-3">{d.head || "—"}</td>
                <td className="p-3">{d.facultyCount}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(d.id)}
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
