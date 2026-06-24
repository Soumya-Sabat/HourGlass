"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { CheckCircle, MessageSquare } from "lucide-react";

export default function InProgressTicketsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/support/tickets?status=In Progress");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="In Progress Tickets"
        description="Tickets currently being worked on by support staff"
      />

      <Table
        headers={["Ticket ID", "Institution", "User", "Subject", "Priority", "Status", "Date", "Actions"]}
        rows={data.map((t: any) => [
          <span key="id" className="font-mono text-[10px]">{t.ticketId || t._id}</span>,
          <span key="inst">{t.institutionName || "—"}</span>,
          <span key="user">{t.userName || "—"}</span>,
          <span key="subj" className="max-w-[160px] truncate block">{t.subject}</span>,
          <StatusBadge key="pri" status={t.priority} />,
          <StatusBadge key="stat" status={t.status} />,
          <span key="date" className="text-[10px]">{new Date(t.createdAt).toLocaleDateString()}</span>,
          <div key="actions" className="flex items-center gap-1">
            <ActionButton label="Comment" variant="ghost" icon={MessageSquare} />
            <ActionButton label="Resolve" variant="primary" icon={CheckCircle} />
          </div>,
        ])}
      />
    </div>
  );
}
