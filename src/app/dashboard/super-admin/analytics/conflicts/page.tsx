"use client";

import { connectToDatabase } from "@/lib/db/mongoose";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
import { PageHeader, Table, StatusBadge, ActionButton, StatCard, Card } from "@/components/super-admin/ui";
import { GitBranch, AlertTriangle, Clock, CheckCircle } from "lucide-react";

const CONFLICT_TYPES = ["Room", "Faculty", "Time", "Resource"];
const CONFLICT_TABLE_DATA = [
  { type: "Room Double-Booking", count: 12, avgResolution: "2.4h", cause: "Scheduling overlap" },
  { type: "Faculty Clash", count: 8, avgResolution: "1.8h", cause: "Faculty assigned to multiple slots" },
  { type: "Time Conflict", count: 5, avgResolution: "0.9h", cause: "Back-to-back cross-campus" },
  { type: "Resource Unavailable", count: 3, avgResolution: "3.2h", cause: "Lab equipment maintenance" },
];

export default async function ConflictsPage() {
  await connectToDatabase();
  const institutions = await InstitutionModel.find().lean();

  const rows = institutions.map((inst) => [
    <span key="name" className="font-black text-[11px]">{inst.nameHash || inst._id?.toString().slice(-6)}</span>,
    <span key="ct">{CONFLICT_TYPES[Math.floor(Math.random() * CONFLICT_TYPES.length)]}</span>,
    <span key="cnt" className="font-black">{Math.floor(Math.random() * 20) + 1}</span>,
    <span key="rt" className="text-[10px]">{(Math.random() * 4 + 0.5).toFixed(1)}h</span>,
    <span key="cause" className="text-[10px] max-w-[200px] truncate block">Scheduling conflict detected</span>,
    <div key="ac" className="flex gap-1">
      <ActionButton label="Resolve" variant="primary" />
      <ActionButton label="Details" variant="ghost" />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conflict Reports"
        description="View and resolve scheduling conflicts across institutions"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Conflicts" value="28" icon={GitBranch} trend={{ value: "-12% this week", positive: true }} />
        <StatCard label="Open Conflicts" value="9" icon={AlertTriangle} trend={{ value: "Needs attention", positive: false }} />
        <StatCard label="Avg Resolution Time" value="2.1h" icon={Clock} trend={{ value: "0.5h faster", positive: true }} />
        <StatCard label="Resolved Today" value="4" icon={CheckCircle} trend={{ value: "+2 vs yesterday", positive: true }} />
      </div>

      <Card title="Conflict Breakdown">
        <div className="space-y-3">
          {CONFLICT_TABLE_DATA.map((item) => (
            <div key={item.type} className="flex items-center justify-between p-3 border-2 border-[var(--border-primary)] bg-[var(--surface-white)]">
              <div className="flex-1">
                <div className="text-[11px] font-black">{item.type}</div>
                <div className="text-[9px] font-bold text-gray-500 mt-0.5">{item.cause}</div>
              </div>
              <div className="flex items-center gap-4 text-center">
                <div>
                  <div className="text-[9px] font-black uppercase opacity-60">Count</div>
                  <div className="text-sm font-black">{item.count}</div>
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase opacity-60">Avg Resolve</div>
                  <div className="text-sm font-black">{item.avgResolution}</div>
                </div>
                <ActionButton label="View Details" variant="ghost" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Per-Institution Conflicts">
        <Table
          headers={["Institution", "Conflict Type", "Count", "Resolution Time", "Causes", "Actions"]}
          rows={rows}
        />
      </Card>
    </div>
  );
}
