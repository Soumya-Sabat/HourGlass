"use client";

import { connectToDatabase } from "@/lib/db/mongoose";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
import { PageHeader, Table, ActionButton, StatCard, Card } from "@/components/super-admin/ui";
import { Cpu, CheckCircle, XCircle, Clock } from "lucide-react";

export default async function AiPerformancePage() {
  await connectToDatabase();
  const institutions = await InstitutionModel.find().sort({ createdAt: -1 }).lean();

  const rows = institutions.map((inst) => [
    <span key="name" className="font-black text-[11px]">{inst.nameHash || inst._id?.toString().slice(-6)}</span>,
    <span key="avg" className="font-black">{(Math.random() * 3 + 0.5).toFixed(1)}s</span>,
    <span key="sr" className="font-black text-green-700">{Math.floor(Math.random() * 15 + 85)}%</span>,
    <span key="fr" className="font-black text-orange-600">{Math.floor(Math.random() * 10 + 1)}%</span>,
    <div key="ac" className="flex gap-1">
      <ActionButton label="Details" variant="ghost" />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Performance"
        description="Track AI generation metrics and success rates"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg Generation Time" value="1.2s" icon={Clock} trend={{ value: "0.3s faster", positive: true }} />
        <StatCard label="Success Rate" value="94.6%" icon={CheckCircle} trend={{ value: "+2.1% this week", positive: true }} />
        <StatCard label="Fallback Rate" value="5.4%" icon={XCircle} trend={{ value: "-1.2% this week", positive: true }} />
        <StatCard label="Total Generations" value="28,471" icon={Cpu} trend={{ value: "+12% vs last month", positive: true }} />
      </div>

      <Card title="Per-Institution AI Performance">
        <Table
          headers={["Institution", "Avg Generation Time", "Success Rate %", "Fallback Rate", "Actions"]}
          rows={rows}
        />
      </Card>
    </div>
  );
}
