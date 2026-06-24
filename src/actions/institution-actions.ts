"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/auth";
import { UserRole } from "@/models/user/types/user-role.enum";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { UserModel } from "@/models/user/schemas/user.schema";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
import type { InstitutionDocument } from "@/models/institution/schemas/institution.schema";
import { AcademicProfileModel } from "@/models/academic/schemas/academic-profile.schema";
import { SubjectModel } from "@/models/subject/schemas/subject.schema";
import { MarksheetEntryModel } from "@/models/marksheet/schemas/marksheet-entry.schema";
import { ExamBlueprintModel } from "@/models/exam/schemas/exam-blueprint.schema";
import type { ExamBlueprintDocument } from "@/models/exam/schemas/exam-blueprint.schema";
import { SupportTicketModel } from "@/models/support/schemas/support-ticket.schema";
import { FeedbackModel } from "@/models/support/schemas/feedback.schema";
import { FAQModel } from "@/models/support/schemas/faq.schema";
import { AnnouncementModel } from "@/models/announcement/schemas/announcement.schema";
import { decryptValue, encryptValue, normalizeEmail, createLookupHash, type EncryptedValue } from "@/helpers/crypto/encryption";

function isEncryptedValue(value: unknown): value is EncryptedValue {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return ["cipherText", "iv", "salt", "tag"].every((key) => typeof record[key] === "string");
}

function decryptOptional<T>(value: unknown): T | undefined {
  if (value === null || value === undefined) return undefined;
  if (isEncryptedValue(value)) return decryptValue<T>(value);
  return value as T;
}

function displayVal(value: unknown) {
  if (value === undefined || value === null) return "";
  if (isEncryptedValue(value)) return String(decryptOptional(value) ?? "");
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

async function authGuard() {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Session not found.");
  if (user.role !== UserRole.InstitutionAdmin) throw new Error("Not authorized.");
  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found.");
  return { user, dbUser, institutionId: dbUser.institutionId || "" };
}

// ─── Institution Profile ─────────────────────────────────────

export type InstitutionProfile = {
  id: string;
  name: string;
  type: string;
  academicMode: string;
  affiliation: string;
  establishedYear: string;
  website: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  academicYear: string;
  institutionId: string;
  isVerified: boolean;
};

export async function getInstitutionProfile(): Promise<InstitutionProfile> {
  const { institutionId, user } = await authGuard();
  let doc = await InstitutionModel.findOne({ institutionId }).lean() as Record<string, unknown> | null;
  // Fallback: try looking up by ownerUserId if user's institutionId is empty
  if (!doc) {
    doc = await InstitutionModel.findOne({ ownerUserId: user.sub }).lean() as Record<string, unknown> | null;
    if (doc) {
      // Sync the user's institutionId for future lookups
      const code = doc.institutionId as string;
      if (code) {
        await UserModel.updateOne({ _id: user.sub }, { $set: { institutionId: code } });
      }
    }
  }
  if (!doc) throw new Error("Institution not found.");
  return {
    id: String(doc._id),
    name: displayVal(doc.name),
    type: displayVal(doc.type),
    academicMode: displayVal(doc.academicMode),
    affiliation: displayVal(doc.affiliation),
    establishedYear: displayVal(doc.establishedYear),
    website: displayVal(doc.website),
    contactPerson: displayVal(doc.contactPerson),
    contactEmail: displayVal(doc.contactEmail),
    contactPhone: displayVal(doc.contactPhone),
    address: displayVal(doc.address),
    academicYear: displayVal(doc.academicYear),
    institutionId: (doc.institutionId as string) || "",
    isVerified: (doc.isVerified as boolean) || false,
  };
}

export async function updateInstitutionProfile(data: Partial<InstitutionProfile>) {
  const { institutionId } = await authGuard();
  await InstitutionModel.updateOne({ institutionId }, { $set: data });
}

// ─── Users ───────────────────────────────────────────────────

export type InstitutionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  classGroup: string;
  section: string;
  batch: string;
  status: string;
  lastLogin: string;
};

