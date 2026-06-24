"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

export default function APIKeysPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/settings/api-keys");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Manage third-party service integrations and API credentials"
        actions={<ActionButton label="Add API Key" variant="primary" icon={Plus} />}
      />

      <Table
        headers={["Service Name", "Status", "Last Used", "Rate Limit", "Actions"]}
        rows={data.map((k: any) => [
          <span key="name" className="font-black">{k.serviceName}</span>,
          <StatusBadge key="stat" status={k.isActive ? "Enabled" : "Disabled"} />,
          <span key="last" className="text-[10px]">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}</span>,
          <span key="rate" className="font-mono text-[10px]">{k.rateLimitPerMinute} req/min</span>,
          <div key="actions" className="flex items-center gap-1">
            <ActionButton label="Edit" variant="ghost" icon={Pencil} />
            <ActionButton label="Rotate" variant="default" icon={RefreshCw} />
            <ActionButton label="Delete" variant="danger" icon={Trash2} />
          </div>,
        ])}
      />
    </div>
  );
}
