import { roleProfileFields } from "@/components/forms/auth-profile-fields";

export async function postJson<T>(url: string, data: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = (await readJsonResponse(response)) as {
    success?: boolean;
    data?: T;
    error?: string;
  };

  if (!response.ok || !result.success) {
    throw new Error(result.error ?? "Something went wrong.");
  }

  return result.data as T;
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(
      response.ok
        ? "The server returned an invalid response."
        : "The server returned an error page instead of JSON.",
    );
  }
}

export function readString(form: FormData, key: string) {
  const value = String(form.get(key) ?? "").trim();
  return value || undefined;
}

export type RegisterAccountType = "institution" | "user";

function readNumber(form: FormData, key: string) {
  const value = readString(form, key);
  return value ? Number(value) : undefined;
}

function readTags(form: FormData, key: string) {
  const tags = String(form.get(key) ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return tags.length ? tags : undefined;
}

export function buildRegisterPayload(form: FormData) {
  const accountType = (String(form.get("accountType") ?? "user") || "user") as RegisterAccountType;
  const role = accountType === "institution" ? "institution_admin" : String(form.get("role") ?? "");
  const email =
    accountType === "institution"
      ? String(form.get("institution.contactEmail") ?? "")
      : String(form.get("email") ?? "");
  const institutionId = readString(form, "institutionId")?.toUpperCase();
  const institutionDetails = {
    name: readString(form, "institution.name"),
    type: readString(form, "institution.type"),
    academicMode: readString(form, "institution.academicMode"),
    affiliation: readString(form, "institution.affiliation"),
    establishedYear: readNumber(form, "institution.establishedYear"),
    website: readString(form, "institution.website"),
    contactPerson: readString(form, "institution.contactPerson"),
    contactEmail: readString(form, "institution.contactEmail"),
    contactPhone: readString(form, "institution.contactPhone"),
    address: {
      country: readString(form, "institution.address.country"),
      state: readString(form, "institution.address.state"),
      city: readString(form, "institution.address.city"),
      postalCode: readString(form, "institution.address.postalCode"),
      line: readString(form, "institution.address.line"),
    },
    academicYear: readString(form, "institution.academicYear"),
    timetableCycle: readString(form, "institution.timetableCycle"),
    workingDays: readTags(form, "institution.workingDays"),
    periodDurationMinutes: readNumber(form, "institution.periodDurationMinutes"),
    dailyPeriods: readNumber(form, "institution.dailyPeriods"),
    breakSlots: readTags(form, "institution.breakSlots"),
    departmentsOrSections: readTags(form, "institution.departmentsOrSections"),
    classroomResources: readTags(form, "institution.classroomResources"),
    approvalWorkflow: readTags(form, "institution.approvalWorkflow"),
    schedulingRules: readTags(form, "institution.schedulingRules"),
  };
  const address = {
    country: readString(form, "address.country"),
    state: readString(form, "address.state"),
    city: readString(form, "address.city"),
    postalCode: readString(form, "address.postalCode"),
    line: readString(form, "address.line"),
  };
  const education = {
    highestStudy: readString(form, "education.highestStudy"),
    specialization: readString(form, "education.specialization"),
    collegeOrUniversity: readString(form, "education.collegeOrUniversity"),
    graduationYear: readNumber(form, "education.graduationYear"),
  };
  const socialLinks = {
    linkedin: readString(form, "socialLinks.linkedin"),
    github: readString(form, "socialLinks.github"),
    portfolio: readString(form, "socialLinks.portfolio"),
    twitter: readString(form, "socialLinks.twitter"),
    reddit: readString(form, "socialLinks.reddit"),
  };
  const profile = (roleProfileFields[role] ?? []).reduce<Record<string, unknown>>((values, field) => {
    const formKey = `profile.${field.name}`;
    const value =
      field.type === "tags"
        ? readTags(form, formKey)
        : field.type === "number"
          ? readNumber(form, formKey)
          : readString(form, formKey);

    if (value !== undefined) {
      values[field.name] = value;
    }

    return values;
  }, {});
  const hasAddress = Object.values(address).some(Boolean);
  const hasEducation = Object.values(education).some(Boolean);
  const hasSocialLinks = Object.values(socialLinks).some(Boolean);

  return {
    email,
    payload: {
      accountType,
      institutionId: accountType === "user" ? institutionId : undefined,
      institution: accountType === "institution" ? institutionDetails : undefined,
      fullName:
        accountType === "institution"
          ? readString(form, "institution.contactPerson")
          : readString(form, "fullName"),
      email,
      role,
      phoneNumber: readString(form, "phoneNumber"),
      designation: readString(form, "designation"),
      bio: readString(form, "bio"),
      skills: readTags(form, "skills"),
      gender: readString(form, "gender"),
      nationality: readString(form, "nationality"),
      dateOfBirth: readString(form, "dateOfBirth"),
      address: hasAddress ? address : undefined,
      yearsOfExperience: readNumber(form, "yearsOfExperience"),
      areasOfInterest: readTags(form, "areasOfInterest"),
      education: hasEducation ? education : undefined,
      socialLinks: hasSocialLinks ? socialLinks : undefined,
      profile,
    },
  };
}
