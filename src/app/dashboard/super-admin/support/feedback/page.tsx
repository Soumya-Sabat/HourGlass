"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { Pencil, Trash2, CheckCircle } from "lucide-react";

export default function FeedbackPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/support/feedback");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback Management"
        description="Review and manage user feedback and suggestions"
      />

      <Table
        headers={["Institution", "User", "Type", "Description", "Status", "Date", "Actions"]}
        rows={data.map((f: any) => [
          <span key="inst">{f.institutionName || "—"}</span>,
          <span key="user">{f.userName || "—"}</span>,
          <StatusBadge key="type" status={f.feedbackType} />,
          <span key="desc" className="max-w-[200px] truncate block">{f.description}</span>,
          <StatusBadge key="stat" status={f.status} />,
          <span key="date" className="text-[10px]">{new Date(f.createdAt).toLocaleDateString()}</span>,
          <div key="actions" className="flex items-center gap-1">
            <ActionButton label="Review" variant="default" icon={CheckCircle} />
            <ActionButton label="Edit" variant="ghost" icon={Pencil} />
            <ActionButton label="Delete" variant="danger" icon={Trash2} />
          </div>,
        ])}
      />
    </div>
  );
}
