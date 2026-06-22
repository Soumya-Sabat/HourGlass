"use client";

import { useState } from "react";
import { Package2, Plus, Trash2 } from "lucide-react";

type Classroom = { id: string; name: string; capacity: number; resources: string; location: string };

export default function CampusEstatePage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", capacity: 30, resources: "", location: "" });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setClassrooms([...classrooms, { ...form, id: Date.now().toString() }]);
    setForm({ name: "", capacity: 30, resources: "", location: "" });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setClassrooms(classrooms.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Package2 className="h-5 w-5 text-[#e28774]" /> Campus Estate
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Manage classrooms and campus resources</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-3 py-2 text-xs font-black uppercase hover:bg-[#2a2a24]">
          <Plus className="h-3 w-3" /> {showForm ? "Cancel" : "Add Room"}
        </button>
      </div>

      {showForm && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input placeholder="Room Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
          <input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            className="border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
          <input placeholder="Resources (Projector, Smartboard, etc.)" value={form.resources} onChange={(e) => setForm({ ...form, resources: e.target.value })}
            className="border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
          <input placeholder="Location (Building, Floor)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
          <div className="sm:col-span-2">
            <button onClick={handleAdd}
              className="border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase">
              Save Classroom
            </button>
          </div>
        </div>
      )}

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] text-[10px] uppercase">
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Capacity</th>
              <th className="p-3 text-left">Resources</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center font-black">No classrooms added yet.</td></tr>
            ) : classrooms.map((c) => (
              <tr key={c.id} className="border-b border-black">
                <td className="p-3 font-black">{c.name}</td>
                <td className="p-3">{c.capacity}</td>
                <td className="p-3 text-[10px]">{c.resources}</td>
                <td className="p-3">{c.location}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 border border-black bg-red-200 hover:bg-red-300">
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
