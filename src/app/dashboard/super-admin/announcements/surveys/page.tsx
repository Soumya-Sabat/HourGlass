"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { Plus } from "lucide-react";

export default function SurveysPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/announcements/surveys");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((s: any) => [
    <span key="n" className="font-black">{s.name}</span>,
    s.targetAudience || "All",
    s.startDate ? new Date(s.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—",
    s.endDate ? new Date(s.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—",
    s.responses || 0,
    <StatusBadge key="s" status={s.status} />,
    <div key="ac" className="flex items-center gap-2">
      <ActionButton label="View" variant="ghost" />
      <ActionButton label="Results" variant="default" />
      {s.status === "Active" && <ActionButton label="Close" variant="danger" />}
    </div>,
  ]);

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <PageHeader
        title="SURVEYS"
        description="Create and manage surveys for feedback collection"
        actions={<ActionButton label="New Survey" variant="primary" icon={Plus} />}
      />
      <Table headers={["Survey Name", "Target Audience", "Start Date", "End Date", "Responses", "Status", "Actions"]} rows={rows} />
    </div>
  );
}
