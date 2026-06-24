import { models, model, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";
import { EncryptedValueSchema } from "@/models/user/schemas/encrypted-value.schema";
import { UserRole } from "@/models/user/types/user-role.enum";

const OtpSchema = new Schema(
  {
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    lastSentAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    purpose: {
      type: String,
      enum: ["email-verification", "login"],
      required: true,
    },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      index: true,
    },
    emailHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    accountType: {
      type: String,
      enum: ["institution", "user"],
      default: "user",
      index: true,
    },
    institutionId: {
      type: String,
      index: true,
    },
    email: { type: EncryptedValueSchema, required: true },
    fullName: { type: EncryptedValueSchema, required: true },
    phoneNumber: { type: EncryptedValueSchema },
    designation: { type: EncryptedValueSchema },
    bio: { type: EncryptedValueSchema },
    skills: { type: EncryptedValueSchema },
    gender: { type: EncryptedValueSchema },
    nationality: { type: EncryptedValueSchema },
    dateOfBirth: { type: EncryptedValueSchema },
    address: { type: EncryptedValueSchema },
    yearsOfExperience: { type: EncryptedValueSchema },
    areasOfInterest: { type: EncryptedValueSchema },
    education: { type: EncryptedValueSchema },
    socialLinks: { type: EncryptedValueSchema },
    otp: { type: OtpSchema },
    isEmailVerified: { type: Boolean, default: false, index: true },
    emailVerifiedAt: { type: Date },
    department: { type: String, default: "", index: true },
    classGroup: { type: String, default: "" },
    section: { type: String, default: "" },
    batch: { type: String, default: "" },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

type User = InferSchemaType<typeof UserSchema>;

export type UserDocument = HydratedDocument<User>;

export const UserModel = models.User || model("User", UserSchema);
