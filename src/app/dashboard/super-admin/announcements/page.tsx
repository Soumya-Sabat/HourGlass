"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton, FilterBar } from "@/components/super-admin/ui";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AnnouncementsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/announcements");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-black bg-white p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((a: any) => [
    <span key="t" className="font-black">{a.title}</span>,
    a.targetAudience || "All",
    a.scheduledDate ? new Date(a.scheduledDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—",
    <StatusBadge key="s" status={a.status} />,
    <div key="ac" className="flex items-center gap-2">
      <ActionButton label="View" variant="ghost" />
      <ActionButton label="Edit" variant="default" />
      {a.status === "Draft" && <ActionButton label="Publish" variant="primary" />}
    </div>,
  ]);

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <PageHeader
        title="ANNOUNCEMENTS"
        description="Create and manage system-wide announcements"
        actions={
          <Link href="/dashboard/super-admin/announcements/create">
            <ActionButton label="New Announcement" variant="primary" icon={Plus} />
          </Link>
        }
      />
      <Table headers={["Title", "Target Audience", "Scheduled Date", "Status", "Actions"]} rows={rows} />
    </div>
  );
}
