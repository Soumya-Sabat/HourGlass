"use client";

import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { getDepartmentUsers, type DepartmentUser } from "@/actions/department-actions";

const roleLabels: Record<string, string> = {
  department_admin: "Dept Admin",
  department_head: "Dept Head",
  faculty: "Faculty",
  reviewer: "Reviewer",
  student: "Student",
};

export default function FacultyRosterPage() {
  const [users, setUsers] = useState<DepartmentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDepartmentUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading faculty roster...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Users className="h-5 w-5 text-[#e28774]" /> Faculty Roster
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">View all faculty, and staffs in your department</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search by name, email, or role..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-black bg-[#f4ebd0] p-2 pl-9 text-xs font-bold" />
      </div>

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] text-[10px] uppercase">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Batch</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-center font-black">No users found.</td></tr>
            ) : filtered.map((u) => (
              <tr key={u.id} className="border-b border-black">
                <td className="p-3 font-black">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 uppercase text-[10px]">{roleLabels[u.role] || u.role.replace("_", " ")}</td>
                <td className="p-3">{u.classGroup || "—"}</td>
                <td className="p-3">{u.section || "—"}</td>
                <td className="p-3">{u.batch || "—"}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${u.status === "Active" ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-[10px]">{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
