"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import Link from "next/link";
import { UserPlus, Eye } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  institution_admin: "Inst. Admin",
  department_admin: "Dept. Admin",
  department_head: "Dept. Head",
  faculty: "Faculty",
  reviewer: "Reviewer",
  student: "Student",
  admin: "Admin",
};

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/users");
      if (res.ok) setData((await res.json()).users || []);
    } catch {} finally { setLoading(false); }
  }

  const rows = data.map((u: any) => [
    <span key="n" className="font-black">{u.fullName}</span>,
    <span key="e" className="text-[10px]">{u.email}</span>,
    <span key="i">{u.institutionId || "—"}</span>,
    <span key="r">{ROLE_LABELS[u.role] || u.role}</span>,
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
        title="All Users"
        description={`Manage platform users, roles, and permissions`}
        actions={
          <Link href="/dashboard/super-admin/users/invite">
            <ActionButton label="Invite User" variant="primary" icon={UserPlus} />
          </Link>
        }
      />
      <Table
        headers={["Name", "Email", "Institution", "Role", "Status", "Last Login", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
