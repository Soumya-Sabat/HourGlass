import { connectToDatabase } from "@/lib/db/mongoose";
import {
  createLookupHash,
  decryptValue,
  encryptValue,
  normalizeEmail,
  type EncryptedValue,
} from "@/helpers/crypto/encryption";
import { generateOtp, hashOtp, verifyOtp } from "@/helpers/security/otp";
import { sendOtpEmail } from "@/helpers/email/send-otp";
import { InstitutionModel, type InstitutionDocument } from "@/models/institution/schemas/institution.schema";
import type { CreateUserDto } from "@/models/user/dto/create-user.dto";
import type { LoginDto } from "@/models/user/dto/login.dto";
import type { VerifyEmailDto } from "@/models/user/dto/verify-email.dto";
import { FounderProfileModel } from "@/models/founder/schemas/founder-profile.schema";
import { IncubatorProfileModel } from "@/models/incubator/schemas/incubator-profile.schema";
import { IndustryProfileModel } from "@/models/industry/schemas/industry-profile.schema";
import { InvestorProfileModel } from "@/models/investor/schemas/investor-profile.schema";
import { ProfessorProfileModel } from "@/models/professor/schemas/professor-profile.schema";
import { ResearcherProfileModel } from "@/models/researcher/schemas/researcher-profile.schema";
import { StudentProfileModel } from "@/models/student/schemas/student-profile.schema";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { UserRole } from "@/models/user/types/user-role.enum";
import mongoose from "mongoose"; // Moved global import to the top

const OTP_TTL_MS = 10 * 60 * 1_000;
const MAX_OTP_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 30 * 1_000;

type OtpPurpose = "email-verification" | "login";
type ProfileModel = {
  create(data: Record<string, unknown>): Promise<unknown>;
};
const roleProfileModels: Partial<Record<UserRole, ProfileModel>> = {
  [UserRole.Professor]: ProfessorProfileModel,
  [UserRole.Researcher]: ResearcherProfileModel,
  [UserRole.Industry]: IndustryProfileModel,
  [UserRole.Founder]: FounderProfileModel,
  [UserRole.Incubator]: IncubatorProfileModel,
  [UserRole.Investor]: InvestorProfileModel,
  [UserRole.Student]: StudentProfileModel,
};

// Inline helper to compile/retrieve the Admin model cleanly
function getAdminOtpModel() {
  const adminSchema = new mongoose.Schema(
    {
      emailHash: { type: String, required: true, unique: true },
      hash: { type: String, required: true },
      salt: { type: String, required: true },
      expiresAt: { type: Date, required: true },
      attempts: { type: Number, default: 0 },
    },
    { timestamps: true, collection: "admin" }
  );
  return mongoose.models.Admin || mongoose.model("Admin", adminSchema);
}

function createOtpPayload(otp: string, purpose: OtpPurpose) {
  const hashedOtp = hashOtp(otp);
  const now = new Date();

  return {
    ...hashedOtp,
    expiresAt: new Date(now.getTime() + OTP_TTL_MS),
    lastSentAt: now,
    attempts: 0,
    purpose,
  };
}

function toAuthUser(user: { _id: { toString(): string }; role: string; isEmailVerified: boolean; fullName?: unknown }) {
  const fullName = user.fullName ? decryptValue<string>(user.fullName as EncryptedValue) : null;

  return {
    id: user._id.toString(),
    role: user.role,
    name: fullName || "User",
    isEmailVerified: user.isEmailVerified,
  };
}

function hasProfileValue(value: unknown) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function encryptedProfileData(profile: CreateUserDto["profile"] = {}) {
  return Object.fromEntries(
    Object.entries(profile)
      .filter(([, value]) => hasProfileValue(value))
      .map(([key, value]) => [key, encryptValue(value)]),
  );
}

function cleanInstitutionIdSeed(value: unknown) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function generateInstitutionIdSeed(
  institutionName: string,
  city: string | undefined,
  createdAt: Date,
  attempt: number,
) {
  const nameSeed = cleanInstitutionIdSeed(institutionName).slice(0, 3).padEnd(3, "X");
  const citySeed = cleanInstitutionIdSeed(city).slice(0, 1).padEnd(1, "0");
  const yearSeed = String(createdAt.getFullYear()).slice(-2);
  const attemptSeed = attempt.toString(36).toUpperCase().slice(-1);

  return `${nameSeed}${citySeed}${yearSeed}${attemptSeed}`.slice(0, 7);
}