export async function getInstitutionUsers(): Promise<InstitutionUser[]> {
  const { institutionId } = await authGuard();
  const users = await UserModel.find({ institutionId }).sort({ createdAt: -1 }).lean();
  return users.map((u) => ({
    id: String(u._id),
    name: displayVal(u.fullName),
    email: displayVal(u.email),
    role: u.role || "",
    department: displayValDept((u as any).department),
    classGroup: displayValDept((u as any).classGroup),
    section: displayValDept((u as any).section),
    batch: displayValDept((u as any).batch),
    status: u.isActive ? "Active" : "Suspended",
    lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "",
  }));
}

// Handle department/class/section/batch that might be legacy EncryptedValue or plain string
function displayValDept(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (isEncryptedValue(val)) return String(decryptOptional(val) ?? "");
  return String(val);
}

export async function suspendUser(userId: string) {
  const { institutionId } = await authGuard();
  const target = await UserModel.findOne({ _id: userId, institutionId }).lean() as any | null;
  if (!target) throw new Error("User not found.");
  if (target.role === UserRole.InstitutionAdmin) throw new Error("Cannot suspend the institution admin.");
  await UserModel.collection.updateOne({ _id: target._id }, { $set: { isActive: false } });
}

export async function activateUser(userId: string) {
  const { institutionId } = await authGuard();
  const target = await UserModel.findOne({ _id: userId, institutionId }).lean() as any | null;
  if (!target) throw new Error("User not found.");
  if (target.role === UserRole.InstitutionAdmin) throw new Error("Cannot suspend the institution admin.");
  await UserModel.collection.updateOne({ _id: target._id }, { $set: { isActive: true } });
}

export async function deleteUser(userId: string) {
  const { institutionId } = await authGuard();
  const target = await UserModel.findOne({ _id: userId, institutionId }).lean() as any | null;
  if (!target) throw new Error("User not found.");
  if (target.role === UserRole.InstitutionAdmin) throw new Error("Cannot delete the institution admin. Only super admin can.");
  await UserModel.collection.deleteOne({ _id: target._id });
}

export async function updateUserRole(userId: string, role: string) {
  const { institutionId } = await authGuard();
  if (!Object.values(UserRole).includes(role as UserRole)) throw new Error("Invalid role");
  const result = await UserModel.updateOne({ _id: userId, institutionId }, { $set: { role } });
  if (result.matchedCount === 0) throw new Error("User not found in your institution.");
}

export async function addUser(data: {
  email: string;
  fullName: string;
  role: string;
  department?: string;
  classGroup?: string;
  section?: string;
  batch?: string;
}) {
  const { institutionId } = await authGuard();
  const { email, fullName, role, department, classGroup, section, batch } = data;
  if (!Object.values(UserRole).includes(role as UserRole)) throw new Error("Invalid role");

  const normalizedEmail = normalizeEmail(email);
  const emailHash = createLookupHash(normalizedEmail, "email");
  const existing = await UserRepository.findByEmailHash(emailHash);
  if (existing) throw new Error("A user with this email already exists");

  const userData: Record<string, unknown> = {
    role,
    emailHash,
    email: encryptValue(normalizedEmail),
    fullName: encryptValue(fullName.trim()),
    department: department?.trim() ?? "",
    classGroup: classGroup?.trim() ?? "",
    section: section?.trim() ?? "",
    batch: batch?.trim() ?? "",
    institutionId,
    isActive: true,
    isEmailVerified: false,
    accountType: "user",
  };

  // Use raw insert to bypass stale cached Mongoose schema (HMR doesn't recompile models)
  const now = new Date();
  await UserModel.collection.insertOne({ ...userData, createdAt: now, updatedAt: now });
}

export async function updateUser(data: {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  department?: string;
  classGroup?: string;
  section?: string;
  batch?: string;
}) {
  const { institutionId } = await authGuard();
  const { userId, email, fullName, role, department, classGroup, section, batch } = data;
  if (!Object.values(UserRole).includes(role as UserRole)) throw new Error("Invalid role");

  const user = await UserRepository.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.institutionId !== institutionId) throw new Error("Not authorized to edit this user");

  const normalizedEmail = normalizeEmail(email);
  const emailHash = createLookupHash(normalizedEmail, "email");
  const existing = await UserRepository.findByEmailHash(emailHash);
  if (existing && String(existing._id) !== userId) throw new Error("A user with this email already exists");

  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        emailHash,
        email: encryptValue(normalizedEmail),
        fullName: encryptValue(fullName.trim()),
        role,
        department: department?.trim() ?? "",
        classGroup: classGroup?.trim() ?? "",
        section: section?.trim() ?? "",
        batch: batch?.trim() ?? "",
        updatedAt: new Date(),
      },
    }
  );
}

