import { z } from "zod";
import { UserRole } from "@/models/user/types/user-role.enum";

const requiredString = z.string().trim().min(1);
const optionalString = z.string().trim().optional();
const requiredNumber = z.number().min(0);
const requiredTags = z.array(z.string().trim().min(1)).min(1);
const optionalTags = z.array(z.string().trim().min(1)).optional();
const optionalUrl = z.url().optional();
const otpSchema = z.string().regex(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{6}$/);

const roleProfileSchemas: Partial<Record<UserRole, z.ZodType>> = {
  [UserRole.Professor]: z.object({
    facultyId: requiredString,
    researchDomains: requiredTags,
    publications: requiredNumber,
    patents: optionalString,
    universityName: requiredString,
    coursesTeaching: requiredTags,
    availableForMentorship: requiredString,
    fundedProjects: optionalString,
    portfolioWebsite: optionalUrl,
    orcidId: optionalString,
    researchGate: optionalUrl,
    googleScholar: optionalUrl,
  }),
  [UserRole.Researcher]: z.object({
    researchArea: requiredString,
    publishedPaperCount: requiredNumber,
    currentResearchTopic: requiredString,
    openToCollaboration: requiredString,
    domains: requiredTags,
    labOrCenter: requiredString,
    universityName: requiredString,
  }),
  [UserRole.Industry]: z.object({
    companyName: requiredString,
    industrySector: requiredString,
    domains: requiredTags,
    jobRole: requiredString,
    problemsInterestedIn: requiredTags,
    hiringInterns: requiredString,
    companyWebsite: optionalUrl,
    idCardProof: optionalString,
  }),
  [UserRole.Founder]: z.object({
    startupName: requiredString,
    startupDomain: requiredString,
    stage: requiredString,
    teamSize: requiredNumber,
    fundingStatus: requiredString,
    startupDescription: requiredString,
    startupWebsite: optionalUrl,
    incubationStatus: optionalString,
    url: optionalUrl,
  }),
  [UserRole.Incubator]: z.object({
    incubationName: requiredString,
    supportedDomains: requiredTags,
    startupsSupportedCount: requiredNumber,
    fundingAvailable: requiredString,
    website: optionalUrl,
    applicationLink: optionalUrl,
    acceptanceCriteria: optionalString,
    preferencePlans: optionalString,
  }),
  [UserRole.Investor]: z.object({
    investmentFirmName: requiredString,
    investmentDomains: requiredTags,
    investmentRange: requiredString,
    portfolioCompaniesCount: requiredNumber,
    openToMentor: requiredString,
    funding: optionalString,
    interestedStartupStages: optionalTags,
  }),
  [UserRole.Student]: z.object({
    collegeName: requiredString,
    degree: requiredString,
    branch: requiredString,
    yearOfStudy: requiredString,
    areasOfInterest: requiredTags,
    interestedInInternship: requiredString,
    hackathons: optionalString,
    industryExperience: optionalString,
  }),
};

export const createUserSchema = z.object({
  accountType: z.enum(["institution", "user"]).default("user"),
  institutionId: z.string().trim().regex(/^[A-Za-z0-9]{7}$/).transform((value) => value.toUpperCase()).optional(),
  institution: z
    .object({
      name: z.string().trim().min(2).optional(),
      type: z.string().trim().min(2).optional(),
      affiliation: z.string().trim().optional(),
      establishedYear: z.number().int().min(1800).optional(),
      website: z.url().optional(),
      contactPerson: z.string().trim().min(2).optional(),
      contactEmail: z.email().optional(),
      contactPhone: z.string().trim().optional(),
      address: z
        .object({
          country: z.string().trim().optional(),
          state: z.string().trim().optional(),
          city: z.string().trim().optional(),
          postalCode: z.string().trim().optional(),
          line: z.string().trim().optional(),
        })
        .optional(),
    })
    .optional(),
  fullName: z.string().trim().min(2),
  email: z.email().transform((value) => value.toLowerCase()),
  role: z.enum(UserRole),
  phoneNumber: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  bio: z.string().trim().max(1_000).optional(),
  skills: z.array(z.string().trim().min(1)).optional(),
  gender: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  dateOfBirth: z.string().trim().optional(),
  address: z
    .object({
      country: z.string().trim().optional(),
      state: z.string().trim().optional(),
      city: z.string().trim().optional(),
      postalCode: z.string().trim().optional(),
      line: z.string().trim().optional(),
    })
    .optional(),
  yearsOfExperience: z.number().min(0).optional(),
  areasOfInterest: z.array(z.string().trim().min(1)).optional(),
  education: z
    .object({
      highestStudy: z.string().trim().optional(),
      specialization: z.string().trim().optional(),
      collegeOrUniversity: z.string().trim().optional(),
      graduationYear: z.number().int().optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      linkedin: z.url().optional(),
      github: z.url().optional(),
      portfolio: z.url().optional(),
      twitter: z.url().optional(),
      reddit: z.url().optional(),
    })
    .optional(),
  profile: z.record(z.string(), z.unknown()).optional(),
}).superRefine((data, ctx) => {
  if (data.accountType === "user" && !data.institutionId) {
    ctx.addIssue({
      code: "custom",
      path: ["institutionId"],
      message: "Institution ID is required.",
    });
  }

  if (data.accountType === "institution") {
    const institution = data.institution;
    const requiredInstitutionFields = [
      ["name", institution?.name],
      ["type", institution?.type],
      ["contactPerson", institution?.contactPerson],
      ["contactEmail", institution?.contactEmail],
    ] as const;

    for (const [field, value] of requiredInstitutionFields) {
      if (!value) {
        ctx.addIssue({
          code: "custom",
          path: ["institution", field],
          message: "Required for institution registration.",
        });
      }
    }
  }

  if (data.accountType === "institution") {
    return;
  }

  const profileSchema = roleProfileSchemas[data.role];

  if (!profileSchema) {
    return;
  }

  const result = profileSchema.safeParse(data.profile);

  if (result.success) {
    return;
  }

  for (const issue of result.error.issues) {
    ctx.addIssue({
      code: "custom",
      path: ["profile", ...issue.path],
      message: issue.message,
    });
  }
});

export const emailSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
});

export const resendOtpSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  purpose: z.enum(["email-verification", "login"]).default("email-verification"),
});

export const verifyEmailSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  otp: otpSchema,
});