async function generateInstitutionId(institution: InstitutionDocument) {
  if (institution.institutionId) {
    return institution.institutionId;
  }

  const institutionName = decryptValue<string>(institution.name as EncryptedValue);
  const address = institution.address
    ? decryptValue<{ city?: string }>(institution.address as EncryptedValue)
    : undefined;

  for (let attempt = 0; attempt < 36; attempt += 1) {
    const institutionId = generateInstitutionIdSeed(
      institutionName,
      address?.city,
      institution.createdAt ?? new Date(),
      attempt,
    );
    const existingInstitution = await InstitutionModel.findOne({ institutionId });

    if (!existingInstitution) {
      institution.institutionId = institutionId;
      institution.institutionIdGeneratedAt = new Date();
      await institution.save();
      return institutionId;
    }
  }

  throw new Error("Unable to generate a unique institution ID.");
}

async function createInstitutionProfile(userId: unknown, input: CreateUserDto["institution"]) {
  if (!input?.name || !input.type || !input.contactPerson || !input.contactEmail) {
    throw new Error("Institution registration requires complete academic and contact details.");
  }

  return InstitutionModel.create({
    ownerUserId: userId,
    nameHash: createLookupHash(input.name, "institution-name"),
    name: encryptValue(input.name),
    type: encryptValue(input.type),
    affiliation: input.affiliation ? encryptValue(input.affiliation) : undefined,
    establishedYear: input.establishedYear !== undefined ? encryptValue(input.establishedYear) : undefined,
    website: input.website ? encryptValue(input.website) : undefined,
    contactPerson: encryptValue(input.contactPerson),
    contactEmail: encryptValue(normalizeEmail(input.contactEmail)),
    contactPhone: input.contactPhone ? encryptValue(input.contactPhone) : undefined,
    address: input.address ? encryptValue(input.address) : undefined,
  });
}

async function createRoleProfile(userId: unknown, role: UserRole, profile: CreateUserDto["profile"]) {
  const profileModel = roleProfileModels[role];
  if (!profileModel) return;

  await profileModel.create({
    userId,
    ...encryptedProfileData(profile),
  });
}

function getResendCooldownSeconds(
  user: { otp?: { purpose: string; lastSentAt: Date } | null },
  purpose: OtpPurpose,
) {
  if (!user.otp || user.otp.purpose !== purpose) return 0;

  const elapsed = Date.now() - user.otp.lastSentAt.getTime();
  const remaining = OTP_RESEND_COOLDOWN_MS - elapsed;

  return remaining > 0 ? Math.ceil(remaining / 1_000) : 0;
}

function assertCanSendOtp(user: { otp?: { purpose: string; lastSentAt: Date } | null }, purpose: OtpPurpose) {
  const retryAfter = getResendCooldownSeconds(user, purpose);
  if (retryAfter > 0) {
    throw new Error(`Please wait ${retryAfter} seconds before requesting another OTP.`);
  }
}

export class UserService {
  static async lookupInstitution(institutionId: string) {
    await connectToDatabase();

    const normalizedInstitutionId = institutionId.trim().toUpperCase();
    const institution = await InstitutionModel.findOne({
      institutionId: normalizedInstitutionId,
      isVerified: true,
    });

    if (!institution) {
      throw new Error("Institution ID was not found or is not verified yet.");
    }

    return { institutionId: normalizedInstitutionId };
  }

  static async createUser(input: CreateUserDto) {
    await connectToDatabase();

    const email = normalizeEmail(input.email);
    const emailHash = createLookupHash(email, "email");
    const existingUser = await UserRepository.findByEmailHash(emailHash);
    const accountType = input.accountType ?? "user";

    if (accountType === "user") {
      const institutionId = input.institutionId?.toUpperCase();

      if (!institutionId) {
        throw new Error("Institution ID is required for user registration.");
      }

      const institution = await InstitutionModel.findOne({ institutionId, isVerified: true });

      if (!institution) {
        throw new Error("Institution ID was not found or is not verified yet.");
      }
    }

    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        const retryAfter = getResendCooldownSeconds(existingUser, "email-verification");

        if (retryAfter > 0) {
          return {
            userId: existingUser._id.toString(),
            email,
            emailSent: false,
            verificationRequired: true,
            message: `This account is already pending verification. Continue to verification or request another OTP in ${retryAfter} seconds.`,
          };
        }

        const otp = generateOtp();
        existingUser.otp = createOtpPayload(otp, "email-verification");
        await UserRepository.save(existingUser);

        const emailResult = await sendOtpEmail({ to: email, otp, purpose: "email-verification" });

        return {
          userId: existingUser._id.toString(),
          email,
          emailSent: emailResult.sent,
          verificationRequired: true,
          message: emailResult.sent
            ? "This account is already pending verification. A fresh verification OTP has been sent."
            : "This account is already pending verification, but the OTP email could not be sent. Continue to verification and try resend OTP.",
        };
      }

