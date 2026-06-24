"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/auth";
import { UserRole } from "@/models/user/types/user-role.enum";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { UserModel } from "@/models/user/schemas/user.schema";
import { SubjectModel } from "@/models/subject/schemas/subject.schema";
import { ExamBlueprintModel } from "@/models/exam/schemas/exam-blueprint.schema";
import { NoticeModel } from "@/models/notice/schemas/notice.schema";
import { MessageModel } from "@/models/message/schemas/message.schema";
import { DepartmentSettingModel } from "@/models/department/schemas/department-setting.schema";
import { AlertModel } from "@/models/alert/schemas/alert.schema";
import { decryptValue, type EncryptedValue } from "@/helpers/crypto/encryption";

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

async function authGuard() {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Session not found.");
  if (user.role !== UserRole.DepartmentAdmin && user.role !== UserRole.DepartmentHead && user.role !== UserRole.InstitutionAdmin) throw new Error("Not authorized.");
  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found.");
  return { user, dbUser, institutionId: dbUser.institutionId || "", department: dbUser.department || "" };
}

// ─── Types ──────────────────────────────────────────────────

export type DepartmentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  classGroup: string;
  section: string;
  batch: string;
  status: string;
  lastLogin: string;
};

export type DepartmentDashboardStats = {
  totalFaculty: number;
  totalStudents: number;
  totalSubjects: number;
  totalExams: number;
};

// ─── Dashboard Stats ────────────────────────────────────────

export async function getDepartmentDashboardStats(): Promise<DepartmentDashboardStats> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};

  const [faculty, students, subjects, exams] = await Promise.all([
    UserModel.countDocuments({ institutionId, ...dept, role: { $in: [UserRole.Faculty, UserRole.DepartmentHead, UserRole.Reviewer] } }),
    UserModel.countDocuments({ institutionId, ...dept, role: UserRole.Student }),
    SubjectModel.countDocuments({ institutionId, ...dept }),
    ExamBlueprintModel.countDocuments({ institutionId, ...dept }),
  ]);

  return { totalFaculty: faculty, totalStudents: students, totalSubjects: subjects, totalExams: exams };
}

// ─── Department Users (Faculty Roster) ──────────────────────

export async function getDepartmentUsers(): Promise<DepartmentUser[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};

  const users = await UserModel.find({ institutionId, ...dept }).sort({ createdAt: -1 }).lean() as Record<string, unknown>[];

  return users.map((u) => ({
    id: String(u._id),
    name: decryptOptional<string>(u.fullName) ?? "",
    email: decryptOptional<string>(u.email) ?? "",
    role: (u.role as string) ?? "",
    classGroup: (u.classGroup as string) ?? "",
    section: (u.section as string) ?? "",
    batch: (u.batch as string) ?? "",
    status: (u.isActive as boolean) ? "Active" : "Suspended",
    lastLogin: u.lastLogin ? new Date(u.lastLogin as Date).toLocaleString() : "Never",
  }));
}

// ─── Subjects ───────────────────────────────────────────────

export async function getDepartmentSubjects(): Promise<{ id: string; name: string; code: string; faculty: string }[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};

  const subjects = await SubjectModel.find({ institutionId, ...dept }).sort({ name: 1 }).lean() as Record<string, unknown>[];

  const allFacultyIds = [...new Set(subjects.flatMap((s) => (s.facultyIds as string[] || []).filter(Boolean)))];
  const facultyUsers = allFacultyIds.length > 0
    ? await UserModel.find({ _id: { $in: allFacultyIds } }).lean() as Record<string, unknown>[]
    : [];
  const facultyMap = new Map(facultyUsers.map((f) => [String(f._id), decryptOptional<string>(f.fullName) ?? "Unknown"]));

  return subjects.map((s) => {
    const fIds = (s.facultyIds as string[] || []);
    const faculty = fIds.map((id: string) => facultyMap.get(id) ?? "Unknown").join(", ") || "Unassigned";
    return {
      id: String(s._id),
      name: (s.name as string) ?? "",
      code: (s.code as string) ?? "",
      faculty,
    };
  });
}

// ─── Exams ──────────────────────────────────────────────────

export async function getDepartmentExams(): Promise<{ id: string; title: string; subject: string; date: string }[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};

  const exams = await ExamBlueprintModel.find({ institutionId, ...dept }).sort({ createdAt: -1 }).lean() as Record<string, unknown>[];

  return exams.map((e) => ({
    id: String(e._id),
    title: (e.title as string) ?? "",
    subject: (e.subject as string) ?? "",
    date: e.examDate ? new Date(e.examDate as Date).toLocaleDateString() : "TBD",
  }));
}

