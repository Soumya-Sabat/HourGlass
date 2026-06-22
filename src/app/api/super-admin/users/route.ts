import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/models/user/schemas/user.schema";
import { decryptValue, type EncryptedValue } from "@/helpers/crypto/encryption";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;

    const docs = await UserModel.find(filter).sort({ createdAt: -1 }).lean();

    const data = docs.map((d) => {
      const u = d as Record<string, unknown>;
      function decrypt<T>(val: EncryptedValue | undefined, fallback: T): T {
        if (!val) return fallback;
        try { return decryptValue<T>(val); } catch { return fallback; }
      }
      return {
        _id: String(u._id),
        role: u.role,
        fullName: decrypt<string>(u.fullName as EncryptedValue, "Unknown"),
        email: decrypt<string>(u.email as EncryptedValue, ""),
        phoneNumber: decrypt<string>(u.phoneNumber as EncryptedValue, ""),
        institutionId: u.institutionId || "",
        isEmailVerified: !!u.isEmailVerified,
        createdAt: u.createdAt ? new Date(u.createdAt as string).toISOString() : null,
      };
    });

    let filtered = data;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }

    return NextResponse.json({ users: filtered });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
