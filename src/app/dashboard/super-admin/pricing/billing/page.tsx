"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";

export default function BillingPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/pricing/billing");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((rec: any) => [
    <span key="inst" className="font-black">{rec.institutionName || rec.institutionId?.toString()}</span>,
    <span key="inv" className="text-[10px] font-mono">{rec.invoiceNumber || "—"}</span>,
    <span key="amt">₹{rec.amount?.toLocaleString()}</span>,
    <span key="dt" className="text-[10px]">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "—"}</span>,
    <span key="pm">{rec.paymentMethod}</span>,
    <StatusBadge key="st" status={rec.status} />,
    <div key="ac" className="flex gap-1">
      <ActionButton label="View" variant="ghost" />
      <ActionButton label="Download" variant="ghost" />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing History"
        description="View all billing records and invoices"
      />
      <Table
        headers={["Institution", "Invoice #", "Amount", "Date", "Payment Method", "Status", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
