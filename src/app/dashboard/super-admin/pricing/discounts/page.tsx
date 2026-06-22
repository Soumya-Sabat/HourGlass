"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton } from "@/components/super-admin/ui";

export default function DiscountsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/pricing/coupons");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-black bg-white p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = data.map((coupon: any) => [
    <span key="code" className="font-mono font-black text-[11px]">{coupon.code}</span>,
    <span key="disc">
      {coupon.discountPercent > 0 ? `${coupon.discountPercent}%` : ""}
      {coupon.discountAmount > 0 ? `₹${coupon.discountAmount}` : ""}
      {!coupon.discountPercent && !coupon.discountAmount ? "—" : ""}
    </span>,
    <span key="val" className="text-[10px]">
      {coupon.validityStart ? new Date(coupon.validityStart).toLocaleDateString() : "—"}
      {" → "}
      {coupon.validityEnd ? new Date(coupon.validityEnd).toLocaleDateString() : "—"}
    </span>,
    <span key="mx">{coupon.maxUses}</span>,
    <span key="uc">{coupon.usedCount}</span>,
    <StatusBadge key="st" status={coupon.isActive ? "Active" : "Disabled"} />,
    <div key="ac" className="flex gap-1">
      <ActionButton label="Edit" variant="ghost" />
      <ActionButton label={coupon.isActive ? "Disable" : "Enable"} variant={coupon.isActive ? "danger" : "default"} />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts & Coupons"
        description="Manage promotional coupons and discount codes"
      />
      <Table
        headers={["Coupon Code", "Discount", "Validity", "Max Uses", "Used Count", "Status", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
