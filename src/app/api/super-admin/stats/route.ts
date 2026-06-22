import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
import { UserModel } from "@/models/user/schemas/user.schema";
import { SubscriptionModel } from "@/models/pricing/schemas/subscription.schema";
import { SupportTicketModel } from "@/models/support/schemas/support-ticket.schema";
import { UserRole } from "@/models/user/types/user-role.enum";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    const totalInstitutions = await InstitutionModel.countDocuments();
    const pendingInstitutions = await InstitutionModel.countDocuments({ isVerified: false });
    const approvedInstitutions = await InstitutionModel.countDocuments({ isVerified: true });
    const totalUsers = await UserModel.countDocuments();
    const superAdmins = await UserModel.countDocuments({ role: UserRole.SuperAdmin });
    const totalSubscriptions = await SubscriptionModel.countDocuments();
    const activeSubscriptions = await SubscriptionModel.countDocuments({ status: "Active" });
    const openTickets = await SupportTicketModel.countDocuments({ status: "Open" });

    return NextResponse.json({
      stats: {
        totalInstitutions,
        pendingInstitutions,
        approvedInstitutions,
        totalUsers,
        superAdmins,
        totalSubscriptions,
        activeSubscriptions,
        openTickets,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
