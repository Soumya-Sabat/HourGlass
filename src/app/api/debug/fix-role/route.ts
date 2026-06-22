import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/models/user/schemas/user.schema";
import { createLookupHash, normalizeEmail } from "@/helpers/crypto/encryption";
import { UserRole } from "@/models/user/types/user-role.enum";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();
    const normalized = normalizeEmail(email);
    const emailHash = createLookupHash(normalized, "email");
    const user = await UserModel.findOne({ emailHash });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const oldRole = user.role;

    // Use updateOne to bypass Mongoose schema validation
    await UserModel.updateOne(
      { _id: user._id },
      { $set: { role: UserRole.InstitutionAdmin } },
    );

    return NextResponse.json({
      message: `Role changed from "${oldRole}" to "${UserRole.InstitutionAdmin}"`,
      email: normalized,
      oldRole,
      newRole: UserRole.InstitutionAdmin,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fix role" },
      { status: 500 },
    );
  }
}
