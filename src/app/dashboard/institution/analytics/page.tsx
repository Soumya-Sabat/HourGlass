"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, BookOpen, ClipboardList, AlertTriangle } from "lucide-react";
import { getInstitutionDashboardStats, type InstitutionDashboardStats } from "@/actions/institution-actions";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<InstitutionDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInstitutionDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading analytics...</div>;
  if (!stats) return null;

  const metrics = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-600" },
    { label: "Faculty", value: stats.totalFaculty, icon: Users, color: "bg-green-700" },
    { label: "Students", value: stats.totalStudents, icon: Users, color: "bg-purple-700" },
    { label: "Subjects", value: stats.totalSubjects, icon: BookOpen, color: "bg-orange-700" },
    { label: "Exam Blueprints", value: stats.totalExams, icon: ClipboardList, color: "bg-teal-700" },
    { label: "Complaints", value: stats.totalComplaints, icon: AlertTriangle, color: "bg-red-700" },
  ];

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#e28774]" /> Analytics & Reports
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Monitor usage, performance, and activity</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 ${m.color} text-white rounded-sm`}><m.icon className="h-4 w-4" /></div>
              <span className="text-[10px] font-black uppercase tracking-wide">{m.label}</span>
            </div>
            <div className="text-2xl font-black">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
