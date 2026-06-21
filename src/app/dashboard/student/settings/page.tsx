"use client";

import { useEffect, useState, type ElementType } from "react";
import { Lock, UserRoundCog } from "lucide-react";
import { getStudentSettingsData, type StudentSettingsData } from "@/actions/dashboard-session-actions";

type SettingsSection = "account" | "studentProfile" | "institution" | "personalDetails";

type SettingsRecord = Record<string, string>;

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  role: "Role",
  phoneNumber: "Phone Number",
  institutionName: "Institution Name",
  institutionId: "Institution ID",
  emailVerified: "Email Verified",
  studentId: "Student ID",
  programOrClass: "Program Or Class",
  batchOrSection: "Batch Or Section",
  subjects: "Subjects",
  preferredSlots: "Preferred Slots",
  type: "Institution Type",
  academicMode: "Academic Mode",
  affiliation: "Affiliation",
  establishedYear: "Established Year",
  website: "Website",
  contactPerson: "Contact Person",
  contactEmail: "Contact Email",
  contactPhone: "Contact Phone",
  address: "Address",
  academicYear: "Academic Year",
  timetableCycle: "Timetable Cycle",
  workingDays: "Working Days",
  periodDurationMinutes: "Period Duration Minutes",
  dailyPeriods: "Daily Periods",
  breakSlots: "Break Slots",
  departmentsOrSections: "Departments Or Sections",
  classroomResources: "Classroom Resources",
  approvalWorkflow: "Approval Workflow",
  schedulingRules: "Scheduling Rules",
  designation: "Designation",
  bio: "Bio",
  skills: "Skills",
  gender: "Gender",
  nationality: "Nationality",
  dateOfBirth: "Date Of Birth",
  yearsOfExperience: "Years Of Experience",
  areasOfInterest: "Areas Of Interest",
  education: "Education",
  socialLinks: "Social Links",
};

const EDITABLE_FIELDS: Array<[SettingsSection, string]> = [
  ["account", "name"],
  ["account", "phoneNumber"],
  ["studentProfile", "programOrClass"],
  ["studentProfile", "batchOrSection"],
  ["studentProfile", "subjects"],
  ["studentProfile", "preferredSlots"],
  ["personalDetails", "bio"],
  ["personalDetails", "skills"],
  ["personalDetails", "address"],
  ["personalDetails", "education"],
  ["personalDetails", "socialLinks"],
];

const LOCKED_FIELDS: Array<[SettingsSection, string]> = [
  ["account", "email"],
  ["account", "role"],
  ["account", "institutionName"],
  ["account", "institutionId"],
  ["account", "emailVerified"],
  ["studentProfile", "studentId"],
  ["institution", "name"],
  ["institution", "type"],
  ["institution", "academicMode"],
  ["institution", "affiliation"],
  ["institution", "establishedYear"],
  ["institution", "website"],
  ["institution", "contactPerson"],
  ["institution", "contactEmail"],
  ["institution", "contactPhone"],
  ["institution", "address"],
  ["institution", "academicYear"],
  ["institution", "timetableCycle"],
  ["institution", "workingDays"],
  ["institution", "periodDurationMinutes"],
  ["institution", "dailyPeriods"],
  ["institution", "breakSlots"],
  ["institution", "departmentsOrSections"],
  ["institution", "classroomResources"],
  ["institution", "approvalWorkflow"],
  ["institution", "schedulingRules"],
  ["personalDetails", "gender"],
  ["personalDetails", "nationality"],
  ["personalDetails", "dateOfBirth"],
  ["personalDetails", "yearsOfExperience"],
  ["personalDetails", "areasOfInterest"],
];

function labelFor(key: string) {
  return FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());
}

function isLongField(section: SettingsSection, key: string) {
  return ["bio", "address", "education", "socialLinks", "subjects", "skills", "preferredSlots", "workingDays", "breakSlots", "departmentsOrSections", "classroomResources", "approvalWorkflow", "schedulingRules"].includes(key)
    || section === "institution";
}

function getSectionData(data: StudentSettingsData, section: SettingsSection): SettingsRecord {
  return data[section] as SettingsRecord;
}

function setSectionValue(data: StudentSettingsData, section: SettingsSection, key: string, value: string) {
  return {
    ...data,
    [section]: {
      ...getSectionData(data, section),
      [key]: value,
    },
  };
}

