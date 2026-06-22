import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/models/user/schemas/user.schema";
import { createLookupHash, encryptValue, normalizeEmail } from "@/helpers/crypto/encryption";
import { UserRole } from "@/models/user/types/user-role.enum";

export const runtime = "nodejs";

export async function POST() {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || process.env.NEXT_PUBLIC_STATIC_SUPER_ADMIN_EMAIL;
    if (!superAdminEmail) {
      return NextResponse.json({ error: "SUPER_ADMIN_EMAIL not configured" }, { status: 400 });
    }

    await connectToDatabase();

    const email = normalizeEmail(superAdminEmail);
    const emailHash = createLookupHash(email, "email");
    const existing = await UserModel.findOne({ emailHash });

    if (existing) {
      if (existing.role === UserRole.SuperAdmin) {
        return NextResponse.json({ message: "Super Admin already exists", email: superAdminEmail });
      }
      existing.role = UserRole.SuperAdmin;
      existing.isEmailVerified = true;
      await existing.save();
      return NextResponse.json({ message: "Existing user promoted to Super Admin", email: superAdminEmail });
    }

    await UserModel.create({
      role: UserRole.SuperAdmin,
      accountType: "user",
      emailHash,
      email: encryptValue(email),
      fullName: encryptValue("Super Admin"),
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });

    return NextResponse.json({ message: "Super Admin created successfully", email: superAdminEmail });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Seed failed" }, { status: 500 });
  }
}

// seeding the super-admin to the user
// Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/seed/super-admin"