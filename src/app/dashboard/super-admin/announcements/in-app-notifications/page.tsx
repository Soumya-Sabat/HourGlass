"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { Plus } from "lucide-react";

const PRIORITY_COLORS: Record<string, string> = {
  Low: "text-green-700",
  Medium: "text-yellow-700",
  High: "text-red-700",
  Urgent: "text-red-900 font-black",
};

export default function InAppNotificationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/announcements/notifications");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((n: any) => [
    <span key="t" className="font-black">{n.title}</span>,
    <span key="m" className="text-gray-600 max-w-[200px] truncate block">{n.message}</span>,
    <span key="p" className={`text-[10px] font-black uppercase ${PRIORITY_COLORS[n.priority] || ""}`}>{n.priority}</span>,
    n.targetRole || "All",
    n.expiryDate ? new Date(n.expiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—",
    <StatusBadge key="s" status={n.expiryDate && new Date(n.expiryDate) < new Date() ? "Expired" : "Active"} />,
    <div key="ac" className="flex items-center gap-1">
      <ActionButton label="View" variant="ghost" />
      <ActionButton label="Dismiss" variant="danger" />
    </div>,
  ]);

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <PageHeader
        title="IN-APP NOTIFICATIONS"
        description="Push notifications displayed inside the application"
        actions={<ActionButton label="New Notification" variant="primary" icon={Plus} />}
      />
      <Table headers={["Title", "Message Preview", "Priority", "Target Users", "Expiry", "Status", "Actions"]} rows={rows} />
    </div>
  );
}
