"use client";

import { useEffect, useState } from "react";
import { Building2, Users, GraduationCap, BookOpen, ClipboardList, AlertTriangle, Megaphone, BookMarked } from "lucide-react";
import { getInstitutionDashboardStats, type InstitutionDashboardStats } from "@/actions/institution-actions";

export default function InstitutionDashboardPage() {
  const [stats, setStats] = useState<InstitutionDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInstitutionDashboardStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading dashboard...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;
  if (!stats) return null;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-600" },
    { label: "Faculty", value: stats.totalFaculty, icon: GraduationCap, color: "bg-green-700" },
    { label: "Students", value: stats.totalStudents, icon: BookMarked, color: "bg-purple-700" },
    { label: "Subjects", value: stats.totalSubjects, icon: BookOpen, color: "bg-orange-700" },
    { label: "Exam Blueprints", value: stats.totalExams, icon: ClipboardList, color: "bg-teal-700" },
    { label: "Complaints", value: stats.totalComplaints, icon: AlertTriangle, color: "bg-red-700" },
    { label: "Announcements", value: stats.totalAnnouncements, icon: Megaphone, color: "bg-indigo-700" },
  ];

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#e28774]" /> Institution Dashboard
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Overview of your institution&apos;s activity</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 ${card.color} text-white rounded-sm`}>
                <card.icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wide">{card.label}</span>
            </div>
            <div className="text-2xl font-black">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
        <div className="border-b-2 border-black p-3 bg-[#1a1a14] text-[#f4ebd0]">
          <h2 className="text-xs font-black uppercase tracking-wide">Recent Users</h2>
        </div>
        {stats.recentUsers.length === 0 ? (
          <div className="p-6 text-center text-xs font-black">No users yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs font-bold">
              <thead>
                <tr className="border-b-2 border-black bg-[#eae3cb] text-[10px] uppercase">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((u) => (
                  <tr key={u.id} className="border-b border-black">
                    <td className="p-3 font-black">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 uppercase text-[10px]">{u.role.replace("_", " ")}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${u.status === "Active" ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