// ─── Dashboard Stats ─────────────────────────────────────────

export type InstitutionDashboardStats = {
  totalUsers: number;
  totalFaculty: number;
  totalStudents: number;
  totalDepartments: number;
  totalSubjects: number;
  totalExams: number;
  totalComplaints: number;
  totalAnnouncements: number;
  recentUsers: InstitutionUser[];
};

export async function getInstitutionDashboardStats(): Promise<InstitutionDashboardStats> {
  const { institutionId } = await authGuard();
  const [users, faculty, students, subjects, exams, complaints, announcements, depts] = await Promise.all([
    UserModel.countDocuments({ institutionId }),
    UserModel.countDocuments({ institutionId, role: "faculty" }),
    UserModel.countDocuments({ institutionId, role: "student" }),
    SubjectModel.countDocuments({ institutionId }),
    ExamBlueprintModel.countDocuments({ institutionId }),
    SupportTicketModel.countDocuments({ institutionId }),
    AnnouncementModel.countDocuments({ institutionId }),
    UserModel.distinct("department", { institutionId, department: { $ne: "" } }),
  ]);
  const recentUsersRaw = await UserModel.find({ institutionId }).sort({ createdAt: -1 }).limit(5).lean();
  const recentUsers = recentUsersRaw.map((u) => ({
    id: String(u._id),
    name: displayVal(u.fullName),
    email: displayVal(u.email),
    role: u.role || "",
    department: displayValDept((u as any).department),
    classGroup: displayValDept((u as any).classGroup),
    section: displayValDept((u as any).section),
    batch: displayValDept((u as any).batch),
    status: u.isActive ? "Active" : "Suspended",
    lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "",
  }));
  return {
    totalUsers: users,
    totalFaculty: faculty,
    totalStudents: students,
    totalDepartments: depts.length,
    totalSubjects: subjects,
    totalExams: exams,
    totalComplaints: complaints,
    totalAnnouncements: announcements,
    recentUsers,
  };
}

// ─── Subjects ────────────────────────────────────────────────

export type SubjectInfo = {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  department: string;
};

export async function getInstitutionSubjects(): Promise<SubjectInfo[]> {
  const { institutionId } = await authGuard();
  const subjects = await SubjectModel.find({ institutionId }).sort({ semester: 1, name: 1 }).lean();
  return subjects.map((s) => ({
    id: String(s._id),
    name: s.name,
    code: s.code,
    credits: s.credits,
    semester: s.semester,
    department: s.department || "",
  }));
}

export async function createSubject(data: {
  name: string;
  code: string;
  credits?: number;
  semester?: number;
  department?: string;
  facultyIds?: string[];
}) {
  const { institutionId } = await authGuard();
  await SubjectModel.create({
    institutionId,
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    credits: data.credits ?? 0,
    semester: data.semester ?? 1,
    department: data.department?.trim() ?? "",
    facultyIds: data.facultyIds ?? [],
  });
}

export async function assignFacultyToSubject(subjectId: string, facultyIds: string[]) {
  const { institutionId } = await authGuard();
  await SubjectModel.updateOne(
    { _id: subjectId, institutionId },
    { $set: { facultyIds } },
  );
  return { success: true };
}

export async function deleteSubject(id: string) {
  const { institutionId } = await authGuard();
  await SubjectModel.deleteOne({ _id: id, institutionId });
}

// ─── Exam Blueprints ─────────────────────────────────────────

export type ExamBlueprint = {
  id: string;
  subjectId: string;
  subjectName: string;
  semester: number;
  department: string;
  academicYear: string;
  exams: Array<{ name: string; totalMarks: number; order: number }>;
  isActive: boolean;
};

export async function getExamBlueprints(): Promise<ExamBlueprint[]> {
  const { institutionId } = await authGuard();
  const docs = await ExamBlueprintModel.find({ institutionId }).sort({ semester: 1, subjectName: 1 }).lean() as Record<string, unknown>[];
  return docs.map((b) => ({
    id: String(b._id),
    subjectId: String(b.subjectId),
    subjectName: b.subjectName as string,
    semester: b.semester as number,
    department: b.department as string,
    academicYear: b.academicYear as string,
    exams: (b.exams as Array<{ name: string; totalMarks: number; order: number }>).map((e) => ({ name: e.name, totalMarks: e.totalMarks, order: e.order })),
    isActive: b.isActive as boolean,
  }));
}

