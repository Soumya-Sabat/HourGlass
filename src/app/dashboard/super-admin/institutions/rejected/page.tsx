"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function RejectedInstitutionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/institutions?status=rejected");
      if (res.ok) setData((await res.json()).institutions || []);
    } catch {} finally { setLoading(false); }
  }

  const rows = data.map((inst: any) => [
    <span key="n" className="font-black">{inst.name}</span>,
    <span key="c">{inst.institutionId || "—"}</span>,
    <span key="t">{inst.type}</span>,
    <StatusBadge key="s" status="Rejected" />,
    <span key="d">{inst.createdAt ? new Date(inst.createdAt).toISOString().split("T")[0] : "—"}</span>,
    <div key="a" className="flex gap-1">
      <ActionButton label="Re-review" variant="default" icon={RotateCcw} />
    </div>,
  ]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rejected Institutions"
        description="Institution applications that have been rejected"
        actions={
          <Link href="/dashboard/super-admin/institutions">
            <ActionButton label="Back to All" variant="ghost" icon={ArrowLeft} />
          </Link>
        }
      />
      <Table
        headers={["Institution Name", "Institution Code", "Type", "Status", "Registration Date", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