// ─── Notices ────────────────────────────────────────────────

export type DepartmentNotice = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export async function getDepartmentNotices(): Promise<DepartmentNotice[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const notices = await NoticeModel.find({ institutionId, ...dept }).sort({ createdAt: -1 }).lean();
  return notices.map((n) => ({
    id: String(n._id),
    title: n.title,
    content: n.content,
    date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "",
  }));
}

export async function createDepartmentNotice(data: { title: string; content: string }) {
  const { institutionId, department, dbUser, user } = await authGuard();
  await NoticeModel.create({
    institutionId,
    department,
    issuerId: dbUser._id,
    issuerName: user.name ?? "",
    issuerRole: "department_admin",
    title: data.title,
    content: data.content,
  });
}

export async function deleteDepartmentNotice(id: string) {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  await NoticeModel.deleteOne({ _id: id, institutionId, ...dept });
}

// ─── Messages ───────────────────────────────────────────────

export type DepartmentMessage = {
  id: string;
  senderName: string;
  content: string;
  date: string;
};

export async function getDepartmentMessages(): Promise<DepartmentMessage[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const deptUsers = await UserModel.find({ institutionId, ...dept }).select("_id").lean();
  const deptUserIds = deptUsers.map((u) => u._id);
  const messages = await MessageModel.find({ institutionId, $or: [{ senderId: { $in: deptUserIds } }, { receiverId: { $in: deptUserIds } }] })
    .sort({ createdAt: -1 }).limit(100).lean();
  return messages.map((m) => ({
    id: String(m._id),
    senderName: m.senderName || "Unknown",
    content: m.content,
    date: m.createdAt ? new Date(m.createdAt).toLocaleString() : "",
  }));
}

export async function sendDepartmentMessage(data: { content: string }) {
  const { institutionId, dbUser, user } = await authGuard();
  await MessageModel.create({
    institutionId,
    senderId: dbUser._id,
    senderName: user.name ?? "",
    senderRole: "department_admin",
    content: data.content,
  });
}

// ─── Settings ───────────────────────────────────────────────

export async function getDepartmentSettings(): Promise<{ displayName: string; code: string; description: string }> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const existing = await DepartmentSettingModel.findOne({ institutionId, ...dept }).lean() as Record<string, unknown> | null;
  if (existing) {
    return { displayName: String(existing.displayName || ""), code: String(existing.code || ""), description: String(existing.description || "") };
  }
  return { displayName: department, code: "", description: "" };
}

export async function updateDepartmentSettings(data: { displayName: string; code: string; description: string }) {
  const { institutionId, department, dbUser } = await authGuard();
  const dept = department ? { department } : {};
  await DepartmentSettingModel.updateOne(
    { institutionId, ...dept },
    { $set: { institutionId, department, displayName: data.displayName, code: data.code, description: data.description } },
    { upsert: true },
  );
  return { success: true };
}

// ─── Students (filtered) ────────────────────────────────────

export type DepartmentStudent = {
  id: string;
  name: string;
  email: string;
  classGroup: string;
  section: string;
  batch: string;
  status: string;
};

export async function getDepartmentStudents(filters?: { classGroup?: string; section?: string; batch?: string }): Promise<DepartmentStudent[]> {
  const { institutionId, department } = await authGuard();
  const query: Record<string, unknown> = { institutionId, role: UserRole.Student };
  if (department) query.department = department;
  if (filters?.classGroup) query.classGroup = filters.classGroup;
  if (filters?.section) query.section = filters.section;
  if (filters?.batch) query.batch = filters.batch;

  const users = await UserModel.find(query).sort({ createdAt: -1 }).lean() as Record<string, unknown>[];
  return users.map((u) => ({
    id: String(u._id),
    name: decryptOptional<string>(u.fullName) ?? "",
    email: decryptOptional<string>(u.email) ?? "",
    classGroup: (u.classGroup as string) ?? "",
    section: (u.section as string) ?? "",
    batch: (u.batch as string) ?? "",
    status: (u.isActive as boolean) ? "Active" : "Suspended",
  }));
}

