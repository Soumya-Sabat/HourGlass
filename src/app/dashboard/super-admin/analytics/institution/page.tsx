"use client";

import { connectToDatabase } from "@/lib/db/mongoose";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
import { PageHeader, Table, ActionButton } from "@/components/super-admin/ui";

export default async function InstitutionAnalyticsPage() {
  await connectToDatabase();
  const institutions = await InstitutionModel.find().sort({ createdAt: -1 }).lean();

  const rows = institutions.map((inst) => [
    <span key="name" className="font-black text-[11px]">{inst.nameHash || inst._id?.toString().slice(-6)}</span>,
    <span key="tt" className="font-black">{Math.floor(Math.random() * 200) + 20}</span>,
    <span key="au">{Math.floor(Math.random() * 500) + 50}</span>,
    <span key="ru" className="font-black">{Math.floor(Math.random() * 40) + 60}%</span>,
    <span key="cr">{Math.floor(Math.random() * 5) + 1}%</span>,
    <div key="ac" className="flex gap-1">
      <ActionButton label="View" variant="ghost" />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Analytics"
        description="Detailed analytics per institution"
      />
      <Table
        headers={["Institution", "Timetables Generated", "Active Users", "Room Utilization", "Conflict Rate", "Actions"]}
        rows={rows}
      />
    </div>
  );
}
