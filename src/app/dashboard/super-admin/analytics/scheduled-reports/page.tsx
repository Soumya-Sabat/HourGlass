"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";

export default function ScheduledReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/analytics/scheduled-reports");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((report: any) => [
    <span key="name" className="font-black text-[11px]">{report.name}</span>,
    <span key="freq" className="font-black text-[10px]">{report.frequency}</span>,
    <span key="rec" className="text-[10px] max-w-[180px] truncate block">
      {report.recipients?.join(", ") || "—"}
    </span>,
    <span key="ls" className="text-[10px]">{report.lastSentAt ? new Date(report.lastSentAt).toLocaleDateString() : "Never"}</span>,
    <StatusBadge key="st" status={report.isActive ? "Active" : "Disabled"} />,
    <div key="ac" className="flex gap-1">
      <ActionButton label={report.isActive ? "Disable" : "Enable"} variant={report.isActive ? "danger" : "primary"} />
      <ActionButton label="Edit" variant="ghost" />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scheduled Reports"
        description="Manage automated report scheduling and delivery"
      />
      <Table
        headers={["Report Name", "Frequency", "Recipients", "Last Sent", "Status", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
