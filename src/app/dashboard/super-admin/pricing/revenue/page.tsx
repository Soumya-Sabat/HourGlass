"use client";

import { connectToDatabase } from "@/lib/db/mongoose";
import { BillingRecordModel } from "@/models/pricing/schemas/billing-record.schema";
import { SubscriptionModel } from "@/models/pricing/schemas/subscription.schema";
import { PageHeader, StatCard, Card } from "@/components/super-admin/ui";
import { TrendingUp, DollarSign, Users, Activity, BarChart3 } from "lucide-react";

const MOCK_MONTHLY_REVENUE = [
  { month: "Jan", rev: 42000 },
  { month: "Feb", rev: 48000 },
  { month: "Mar", rev: 51000 },
  { month: "Apr", rev: 47000 },
  { month: "May", rev: 56000 },
  { month: "Jun", rev: 62000 },
  { month: "Jul", rev: 59000 },
  { month: "Aug", rev: 64000 },
  { month: "Sep", rev: 68000 },
  { month: "Oct", rev: 71000 },
  { month: "Nov", rev: 75000 },
  { month: "Dec", rev: 82000 },
];

export default async function RevenuePage() {
  await connectToDatabase();

  const billingRecords = await BillingRecordModel.find({ status: "Paid" }).lean();
  const totalRevenue = billingRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
  const activeSubs = await SubscriptionModel.countDocuments({ status: "Active" });
  const newSubsThisMonth = await SubscriptionModel.countDocuments({
    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
  });

  const mrr = activeSubs * 4999;
  const churnRate = "2.4%";
  const maxRev = Math.max(...MOCK_MONTHLY_REVENUE.map((d) => d.rev));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Analytics"
        description="Monitor platform revenue, MRR, and growth metrics"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: "12.3% vs last month", positive: true }}
        />
        <StatCard
          label="Monthly Recurring Revenue (MRR)"
          value={`₹${mrr.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: "8.1% vs last month", positive: true }}
        />
        <StatCard
          label="New Subscriptions (30d)"
          value={newSubsThisMonth}
          icon={Users}
          trend={{ value: "3 vs previous period", positive: true }}
        />
        <StatCard
          label="Churn Rate"
          value={churnRate}
          icon={Activity}
          trend={{ value: "0.3% improvement", positive: true }}
        />
      </div>

      <Card title="Annual Revenue Overview">
        <div className="space-y-3 pt-2">
          <div className="flex items-end justify-between h-40 gap-1">
            {MOCK_MONTHLY_REVENUE.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[var(--accent)] border border-[var(--border-primary)] transition-all hover:opacity-80"
                  style={{ height: `${(item.rev / maxRev) * 100}%` }}
                />
                <span className="text-[8px] font-black uppercase">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[9px] font-bold text-[var(--text-primary)]/60 pt-2 border-t border-[var(--border-primary)]/10">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-[var(--accent)] border border-[var(--border-primary)] inline-block" />
              <span>Monthly Revenue</span>
            </div>
            <span>Total: ₹{MOCK_MONTHLY_REVENUE.reduce((s, d) => s + d.rev, 0).toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <Card title="Key Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)]">
            <div className="text-[10px] font-black uppercase tracking-wider opacity-70">Avg. Revenue / Sub</div>
            <div className="text-xl font-black mt-1">₹{(totalRevenue / (activeSubs || 1)).toLocaleString()}</div>
          </div>
          <div className="p-4 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)]">
            <div className="text-[10px] font-black uppercase tracking-wider opacity-70">Active Subscriptions</div>
            <div className="text-xl font-black mt-1">{activeSubs}</div>
          </div>
          <div className="p-4 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)]">
            <div className="text-[10px] font-black uppercase tracking-wider opacity-70">Projected Annual Run Rate</div>
            <div className="text-xl font-black mt-1">₹{(mrr * 12).toLocaleString()}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
