import { z } from "zod";
import { UserRole } from "@/models/user/types/user-role.enum";

const requiredString = z.string().trim().min(1);
const requiredNumber = z.number().min(0);
const requiredTags = z.array(z.string().trim().min(1)).min(1);
const otpSchema = z.string().regex(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{6}$/);

const roleProfileSchemas: Partial<Record<UserRole, z.ZodType>> = {
  [UserRole.InstitutionAdmin]: z.object({
    adminScope: requiredString,
    academicMode: requiredString,
    managedDepartments: requiredTags,
    timetableCycle: requiredString,
  }),
  [UserRole.DepartmentAdmin]: z.object({
    departmentName: requiredString,
    managedBatches: requiredTags,
    roomPlanningAccess: requiredString,
    approvalLevel: requiredString,
  }),
  [UserRole.DepartmentHead]: z.object({
    departmentName: requiredString,
    facultyCount: requiredNumber,
    approvalResponsibility: requiredString,
    priorityRules: requiredTags,
  }),
  [UserRole.Faculty]: z.object({
    employeeId: requiredString,
    departmentName: requiredString,
    subjects: requiredTags,
    maxClassesPerDay: requiredNumber,
    preferredSlots: requiredTags,
  }),
  [UserRole.Reviewer]: z.object({
    reviewScope: requiredString,
    reviewDepartments: requiredTags,
    checksPerformed: requiredTags,
  }),
  [UserRole.Student]: z.object({
    studentId: requiredString,
    programOrClass: requiredString,
    batchOrSection: requiredString,
    subjects: requiredTags,
    preferredSlots: requiredTags,
  }),
  [UserRole.SuperAdmin]: z.object({
    adminArea: requiredString,
    permissions: requiredTags,
  }),
};
 
export const createUserSchema = z.object({
  accountType: z.enum(["institution", "user"]).default("user"),
  institutionId: z.string().trim().regex(/^[A-Z0-9-]{7,20}$/).transform((value) => value.toUpperCase()).optional(),
  institution: z
    .object({
      name: z.string().trim().min(2).optional(),
      type: z.string().trim().min(2).optional(),
      academicMode: z.enum(["school", "college", "hybrid"]).optional(),
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
      academicYear: z.string().trim().optional(),
      timetableCycle: z.string().trim().optional(),
      workingDays: z.array(z.string().trim().min(1)).optional(),
      periodDurationMinutes: z.number().int().min(20).max(120).optional(),
      dailyPeriods: z.number().int().min(1).max(16).optional(),
      breakSlots: z.array(z.string().trim().min(1)).optional(),
      departmentsOrSections: z.array(z.string().trim().min(1)).optional(),
      classroomResources: z.array(z.string().trim().min(1)).optional(),
      approvalWorkflow: z.array(z.string().trim().min(1)).optional(),
      schedulingRules: z.array(z.string().trim().min(1)).optional(),
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
      ["academicMode", institution?.academicMode],
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
