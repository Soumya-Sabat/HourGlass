import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
import { decryptValue, type EncryptedValue } from "@/helpers/crypto/encryption";

export const runtime = "nodejs";

function d<T>(val: EncryptedValue | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return decryptValue<T>(val); } catch { return fallback; }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const doc = await InstitutionModel.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 });
    }

    const inst = doc as Record<string, unknown>;
    const rawAddress = d<unknown>(inst.address as EncryptedValue, null);

    return NextResponse.json({
      institution: {
        _id: String(inst._id),
        institutionId: inst.institutionId ?? "",
        name: d<string>(inst.name as EncryptedValue, "Unknown"),
        type: d<string>(inst.type as EncryptedValue, "Unknown"),
        academicMode: d<string>(inst.academicMode as EncryptedValue, ""),
        affiliation: d<string>(inst.affiliation as EncryptedValue, ""),
        establishedYear: d<string>(inst.establishedYear as EncryptedValue, ""),
        website: d<string>(inst.website as EncryptedValue, ""),
        contactPerson: d<string>(inst.contactPerson as EncryptedValue, ""),
        contactEmail: d<string>(inst.contactEmail as EncryptedValue, ""),
        contactPhone: d<string>(inst.contactPhone as EncryptedValue, ""),
        address: typeof rawAddress === "string" ? safeJsonParse(rawAddress) : rawAddress,
        isVerified: !!inst.isVerified,
        verifiedAt: inst.verifiedAt ? new Date(inst.verifiedAt as string).toISOString() : null,
        createdAt: inst.createdAt ? new Date(inst.createdAt as string).toISOString() : null,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

function safeJsonParse(val: string): unknown {
  try { return JSON.parse(val); } catch { return val; }
}
