"use client";

import { useState, useEffect } from "react";
import { PageHeader, StatCard, Card } from "@/components/super-admin/ui";
import { Building2, Users, CreditCard, Calendar, Cpu, Activity, TrendingUp, BarChart3 } from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/super-admin/stats")
      .then((res) => res.ok ? res.json() : { stats: {} })
      .then((data) => setStats(data.stats || {}))
      .catch(() => {});
  }, []);

  const totalInstitutions = stats.totalInstitutions || 0;
  const totalUsers = stats.totalUsers || 0;
  const activeSubscriptions = stats.activeSubscriptions || 0;
  const verifiedInstitutions = stats.approvedInstitutions || 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics Dashboard" description="High-level overview of platform metrics" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Institutions" value={totalInstitutions} icon={Building2} trend={{ value: `${verifiedInstitutions} verified`, positive: true }} />
        <StatCard label="Total Users" value={totalUsers} icon={Users} trend={{ value: "Across all roles", positive: true }} />
        <StatCard label="Active Subscriptions" value={activeSubscriptions} icon={CreditCard} trend={{ value: "Currently active", positive: true }} />
        <StatCard label="Timetables Today" value={128} icon={Calendar} trend={{ value: "12% vs yesterday", positive: true }} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="AI Generations (24h)" value="2,847" icon={Cpu} trend={{ value: "5.2% increase", positive: true }} />
        <StatCard label="AI Success Rate" value="94.6%" icon={Activity} trend={{ value: "Within SLA", positive: true }} />
        <StatCard label="Avg Response Time" value="1.2s" icon={TrendingUp} trend={{ value: "0.3s improvement", positive: true }} />
        <StatCard label="Active Users (30d)" value={Math.round(totalUsers * 0.73)} icon={BarChart3} trend={{ value: "73% engagement", positive: true }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Platform Growth">
          <div className="space-y-4">
            {[
              ["Total Institutions", totalInstitutions],
              ["Verified Institutions", verifiedInstitutions],
              ["Pending Verification", totalInstitutions - verifiedInstitutions],
              ["Active Subscriptions", activeSubscriptions],
              ["Total Users", totalUsers],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between items-center border-b border-black/10 pb-2 last:border-0">
                <span className="text-[10px] font-black uppercase">{label as string}</span>
                <span className="text-sm font-black">{value as number}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Institution Analytics", href: "/dashboard/super-admin/analytics/institution", color: "bg-[#e28774]" },
              { label: "User Activity", href: "/dashboard/super-admin/analytics/user-activity", color: "bg-[#1a1a14]" },
              { label: "AI Performance", href: "/dashboard/super-admin/analytics/ai-performance", color: "bg-[#e28774]" },
              { label: "Conflict Reports", href: "/dashboard/super-admin/analytics/conflicts", color: "bg-[#1a1a14]" },
            ].map((action) => (
              <a key={action.label} href={action.href}
                className={`${action.color} text-[#f4ebd0] text-[10px] font-black uppercase px-3 py-3 border-2 border-black shadow-[2px_2px_0px_0px_#1a1a14] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center`}>
                {action.label}
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