export async function updateDepartmentStudent(data: {
  userId: string;
  fullName: string;
  email: string;
  classGroup?: string;
  section?: string;
  batch?: string;
}) {
  const { institutionId, department } = await authGuard();
  const { userId, fullName, email, classGroup, section, batch } = data;
  const dept = department ? { department } : {};

  const user = await UserModel.findOne({ _id: userId, institutionId, ...dept });
  if (!user) throw new Error("Student not found in your department");
  if (user.role !== UserRole.Student) throw new Error("User is not a student");

  const { normalizeEmail, createLookupHash, encryptValue } = await import("@/helpers/crypto/encryption");
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
        classGroup: classGroup?.trim() ?? "",
        section: section?.trim() ?? "",
        batch: batch?.trim() ?? "",
        updatedAt: new Date(),
      },
    }
  );
  return { success: true };
}

export async function suspendDepartmentUser(userId: string) {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const result = await UserModel.updateOne({ _id: userId, institutionId, ...dept }, { $set: { isActive: false, updatedAt: new Date() } });
  if (result.matchedCount === 0) throw new Error("User not found in your department");
  return { success: true };
}

export async function activateDepartmentUser(userId: string) {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const result = await UserModel.updateOne({ _id: userId, institutionId, ...dept }, { $set: { isActive: true, updatedAt: new Date() } });
  if (result.matchedCount === 0) throw new Error("User not found in your department");
  return { success: true };
}

export async function getDepartmentFilterOptions(): Promise<{ classGroups: string[]; sections: string[]; batches: string[] }> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const students = await UserModel.find({ institutionId, ...dept, role: UserRole.Student }).lean() as Record<string, unknown>[];
  const classGroups = [...new Set(students.map((s) => s.classGroup as string).filter(Boolean))].sort();
  const sections = [...new Set(students.map((s) => s.section as string).filter(Boolean))].sort();
  const batches = [...new Set(students.map((s) => s.batch as string).filter(Boolean))].sort();
  return { classGroups, sections, batches };
}

// ─── Exam Management ────────────────────────────────────────

export async function createDepartmentExam(data: { title: string; subject: string; examDate: string; startTime?: string; endTime?: string; maxMarks?: number }) {
  const { institutionId, department } = await authGuard();
  // Use raw insertOne to bypass stale cached Mongoose schema (HMR cache issue)
  const doc = {
    institutionId,
    department,
    title: data.title,
    subject: data.subject,
    examDate: data.examDate ? new Date(data.examDate) : undefined,
    startTime: data.startTime || "",
    endTime: data.endTime || "",
    maxMarks: data.maxMarks || 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await ExamBlueprintModel.collection.insertOne(doc);

  await broadcastAlert({
    title: `New exam scheduled: ${data.title}`,
    message: `${data.subject} exam on ${data.examDate}${data.startTime ? ` at ${data.startTime}` : ""}.`,
    type: "exam",
    link: "/dashboard/department/exams",
  });
}

export async function deleteDepartmentExam(id: string) {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  await ExamBlueprintModel.deleteOne({ _id: id, institutionId, ...dept });
}

export async function updateDepartmentExam(id: string, data: { title?: string; subject?: string; examDate?: string; startTime?: string; endTime?: string; maxMarks?: number }) {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const update: Record<string, unknown> = {};
  if (data.title) update.title = data.title;
  if (data.subject) update.subject = data.subject;
  if (data.examDate) update.examDate = new Date(data.examDate);
  if (data.startTime !== undefined) update.startTime = data.startTime;
  if (data.endTime !== undefined) update.endTime = data.endTime;
  if (data.maxMarks !== undefined) update.maxMarks = data.maxMarks;
  await ExamBlueprintModel.updateOne({ _id: id, institutionId, ...dept }, { $set: update });
}

// ─── Events & Alerts ────────────────────────────────────────

export type DepartmentEvent = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  terminationDate: string;
  eventType: string;
  createdAt: string;
};

/** Filters out expired events and returns clean list. */
export async function getDepartmentEvents(): Promise<DepartmentEvent[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const { EventModel } = await import("@/models/event/schemas/event.schema");
  // Remove expired events first
  await EventModel.deleteMany({ institutionId, ...dept, terminationDate: { $ne: null, $lte: new Date() } });
  const events = await EventModel.find({ institutionId, ...dept }).sort({ eventDate: -1 }).lean() as Record<string, unknown>[];
  return events.map((e) => ({
    id: String(e._id),
    title: (e.title as string) ?? "",
    description: (e.description as string) ?? "",
    eventDate: e.eventDate ? new Date(e.eventDate as Date).toLocaleDateString() : "",
    terminationDate: e.terminationDate ? new Date(e.terminationDate as Date).toLocaleDateString() : "",
    eventType: (e.eventType as string) ?? "general",
    createdAt: e.createdAt ? new Date(e.createdAt as Date).toLocaleString() : "",
  }));
}