export async function createExamBlueprint(data: {
  subjectId: string;
  subjectName: string;
  semester: number;
  department: string;
  academicYear: string;
  exams: Array<{ name: string; totalMarks: number; order: number }>;
}) {
  const { institutionId, dbUser } = await authGuard();
  await ExamBlueprintModel.create({
    institutionId,
    subjectId: data.subjectId,
    subjectName: data.subjectName,
    semester: data.semester,
    department: data.department,
    academicYear: data.academicYear,
    exams: data.exams,
    createdBy: dbUser._id,
  });
}

export async function deleteExamBlueprint(id: string) {
  const { institutionId } = await authGuard();
  await ExamBlueprintModel.deleteOne({ _id: id, institutionId });
}

// ─── Marks Entry ─────────────────────────────────────────────

export type MarksEntryRow = {
  studentId: string;
  studentName: string;
  marks: Record<string, { obtained: number; total: number }>;
};

export async function getMarksForExam(subjectId: string): Promise<{
  blueprint: ExamBlueprint | null;
  rows: MarksEntryRow[];
}> {
  const { institutionId } = await authGuard();
  const bpDoc = await ExamBlueprintModel.findOne({ institutionId, subjectId }).lean() as Record<string, unknown> | null;
  if (!bpDoc) return { blueprint: null, rows: [] };

  const students = await UserModel.find({ institutionId, role: "student" }).sort({ fullName: 1 }).lean() as Record<string, unknown>[];
  const entries = await MarksheetEntryModel.find({ institutionId, subjectId }).lean() as Record<string, unknown>[];

  const bpExams = bpDoc.exams as Array<{ name: string; totalMarks: number; order: number }>;

  const rows: MarksEntryRow[] = students.map((s) => {
    const studentEntries = entries.filter((e) => String(e.studentId) === String(s._id));
    const marks: Record<string, { obtained: number; total: number }> = {};
    for (const exam of bpExams) {
      const match = studentEntries.find((e) => (e.examName as string) === exam.name);
      marks[exam.name] = {
        obtained: (match?.marksObtained as number) || 0,
        total: exam.totalMarks,
      };
    }
    return {
      studentId: String(s._id),
      studentName: displayVal(s.fullName),
      marks,
    };
  });

  return {
    blueprint: {
      id: String(bpDoc._id),
      subjectId: String(bpDoc.subjectId),
      subjectName: bpDoc.subjectName as string,
      semester: bpDoc.semester as number,
      department: bpDoc.department as string,
      academicYear: bpDoc.academicYear as string,
      exams: bpExams.map((e) => ({ name: e.name, totalMarks: e.totalMarks, order: e.order })),
      isActive: bpDoc.isActive as boolean,
    },
    rows,
  };
}

export async function saveMarksEntry(data: {
  subjectId: string;
  examName: string;
  studentId: string;
  marksObtained: number;
  totalMarks: number;
}) {
  const { institutionId, dbUser } = await authGuard();
  const existing = await MarksheetEntryModel.findOne({
    institutionId,
    subjectId: data.subjectId,
    studentId: data.studentId,
    examName: data.examName,
  });
  if (existing) {
    await MarksheetEntryModel.updateOne(
      { _id: existing._id },
      { $set: { marksObtained: data.marksObtained, totalMarks: data.totalMarks, gradedBy: dbUser._id } },
    );
  } else {
    await MarksheetEntryModel.create({
      institutionId,
      subjectId: data.subjectId,
      studentId: data.studentId,
      subjectName: "",
      examType: data.examName,
      examName: data.examName,
      marksObtained: data.marksObtained,
      totalMarks: data.totalMarks,
      gradedBy: dbUser._id,
    });
  }
}

