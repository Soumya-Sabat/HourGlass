"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function PricingPlansPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/pricing/plans");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((plan: any) => [
    <span key="name" className="font-black">{plan.name}</span>,
    <span key="mp">₹{plan.priceMonthly}</span>,
    <span key="yp">₹{plan.priceYearly}</span>,
    <span key="feat" className="text-[10px] max-w-[180px] truncate block">{plan.features?.join(", ")}</span>,
    <span key="mu">{plan.maxUsers}</span>,
    <span key="mt">{plan.maxTimetablesPerMonth}</span>,
    <StatusBadge key="st" status={plan.isActive ? "Active" : "Disabled"} />,
    <div key="ac" className="flex gap-1">
      <ActionButton label="Edit" variant="ghost" />
      <ActionButton label={plan.isActive ? "Disable" : "Enable"} variant={plan.isActive ? "danger" : "default"} />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricing Plans"
        description="Manage subscription plans for institutions"
        actions={
          <Link href="/dashboard/super-admin/pricing/create">
            <ActionButton label="Create Plan" variant="primary" icon={Plus} />
          </Link>
        }
      />
      <Table
        headers={["Plan Name", "Monthly Price", "Yearly Price", "Features", "Max Users", "Max Timetables", "Status", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
