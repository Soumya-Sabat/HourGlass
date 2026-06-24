"use client";

import { useState, useEffect } from "react";
import { Calendar, CheckCircle2, BookOpen, AlertCircle, BellRing, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getDashboardSessionSummary, type DashboardSessionSummary } from "@/actions/dashboard-session-actions";
import { getStudentTimetable, getStudentAttendance, getStudentSubjects, getStudentNotices, type TimetableDay, type AttendanceSummary, type SubjectInfo, type NoticeInfo } from "@/actions/student-academic-actions";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "GOOD MORNING";
  if (hour < 17) return "GOOD AFTERNOON";
  if (hour < 21) return "GOOD EVENING";
  return "GOOD NIGHT";
}

export default function StudentDashboard() {
  const [session, setSession] = useState<DashboardSessionSummary | null>(null);
  const [timetable, setTimetable] = useState<TimetableDay[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [notices, setNotices] = useState<NoticeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    getDashboardSessionSummary().then(setSession).catch(() => {});
  }, []);

  useEffect(() => {
    Promise.all([
      getStudentTimetable().catch(() => []),
      getStudentAttendance().catch(() => []),
      getStudentSubjects().catch(() => []),
      getStudentNotices().catch(() => []),
    ]).then(([t, a, s, n]) => {
      setTimetable(t);
      setAttendance(a);
      setSubjects(s);
      setNotices(n);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }).toUpperCase());
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Today's schedule (Monday = 1)
  const today = new Date().getDay();
  const todaySchedule = timetable.find((d) => d.dayIndex === today)?.entries || [];

  // Attendance stats
  const overallPct = attendance.length > 0
    ? Math.round(attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length)
    : 0;
  const criticalSubjects = attendance.filter((a) => a.percentage < 75);
  const criticalCount = criticalSubjects.length;

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading dashboard...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="p-4 border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)]">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">{greeting()}, {session?.name || "STUDENT"}</h1>
        <p className="text-[11px] text-[var(--text-primary)]/80 mt-1 font-bold tracking-tight">
          {subjects.length} Subjects &mdash; {currentTime || "LOADING..."}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CLASSES TODAY", value: todaySchedule.length.toString(), icon: Calendar, bg: "bg-[var(--surface-white)]" },
          { label: "ATTENDANCE", value: `${overallPct}%`, icon: CheckCircle2, bg: "bg-[var(--surface-white)]" },
          { label: "SUBJECTS", value: subjects.length.toString(), icon: BookOpen, bg: "bg-[var(--surface-white)]" },
          { label: "CRITICAL", value: criticalCount.toString(), icon: AlertCircle, bg: criticalCount > 0 ? "bg-[var(--accent)]" : "bg-[var(--surface-white)]" },
        ].map((kpi, idx) => (
          <div key={idx} className={`p-4 border-2 border-[var(--border-primary)] ${kpi.bg} shadow-[3px_3px_0px_0px_var(--border-primary)]`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-80">{kpi.label}</span>
              <kpi.icon className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="text-2xl font-black">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {/* Schedule */}
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] flex flex-col">
          <div className="p-3 border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] font-black text-xs uppercase tracking-wide">
            TODAY&apos;S SCHEDULE
          </div>
          <div className="p-4 space-y-3 flex-1 bg-[var(--surface-white)]">
            {todaySchedule.length === 0 ? (
              <p className="text-xs font-bold text-gray-500 text-center py-4">No classes scheduled today.</p>
            ) : todaySchedule.map((slot, idx) => (
              <div key={idx} className="p-3 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)]/30">
                <div className="text-xs font-black text-[var(--accent)]">{slot.startTime}-{slot.endTime}</div>
                <div className="text-sm font-black">{slot.subjectName} <span className="text-[9px] px-1 border border-[var(--border-primary)] bg-[var(--surface-white)] ml-1 font-normal uppercase">{slot.type}</span></div>
                <div className="text-[11px] font-bold text-gray-600 mt-0.5">{slot.room} &bull; {slot.facultyName}</div>
              </div>
            ))}
            <Link href="/dashboard/student/timetable"
              className="block text-center text-[9px] font-black uppercase border border-[var(--border-primary)] px-2 py-1 bg-[var(--bg-primary)] hover:bg-[var(--accent)] transition-colors mt-2">
              Full Timetable &rarr;
            </Link>
          </div>
        </div>

        {/* Attendance */}
        <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] flex flex-col">
          <div className="p-3 border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] font-black text-xs uppercase">
            ATTENDANCE
          </div>
          <div className="p-4 bg-[var(--surface-white)] space-y-4 flex-1">
            {attendance.length === 0 ? (
              <p className="text-xs font-bold text-gray-500 text-center py-4">No attendance records yet.</p>
            ) : attendance.map((item, idx) => {
              const isLow = item.percentage < 75;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-black">
                    <span>{item.subjectName}</span>
                    <span className={isLow ? "text-red-600" : ""}>{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-[var(--bg-primary)] h-3 border border-[var(--border-primary)]">
                    <div className={`h-full border-r border-[var(--border-primary)] ${isLow ? "bg-[var(--accent)]" : "bg-[var(--dark-bg)]"}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              );
            })}
            {criticalCount > 0 ? (
              <div className="pt-3 border-t border-dashed border-[var(--border-primary)] text-[10px] font-black text-red-600 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                <span>{criticalCount} SUBJECT{criticalCount > 1 ? "S" : ""} BELOW 75%</span>
              </div>
            ) : (
              <div className="pt-3 border-t border-dashed border-[var(--border-primary)] text-[10px] font-black text-green-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>ALL ATTENDANCE WITHIN LIMITS</span>
              </div>
            )}
          </div>
        </div>

        {/* Notices & Messages */}
        <div className="space-y-6 md:col-span-2 xl:col-span-1 flex flex-col">
          <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)]">
            <div className="p-3 border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] font-black text-xs uppercase flex items-center gap-2">
              <BellRing className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>NOTICES</span>
            </div>
            <div className="p-4 bg-[var(--surface-white)] space-y-3 max-h-[240px] overflow-y-auto">
              {notices.length === 0 ? (
                <p className="text-xs font-bold text-gray-500">No notices yet.</p>
              ) : notices.slice(0, 5).map((n) => (
                <div key={n.id} className="p-2.5 border border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-black uppercase tracking-tight">{n.title}</span>
                    {n.priority && <span className="text-[8px] font-black px-1 bg-[var(--dark-bg)] text-[var(--light-text)] shrink-0">{n.priority}</span>}
                  </div>
                  <p className="text-[11px] text-gray-700 leading-tight">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)]">
            <div className="p-3 border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] font-black text-xs uppercase flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>QUICK LINKS</span>
            </div>
            <div className="p-4 bg-[var(--surface-white)] space-y-2">
              <Link href="/dashboard/student/marksheet" className="block border border-[var(--border-primary)] p-2 text-xs font-bold bg-[var(--bg-primary)] hover:bg-[var(--accent)] transition-colors">View Marksheet</Link>
              <Link href="/dashboard/student/attendance" className="block border border-[var(--border-primary)] p-2 text-xs font-bold bg-[var(--bg-primary)] hover:bg-[var(--accent)] transition-colors">Full Attendance</Link>
              <Link href="/dashboard/student/subjects" className="block border border-[var(--border-primary)] p-2 text-xs font-bold bg-[var(--bg-primary)] hover:bg-[var(--accent)] transition-colors">My Subjects</Link>
              <Link href="/dashboard/student/faculties" className="block border border-[var(--border-primary)] p-2 text-xs font-bold bg-[var(--bg-primary)] hover:bg-[var(--accent)] transition-colors">My Faculties</Link>
              <Link href="/dashboard/student/messages" className="block border border-[var(--border-primary)] p-2 text-xs font-bold bg-[var(--bg-primary)] hover:bg-[var(--accent)] transition-colors">Messages</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