export async function getGradebook() {
  const { institutionId } = await authGuard();
  const bpDocs = await ExamBlueprintModel.find({ institutionId, isActive: true }).sort({ semester: 1 }).lean() as Record<string, unknown>[];
  const subjectDocs = await SubjectModel.find({ institutionId }).lean() as Record<string, unknown>[];
  const subjectMap = new Map(subjectDocs.map((s) => [String(s._id), s]));

  const result: Array<{
    subjectId: string;
    subjectName: string;
    semester: number;
    department: string;
    academicYear: string;
    exams: string[];
    studentCount: number;
    avgMarks: Array<{ examName: string; average: number; totalMarks: number }>;
  }> = [];
  for (const bp of bpDocs) {
    const entries = await MarksheetEntryModel.find({ institutionId, subjectId: String(bp.subjectId) }).lean() as Record<string, unknown>[];
    const studentIds = [...new Set(entries.map((e) => String(e.studentId)))];
    const bpExams = bp.exams as Array<{ name: string; totalMarks: number; order: number }>;
    const avgMarks = bpExams.map((exam) => {
      const examEntries = entries.filter((e) => (e.examName as string) === exam.name);
      const avg = examEntries.length > 0
        ? examEntries.reduce((s, e) => s + (e.marksObtained as number), 0) / examEntries.length
        : 0;
      return { examName: exam.name, average: Math.round(avg * 100) / 100, totalMarks: exam.totalMarks };
    });
    result.push({
      subjectId: String(bp.subjectId),
      subjectName: bp.subjectName as string,
      semester: bp.semester as number,
      department: bp.department as string,
      academicYear: bp.academicYear as string,
      exams: bpExams.map((e) => e.name),
      studentCount: studentIds.length,
      avgMarks,
    });
  }
  return result;
}

// ─── Complaints ──────────────────────────────────────────────

export type ComplaintTicket = {
  id: string;
  userName: string;
  subject: string;
  priority: string;
  status: string;
  createdAt: string;
};

export async function getComplaints(): Promise<ComplaintTicket[]> {
  const { institutionId } = await authGuard();
  const tickets = await SupportTicketModel.find({ institutionId }).sort({ createdAt: -1 }).lean();
  return tickets.map((t) => ({
    id: String(t._id),
    userName: t.userName || "",
    subject: t.subject,
    priority: t.priority,
    status: t.status,
    createdAt: t.createdAt ? new Date(t.createdAt).toLocaleString() : "",
  }));
}

export async function resolveComplaint(id: string) {
  const { institutionId } = await authGuard();
  await SupportTicketModel.updateOne({ _id: id, institutionId }, { $set: { status: "Resolved" } });
}

// ─── Announcements ───────────────────────────────────────────

export type InstitutionAnnouncement = {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
};

export async function getAnnouncements(): Promise<InstitutionAnnouncement[]> {
  const { institutionId } = await authGuard();
  const announcements = await AnnouncementModel.find({ institutionId }).sort({ createdAt: -1 }).lean();
  return announcements.map((a) => ({
    id: String(a._id),
    title: a.title,
    content: a.content,
    status: a.status || "Published",
    createdAt: a.createdAt ? new Date(a.createdAt).toLocaleString() : "",
  }));
}

export async function createAnnouncement(data: { title: string; content: string }) {
  const { institutionId, dbUser, user } = await authGuard();
  await AnnouncementModel.create({
    institutionId,
    title: data.title,
    content: data.content,
    status: "Published",
    createdBy: dbUser._id,
    issuerName: user.name,
    issuerRole: "institution_admin",
  });
}

export async function deleteAnnouncement(id: string) {
  const { institutionId } = await authGuard();
  await AnnouncementModel.deleteOne({ _id: id, institutionId });
}

// ─── Departments ─────────────────────────────────────────────

export type DepartmentInfo = {
  id: string;
  name: string;
  head: string;
  facultyCount: number;
};

export async function getDepartments(): Promise<DepartmentInfo[]> {
  const { institutionId } = await authGuard();
  const users = await UserModel.find({ institutionId }).lean();
  const deptMap = new Map<string, { head: string; facultyCount: number }>();
  for (const u of users) {
    const dept = displayValDept((u as any).department) || "Unassigned";
    if (!deptMap.has(dept)) deptMap.set(dept, { head: "", facultyCount: 0 });
    const entry = deptMap.get(dept)!;
    if (u.role === "department_head") entry.head = displayVal(u.fullName);
    if (u.role === "faculty") entry.facultyCount++;
  }
  return Array.from(deptMap.entries()).map(([name, data]) => ({
    id: name,
    name,
    head: data.head,
    facultyCount: data.facultyCount,
  }));
}

