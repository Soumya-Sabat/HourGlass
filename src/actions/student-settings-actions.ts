"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { encryptValue, type EncryptedValue } from "@/helpers/crypto/encryption";
import { AcademicProfileModel } from "@/models/academic/schemas/academic-profile.schema";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { UserRole } from "@/models/user/types/user-role.enum";
import { ChangeRequestModel } from "@/models/support/schemas/change-request.schema";
import { getCurrentUser } from "@/auth";

type EditableFields = {
  name?: string;
  phoneNumber?: string;
  classGroup?: string;
  section?: string;
  batch?: string;
  subjects?: string;
  preferredSlots?: string;
  bio?: string;
  skills?: string;
  address?: string;
  education?: string;
  socialLinks?: string;
};

const USER_ENCRYPTED_FIELDS = new Set([
  "name",
  "phoneNumber",
  "bio",
  "skills",
  "address",
  "education",
  "socialLinks",
]);

const USER_PLAIN_FIELDS = new Set([
  "classGroup",
  "section",
  "batch",
]);

const PROFILE_PLAIN_FIELDS = new Set([
  "subjects",
  "preferredSlots",
]);

const FIELD_TO_USER_KEY: Record<string, string> = {
  name: "fullName",
  phoneNumber: "phoneNumber",
  bio: "bio",
  skills: "skills",
  address: "address",
  education: "education",
  socialLinks: "socialLinks",
};

export type SaveResult = { success: true } | { success: false; error: string };

export async function updateStudentSettings(
  fields: EditableFields,
): Promise<SaveResult> {
  await connectToDatabase();

  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Session not found." };
  if (user.role !== UserRole.Student)
    return { success: false, error: "Not authorized." };

  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) return { success: false, error: "User not found." };

  const userUpdates: Record<string, EncryptedValue | string> = {};
  const profileUpdates: Record<string, string> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;

    if (USER_ENCRYPTED_FIELDS.has(key)) {
      const dbKey = FIELD_TO_USER_KEY[key];
      userUpdates[dbKey] = encryptValue(value);
    } else if (USER_PLAIN_FIELDS.has(key)) {
      userUpdates[key] = value;
    } else if (PROFILE_PLAIN_FIELDS.has(key)) {
      profileUpdates[key] = value;
    }
  }

  if (Object.keys(userUpdates).length > 0) {
    dbUser.set(userUpdates);
    await UserRepository.save(dbUser);
  }

  if (Object.keys(profileUpdates).length > 0) {
    await AcademicProfileModel.findOneAndUpdate(
      { userId: user.sub },
      { $set: profileUpdates },
      { upsert: true },
    );
  }

  return { success: true };
}

export type ChangeRequestInput = {
  fieldName: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
};

export async function submitChangeRequest(
  input: ChangeRequestInput,
): Promise<SaveResult> {
  await connectToDatabase();

  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Session not found." };
  if (user.role !== UserRole.Student)
    return { success: false, error: "Not authorized." };

  const dbUser = await UserRepository.findById(user.sub);
  const institutionId = dbUser?.institutionId ?? "";

  await ChangeRequestModel.create({
    userId: user.sub,
    institutionId,
    fieldName: input.fieldName,
    currentValue: input.currentValue,
    requestedValue: input.requestedValue,
    reason: input.reason,
  });

  return { success: true };
}
