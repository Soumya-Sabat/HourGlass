import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
export const runtime = "nodejs";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const doc = await InstitutionModel.findById(id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await InstitutionModel.updateOne(
      { _id: id },
      { $set: { isVerified: false, rejectedAt: new Date() } },
    );

    return NextResponse.json({ message: "Rejected" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