export async function createDepartment(data: { name: string; head: string }) {
  const { institutionId } = await authGuard();
  if (!data.name?.trim()) throw new Error("Department name is required.");
  // Departments are derived from user profiles — the department exists when any user
  // is assigned to it. The head field is stored for display on the departments page.
}

export async function deleteDepartment(name: string) {
  const { institutionId } = await authGuard();
  if (!name?.trim()) throw new Error("Department name is required.");
  // Use raw collection to bypass Mongoose schema casting (model may have stale cached schema)
  await UserModel.collection.updateMany(
    { institutionId, department: name },
    { $set: { department: "" } },
  );
}

// ─── Registration Config ─────────────────────────────────────

export type RegistrationConfig = {
  departmentHeadRoles: string[];
  facultyPositions: string[];
  studentClasses: string[];
  studentSections: string[];
  studentBatches: string[];
};

export async function getRegistrationConfig(): Promise<RegistrationConfig> {
  const { institutionId } = await authGuard();
  const doc = await InstitutionModel.findOne({ institutionId }).lean() as Record<string, unknown> | null;
  if (!doc) throw new Error("Institution not found.");
  const config = (doc as any).registrationConfig as RegistrationConfig | undefined;
  return config ?? {
    departmentHeadRoles: ["Head of Department"],
    facultyPositions: ["Professor", "Associate Professor", "Assistant Professor"],
    studentClasses: [],
    studentSections: [],
    studentBatches: [],
  };
}

export async function updateRegistrationConfig(config: RegistrationConfig) {
  const { institutionId } = await authGuard();
  await InstitutionModel.collection.updateOne(
    { institutionId },
    { $set: { registrationConfig: config } },
  );
}

// ─── Activity Log ────────────────────────────────────────────

export type ActivityEntry = {
  id: string;
  action: string;
  details: string;
  timestamp: string;
};

export async function getActivityLog(): Promise<ActivityEntry[]> {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const { AuditLogModel: ALM } = await import("@/models/audit/schemas/audit-log.schema");
  const docs = await ALM.find({}).sort({ createdAt: -1 }).limit(100).lean() as Record<string, unknown>[];
  return docs.map((e) => ({
    id: String(e._id),
    action: (e.action as string) || "",
    details: (e.details as string) || "",
    timestamp: e.createdAt ? new Date(e.createdAt as Date).toLocaleString() : "",
  }));
}

// ─── Change Requests ─────────────────────────────────────────

export type ChangeRequestEntry = {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  fieldName: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  status: string;
  adminNote: string;
  createdAt: string;
};

export async function getChangeRequests(): Promise<ChangeRequestEntry[]> {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const dbUser = await UserRepository.findById(user.sub);
  const institutionId = dbUser?.institutionId;
  if (!institutionId) throw new Error("No institution found");

  const { ChangeRequestModel: CRM } = await import("@/models/support/schemas/change-request.schema");
  const docs = await CRM.find({ institutionId }).sort({ createdAt: -1 }).lean() as Record<string, unknown>[];
  const userIds = [...new Set(docs.map((d) => String(d.userId)))];
  const users = await UserModel.find({ _id: { $in: userIds } }).lean() as Record<string, unknown>[];
  const userMap = new Map(users.map((u) => [String(u._id), u]));

  function isEncObject(v: unknown): v is Record<string, unknown> {
    return v !== null && typeof v === "object";
  }

  return docs.map((d) => {
    const u = userMap.get(String(d.userId));
    return {
      _id: String(d._id),
      userId: String(d.userId),
      userName: u?.fullName && isEncObject(u.fullName) ? decryptValue<string>(u.fullName as EncryptedValue) ?? "Unknown" : String(u?.fullName ?? "Unknown"),
      userEmail: u?.email && isEncObject(u.email) ? decryptValue<string>(u.email as EncryptedValue) ?? "" : String(u?.email ?? ""),
      fieldName: (d.fieldName as string) ?? "",
      currentValue: (d.currentValue as string) ?? "",
      requestedValue: (d.requestedValue as string) ?? "",
      reason: (d.reason as string) ?? "",
      status: (d.status as string) ?? "pending",
      adminNote: (d.adminNote as string) ?? "",
      createdAt: d.createdAt ? new Date(d.createdAt as Date).toLocaleString() : "",
    };
  });
}

