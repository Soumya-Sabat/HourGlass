"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, Users, BookOpen, GraduationCap, ClipboardList, Bell, Calendar } from "lucide-react";
import { getDepartmentDashboardStats, getDepartmentUsers, getDepartmentExams, getDepartmentNotices, type DepartmentDashboardStats, type DepartmentUser } from "@/actions/department-actions";

export default function DepartmentDashboard() {
  const [stats, setStats] = useState<DepartmentDashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<DepartmentUser[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<{ id: string; title: string; subject: string; date: string }[]>([]);
  const [recentNotices, setRecentNotices] = useState<{ id: string; title: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getDepartmentDashboardStats(),
      getDepartmentUsers(),
      getDepartmentExams(),
      getDepartmentNotices(),
    ])
      .then(([s, u, e, n]) => {
        setStats(s);
        setRecentUsers(u.slice(0, 5));
        setUpcomingExams(e.slice(0, 5));
        setRecentNotices(n.slice(0, 3));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading dashboard...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;

  const cards = [
    { label: "Faculty", value: stats?.totalFaculty ?? 0, icon: Users, color: "bg-blue-200" },
    { label: "Students", value: stats?.totalStudents ?? 0, icon: GraduationCap, color: "bg-green-200" },
    { label: "Subjects", value: stats?.totalSubjects ?? 0, icon: BookOpen, color: "bg-purple-200" },
    { label: "Exams", value: stats?.totalExams ?? 0, icon: ClipboardList, color: "bg-amber-200" },
  ];

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-[#e28774]" /> Department Dashboard
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Overview of your department</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} border-2 border-black shadow-[3px_3px_0px_0px_#1a1a14] p-4`}>
            <card.icon className="h-5 w-5 mb-2 text-[#1a1a14]" />
            <p className="text-2xl font-black">{card.value}</p>
            <p className="text-[10px] font-bold uppercase">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-[#e28774]" /> Recent Users
          </h2>
          {recentUsers.length === 0 ? (
            <p className="text-xs font-bold text-gray-500">No users found.</p>
          ) : (
            <div className="space-y-2">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between border-b border-black/10 pb-2 last:border-0">
                  <div>
                    <p className="text-xs font-black">{u.name}</p>
                    <p className="text-[9px] font-bold text-gray-500">{u.role.replace("_", " ")} &middot; {u.lastLogin}</p>
                  </div>
                  <span className={`px-1.5 py-0.5 text-[9px] font-black uppercase ${u.status === "Active" ? "bg-green-200" : "bg-red-200"}`}>
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Exams */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <ClipboardList className="h-4 w-4 text-[#e28774]" /> Upcoming Exams
          </h2>
          {upcomingExams.length === 0 ? (
            <p className="text-xs font-bold text-gray-500">No exams scheduled.</p>
          ) : (
            <div className="space-y-2">
              {upcomingExams.map((e) => (
                <div key={e.id} className="flex items-center justify-between border-b border-black/10 pb-2 last:border-0">
                  <div>
                    <p className="text-xs font-black">{e.title}</p>
                    <p className="text-[9px] font-bold text-gray-500">{e.subject}</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">{e.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notices */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-[#e28774]" /> Recent Notices
          </h2>
          {recentNotices.length === 0 ? (
            <p className="text-xs font-bold text-gray-500">No notices yet.</p>
          ) : (
            <div className="space-y-2">
              {recentNotices.map((n) => (
                <div key={n.id} className="border-b border-black/10 pb-2 last:border-0">
                  <p className="text-xs font-black">{n.title}</p>
                  <p className="text-[9px] font-bold text-gray-500">{n.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-[#e28774]" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <a href="/dashboard/department/events" className="border-2 border-black bg-[#e28774] p-3 text-center text-[10px] font-black uppercase  hover:bg-[#d97766] shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
              Add Event
            </a>
            <a href="/dashboard/department/exams" className="border-2 border-black bg-[#e28774] p-3 text-center text-[10px] font-black uppercase  hover:bg-[#d97766] shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
              Schedule Exam
            </a>
            <a href="/dashboard/department/notices" className="border-2 border-black bg-[#e28774] p-3 text-center text-[10px] font-black uppercase  hover:bg-[#d97766] shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
              Post Notice
            </a>
            <a href="/dashboard/department/faculty-roster" className="border-2 border-black bg-[#e28774] p-3 text-center text-[10px] font-black uppercase  hover:bg-[#d97766] shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
              View Roster
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
