"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";

export default function RefundsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/pricing/refunds");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-black bg-white p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((refund: any) => [
    <span key="inst" className="font-black">{refund.institutionName || refund.institutionId?.toString()}</span>,
    <span key="amt" className="font-black">₹{refund.amount?.toLocaleString()}</span>,
    <span key="rsn" className="max-w-[200px] truncate block text-[10px]">{refund.reason}</span>,
    <span key="dt" className="text-[10px]">{refund.createdAt ? new Date(refund.createdAt).toLocaleDateString() : "—"}</span>,
    <StatusBadge key="st" status={refund.status} />,
    <div key="ac" className="flex gap-1">
      {refund.status === "Pending" && (
        <>
          <ActionButton label="Approve" variant="primary" />
          <ActionButton label="Reject" variant="danger" />
        </>
      )}
      {refund.status !== "Pending" && <ActionButton label="View" variant="ghost" />}
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refunds"
        description="Process and review refund requests"
      />
      <Table
        headers={["Institution", "Amount", "Reason", "Date", "Status", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