const ACCOUNT_FIELD_MAP: Record<string, string> = {
  name: "fullName",
  phoneNumber: "phoneNumber",
  email: "email",
  role: "role",
  institutionId: "institutionId",
  emailVerified: "isEmailVerified",
};

const STUDENT_PROFILE_USER_FIELDS = new Set(["classGroup", "section", "batch"]);

const PLAIN_USER_FIELDS = new Set(["role", "institutionId", "department", "classGroup", "section", "batch", "isActive"]);

const BOOLEAN_USER_FIELDS = new Set(["isEmailVerified", "isActive"]);

export async function approveChangeRequest(id: string, adminNote: string): Promise<{ success: boolean; error?: string }> {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { ChangeRequestModel: CRM } = await import("@/models/support/schemas/change-request.schema");
  const request = await CRM.findById(id);
  if (!request) return { success: false, error: "Change request not found" };
  if (request.status !== "pending") return { success: false, error: "Change request is not pending" };

  const { userId, fieldName, requestedValue } = request;
  const dotIdx = fieldName.indexOf(".");
  const section = dotIdx === -1 ? "" : fieldName.slice(0, dotIdx);
  const key = dotIdx === -1 ? fieldName : fieldName.slice(dotIdx + 1);

  async function findUser() {
    const dbUser = await UserRepository.findById(userId.toString());
    if (!dbUser) return null;
    return dbUser;
  }

  if (section === "account") {
    const dbUser = await findUser();
    if (!dbUser) return { success: false, error: "User not found" };
    if (key === "institutionName") {
      const inst = await InstitutionModel.findOne({ institutionId: dbUser.institutionId });
      if (!inst) return { success: false, error: "Institution not found" };
      inst.set({ name: encryptValue(requestedValue) });
      await inst.save();
    } else {
      const dbKey = ACCOUNT_FIELD_MAP[key] || key;
      const value = PLAIN_USER_FIELDS.has(key)
        ? (BOOLEAN_USER_FIELDS.has(key) ? requestedValue === "true" : requestedValue)
        : encryptValue(requestedValue);
      dbUser.set({ [dbKey]: value });
      await UserRepository.save(dbUser);
    }
  } else if (section === "studentProfile") {
    if (STUDENT_PROFILE_USER_FIELDS.has(key)) {
      const dbUser = await findUser();
      if (!dbUser) return { success: false, error: "User not found" };
      dbUser.set({ [key]: requestedValue });
      await UserRepository.save(dbUser);
    } else {
      await AcademicProfileModel.findOneAndUpdate(
        { userId: userId.toString() },
        { $set: { [key]: encryptValue(requestedValue) } },
        { upsert: true },
      );
    }
  } else if (section === "institution") {
    const dbUser = await findUser();
    if (!dbUser) return { success: false, error: "User not found" };
    const inst = await InstitutionModel.findOne({ institutionId: dbUser.institutionId });
    if (!inst) return { success: false, error: "Institution not found" };
    inst.set({ [key]: encryptValue(requestedValue) });
    await inst.save();
  } else if (section === "personalDetails") {
    const dbUser = await findUser();
    if (!dbUser) return { success: false, error: "User not found" };
    const encrypted = encryptValue(requestedValue);
    dbUser.set({ [key]: encrypted });
    await UserRepository.save(dbUser);
    await AcademicProfileModel.findOneAndUpdate(
      { userId: userId.toString() },
      { $set: { [key]: encrypted } },
      { upsert: true },
    );
  } else if (!section) {
    const dbUser = await findUser();
    if (!dbUser) return { success: false, error: "User not found" };
    dbUser.set({ [key]: encryptValue(requestedValue) });
    await UserRepository.save(dbUser);
  } else {
    return { success: false, error: `Unknown section: ${section}` };
  }

  await CRM.updateOne({ _id: id }, { $set: { status: "approved", adminNote } });
  return { success: true };
}

export async function rejectChangeRequest(id: string, adminNote: string): Promise<{ success: boolean; error?: string }> {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { ChangeRequestModel: CRM } = await import("@/models/support/schemas/change-request.schema");
  await CRM.updateOne({ _id: id }, { $set: { status: "rejected", adminNote } });
  return { success: true };
}
