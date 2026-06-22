"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";

export default function SubscriptionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/pricing/subscriptions");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-black bg-white p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((sub: any) => [
    <span key="inst" className="font-black">{sub.institutionName || sub.institutionId?.toString()}</span>,
    <span key="plan">{sub.planName || "—"}</span>,
    <span key="sd" className="text-[10px]">{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "—"}</span>,
    <span key="ed" className="text-[10px]">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "—"}</span>,
    <StatusBadge key="st" status={sub.status} />,
    <StatusBadge key="ps" status={sub.paymentStatus} />,
    <div key="ac" className="flex gap-1">
      <ActionButton label="View" variant="ghost" />
      <ActionButton label="Cancel" variant="danger" />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="View and manage all institution subscriptions"
      />
      <Table
        headers={["Institution", "Plan", "Start Date", "End Date", "Status", "Payment Status", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
