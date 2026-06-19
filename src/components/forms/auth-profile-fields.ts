import type { ProfileField } from "@/components/forms/auth-form.types";

const yesNoOptions = ["Yes", "No"];

export const roleProfileFields: Record<string, ProfileField[]> = {
  institution_admin: [
    { name: "adminScope", label: "Admin Scope", type: "select", required: true, options: ["School-wide", "College-wide", "University-wide"] },
    { name: "academicMode", label: "Academic Mode", type: "select", required: true, options: ["School", "College", "Hybrid"] },
    { name: "managedDepartments", label: "Departments / Sections", type: "tags", required: true, placeholder: "CSE, ECE, Primary, Senior Secondary" },
    { name: "timetableCycle", label: "Timetable Cycle", required: true, placeholder: "2026-27 Semester 1 / Term 1" },
  ],
  department_admin: [
    { name: "departmentName", label: "Department / Section", required: true, placeholder: "Computer Science / Grade 10" },
    { name: "managedBatches", label: "Managed Batches", type: "tags", required: true, placeholder: "CSE-A, CSE-B, Grade 10-A" },
    { name: "roomPlanningAccess", label: "Room Planning Access", type: "select", required: true, options: yesNoOptions },
    { name: "approvalLevel", label: "Approval Level", type: "select", required: true, options: ["Draft only", "Department approval", "Final approval"] },
  ],
  department_head: [
    { name: "departmentName", label: "Department / Section", required: true, placeholder: "Physics / Senior Secondary" },
    { name: "facultyCount", label: "Faculty Count", type: "number", required: true, placeholder: "18" },
    { name: "approvalResponsibility", label: "Approval Responsibility", type: "select", required: true, options: ["Department", "Cross-department", "Institute"] },
    { name: "priorityRules", label: "Priority Rules", type: "tags", required: true, placeholder: "No Friday labs, Morning theory, Lab blocks" },
  ],
  faculty: [
    { name: "employeeId", label: "Employee ID", required: true, placeholder: "FAC-1024" },
    { name: "departmentName", label: "Department / Section", required: true, placeholder: "Mathematics" },
    { name: "subjects", label: "Subjects", type: "tags", required: true, placeholder: "Calculus, Statistics, Algebra" },
    { name: "maxClassesPerDay", label: "Max Classes Per Day", type: "number", required: true, placeholder: "4" },
    { name: "preferredSlots", label: "Preferred Slots", type: "tags", required: true, placeholder: "Morning, Mon-Wed, Lab block 2" },
  ],
  reviewer: [
    { name: "reviewScope", label: "Review Scope", type: "select", required: true, options: ["Department", "Institute", "Cross-department"] },
    { name: "reviewDepartments", label: "Review Departments", type: "tags", required: true, placeholder: "CSE, ECE, Grade 9" },
    { name: "checksPerformed", label: "Checks Performed", type: "tags", required: true, placeholder: "Faculty clashes, Room conflicts, Workload balance" },
  ],
  student: [
    { name: "studentId", label: "Student ID / Roll Number", required: true, placeholder: "HG-2026-014" },
    { name: "programOrClass", label: "Program / Class", required: true, placeholder: "B.Tech CSE / Grade 10" },
    { name: "batchOrSection", label: "Batch / Section", required: true, placeholder: "A" },
    { name: "subjects", label: "Subjects / Electives", type: "tags", required: true, placeholder: "Physics, AI Lab, Hindi" },
    { name: "preferredSlots", label: "Preferred Slots", type: "tags", required: true, placeholder: "Morning, No late labs" },
  ],
  admin: [
    { name: "adminArea", label: "Admin Area", type: "select", required: true, options: ["Platform", "Support", "Institution operations"] },
    { name: "permissions", label: "Permissions", type: "tags", required: true, placeholder: "Users, Institutions, Audit logs" },
  ],
  super_admin: [
    { name: "adminArea", label: "Admin Area", type: "select", required: true, options: ["Platform owner", "Security", "Operations"] },
    { name: "permissions", label: "Permissions", type: "tags", required: true, placeholder: "All institutions, Billing, Audit logs" },
  ],
};
