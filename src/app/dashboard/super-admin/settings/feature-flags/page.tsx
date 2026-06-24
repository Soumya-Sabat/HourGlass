"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { Plus, ToggleLeft, ToggleRight } from "lucide-react";

export default function FeatureFlagsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/settings/feature-flags");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Flags"
        description="Enable or disable system features across the platform"
        actions={<ActionButton label="Add Flag" variant="primary" icon={Plus} />}
      />

      <Table
        headers={["Feature Name", "Description", "Status", "Actions"]}
        rows={data.map((f: any) => [
          <span key="name" className="font-mono text-[10px] font-black">{f.name}</span>,
          <span key="desc" className="max-w-[280px] block">{f.description}</span>,
          <StatusBadge key="stat" status={f.isEnabled ? "Enabled" : "Disabled"} />,
          <div key="actions" className="flex items-center gap-1">
            <ActionButton
              label={f.isEnabled ? "Disable" : "Enable"}
              variant={f.isEnabled ? "danger" : "primary"}
              icon={f.isEnabled ? ToggleLeft : ToggleRight}
            />
          </div>,
        ])}
      />
    </div>
  );
}
