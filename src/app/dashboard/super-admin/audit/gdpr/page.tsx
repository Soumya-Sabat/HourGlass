"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton, FilterBar } from "@/components/super-admin/ui";
import { GDPRRowActions } from "./row-actions";

export default function GDPRRequestsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/audit/gdpr");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-black bg-white p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((req: any) => [
    req._id.toString().slice(-6).toUpperCase(),
    req.userName || "—",
    req.institutionId || "—",
    <StatusBadge key="rt" status={req.requestType} />,
    <StatusBadge key="rs" status={req.status} />,
    new Date(req.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    <GDPRRowActions key="ra" id={req._id.toString()} status={req.status} />,
  ]);

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <PageHeader
        title="GDPR REQUESTS"
        description="Manage data access, deletion, and rectification requests"
        actions={<ActionButton label="Export All" variant="primary" />}
      />
      <Table headers={["Request ID", "User", "Institution", "Type", "Status", "Date", "Actions"]} rows={rows} />
    </div>
  );
}
