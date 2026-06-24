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
  };

  const address = {
    country: readString(form, "address.country"),
    state: readString(form, "address.state"),
    city: readString(form, "address.city"),
    postalCode: readString(form, "address.postalCode"),
    line: readString(form, "address.line"),
  };

  const phoneCountryCode = readString(form, "phoneCountryCode") ?? "";
  const phoneNumber = readString(form, "phoneNumber") ?? "";
  const combinedPhone = phoneCountryCode + phoneNumber || undefined;

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

  // Map step-2 dropdown values for student
  const classGroup = readString(form, "studentClass");
  const section = readString(form, "studentSection");
  const batch = readString(form, "studentBatch");

  // yearsOfExperience may come from role profile fields instead of top-level
  const yearsOfExperience = readNumber(form, "profile.yearsOfExperience") ?? readNumber(form, "yearsOfExperience");

  return {
    email,
    payload: {
      accountType,
      institutionId: accountType === "user" ? institutionId : undefined,
      institution: accountType === "institution" ? institutionDetails : undefined,
      fullName: readString(form, "fullName"),
      email,
      role,
      phoneNumber: combinedPhone,
      bio: readString(form, "bio"),
      skills: readTags(form, "skills"),
      gender: readString(form, "gender"),
      nationality: readString(form, "nationality"),
      dateOfBirth: readString(form, "dateOfBirth"),
      address: hasAddress ? address : undefined,
      classGroup,
      section,
      batch,
      yearsOfExperience,
      areasOfInterest: readTags(form, "areasOfInterest"),
      profile,
    },
  };
}
