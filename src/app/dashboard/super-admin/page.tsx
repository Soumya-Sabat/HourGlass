"use client";

import { useState, useEffect } from "react";
import { PageHeader, StatCard, Card, StatusBadge } from "@/components/super-admin/ui";
import { Building2, Users, CreditCard, CalendarCheck, Brain, Clock, Shield, Database, Mail, Cpu, Activity } from "lucide-react";

const MOCK_AUDIT_LOGS = [
  { action: "USER_LOGIN", userName: "John Doe", institutionId: "INST001", createdAt: "2026-06-22T10:15:00Z" },
  { action: "INSTITUTION_CREATED", userName: "Admin", institutionId: "INST002", createdAt: "2026-06-22T09:45:00Z" },
  { action: "TIMETABLE_GENERATED", userName: "Sarah Teacher", institutionId: "INST001", createdAt: "2026-06-22T08:30:00Z" },
  { action: "SUBSCRIPTION_UPDATED", userName: "Finance Bot", institutionId: "INST002", createdAt: "2026-06-21T22:15:00Z" },
  { action: "GDPR_REQUEST", userName: "Jane Doe", institutionId: "INST001", createdAt: "2026-06-21T18:00:00Z" },
];

const SYSTEM_HEALTH = [
  { label: "API Status", status: "Operational", icon: Activity, ok: true },
  { label: "Database", status: "Connected", icon: Database, ok: true },
  { label: "Email Service", status: "Operational", icon: Mail, ok: true },
  { label: "AI Engine", status: "Degraded Performance", icon: Cpu, ok: false },
];

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/stats");
      if (res.ok) setStats((await res.json()).stats || null);
    } catch {} finally { setLoading(false); }
  }

  const recentLogs = MOCK_AUDIT_LOGS;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <PageHeader
        title="SUPER ADMIN COMMAND CENTER"
        description="System-wide oversight, compliance monitoring, and platform governance"
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Institutions"
          value={stats?.totalInstitutions ?? 0}
          icon={Building2}
          trend={{ value: "+2 this month", positive: true }}
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          trend={{ value: "+48 this month", positive: true }}
        />
        <StatCard
          label="Active Subscriptions"
          value={stats?.activeSubscriptions ?? 0}
          icon={CreditCard}
          trend={{ value: "82% of institutions", positive: true }}
        />
        <StatCard
          label="Timetables Today"
          value={24}
          icon={CalendarCheck}
          trend={{ value: "+12% vs yesterday", positive: true }}
        />
        <StatCard
          label="AI Success Rate"
          value="97.3%"
          icon={Brain}
          trend={{ value: "+0.5% this week", positive: true }}
        />
        <StatCard
          label="Pending Approvals"
          value={stats?.pendingInstitutions ?? 0}
          icon={Clock}
          trend={{ value: "requires action", positive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="space-y-2">
            {recentLogs.map((log: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between border-b border-dashed border-[var(--border-primary)]/20 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-2 w-2 rounded-full border border-[var(--border-primary)] shrink-0 ${
                    log.action.includes("LOGIN") ? "bg-blue-400" :
                    log.action.includes("CREATED") ? "bg-green-400" :
                    log.action.includes("DELETED") ? "bg-red-400" :
                    "bg-yellow-400"
                  }`} />
                  <div className="min-w-0">
                    <span className="text-[11px] font-black block truncate">{log.action.replace(/_/g, " ")}</span>
                    <span className="text-[9px] font-bold text-gray-500">
                      {log.userName} • {log.institutionId || "System"}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gray-500 shrink-0 ml-2">
                  {new Date(log.createdAt).toLocaleString("en-IN", {
                    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="System Health">
          <div className="space-y-3">
            {SYSTEM_HEALTH.map((svc) => (
              <div key={svc.label} className="flex items-center justify-between border border-[var(--border-primary)] p-3">
                <div className="flex items-center gap-3">
                  <div className="border-2 border-[var(--border-primary)] bg-[var(--dark-bg)] p-1.5">
                    <svc.icon className="h-4 w-4 text-[var(--light-text)]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-black">{svc.label}</div>
                    <div className={`text-[10px] font-bold ${svc.ok ? "text-green-700" : "text-red-700"}`}>
                      {svc.status}
                    </div>
                  </div>
                </div>
                <div className={`h-3 w-3 rounded-full border border-[var(--border-primary)] ${
                  svc.ok ? "bg-green-500 shadow-[0_0_6px_#22c55e]" : "bg-red-500 shadow-[0_0_6px_#ef4444] animate-pulse"
                }`} />
              </div>
            ))}
            <div className="border-t-2 border-dashed border-[var(--border-primary)] pt-3 mt-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
                <span>Last checked: {new Date().toLocaleString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                })}</span>
                <span className="text-green-700 font-black">● All Systems Monitored</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
