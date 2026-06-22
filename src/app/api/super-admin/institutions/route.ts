import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
import { decryptValue, type EncryptedValue } from "@/helpers/crypto/encryption";

export const runtime = "nodejs";

function decryptField<T>(val: EncryptedValue | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return decryptValue<T>(val); } catch { return fallback; }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
    if (status === "pending") { filter.isVerified = false; filter.rejectedAt = null; }
    else if (status === "approved") { filter.isVerified = true; filter.rejectedAt = null; }
    else if (status === "rejected") { filter.rejectedAt = { $ne: null }; }
    else if (status === "suspended") filter.isVerified = "suspended";

    const docs = await InstitutionModel.find(filter).sort({ createdAt: -1 }).lean();

    const data = docs.map((d) => {
      const inst = d as Record<string, unknown>;
      return {
        _id: String(inst._id),
        institutionId: String(inst.institutionId || ""),
        name: decryptField<string>(inst.name as EncryptedValue, "Unknown"),
        type: decryptField<string>(inst.type as EncryptedValue, "Unknown"),
        contactPerson: decryptField<string>(inst.contactPerson as EncryptedValue, ""),
        contactEmail: decryptField<string>(inst.contactEmail as EncryptedValue, ""),
        contactPhone: decryptField<string>(inst.contactPhone as EncryptedValue, ""),
        isVerified: !!inst.isVerified,
        verifiedAt: inst.verifiedAt ? new Date(inst.verifiedAt as string).toISOString() : null,
        createdAt: inst.createdAt ? new Date(inst.createdAt as string).toISOString() : null,
      };
    });

    let filtered = data;
    if (type && type !== "All Types") {
      filtered = filtered.filter((i) => i.type.toLowerCase() === type.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((i) => i.name.toLowerCase().includes(q) || i.institutionId.toLowerCase().includes(q));
    }

    return NextResponse.json({ institutions: filtered });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch" }, { status: 500 });
  }
}
