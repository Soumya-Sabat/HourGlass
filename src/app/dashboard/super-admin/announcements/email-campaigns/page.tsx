"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function EmailCampaignsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/announcements/email-campaigns");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-black bg-white p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((c: any) => [
    <span key="n" className="font-black">{c.name}</span>,
    c.subject,
    c.totalRecipients || 0,
    c.sentCount || 0,
    <StatusBadge key="s" status={c.status} />,
    <div key="ac" className="flex items-center gap-2">
      <ActionButton label="View" variant="ghost" />
      {c.status === "Draft" && <ActionButton label="Send" variant="primary" />}
    </div>,
  ]);

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <PageHeader
        title="EMAIL CAMPAIGNS"
        description="Manage bulk email communications and campaigns"
        actions={<ActionButton label="New Campaign" variant="primary" icon={Plus} />}
      />
      <Table headers={["Campaign Name", "Subject", "Recipients", "Sent Count", "Status", "Actions"]} rows={rows} />
    </div>
  );
}
