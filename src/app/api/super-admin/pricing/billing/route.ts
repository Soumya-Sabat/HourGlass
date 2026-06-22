import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BillingRecordModel } from "@/models/pricing/schemas/billing-record.schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await BillingRecordModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
