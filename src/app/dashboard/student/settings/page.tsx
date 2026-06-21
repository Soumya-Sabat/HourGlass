"use client";

import { useEffect, useState, type ElementType } from "react";
import { Lock, UserRoundCog, Download, Save, Mail, X, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { getStudentSettingsData, type StudentSettingsData } from "@/actions/dashboard-session-actions";
import { updateStudentSettings, submitChangeRequest } from "@/actions/student-settings-actions";
import { generateStudentDossierPdf } from "@/lib/pdf/student-dossier";

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
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [requestField, setRequestField] = useState<{ section: SettingsSection; key: string; currentValue: string } | null>(null);
  const [requestSending, setRequestSending] = useState(false);
  const [requestMessage, setRequestMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [downloading, setDownloading] = useState(false);

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

  async function handleSave() {
    if (!data || saving) return;
    setSaving(true);
    setSaveMessage(null);

    const fields = {
      name: data.account.name,
      phoneNumber: data.account.phoneNumber,
      programOrClass: data.studentProfile.programOrClass,
      batchOrSection: data.studentProfile.batchOrSection,
      subjects: data.studentProfile.subjects,
      preferredSlots: data.studentProfile.preferredSlots,
      bio: data.personalDetails.bio,
      skills: data.personalDetails.skills,
      address: data.personalDetails.address,
      education: data.personalDetails.education,
      socialLinks: data.personalDetails.socialLinks,
    };

    const result = await updateStudentSettings(fields);

    if (result.success) {
      setSaveMessage({ type: "success", text: "Settings saved successfully." });
    } else {
      setSaveMessage({ type: "error", text: result.error });
    }

    setSaving(false);
  }

  async function handleRequestSubmit(formData: FormData) {
    if (!requestField || requestSending) return;
    setRequestSending(true);
    setRequestMessage(null);

    const result = await submitChangeRequest({
      fieldName: `${requestField.section}.${requestField.key}`,
      currentValue: requestField.currentValue,
      requestedValue: formData.get("requestedValue") as string,
      reason: formData.get("reason") as string,
    });

    if (result.success) {
      setRequestMessage({ type: "success", text: "Request sent to admin." });
      setTimeout(() => {
        setRequestField(null);
        setRequestMessage(null);
      }, 1500);
    } else {
      setRequestMessage({ type: "error", text: result.error });
    }

    setRequestSending(false);
  }

  function handleDownload() {
    if (!data || downloading) return;
    setDownloading(true);
    try {
      generateStudentDossierPdf(data);
    } catch {
      setSaveMessage({ type: "error", text: "Failed to generate PDF." });
    }
    setDownloading(false);
  }

  if (loading) {
    return (
      <div className="border-2 border-black bg-[#eae3cb] p-4 font-mono text-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14]">
        Loading...
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
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">STUDENT SETTINGS</h1>
          <p className="text-[11px] mt-1 font-bold tracking-tight text-[#1a1a14]/80">
            Decrypted DB records are loaded into editable and locked settings boxes.
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] px-4 py-2 text-xs font-black uppercase text-[#f4ebd0] shadow-[2px_2px_0px_0px_#1a1a14] hover:bg-[#2a2a24] disabled:opacity-50"
        >
          {downloading ? <Loader className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {downloading ? "Generating..." : "Download Dossier (PDF)"}
        </button>
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
        >
          <div className="border-t-2 border-black p-4 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] px-5 py-2 text-xs font-black uppercase text-[#f4ebd0] shadow-[3px_3px_0px_0px_#1a1a14] hover:bg-[#2a2a24] disabled:opacity-50"
            >
              {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saveMessage && (
              <span className={`flex items-center gap-1 text-xs font-black uppercase ${saveMessage.type === "success" ? "text-green-800" : "text-red-800"}`}>
                {saveMessage.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {saveMessage.text}
              </span>
            )}
          </div>
        </SettingsSectionBox>

        <SettingsSectionBox
          title="Locked Settings"
          subtitle="Values in this box cannot be changed. Click the mail icon to request a change."
          icon={Lock}
          sections={lockedSections}
          fields={LOCKED_FIELDS}
          data={data}
          mode="locked"
          onChange={updateField}
          onRequestChange={(section, key) => {
            const sectionData = getSectionData(data, section);
            setRequestField({ section, key, currentValue: sectionData[key] || "" });
          }}
        />
      </div>

      {requestField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md border-2 border-black bg-[#eae3cb] shadow-[8px_8px_0px_0px_#1a1a14]">
            <div className="flex items-center justify-between border-b-2 border-black bg-[#1a1a14] p-3">
              <h2 className="text-xs font-black uppercase text-[#f4ebd0]">Request Change</h2>
              <button onClick={() => { setRequestField(null); setRequestMessage(null); }} className="text-[#f4ebd0] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form action={handleRequestSubmit} className="p-4 space-y-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/70">Field</div>
                <div className="mt-1 border-2 border-black bg-white px-3 py-2 text-xs font-black">
                  {labelFor(requestField.key)}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/70">Current Value</div>
                <div className="mt-1 border-2 border-black bg-[#f4ebd0] px-3 py-2 text-xs font-black">
                  {requestField.currentValue || "Not available"}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/70">
                  Requested Value
                </label>
                <input
                  name="requestedValue"
                  type="text"
                  required
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase outline-none focus:bg-[#eae3cb]"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/70">
                  Reason
                </label>
                <textarea
                  name="reason"
                  required
                  rows={3}
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase outline-none focus:bg-[#eae3cb]"
                />
              </div>
              {requestMessage && (
                <p className={`flex items-center gap-1 text-xs font-black uppercase ${requestMessage.type === "success" ? "text-green-800" : "text-red-800"}`}>
                  {requestMessage.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {requestMessage.text}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={requestSending}
                  className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] px-4 py-2 text-xs font-black uppercase text-[#f4ebd0] shadow-[2px_2px_0px_0px_#1a1a14] hover:bg-[#2a2a24] disabled:opacity-50"
                >
                  {requestSending ? <Loader className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  {requestSending ? "Sending..." : "Send Request"}
                </button>
                <button
                  type="button"
                  onClick={() => { setRequestField(null); setRequestMessage(null); }}
                  className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#1a1a14] hover:bg-[#eae3cb]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
  onRequestChange,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ElementType;
  sections: SettingsSection[];
  fields: Array<[SettingsSection, string]>;
  data: StudentSettingsData;
  mode: "editable" | "locked";
  onChange: (section: SettingsSection, key: string, value: string) => void;
  onRequestChange?: (section: SettingsSection, key: string) => void;
  children?: React.ReactNode;
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
                    onRequestChange={onRequestChange}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}

function SettingsField({
  section,
  fieldKey,
  value,
  mode,
  onChange,
  onRequestChange,
}: {
  section: SettingsSection;
  fieldKey: string;
  value: string;
  mode: "editable" | "locked";
  onChange: (section: SettingsSection, key: string, value: string) => void;
  onRequestChange?: (section: SettingsSection, key: string) => void;
}) {
  const label = labelFor(fieldKey);

  if (mode === "locked") {
    return (
      <div className="space-y-1">
        <div className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/70">{label}</div>
        <div className="flex items-start gap-2">
          <div className="min-h-[42px] flex-1 whitespace-pre-wrap break-words border-2 border-black bg-white px-3 py-2 text-xs font-black">
            {value}
          </div>
          {onRequestChange && (
            <button
              onClick={() => onRequestChange(section, fieldKey)}
              className="mt-0 flex h-[42px] w-[42px] shrink-0 items-center justify-center border-2 border-black bg-[#eae3cb] hover:bg-[#d4cbb3]"
              title="Request change"
            >
              <Mail className="h-4 w-4" />
            </button>
          )}
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
