"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader, Table, StatusBadge, FilterBar } from "@/components/super-admin/ui";
import { FilterActions } from "./filter-actions";

export default function AuditLogsPage() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action") || "";
  const [data, setData] = useState<any[]>([]);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [action]);

  async function fetchData() {
    setLoading(true);
    try {
      const url = action ? `/api/super-admin/audit/logs?action=${encodeURIComponent(action)}` : "/api/super-admin/audit/logs";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setData(json.items || []);
        if (json.actionTypes) setActionTypes(json.actionTypes);
      }
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-black bg-white p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((log: any) => [
    new Date(log.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    <StatusBadge key="a" status={log.action.replace(/_/g, " ")} />,
    log.userName || "—",
    log.institutionId || "—",
    log.details || "—",
    log.ipAddress || "—",
  ]);

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <PageHeader title="AUDIT LOGS" description="System-wide activity tracking and compliance trail" />
      <FilterBar>
        <FilterActions actionTypes={actionTypes} currentAction={action || ""} />
      </FilterBar>
      <Table headers={["Timestamp", "Action", "User", "Institution", "Details", "IP Address"]} rows={rows} />
    </div>
  );
}
