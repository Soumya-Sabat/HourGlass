"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";

export default function FacultyPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/users?role=faculty");
      if (res.ok) setData((await res.json()).users || []);
    } catch {} finally { setLoading(false); }
  }

  const rows = data.map((u: any) => [
    <span key="n" className="font-black">{u.fullName}</span>,
    <span key="e" className="text-[10px]">{u.email}</span>,
    <span key="i">{u.institutionId || "—"}</span>,
    <StatusBadge key="s" status={u.isEmailVerified ? "Active" : "Pending"} />,
    <span key="l">{u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "—"}</span>,
    <div key="a" className="flex gap-1">
      <ActionButton label="View" variant="ghost" icon={Eye} />
    </div>,
  ]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty"
        description="All faculty members across institutions"
        actions={
          <Link href="/dashboard/super-admin/users">
            <ActionButton label="Back to All Users" variant="ghost" icon={ArrowLeft} />
          </Link>
        }
      />
      <Table
        headers={["Name", "Email", "Institution", "Status", "Last Login", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