/** Only institution_admin or department_admin can create events. */
export async function createDepartmentEvent(data: { title: string; description: string; eventDate: string; terminationDate?: string; eventType: string }) {
  const { institutionId, department, dbUser, user } = await authGuard();
  if (user.role !== "institution_admin" && user.role !== "department_admin") throw new Error("Only admins can create events.");
  const { EventModel } = await import("@/models/event/schemas/event.schema");
  const event = await EventModel.create({
    institutionId,
    department,
    title: data.title,
    description: data.description,
    eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
    terminationDate: data.terminationDate ? new Date(data.terminationDate) : null,
    eventType: data.eventType || "general",
    createdBy: dbUser._id,
  });

  await broadcastAlert({
    title: `New ${data.eventType} event: ${data.title}`,
    message: data.description || `A new ${data.eventType} event has been scheduled on ${data.eventDate}.`,
    type: "event",
    link: "/dashboard/events",
  });

  return { id: String(event._id) };
}

/** Only institution_admin or department_admin can delete events. */
export async function deleteDepartmentEvent(id: string) {
  const { institutionId, department, user } = await authGuard();
  if (user.role !== "institution_admin" && user.role !== "department_admin") throw new Error("Only admins can delete events.");
  const dept = department ? { department } : {};
  const { EventModel } = await import("@/models/event/schemas/event.schema");
  await EventModel.deleteOne({ _id: id, institutionId, ...dept });
}

/** Read-only events view for all users (no auth guard — any authenticated user). */
export async function getPublicEvents(): Promise<DepartmentEvent[]> {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found");
  const institutionId = dbUser.institutionId || "";
  const department = dbUser.department || "";
  const { EventModel } = await import("@/models/event/schemas/event.schema");
  // Remove expired events first
  await EventModel.deleteMany({ institutionId, terminationDate: { $ne: null, $lte: new Date() } });
  const query: Record<string, unknown> = { institutionId };
  if (department) query.department = department;
  const events = await EventModel.find(query).sort({ eventDate: -1 }).lean() as Record<string, unknown>[];
  return events.map((e) => ({
    id: String(e._id),
    title: (e.title as string) ?? "",
    description: (e.description as string) ?? "",
    eventDate: e.eventDate ? new Date(e.eventDate as Date).toLocaleDateString() : "",
    terminationDate: e.terminationDate ? new Date(e.terminationDate as Date).toLocaleDateString() : "",
    eventType: (e.eventType as string) ?? "general",
    createdAt: e.createdAt ? new Date(e.createdAt as Date).toLocaleString() : "",
  }));
}

// ─── Alert Broadcast ────────────────────────────────────────

async function broadcastAlert(data: {
  title: string;
  message: string;
  type: "event" | "exam" | "notice" | "announcement" | "general";
  link?: string;
}) {
  const { institutionId, department } = await authGuard();
  const allUsers = await UserModel.find({ institutionId }).select("_id role").lean();
  const alerts = allUsers.map((u) => ({
    institutionId,
    department,
    targetUserId: u._id,
    targetRole: u.role,
    title: data.title,
    message: data.message,
    type: data.type,
    link: data.link || "",
  }));
  if (alerts.length > 0) await AlertModel.insertMany(alerts);
}

// Global alert actions (any authenticated user)
export type AlertEntry = {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string;
  read: boolean;
  createdAt: string;
};

export async function getMyAlerts(): Promise<AlertEntry[]> {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  const alerts = await AlertModel.find({ targetUserId: user.sub }).sort({ createdAt: -1 }).limit(50).lean();
  return alerts.map((a) => ({
    id: String(a._id),
    title: a.title,
    message: a.message,
    type: a.type,
    link: a.link || "",
    read: a.read,
    createdAt: a.createdAt ? new Date(a.createdAt).toLocaleString() : "",
  }));
}

export async function markAlertRead(id: string) {
  await connectToDatabase();
  await AlertModel.updateOne({ _id: id }, { $set: { read: true } });
}

export async function getUnreadAlertCount(): Promise<number> {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) return 0;
  return AlertModel.countDocuments({ targetUserId: user.sub, read: false });
}
