"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { decryptValue, type EncryptedValue } from "@/helpers/crypto/encryption";
import { AcademicProfileModel } from "@/models/academic/schemas/academic-profile.schema";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { UserRole } from "@/models/user/types/user-role.enum";
import { getCurrentUser } from "@/auth";

type EncryptedField = EncryptedValue | string | number | boolean | string[] | Record<string, unknown> | undefined | null;

export type DashboardSessionSummary = {
  name: string;
  role: string;
  institutionName: string;
  institutionId: string;
  phoneNumber: string;
};

export type StudentSettingsData = {
  account: {
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    institutionName: string;
    institutionId: string;
    emailVerified: string;
  };
  studentProfile: Record<string, string>;
  institution: Record<string, string>;
  personalDetails: Record<string, string>;
};

function isEncryptedValue(value: unknown): value is EncryptedValue {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;
  return ["cipherText", "iv", "salt", "tag"].every((key) => typeof record[key] === "string");
}

function decryptOptionalValue<T>(value: EncryptedField): T | undefined {
  if (value === undefined || value === null) return undefined;

  if (isEncryptedValue(value)) {
    return decryptValue<T>(value);
  }

  return value as T;
}

function displayValue(value: unknown) {
  if (value === undefined || value === null) return "Not available";
  if (typeof value === "string") return value.trim() || "Not available";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not available";

  return JSON.stringify(value, null, 2);
}

function encryptedToString(value: EncryptedField) {
  return displayValue(decryptOptionalValue<unknown>(value));
}

function profileRecord(profile: Record<string, unknown>, keys: string[]) {
  return Object.fromEntries(
    keys.map((key) => [
      key,
      encryptedToString(profile[key] as EncryptedField),
    ]),
  );
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

export async function getDashboardSessionSummary(): Promise<DashboardSessionSummary> {
  await connectToDatabase();

  const user = await getCurrentUser();
  if (!user) throw new Error("Session not found.");

  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User profile not found.");

  const institutionId = dbUser.institutionId || "Not available";
  const institution = await InstitutionModel.findOne({ institutionId });
  const institutionName = institution?.name ? encryptedToString(institution.name as EncryptedField) : "Not available";

  return {
    name: encryptedToString(dbUser.fullName as EncryptedField),
    role: dbUser.role,
    institutionName,
    institutionId,
    phoneNumber: encryptedToString(dbUser.phoneNumber as EncryptedField),
  };
}

export async function getStudentSettingsData(): Promise<StudentSettingsData> {
  await connectToDatabase();

  const user = await getCurrentUser();
  if (!user) throw new Error("Session not found.");

  if (user.role !== UserRole.Student) {
    throw new Error("Student settings are not available for this role.");
  }

  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User profile not found.");

  const institutionId = dbUser.institutionId || "Not available";
  const institution = await InstitutionModel.findOne({ institutionId });
  const profile = await AcademicProfileModel.findOne({ userId: user.sub });
  const profileRecordData = profile ? toRecord(profile.toObject()) : {};
  const institutionRecordData = institution ? toRecord(institution.toObject()) : {};
  const userRecordData = toRecord(dbUser.toObject());
  const institutionKeys = [
    "name",
    "type",
    "academicMode",
    "affiliation",
    "establishedYear",
    "website",
    "contactPerson",
    "contactEmail",
    "contactPhone",
    "address",
    "academicYear",
    "timetableCycle",
    "workingDays",
    "periodDurationMinutes",
    "dailyPeriods",
    "breakSlots",
    "departmentsOrSections",
    "classroomResources",
    "approvalWorkflow",
    "schedulingRules",
  ];
  const personalKeys = [
    "designation",
    "bio",
    "skills",
    "gender",
    "nationality",
    "dateOfBirth",
    "address",
    "yearsOfExperience",
    "areasOfInterest",
    "education",
    "socialLinks",
  ];

  return {
    account: {
      name: encryptedToString(dbUser.fullName as EncryptedField),
      email: encryptedToString(dbUser.email as EncryptedField),
      role: dbUser.role,
      phoneNumber: encryptedToString(dbUser.phoneNumber as EncryptedField),
      institutionName: institution?.name ? encryptedToString(institution.name as EncryptedField) : "Not available",
      institutionId,
      emailVerified: String(Boolean(dbUser.isEmailVerified)),
    },
    studentProfile: profileRecord(profileRecordData, [
      "studentId",
      "programOrClass",
      "batchOrSection",
      "subjects",
      "preferredSlots",
    ]),
    institution: profileRecord(institutionRecordData, institutionKeys),
    personalDetails: {
      ...profileRecord(userRecordData, personalKeys),
      ...profileRecord(profileRecordData, personalKeys),
    },
  };
}
