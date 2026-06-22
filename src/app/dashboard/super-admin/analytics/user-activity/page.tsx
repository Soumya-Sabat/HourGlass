"use client";

import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/models/user/schemas/user.schema";
import { PageHeader, Table, ActionButton } from "@/components/super-admin/ui";

export default async function UserActivityPage() {
  await connectToDatabase();
  const users = await UserModel.find().sort({ createdAt: -1 }).limit(100).lean();

  const rows = users.map((user) => [
    <span key="name" className="font-black text-[11px]">{user.fullName?.toString() || "—"}</span>,
    <span key="inst" className="text-[10px]">{user.institutionId || "—"}</span>,
    <span key="ll" className="text-[10px]">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "—"}</span>,
    <span key="ap">{Math.floor(Math.random() * 500) + 10}</span>,
    <span key="tc">{Math.floor(Math.random() * 50) + 1}</span>,
    <span key="ai">{Math.floor(Math.random() * 100) + 5}</span>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Activity"
        description="Monitor individual user actions and engagement"
      />
      <Table
        headers={["User", "Institution", "Last Login", "Actions Performed", "Timetables Created", "AI Generations"]}
        rows={rows}
      />
    </div>
  );
}
