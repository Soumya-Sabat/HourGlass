import { jsPDF } from "jspdf";
import type { StudentSettingsData } from "@/actions/dashboard-session-actions";

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

export function generateStudentDossierPdf(data: StudentSettingsData): void {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("STUDENT DOSSIER", pageWidth / 2, 20, { align: "center" });

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 27, { align: "center" });

  let y = 40;

  function addSection(title: string, entries: Array<[string, string]>) {
    if (y > 260) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(title.toUpperCase(), 14, y);
    y += 7;

    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(14, y, pageWidth - 14, y);
    y += 5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    for (const [key, value] of entries) {
      if (y > 275) {
        pdf.addPage();
        y = 20;
      }

      const label = FIELD_LABELS[key] || key;
      const displayValue = value === "Not available" || !value ? "-" : value;

      pdf.setFont("helvetica", "bold");
      pdf.text(`${label}:`, 14, y);
      const labelWidth = pdf.getTextWidth(`${label}: `);
      pdf.setFont("helvetica", "normal");
      pdf.text(displayValue, 14 + labelWidth + 1, y);
      y += 6;
    }

    y += 3;
  }

  addSection("Account", [
    ["name", data.account.name],
    ["email", data.account.email],
    ["role", data.account.role],
    ["phoneNumber", data.account.phoneNumber],
    ["institutionName", data.account.institutionName],
    ["institutionId", data.account.institutionId],
  ]);

  addSection("Student Profile", Object.entries(data.studentProfile));

  addSection("Personal Details", Object.entries(data.personalDetails));

  pdf.save("student-dossier.pdf");
}
