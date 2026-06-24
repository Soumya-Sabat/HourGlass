"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Layers, Users, BookOpenText, GraduationCap, Bell, Download, ArrowUpDown, Calendar, Plus, MessageSquare } from "lucide-react";
import { getReviewerDashboardStats, type ReviewerDashboardStats } from "@/actions/review-actions";

export default function ReviewerDashboardPage() {
  const [stats, setStats] = useState<ReviewerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviewerDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading reviewer command center...</div>;

  const cards = [
    { label: "Faculty", value: stats?.totalFaculty ?? 0, icon: Users, color: "bg-green-200", href: "/dashboard/faculty/messages" },
    { label: "Subjects", value: stats?.totalSubjects ?? 0, icon: BookOpenText, color: "bg-purple-200", href: "/dashboard/faculty/subjects" },
    { label: "Clusters", value: stats?.totalClusters ?? 0, icon: Layers, color: "bg-blue-200", href: "/dashboard/review/clusters" },
    { label: "Cluster Members", value: stats?.totalMembers ?? 0, icon: ShieldCheck, color: "bg-amber-200", href: "/dashboard/review/clusters" },
  ];

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[var(--accent)]" /> Reviewer Command Center
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Faculty oversight, cluster management &amp; timetable review</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}
            className={`${c.color} border-2 border-[var(--border-primary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all`}>
            <c.icon className="h-5 w-5 mb-2 text-[var(--text-primary)]" />
            <p className="text-2xl font-black">{c.value}</p>
            <p className="text-[10px] font-bold uppercase">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Plus className="h-4 w-4 text-[var(--accent)]" /> Quick Actions
          </h2>
          <div className="space-y-2">
            <Link href="/dashboard/review/clusters"
              className="flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold hover:bg-[var(--accent)] transition-colors">
              <Layers className="h-4 w-4" /> Create / Manage Clusters
            </Link>
            <Link href="/dashboard/review/timetable-review"
              className="flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold hover:bg-[var(--accent)] transition-colors">
              <Calendar className="h-4 w-4" /> Review &amp; Suggest Timetable Changes
            </Link>
            <Link href="/dashboard/faculty/attendance"
              className="flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold hover:bg-[var(--accent)] transition-colors">
              <Users className="h-4 w-4" /> Mark Attendance
            </Link>
            <Link href="/dashboard/faculty/notices"
              className="flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold hover:bg-[var(--accent)] transition-colors">
              <Bell className="h-4 w-4" /> View Notices
            </Link>
            <Link href="/dashboard/faculty/exchange-desk"
              className="flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold hover:bg-[var(--accent)] transition-colors">
              <ArrowUpDown className="h-4 w-4" /> Exchange Desk
            </Link>
            <Link href="/dashboard/faculty/downloads"
              className="flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold hover:bg-[var(--accent)] transition-colors">
              <Download className="h-4 w-4" /> Downloads
            </Link>
            <Link href="/dashboard/faculty/messages"
              className="flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold hover:bg-[var(--accent)] transition-colors">
              <MessageSquare className="h-4 w-4" /> Messages
            </Link>
          </div>
        </div>

        {/* Recent Clusters */}
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-[var(--accent)]" /> Recent Clusters
          </h2>
          {(stats?.recentClusters ?? []).length === 0 ? (
            <p className="text-xs font-bold text-gray-500">No clusters yet. Create your first one.</p>
          ) : (
            <div className="space-y-2">
              {stats?.recentClusters.map((c) => (
                <div key={c.id} className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-[10px] font-bold">
                  <span className="font-black">{c.name}</span>
                  <br />{c.subject} &mdash; {c.memberCount} member{c.memberCount !== 1 ? "s" : ""}
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/review/clusters"
            className="inline-block mt-3 text-[9px] font-black uppercase border-2 border-[var(--border-primary)] px-3 py-1.5 bg-[var(--surface-white)] hover:bg-[var(--accent)] transition-colors shadow-[2px_2px_0px_0px_var(--border-primary)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
            Manage All Clusters &rarr;
          </Link>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
        <h2 className="text-sm font-black uppercase mb-3">All Sections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {[
            { name: "My Subjects", href: "/dashboard/faculty/subjects", icon: BookOpenText },
            { name: "Timetable", href: "/dashboard/faculty/timetable", icon: GraduationCap },
            { name: "Attendance", href: "/dashboard/faculty/attendance", icon: Users },
            { name: "Notices", href: "/dashboard/faculty/notices", icon: Bell },
            { name: "Exchange Desk", href: "/dashboard/faculty/exchange-desk", icon: ArrowUpDown },
            { name: "Downloads", href: "/dashboard/faculty/downloads", icon: Download },
            { name: "Messages", href: "/dashboard/faculty/messages", icon: MessageSquare },
            { name: "Cluster Mgmt", href: "/dashboard/review/clusters", icon: Layers },
            { name: "Timetable Review", href: "/dashboard/review/timetable-review", icon: Calendar },
          ].map((s) => (
            <Link key={s.name} href={s.href}
              className="flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-[10px] font-bold hover:bg-[var(--accent)] transition-colors">
              <s.icon className="h-3.5 w-3.5 shrink-0" />
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
