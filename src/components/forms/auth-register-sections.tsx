import { Building2, Mail, UserRound } from "lucide-react";
import { FieldLabel, ProfileFieldInput, TextInput } from "@/components/forms/auth-form-fields";
import { roleProfileFields } from "@/components/forms/auth-profile-fields";
import { roleOptions } from "@/components/forms/auth-role-options";
import { Gender } from "@/models/user/types/gender.enum";

export type RegisterSectionId = "account-type" | "institution" | "personal" | "role";

export const registerSections: Array<{
  id: RegisterSectionId;
  title: string;
  description: string;
}> = [
  {
    id: "account-type",
    title: "Type",
    description: "Choose whether you are registering an institution or joining one as a user.",
  },
  {
    id: "institution",
    title: "Institution",
    description: "Add academic details used to verify the institution before issuing its unique ID.",
  },
  {
    id: "personal",
    title: "Personal Data",
    description: "Your personal, professional, and location details.",
  },
  {
    id: "role",
    title: "Roles",
    description: "Finish with the details specific to the profile type you selected.",
  },
];

export type RegistrationConfig = {
  departmentHeadRoles?: string[];
  facultyPositions?: string[];
  studentClasses?: string[];
  studentSections?: string[];
  studentBatches?: string[];
};

type RegisterSectionProps = {
  accountType: "institution" | "user";
  institutionFound: boolean;
  institutionName?: string;
  institutionConfirmed?: boolean;
  registrationConfig?: RegistrationConfig;
  selectedRole: string;
  onAccountTypeChange: (accountType: "institution" | "user") => void;
  onRoleChange: (role: string) => void;
  onConfirmInstitution?: () => void;
  onRejectInstitution?: () => void;
};

const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: "Male", value: Gender.Male },
  { label: "Female", value: Gender.Female },
  { label: "Prefer not to say", value: Gender.PreferNotToSay },
];

const countryCodeOptions = [
  { label: "IN +91", value: "+91" },
  { label: "US +1", value: "+1" },
  { label: "UK +44", value: "+44" },
  { label: "AE +971", value: "+971" },
  { label: "SG +65", value: "+65" },
];

const personNamePattern = "^[A-Za-z][A-Za-z .'-]{1,79}$";
const placeNamePattern = "^[A-Za-z][A-Za-z .'-]{1,79}$";
const tagListPattern = "^[A-Za-z0-9][A-Za-z0-9 .,+#&/-]{1,199}$";
const currentYear = new Date().getFullYear();
const todayDate = new Date().toISOString().slice(0, 10);

export function getRoleLabel(roleValue: string) {
  return roleOptions.find((role) => role.value === roleValue)?.label ?? "Role Details";
}

