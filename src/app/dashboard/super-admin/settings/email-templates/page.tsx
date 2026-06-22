"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, ActionButton } from "@/components/super-admin/ui";
import { Plus, Pencil, Copy } from "lucide-react";

export default function EmailTemplatesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/settings/email-templates");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-black bg-white p-8 text-center text-[12px] font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Templates"
        description="Manage system email templates and variables"
        actions={<ActionButton label="Add Template" variant="primary" icon={Plus} />}
      />

      <Table
        headers={["Template Name", "Subject", "Variables", "Actions"]}
        rows={data.map((t: any) => [
          <span key="name" className="font-black">{t.name}</span>,
          <span key="subj" className="max-w-[240px] truncate block font-mono text-[10px]">{t.subject}</span>,
          <div key="vars" className="flex flex-wrap gap-1">
            {(t.variables || []).map((v: string) => (
              <span key={v} className="text-[9px] font-mono bg-[#eae3cb] px-1.5 py-0.5 border border-black">{`{{${v}}}`}</span>
            ))}
          </div>,
          <div key="actions" className="flex items-center gap-1">
            <ActionButton label="Edit" variant="default" icon={Pencil} />
            <ActionButton label="Duplicate" variant="ghost" icon={Copy} />
          </div>,
        ])}
      />
    </div>
  );
}
