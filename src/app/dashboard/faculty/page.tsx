"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserSquare2, BookOpenText, Users, Clock, Bell, GraduationCap, ClipboardCheck, Download, Pencil } from "lucide-react";
import { getFacultyDashboardStats, getMyClusters, getFacultyProfile, type FacultyDashboardStats, type FacultyCluster, type FacultyProfile } from "@/actions/faculty-actions";

export default function FacultyDashboardPage() {
  const [stats, setStats] = useState<FacultyDashboardStats | null>(null);
  const [clusters, setClusters] = useState<FacultyCluster[]>([]);
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editExperience, setEditExperience] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, c, p] = await Promise.all([
        getFacultyDashboardStats(),
        getMyClusters(),
        getFacultyProfile(),
      ]);
      setStats(s);
      setClusters(c);
      setProfile(p);
      setEditName(p.fullName);
      setEditPhone(p.phoneNumber);
      setEditDesignation(p.designation);
      setEditExperience(p.yearsOfExperience);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const { updateFacultyProfile } = await import("@/actions/faculty-actions");
      await updateFacultyProfile({ fullName: editName, phoneNumber: editPhone, designation: editDesignation, yearsOfExperience: editExperience });
      setSaveMsg("Profile updated!");
      setProfile((prev) => prev ? { ...prev, fullName: editName, phoneNumber: editPhone, designation: editDesignation, yearsOfExperience: editExperience } : prev);
      setEditing(false);
    } catch {
      setSaveMsg("Failed to update.");
    }
    setSaveLoading(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading dashboard...</div>;

  const cards = [
    { label: "Classes", value: stats?.totalClasses ?? 0, icon: Clock, color: "bg-blue-200", href: "/dashboard/faculty/timetable" },
    { label: "Subjects", value: stats?.totalSubjects ?? 0, icon: BookOpenText, color: "bg-purple-200", href: "/dashboard/faculty/subjects" },
    { label: "Students", value: stats?.totalStudents ?? 0, icon: Users, color: "bg-green-200", href: "/dashboard/faculty/attendance" },
    { label: "Notices", value: stats?.totalNotices ?? 0, icon: Bell, color: "bg-amber-200", href: "/dashboard/faculty/notices" },
  ];

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <UserSquare2 className="h-5 w-5 text-[var(--accent)]" /> Faculty Core
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Welcome, {profile?.fullName || "Faculty"}</p>
      </div>

      {/* Quick Action Cards */}
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

      {/* Profile / Quick Edit */}
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase flex items-center gap-2">
            <Pencil className="h-4 w-4 text-[var(--accent)]" /> My Profile
          </h2>
          <button onClick={() => setEditing(!editing)}
            className="text-[9px] font-black uppercase border border-[var(--border-primary)] px-2 py-1 bg-[var(--surface-white)] hover:bg-[var(--accent)] transition-colors">
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>
        {editing ? (
          <div className="space-y-2">
            <input value={editName} onChange={(e) => setEditName(e.target.value)}
              className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold" placeholder="Full name" />
            <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
              className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold" placeholder="Phone number" />
            <input value={editDesignation} onChange={(e) => setEditDesignation(e.target.value)}
              className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold" placeholder="Designation" />
            <input value={editExperience} onChange={(e) => setEditExperience(e.target.value)}
              className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold" placeholder="Years of Experience" />
            <button onClick={handleSaveProfile} disabled={saveLoading}
              className="border-2 border-[var(--border-primary)] bg-[var(--accent)] text-xs font-black uppercase px-4 py-2 shadow-[2px_2px_0px_0px_var(--border-primary)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50">
              {saveLoading ? "Saving..." : "Save"}
            </button>
            {saveMsg && <p className="text-xs font-bold text-green-700">{saveMsg}</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-bold">
            <div className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2"><span className="text-gray-500">Name</span><br />{profile?.fullName || "—"}</div>
            <div className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2"><span className="text-gray-500">Email</span><br />{profile?.email || "—"}</div>
            <div className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2"><span className="text-gray-500">Phone</span><br />{profile?.phoneNumber || "—"}</div>
            <div className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2"><span className="text-gray-500">Designation</span><br />{profile?.designation || "—"}</div>
            <div className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2"><span className="text-gray-500">Dept</span><br />{profile?.department || "—"}</div>
            <div className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2"><span className="text-gray-500">Experience</span><br />{profile?.yearsOfExperience || "—"}</div>
          </div>
        )}
      </div>

      {/* Clusters section */}
      {clusters.length > 0 && (
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-[var(--accent)]" /> My Clusters
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {clusters.map((c) => (
              <div key={c.id} className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-[10px] font-bold">
                <span className="font-black">{c.name}</span>
                <br />{c.subjectName} &mdash; Lead: {c.leadName}
                <br />{c.memberCount} member{c.memberCount !== 1 ? "s" : ""}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two-column: Upcoming Classes + Recent Notices */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-[var(--accent)]" /> Upcoming Classes
          </h2>
          {(stats?.upcomingClasses ?? []).length === 0 ? (
            <p className="text-xs font-bold text-gray-500">No classes scheduled.</p>
          ) : (
            <div className="space-y-2">
              {stats?.upcomingClasses.map((c, i) => (
                <div key={i} className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-[10px] font-bold">
                  <span className="font-black">{c.subject}</span> &mdash; {c.batch}
                  <br />{c.day} {c.time}{c.room ? ` · ${c.room}` : ""}
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/faculty/timetable"
            className="inline-block mt-2 text-[9px] font-black uppercase border border-[var(--border-primary)] px-2 py-1 bg-[var(--surface-white)] hover:bg-[var(--accent)] transition-colors">
            View Full Schedule &rarr;
          </Link>
        </div>

        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-[var(--accent)]" /> Recent Notices
          </h2>
          {(stats?.recentNotices ?? []).length === 0 ? (
            <p className="text-xs font-bold text-gray-500">No notices yet.</p>
          ) : (
            <div className="space-y-2">
              {stats?.recentNotices.map((n) => (
                <div key={n.id} className="border border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-[10px] font-bold">
                  <span className="font-black">{n.title}</span>
                  <br /><span className="text-gray-500">{n.date}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/faculty/notices"
            className="inline-block mt-2 text-[9px] font-black uppercase border border-[var(--border-primary)] px-2 py-1 bg-[var(--surface-white)] hover:bg-[var(--accent)] transition-colors">
            All Notices &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/dashboard/faculty/attendance"
          className="border-2 border-[var(--border-primary)] bg-[var(--accent)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-3 text-center text-xs font-black uppercase hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
          <ClipboardCheck className="h-4 w-4 mx-auto mb-1" /> Mark Attendance
        </Link>
        <Link href="/dashboard/faculty/downloads"
          className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-3 text-center text-xs font-black uppercase hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
          <Download className="h-4 w-4 mx-auto mb-1" /> Downloads
        </Link>
        <Link href="/dashboard/faculty/clusters"
          className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-3 text-center text-xs font-black uppercase hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
          <Users className="h-4 w-4 mx-auto mb-1" /> My Clusters
        </Link>
        <Link href="/dashboard/faculty/exchange-desk"
          className="border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-3 text-center text-xs font-black uppercase hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
          <Clock className="h-4 w-4 mx-auto mb-1" /> Exchange Desk
        </Link>
      </div>
    </div>
  );
}
