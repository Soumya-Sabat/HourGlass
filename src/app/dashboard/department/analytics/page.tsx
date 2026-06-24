"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, BookOpen, ClipboardList, GraduationCap, Activity } from "lucide-react";
import { getDepartmentDashboardStats, getDepartmentUsers, getDepartmentExams, type DepartmentDashboardStats, type DepartmentUser } from "@/actions/department-actions";

export default function DepartmentAnalyticsPage() {
  const [stats, setStats] = useState<DepartmentDashboardStats | null>(null);
  const [users, setUsers] = useState<DepartmentUser[]>([]);
  const [exams, setExams] = useState<Awaited<ReturnType<typeof getDepartmentExams>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDepartmentDashboardStats(),
      getDepartmentUsers(),
      getDepartmentExams(),
    ])
      .then(([s, u, e]) => { setStats(s); setUsers(u); setExams(e); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading analytics...</div>;

  const total = (stats?.totalFaculty ?? 0) + (stats?.totalStudents ?? 0);
  const facultyPct = total > 0 ? Math.round(((stats?.totalFaculty ?? 0) / total) * 100) : 0;
  const studentPct = total > 0 ? Math.round(((stats?.totalStudents ?? 0) / total) * 100) : 0;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const suspendedUsers = users.filter((u) => u.status === "Suspended").length;

  const metrics = [
    { label: "Faculty", value: stats?.totalFaculty ?? 0, icon: Users, color: "bg-blue-200" },
    { label: "Students", value: stats?.totalStudents ?? 0, icon: GraduationCap, color: "bg-green-200" },
    { label: "Subjects", value: stats?.totalSubjects ?? 0, icon: BookOpen, color: "bg-purple-200" },
    { label: "Exams Scheduled", value: stats?.totalExams ?? 0, icon: ClipboardList, color: "bg-amber-200" },
  ];

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#e28774]" /> Department Analytics
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Department-wide statistics and insights</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className={`${m.color} border-2 border-black shadow-[3px_3px_0px_0px_#1a1a14] p-4`}>
            <m.icon className="h-5 w-5 mb-2 text-[#1a1a14]" />
            <p className="text-2xl font-black">{m.value}</p>
            <p className="text-[10px] font-bold uppercase">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* User distribution */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-[#e28774]" /> User Distribution
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Faculty</span>
                <span>{facultyPct}% ({stats?.totalFaculty ?? 0})</span>
              </div>
              <div className="h-3 bg-white border border-black">
                <div className="h-full bg-blue-400 transition-all" style={{ width: `${facultyPct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Students</span>
                <span>{studentPct}% ({stats?.totalStudents ?? 0})</span>
              </div>
              <div className="h-3 bg-white border border-black">
                <div className="h-full bg-green-400 transition-all" style={{ width: `${studentPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Account status */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-[#e28774]" /> Account Status
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-200 border-2 border-black p-3 text-center shadow-[2px_2px_0px_0px_#1a1a14]">
              <p className="text-2xl font-black">{activeUsers}</p>
              <p className="text-[9px] font-black uppercase">Active</p>
            </div>
            <div className="bg-red-200 border-2 border-black p-3 text-center shadow-[2px_2px_0px_0px_#1a1a14]">
              <p className="text-2xl font-black">{suspendedUsers}</p>
              <p className="text-[9px] font-black uppercase">Suspended</p>
            </div>
          </div>
        </div>

        {/* Recent exams list */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4 lg:col-span-2">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <ClipboardList className="h-4 w-4 text-[#e28774]" /> Exam Schedule Overview
          </h2>
          {exams.length === 0 ? (
            <p className="text-xs font-bold text-gray-500">No exams scheduled.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-bold">
                <thead>
                  <tr className="border-b-2 border-black text-[10px] uppercase">
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Subject</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((e) => (
                    <tr key={e.id} className="border-b border-black/20">
                      <td className="p-2 font-black">{e.title}</td>
                      <td className="p-2">{e.subject}</td>
                      <td className="p-2">{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
