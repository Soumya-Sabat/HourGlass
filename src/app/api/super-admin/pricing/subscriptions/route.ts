import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { SubscriptionModel } from "@/models/pricing/schemas/subscription.schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await SubscriptionModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