export default function StudentSettingsPage() {
  const [data, setData] = useState<StudentSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getStudentSettingsData()
      .then((settingsData) => {
        if (isActive) setData(settingsData);
      })
      .catch((loadError) => {
        if (isActive) setError(loadError instanceof Error ? loadError.message : "Unable to load settings.");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  function updateField(section: SettingsSection, key: string, value: string) {
    setData((currentData) => {
      if (!currentData) return currentData;
      return setSectionValue(currentData, section, key, value);
    });
  }

  if (loading) {
    return (
      <div className="border-2 border-black bg-[#eae3cb] p-4 font-mono text-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14]">
        Loading decrypted settings...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border-2 border-black bg-[#e28774] p-4 font-mono text-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14]">
        {error || "Unable to load settings."}
      </div>
    );
  }

  const editableSections: SettingsSection[] = ["account", "studentProfile", "personalDetails"];
  const lockedSections: SettingsSection[] = ["account", "studentProfile", "institution", "personalDetails"];

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">STUDENT SETTINGS</h1>
        <p className="text-[11px] mt-1 font-bold tracking-tight text-[#1a1a14]/80">
          Decrypted DB records are loaded into editable and locked settings boxes.
        </p>
      </div>

      <div className="space-y-6">
        <SettingsSectionBox
          title="Editable Settings"
          subtitle="Values in this box can be changed in the UI."
          icon={UserRoundCog}
          sections={editableSections}
          fields={EDITABLE_FIELDS}
          data={data}
          mode="editable"
          onChange={updateField}
        />

        <SettingsSectionBox
          title="Locked Settings"
          subtitle="Values in this box cannot be changed."
          icon={Lock}
          sections={lockedSections}
          fields={LOCKED_FIELDS}
          data={data}
          mode="locked"
          onChange={updateField}
        />
      </div>
    </div>
  );
}

function SettingsSectionBox({
  title,
  subtitle,
  icon: Icon,
  sections,
  fields,
  data,
  mode,
  onChange,
}: {
  title: string;
  subtitle: string;
  icon: ElementType;
  sections: SettingsSection[];
  fields: Array<[SettingsSection, string]>;
  data: StudentSettingsData;
  mode: "editable" | "locked";
  onChange: (section: SettingsSection, key: string, value: string) => void;
}) {
  return (
    <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
      <div className="border-b-2 border-black bg-[#1a1a14] p-3 text-[#f4ebd0] text-xs font-black uppercase flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="p-3 text-[10px] font-black uppercase tracking-widest bg-[#f4ebd0] border-b-2 border-black">
        {subtitle}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4 bg-white">
        {sections.map((section) => {
          const sectionFields = fields.filter(([fieldSection]) => fieldSection === section);
          const sectionData = getSectionData(data, section);

          return (
            <div key={section} className="border-2 border-black bg-[#f4ebd0]/40">
              <div className="border-b-2 border-black bg-[#1a1a14] p-2 text-[#f4ebd0] text-xs font-black uppercase">
                {sectionLabel(section)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                {sectionFields.map(([, key]) => (
                  <SettingsField
                    key={`${section}.${key}`}
                    section={section}
                    fieldKey={key}
                    value={sectionData[key] || "Not available"}
                    mode={mode}
                    onChange={onChange}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsField({
  section,
  fieldKey,
  value,
  mode,
  onChange,
}: {
  section: SettingsSection;
  fieldKey: string;
  value: string;
  mode: "editable" | "locked";
  onChange: (section: SettingsSection, key: string, value: string) => void;
}) {
  const label = labelFor(fieldKey);

  if (mode === "locked") {
    return (
      <div className="space-y-1">
        <div className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/70">{label}</div>
        <div className="min-h-[42px] whitespace-pre-wrap break-words border-2 border-black bg-white px-3 py-2 text-xs font-black">
          {value}
        </div>
      </div>
    );
  }

  return (
    <label className="space-y-1">
      <div className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/70">{label}</div>
      {isLongField(section, fieldKey) ? (
        <textarea
          value={value}
          onChange={(event) => onChange(section, fieldKey, event.target.value)}
          rows={isLongField(section, fieldKey) ? 5 : 2}
          className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-black uppercase outline-none focus:bg-[#eae3cb]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(section, fieldKey, event.target.value)}
          className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-black uppercase outline-none focus:bg-[#eae3cb]"
        />
      )}
    </label>
  );
}

function sectionLabel(section: SettingsSection) {
  const labels: Record<SettingsSection, string> = {
    account: "Account",
    studentProfile: "Student Profile",
    institution: "Institution",
    personalDetails: "Personal Details",
  };

  return labels[section];
}