function RolePicker({
  selectedRole,
  onRoleChange,
}: Pick<RegisterSectionProps, "selectedRole" | "onRoleChange">) {
  return (
    <div className="min-w-0 space-y-2">
      <FieldLabel>Role</FieldLabel>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {roleOptions.map((role) => {
          const Icon = role.icon;
          return (
            <label
              key={role.value}
              className="flex min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition has-[:checked]:border-brand-blue has-[:checked]:bg-blue-50 has-[:checked]:text-brand-dark"
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                required
                checked={selectedRole === role.value}
                className="sr-only"
                onChange={() => onRoleChange(role.value)}
              />
              <Icon className="h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{role.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function AccountTypeSection({
  accountType,
  onAccountTypeChange,
}: Pick<RegisterSectionProps, "accountType" | "onAccountTypeChange">) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      {[
        { value: "institution" as const, label: "Institution", detail: "Register an academic institution and verify it before the ID is issued.", icon: Building2 },
        { value: "user" as const, label: "User", detail: "Join an existing institution using its issued institution ID.", icon: UserRound },
      ].map((option) => {
        const Icon = option.icon;

        return (
          <label
            key={option.value}
            className="flex min-w-0 cursor-pointer gap-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-700 transition has-[:checked]:border-brand-blue has-[:checked]:bg-blue-50 has-[:checked]:text-brand-dark"
          >
            <input
              type="radio"
              name="accountType"
              value={option.value}
              checked={accountType === option.value}
              onChange={() => onAccountTypeChange(option.value)}
              className="sr-only"
            />
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-black">{option.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{option.detail}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

function InstitutionSection() {
  return (
    <div className="min-w-0 space-y-4">
      <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-3">
        <p className="text-xs font-bold text-amber-800">
          The contact person must be the Head of the Institution (Principal, Director, or equivalent). This person will receive the login credentials after approval.
        </p>
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <div className="min-w-0 space-y-2">
        <FieldLabel>Institution Type</FieldLabel>
        <select
          name="institution.type"
          required
          defaultValue=""
          className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
        >
          <option value="" disabled>Select type</option>
          <option value="school">School</option>
          <option value="college">College</option>
          <option value="university">University</option>
        </select>
      </div>
      <div className="min-w-0 space-y-2">
        <FieldLabel>Academic Mode</FieldLabel>
        <select
          name="institution.academicMode"
          required
          defaultValue=""
          className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
        >
          <option value="" disabled>Select mode</option>
          <option value="school">School</option>
          <option value="college">College</option>
          <option value="hybrid">School + College</option>
          <option value="university">University</option>
        </select>
      </div>
      <TextInput name="institution.affiliation" label="Affiliation" placeholder="Board, university, or council" required minLength={2} maxLength={120} />
      <TextInput name="institution.establishedYear" label="Established Year" type="number" placeholder="2004" required min={1800} max={currentYear} />
      <TextInput name="institution.contactPerson" label="Contact Person" placeholder="Dr. Ananya Rao" required minLength={2} maxLength={80} />
      <TextInput name="institution.contactEmail" label="Contact Email" type="email" placeholder="admin@institution.ac.in" required />
      <TextInput name="institution.contactPhone" label="Contact Phone" type="tel" placeholder="9876543210" required minLength={10} maxLength={15} />
      <TextInput name="institution.address.country" label="Country" placeholder="India" required minLength={2} maxLength={80} />
      <TextInput name="institution.address.state" label="State" placeholder="Karnataka" required minLength={2} maxLength={80} />
      <TextInput name="institution.address.city" label="City" placeholder="Bengaluru" required minLength={2} maxLength={80} />
      <TextInput name="institution.address.postalCode" label="Postal Code" placeholder="560001" required minLength={4} maxLength={10} />
      <div className="sm:col-span-2">
        <TextInput name="institution.address.line" label="Address Line" placeholder="Campus, department, or street" maxLength={160} />
      </div>
    </div>
    </div>
  );
}

function InstitutionLookupSection({
  institutionFound,
  institutionName,
  institutionConfirmed,
  registrationConfig,
  selectedRole,
  onRoleChange,
  onConfirmInstitution,
  onRejectInstitution,
}: Pick<RegisterSectionProps, "institutionFound" | "institutionName" | "institutionConfirmed" | "registrationConfig" | "selectedRole" | "onRoleChange" | "onConfirmInstitution" | "onRejectInstitution">) {
  const cfg = registrationConfig;
  const dynamicFields: { label: string; name: string; options: string[] }[] = [];

  if (cfg && selectedRole) {
    if (selectedRole === "faculty" && cfg.facultyPositions?.length) {
      dynamicFields.push({ label: "Faculty Position", name: "facultyPosition", options: cfg.facultyPositions });
    }
    if (selectedRole === "student") {
      if (cfg.studentClasses?.length) dynamicFields.push({ label: "Class", name: "studentClass", options: cfg.studentClasses });
      if (cfg.studentSections?.length) dynamicFields.push({ label: "Section", name: "studentSection", options: cfg.studentSections });
      if (cfg.studentBatches?.length) dynamicFields.push({ label: "Batch", name: "studentBatch", options: cfg.studentBatches });
    }
    if (selectedRole === "department_head" && cfg.departmentHeadRoles?.length) {
      dynamicFields.push({ label: "Department Head Role", name: "departmentHeadRole", options: cfg.departmentHeadRoles });
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="min-w-0 space-y-3">
        <TextInput
          name="institutionId"
          label="Institution ID"
          placeholder="Your assigned Institution ID"
          required
          minLength={7}
          maxLength={20}
          pattern="^[A-Z0-9-]{7,20}$"
          title="Enter the institution ID shared by your institution."
        />
        {institutionFound && institutionName && (
          <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-4 space-y-3">
            <div className="text-sm font-bold text-emerald-800">
              Institution: <span className="font-black">{institutionName}</span>
            </div>
            {!institutionConfirmed ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onConfirmInstitution}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-black text-white hover:bg-emerald-700"
                >
                  Yes, this is correct
                </button>
                <button
                  type="button"
                  onClick={onRejectInstitution}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-4 text-xs font-black text-red-700 hover:bg-red-50"
                >
                  No, try again
                </button>
              </div>
            ) : (
              <div className="text-xs font-black text-emerald-700">✓ Confirmed. Proceed with your details.</div>
            )}
          </div>
        )}
        {!institutionFound && (
          <p className="text-xs font-bold text-slate-500">
            Enter the ID first. The form checks this before your user details are collected.
          </p>
        )}
      </div>
      {institutionConfirmed && <RolePicker selectedRole={selectedRole} onRoleChange={onRoleChange} />}
      {institutionConfirmed && selectedRole && dynamicFields.length > 0 && (
        <div className="border-t border-slate-200 pt-4 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Institution-Specific Details</p>
          {dynamicFields.map((f) => (
            <div key={f.name} className="min-w-0 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{f.label} <span className="text-red-500">*</span></label>
              <select name={f.name} required className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10">
                <option value="">Select {f.label}...</option>
                {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonalDataSection() {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <div className="min-w-0 space-y-2">
        <FieldLabel>Full Name</FieldLabel>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            name="fullName"
            required
            minLength={2}
            maxLength={80}
            pattern={personNamePattern}
            title="Use letters, spaces, apostrophes, hyphens, and periods only."
            autoComplete="name"
            placeholder="Dr. Ananya Rao"
            className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
          />
        </div>
      </div>
      <div className="min-w-0 space-y-2">
        <FieldLabel>Email</FieldLabel>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            name="email"
            type="email"
            required
            maxLength={120}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
            title="Enter a valid email address."
            autoComplete="email"
            placeholder="you@institution.ac.in"
            className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
          />
        </div>
      </div>
      <div className="min-w-0 space-y-2">
        <FieldLabel>Phone</FieldLabel>
        <div className="grid min-w-0 grid-cols-[6.5rem_1fr] gap-2">
          <select
            name="phoneCountryCode"
            required
            defaultValue="+91"
            className="h-12 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
          >
            {countryCodeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            name="phoneNumber"
            type="tel"
            required
            inputMode="numeric"
            autoComplete="tel-national"
            minLength={10}
            maxLength={10}
            pattern="^[0-9]{10}$"
            title="Enter exactly 10 numeric digits."
            placeholder="9876543210"
            onInput={(event) => {
              event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10);
            }}
            className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
          />
        </div>
      </div>
      <div className="min-w-0 space-y-2">
        <FieldLabel>Gender</FieldLabel>
        <select
          name="gender"
          required
          defaultValue=""
          className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
        >
          <option value="" disabled>Select gender</option>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <TextInput
        name="nationality"
        label="Nationality"
        placeholder="Indian"
        required
        minLength={2}
        maxLength={80}
        pattern={placeNamePattern}
        title="Use letters, spaces, apostrophes, hyphens, and periods only."
        autoComplete="country-name"
      />
      <TextInput name="dateOfBirth" label="Date of Birth" type="date" required max={todayDate} />
      <TextInput
        name="yearsOfExperience"
        label="Years of Experience"
        type="number"
        placeholder="4"
        required
        min={0}
        max={80}
      />
      <TextInput
        name="skills"
        label="Skills or Domains"
        placeholder="AI, Robotics, Biotechnology"
        required
        minLength={2}
        maxLength={200}
        pattern={tagListPattern}
        title="Use comma-separated skills with letters, numbers, spaces, and common symbols."
      />
      <TextInput
        name="areasOfInterest"
        label="Areas of Interest"
        placeholder="AI, Climate, Healthcare"
        required
        minLength={2}
        maxLength={200}
        pattern={tagListPattern}
        title="Use comma-separated interests with letters, numbers, spaces, and common symbols."
      />
      <div className="min-w-0 space-y-2 sm:col-span-2">
        <FieldLabel>Bio</FieldLabel>
        <textarea
          name="bio"
          rows={3}
          maxLength={1000}
          placeholder="Short professional summary"
          className="w-full min-w-0 resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
        />
      </div>
      <TextInput name="address.country" label="Country" placeholder="India" required minLength={2} maxLength={80} pattern={placeNamePattern} title="Use letters, spaces, apostrophes, hyphens, and periods only." autoComplete="country-name" />
      <TextInput name="address.state" label="State" placeholder="Karnataka" required minLength={2} maxLength={80} pattern={placeNamePattern} title="Use letters, spaces, apostrophes, hyphens, and periods only." autoComplete="address-level1" />
      <TextInput name="address.city" label="City" placeholder="Bengaluru" required minLength={2} maxLength={80} pattern={placeNamePattern} title="Use letters, spaces, apostrophes, hyphens, and periods only." autoComplete="address-level2" />
      <TextInput name="address.postalCode" label="Postal Code" placeholder="560001" required inputMode="numeric" minLength={4} maxLength={10} pattern="^[0-9]{4,10}$" title="Use 4 to 10 numeric digits." autoComplete="postal-code" />
      <div className="sm:col-span-2">
        <TextInput name="address.line" label="Address Line" placeholder="Institution, department, or street" maxLength={160} autoComplete="street-address" />
      </div>
    </div>
  );
}

function RoleDetailsSection({ selectedRole }: Pick<RegisterSectionProps, "selectedRole">) {
  if (!selectedRole) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
        <p className="text-sm font-bold text-slate-500">Choose a profile type in the first step to unlock this section.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-4">
      <h4 className="break-words text-sm font-black uppercase tracking-wider text-slate-400">{getRoleLabel(selectedRole)}</h4>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        {roleProfileFields[selectedRole]?.map((field) => (
          <ProfileFieldInput key={field.name} field={field} />
        ))}
      </div>
    </div>
  );
}

export function RegisterSectionContent({
  accountType,
  institutionFound,
  institutionName,
  institutionConfirmed,
  registrationConfig,
  sectionId,
  selectedRole,
  onAccountTypeChange,
  onRoleChange,
  onConfirmInstitution,
  onRejectInstitution,
}: RegisterSectionProps & { sectionId: RegisterSectionId }) {
  if (sectionId === "account-type") {
    return <AccountTypeSection accountType={accountType} onAccountTypeChange={onAccountTypeChange} />;
  }

  if (sectionId === "institution") {
    return accountType === "institution" ? (
      <InstitutionSection />
    ) : (
      <InstitutionLookupSection
        institutionFound={institutionFound}
        institutionName={institutionName}
        institutionConfirmed={institutionConfirmed}
        registrationConfig={registrationConfig}
        selectedRole={selectedRole}
        onRoleChange={onRoleChange}
        onConfirmInstitution={onConfirmInstitution}
        onRejectInstitution={onRejectInstitution}
      />
    );
  }

  if (sectionId === "personal") {
    return <PersonalDataSection />;
  }

  return <RoleDetailsSection selectedRole={selectedRole} />;
}
