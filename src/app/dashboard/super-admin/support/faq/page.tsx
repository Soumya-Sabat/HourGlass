"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function FAQPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/support/faq");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ Management"
        description="Manage frequently asked questions across categories"
        actions={<ActionButton label="Add FAQ" variant="primary" icon={Plus} />}
      />

      <Table
        headers={["Question", "Answer", "Category", "Order", "Actions"]}
        rows={data.map((f: any) => [
          <span key="q" className="max-w-[200px] truncate block font-black">{f.question}</span>,
          <span key="a" className="max-w-[280px] truncate block">{f.answer}</span>,
          <StatusBadge key="cat" status={f.category} />,
          <span key="ord" className="text-[10px] font-mono">{f.order}</span>,
          <div key="actions" className="flex items-center gap-1">
            <ActionButton label="Edit" variant="ghost" icon={Pencil} />
            <ActionButton label="Delete" variant="danger" icon={Trash2} />
          </div>,
        ])}
      />
    </div>
  );
}