      throw new Error("A user with this email already exists.");
    }

    const otp = generateOtp();
    const user = await UserRepository.create({
      accountType,
      institutionId: accountType === "user" ? input.institutionId?.toUpperCase() : undefined,
      role: input.role,
      emailHash,
      email: encryptValue(email),
      fullName: encryptValue(input.fullName),
      phoneNumber: input.phoneNumber ? encryptValue(input.phoneNumber) : undefined,
      designation: input.designation ? encryptValue(input.designation) : undefined,
      bio: input.bio ? encryptValue(input.bio) : undefined,
      skills: input.skills ? encryptValue(input.skills) : undefined,
      gender: input.gender ? encryptValue(input.gender) : undefined,
      nationality: input.nationality ? encryptValue(input.nationality) : undefined,
      dateOfBirth: input.dateOfBirth ? encryptValue(input.dateOfBirth) : undefined,
      address: input.address ? encryptValue(input.address) : undefined,
      yearsOfExperience: input.yearsOfExperience !== undefined ? encryptValue(input.yearsOfExperience) : undefined,
      areasOfInterest: input.areasOfInterest ? encryptValue(input.areasOfInterest) : undefined,
      education: input.education ? encryptValue(input.education) : undefined,
      socialLinks: input.socialLinks ? encryptValue(input.socialLinks) : undefined,
      otp: createOtpPayload(otp, "email-verification"),
    });

    if (accountType === "institution") {
      await createInstitutionProfile(user._id, input.institution);
    } else {
      await createRoleProfile(user._id, input.role, input.profile);
    }

    const emailResult = await sendOtpEmail({ to: email, otp, purpose: "email-verification" });

    return {
      userId: user._id.toString(),
      email,
      emailSent: emailResult.sent,
      verificationRequired: true,
      accountType,
      message: emailResult.sent
        ? "Registration started. Verify the email OTP to activate the account."
        : "Account created, but the OTP email could not be sent. Check SMTP settings, then use resend OTP.",
    };
  }

  static async requestLoginOtp(input: LoginDto) {
    await connectToDatabase();

    const email = normalizeEmail(input.email);
    const user = await UserRepository.findByEmailHash(createLookupHash(email, "email"));

    if (!user) {
      throw new Error("No account exists for this email.");
    }

    if (!user.isEmailVerified) {
      throw new Error("Please verify your email before logging in.");
    }

    assertCanSendOtp(user, "login");

    const otp = generateOtp();
    user.otp = createOtpPayload(otp, "login");
    await UserRepository.save(user);
    const emailResult = await sendOtpEmail({ to: email, otp, purpose: "login" });

    if (!emailResult.sent) {
      throw new Error("OTP email could not be sent. Check SMTP settings and try again.");
    }

    return { message: "Login OTP sent.", institutionId: user.institutionId };
  }

  static async resendLoginOtp(input: LoginDto) {
    return this.requestLoginOtp(input);
  }

  static async resendVerificationOtp(input: LoginDto) {
    await connectToDatabase();

    const email = normalizeEmail(input.email);
    const user = await UserRepository.findByEmailHash(createLookupHash(email, "email"));

    if (!user) {
      throw new Error("No account exists for this email.");
    }

    if (user.isEmailVerified) {
      return { message: "Email is already verified." };
    }

    assertCanSendOtp(user, "email-verification");

    const otp = generateOtp();
    user.otp = createOtpPayload(otp, "email-verification");
    await UserRepository.save(user);
    const emailResult = await sendOtpEmail({ to: email, otp, purpose: "email-verification" });

    if (!emailResult.sent) {
      throw new Error("Verification OTP email could not be sent. Check SMTP settings and try again.");
    }

    return { message: "Verification OTP sent." };
  }

  static async verifyEmail(input: VerifyEmailDto) {
    await connectToDatabase();

    const email = normalizeEmail(input.email);
    const user = await UserRepository.findByEmailHash(createLookupHash(email, "email"));

    if (!user || !user.otp) {
      throw new Error("Invalid verification request.");
    }

    if (user.otp.purpose !== "email-verification") {
      throw new Error("Please request a fresh verification code.");
    }

    if (user.otp.expiresAt.getTime() < Date.now()) {
      throw new Error("OTP has expired.");
    }

    if (user.otp.attempts >= MAX_OTP_ATTEMPTS) {
      throw new Error("Too many invalid OTP attempts.");
    }

    if (!verifyOtp(input.otp, user.otp.hash, user.otp.salt)) {
      user.otp.attempts += 1;
      await UserRepository.save(user);
      throw new Error("Invalid OTP.");
    }

    user.isEmailVerified = true;
    user.emailVerifiedAt = new Date();
    user.otp = undefined;
    await UserRepository.save(user);

    if (user.accountType === "institution") {
      const institution = await InstitutionModel.findOne({ ownerUserId: user._id });

      if (!institution) {
        throw new Error("Institution details were not found for this account.");
      }

      const institutionId = await generateInstitutionId(institution);
      institution.isVerified = true;
      institution.verifiedAt = new Date();
      await institution.save();

      user.institutionId = institutionId;
      await UserRepository.save(user);

      return {
        message: "Email verified successfully. Your institution ID has been generated.",
        institutionId,
      };
    }

    return { message: "Email verified successfully." };
  }

  static async authorizeOtpSignIn(input: VerifyEmailDto) {
    await connectToDatabase();

    const email = normalizeEmail(input.email);
    const user = await UserRepository.findByEmailHash(createLookupHash(email, "email"));

    if (!user || !user.otp || !user.isEmailVerified) {
      return null;
    }

    if (user.otp.purpose !== "login" || user.otp.expiresAt.getTime() < Date.now()) {
      return null;
    }

    if (user.otp.attempts >= MAX_OTP_ATTEMPTS) {
      return null;
    }

    if (!verifyOtp(input.otp, user.otp.hash, user.otp.salt)) {
      user.otp.attempts += 1;
      await UserRepository.save(user);
      return null;
    }

    user.otp = undefined;
    await UserRepository.save(user);

    return toAuthUser(user);
  }

  static async requestAdminLoginOtp(email: string) {
    await connectToDatabase();

    const adminEmail = process.env.NEXT_PUBLIC_STATIC_ADMIN_EMAIL?.toLowerCase().trim();
    const superAdminEmail = process.env.NEXT_PUBLIC_STATIC_SUPER_ADMIN_EMAIL?.toLowerCase().trim();
    
    if (email !== adminEmail && email !== superAdminEmail) {
      throw new Error("Unauthorized administrative access vector.");
    }

    const otp = generateOtp();
    const otpPayload = createOtpPayload(otp, "login");

    // Unified call to get model rules
    const AdminOtpModel = getAdminOtpModel();
    const emailHash = createLookupHash(email, "email");

    await AdminOtpModel.findOneAndUpdate(
      { emailHash },
      {
        hash: otpPayload.hash,
        salt: otpPayload.salt,
        expiresAt: otpPayload.expiresAt,
        attempts: 0,
      },
      { upsert: true, new: true }
    );

    const emailResult = await sendOtpEmail({ to: email, otp, purpose: "login" });
    if (!emailResult.sent) {
      throw new Error("Failed to dispatch administrative OTP code via SMTP system.");
    }

    return { message: "Administrative login OTP successfully dispatched." };
  }

  static async verifyAdminOtpOnly(input: VerifyEmailDto) {
    await connectToDatabase();
    const email = normalizeEmail(input.email);
    const emailHash = createLookupHash(email, "email");

    // FIXED: Uses the unified compilation method to find the correct cache entry
    const AdminOtpModel = getAdminOtpModel();

    const otpRecord = await AdminOtpModel.findOne({ emailHash });
    if (!otpRecord) {
      throw new Error("No active verification window exists for this administrative account.");
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      await AdminOtpModel.deleteOne({ _id: otpRecord._id });
      throw new Error("Administrative token window has expired.");
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await AdminOtpModel.deleteOne({ _id: otpRecord._id });
      throw new Error("Security lockdown: maximum authentication attempts exhausted.");
    }

    if (!verifyOtp(input.otp, otpRecord.hash, otpRecord.salt)) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new Error("Invalid administrative authorization code.");
    }

    await AdminOtpModel.deleteOne({ _id: otpRecord._id });
    return true;
  }
}
