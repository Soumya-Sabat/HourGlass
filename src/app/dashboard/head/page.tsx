"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, BookOpen, Users, MessageSquare, Bell, Layers, GraduationCap, ClipboardList, Calendar, Settings, AlertTriangle, BarChart3 } from "lucide-react";
import { getHeadDashboardStats, type HeadDashboardStats } from "@/actions/head-actions";

export default function HeadDashboardPage() {
  const [stats, setStats] = useState<HeadDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHeadDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading command center...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">
          <CheckSquare className="h-5 w-5 text-[#e28774] inline-block mr-2" />
          HEAD COMMAND CENTER
        </h1>
        <p className="text-[11px] mt-1 font-bold tracking-tight text-[#1a1a14]/80">
          Department oversight &mdash; faculty, students, subjects, clusters, notices &amp; approvals
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Faculty", value: stats?.totalFaculty ?? 0, icon: Users, href: "/dashboard/head/faculty-roster", color: "bg-green-200" },
          { label: "Students", value: stats?.totalStudents ?? 0, icon: GraduationCap, href: "/dashboard/department/students", color: "bg-blue-200" },
          { label: "Subjects", value: stats?.totalSubjects ?? 0, icon: BookOpen, href: "/dashboard/head/subjects", color: "bg-purple-200" },
          { label: "Clusters", value: stats?.totalClusters ?? 0, icon: Layers, href: "/dashboard/head/clusters", color: "bg-amber-200" },
        ].map((card, idx) => (
          <Link key={idx} href={card.href}
            className={`${card.color} border-2 border-black shadow-[3px_3px_0px_0px_#1a1a14] p-4 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-80">{card.label}</span>
              <card.icon className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="text-2xl font-black">{card.value}</div>
          </Link>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Approval Queue */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14]">
          <div className="border-b-2 border-black bg-[#1a1a14] p-3 text-[#f4ebd0] text-xs font-black uppercase flex items-center gap-2">
            <CheckSquare className="h-3.5 w-3.5" />
            Approval Queue
          </div>
          <div className="space-y-3 p-4 bg-white">
            <p className="text-xs font-bold text-gray-600">{stats?.pendingApprovals ?? 0} item(s) pending your review.</p>
            <div className="space-y-2">
              <Link href="/dashboard/head/notices"
                className="block border border-black p-2 text-xs font-bold bg-[#f4ebd0] hover:bg-[#e28774] transition-colors">
                Review &amp; Publish Notices &rarr;
              </Link>
              <Link href="/dashboard/head/subjects"
                className="block border border-black p-2 text-xs font-bold bg-[#f4ebd0] hover:bg-[#e28774] transition-colors">
                Review Subject Allocations &rarr;
              </Link>
              <Link href="/dashboard/head/faculty-roster"
                className="block border border-black p-2 text-xs font-bold bg-[#f4ebd0] hover:bg-[#e28774] transition-colors">
                View Faculty Roster &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Cluster Overview */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14]">
          <div className="border-b-2 border-black bg-[#1a1a14] p-3 text-[#f4ebd0] text-xs font-black uppercase flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            Cluster Overview
          </div>
          <div className="space-y-3 p-4 bg-white">
            {(stats?.clusters ?? []).length === 0 ? (
              <p className="text-xs font-bold text-gray-500">No clusters configured yet.</p>
            ) : (
              <div className="space-y-2">
                {(stats?.clusters ?? []).slice(0, 5).map((c) => (
                  <div key={c.id} className="border border-black p-2 text-[10px] font-bold bg-[#f4ebd0]/40">
                    <span className="font-black">{c.name}</span>
                    <br />Lead: {c.lead} &mdash; {c.memberCount} member{c.memberCount !== 1 ? "s" : ""}
                  </div>
                ))}
              </div>
            )}
            <Link href="/dashboard/head/clusters"
              className="block border border-black p-2 text-xs font-bold bg-[#f4ebd0] hover:bg-[#e28774] transition-colors">
              Manage All Clusters &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-3">
          <p className="text-[10px] font-black uppercase text-gray-600">Notices</p>
          <p className="text-lg font-black">{stats?.recentNotices ?? 0}</p>
        </div>
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-3">
          <p className="text-[10px] font-black uppercase text-gray-600">Pending</p>
          <p className="text-lg font-black">{stats?.pendingApprovals ?? 0}</p>
        </div>
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-3">
          <p className="text-[10px] font-black uppercase text-gray-600">Subjects</p>
          <p className="text-lg font-black">{stats?.totalSubjects ?? 0}</p>
        </div>
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-3">
          <p className="text-[10px] font-black uppercase text-gray-600">Clusters</p>
          <p className="text-lg font-black">{stats?.totalClusters ?? 0}</p>
        </div>
      </div>

      {/* All Sections */}
      <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
        <h2 className="text-sm font-black uppercase mb-3">Department Management</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[
            { name: "Faculty Roster", href: "/dashboard/head/faculty-roster", icon: Users },
            { name: "Subjects", href: "/dashboard/head/subjects", icon: BookOpen },
            { name: "Notices", href: "/dashboard/head/notices", icon: Bell },
            { name: "Cluster Oversight", href: "/dashboard/head/clusters", icon: Layers },
            { name: "Messages", href: "/dashboard/head/messages", icon: MessageSquare },
            { name: "Students", href: "/dashboard/department/students", icon: GraduationCap },
            { name: "Timetable", href: "/dashboard/department/timetable", icon: Calendar },
            { name: "Exams", href: "/dashboard/department/exams", icon: ClipboardList },
            { name: "Events", href: "/dashboard/department/events", icon: AlertTriangle },
            { name: "Settings", href: "/dashboard/department/settings", icon: Settings },
          ].map((s) => (
            <Link key={s.name} href={s.href}
              className="flex items-center gap-2 border border-black bg-white p-2 text-[10px] font-bold hover:bg-[#e28774] transition-colors">
              <s.icon className="h-3.5 w-3.5 shrink-0" />
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
