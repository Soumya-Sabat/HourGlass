import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { SupportTicketModel } from "@/models/support/schemas/support-ticket.schema";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const filter: Record<string, unknown> = {};
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const items = await SupportTicketModel.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
