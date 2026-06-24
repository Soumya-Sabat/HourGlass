"use server";

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/auth";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { UserModel } from "@/models/user/schemas/user.schema";
import { SubjectModel } from "@/models/subject/schemas/subject.schema";
import { TimetableEntryModel } from "@/models/timetable/schemas/timetable-entry.schema";
import { NoticeModel } from "@/models/notice/schemas/notice.schema";
import { AttendanceRecordModel } from "@/models/attendance/schemas/attendance-record.schema";
import { decryptValue, encryptValue, type EncryptedValue } from "@/helpers/crypto/encryption";
import { ClusterModel } from "@/models/cluster/schemas/cluster.schema";
import { ExchangeRequestModel } from "@/models/exchange-request/schemas/exchange-request.schema";
import { UserRole } from "@/models/user/types/user-role.enum";

function isEncrypted(value: unknown): value is EncryptedValue {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return ["cipherText", "iv", "salt", "tag"].every((k) => typeof r[k] === "string");
}

function decrypt<T>(value: unknown): T | undefined {
  if (value == null) return undefined;
  if (isEncrypted(value)) return decryptValue<T>(value);
  return value as T;
}

async function authGuard() {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  if (user.role !== UserRole.Faculty && user.role !== UserRole.Reviewer && user.role !== UserRole.DepartmentHead) throw new Error("Not authorized");
  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found");
  return {
    user,
    dbUser,
    institutionId: dbUser.institutionId || "",
    department: dbUser.department || "",
    facultyId: user.sub,
  };
}

// ─── Faculty Dashboard Stats ───────────────────────────

export type FacultyDashboardStats = {
  totalClasses: number;
  totalSubjects: number;
  totalStudents: number;
  totalNotices: number;
  upcomingClasses: { subject: string; batch: string; day: string; time: string; room: string }[];
  recentNotices: { id: string; title: string; date: string }[];
};

export async function getFacultyDashboardStats(): Promise<FacultyDashboardStats> {
  const { institutionId, department, facultyId } = await authGuard();

  const [timetableEntries, subjects, notices] = await Promise.all([
    TimetableEntryModel.find({ institutionId, facultyId }).lean(),
    SubjectModel.find({ institutionId, facultyIds: facultyId }).lean(),
    NoticeModel.find({ institutionId, ...(department ? { department } : {}) }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const studentIds = await UserModel.distinct("_id", {
    institutionId,
    ...(department ? { department } : {}),
    role: UserRole.Student,
  });

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const classNames = new Set(timetableEntries.map((e) => e.subjectName).filter(Boolean));
  const studentCount = studentIds.length;

  const upcomingClasses = timetableEntries.slice(0, 5).map((e) => ({
    subject: e.subjectName || "Untitled",
    batch: e.batch || "",
    day: DAYS[e.dayOfWeek] || "",
    time: `${e.startTime}-${e.endTime}`,
    room: e.room || "",
  }));

  return {
    totalClasses: timetableEntries.length,
    totalSubjects: subjects.length,
    totalStudents: studentCount,
    totalNotices: notices.length,
    upcomingClasses,
    recentNotices: notices.map((n) => ({
      id: String(n._id),
      title: n.title,
      date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "",
    })),
  };
}

// ─── Timetable ─────────────────────────────────────────

export type FacultyTimetableEntry = {
  id: string;
  subject: string;
  batch: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  type: string;
};

export async function getFacultyTimetable(): Promise<FacultyTimetableEntry[]> {
  const { institutionId, facultyId } = await authGuard();
  const entries = await TimetableEntryModel.find({ institutionId, facultyId })
    .sort({ dayOfWeek: 1, startTime: 1 }).lean();
  return entries.map((e) => ({
    id: String(e._id),
    subject: e.subjectName || "",
    batch: e.batch || "",
    dayOfWeek: e.dayOfWeek,
    startTime: e.startTime,
    endTime: e.endTime,
    room: e.room || "",
    type: e.type || "lecture",
  }));
}

// ─── Subjects ──────────────────────────────────────────

export type FacultySubject = {
  id: string;
  name: string;
  code: string;
  batch: string;
  studentCount: number;
};

export async function getFacultySubjects(): Promise<FacultySubject[]> {
  const { institutionId, facultyId } = await authGuard();
  const subjects = await SubjectModel.find({ institutionId, facultyIds: facultyId }).sort({ name: 1 }).lean();
  return subjects.map((s) => ({
    id: String(s._id),
    name: (s as Record<string, unknown>).name as string || "",
    code: (s as Record<string, unknown>).code as string || "",
    batch: (s as Record<string, unknown>).batch as string || "",
    studentCount: 0,
  }));
}

// ─── Notices ───────────────────────────────────────────

export type FacultyNotice = {
  id: string;
  title: string;
  content: string;
  issuer: string;
  date: string;
};

export async function getFacultyNotices(): Promise<FacultyNotice[]> {
  const { institutionId, department } = await authGuard();
  const notices = await NoticeModel.find({ institutionId, ...(department ? { department } : {}) })
    .sort({ createdAt: -1 }).limit(50).lean();
  return notices.map((n) => ({
    id: String(n._id),
    title: n.title,
    content: n.content,
    issuer: n.issuerName || "",
    date: n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
  }));
}

// ─── Attendance ────────────────────────────────────────

export type StudentAttendance = {
  id: string;
  name: string;
  status: "present" | "absent" | "leave" | "";
};

export type AttendanceSubject = {
  id: string;
  name: string;
};

export async function getAttendanceSubjects(): Promise<AttendanceSubject[]> {
  const { institutionId, facultyId } = await authGuard();
  const subjects = await SubjectModel.find({ institutionId, facultyIds: facultyId }).lean();
  return subjects.map((s) => ({
    id: String(s._id),
    name: (s as Record<string, unknown>).name as string || "",
  }));
}

export async function getStudentsForAttendance(subjectId: string): Promise<StudentAttendance[]> {
  const { institutionId, department } = await authGuard();
  const students = await UserModel.find({
    institutionId,
    ...(department ? { department } : {}),
    role: UserRole.Student,
  }).sort({ createdAt: -1 }).lean();

  return students.map((s) => ({
    id: String((s as Record<string, unknown>)._id),
    name: decrypt<string>((s as Record<string, unknown>).fullName) ?? "Unknown",
    status: "" as const,
  }));
}

export async function markAttendance(data: {
  subjectId: string;
  subjectName: string;
  date: string;
  records: { studentId: string; status: "present" | "absent" | "leave" }[];
}) {
  const { institutionId, facultyId } = await authGuard();
  const docs = data.records.map((r) => ({
    institutionId,
    studentId: r.studentId,
    subjectId: data.subjectId,
    subjectName: data.subjectName,
    date: new Date(data.date),
    status: r.status,
    markedBy: facultyId,
  }));
  if (docs.length > 0) await AttendanceRecordModel.insertMany(docs);
  return { success: true };
}

// ─── My Clusters ───────────────────────────────────────

export type FacultyCluster = {
  id: string;
  name: string;
  subjectName: string;
  leadName: string;
  memberCount: number;
  members: { userId: string; name: string }[];
};

export async function getMyClusters(): Promise<FacultyCluster[]> {
  const { institutionId, facultyId } = await authGuard();
  const facultyObjectId = new mongoose.Types.ObjectId(facultyId);
  const clusters = await ClusterModel.find({
    institutionId,
    $or: [{ "members.userId": facultyObjectId }, { leadId: facultyObjectId }],
  }).lean();

  return clusters.map((c) => ({
    id: String(c._id),
    name: c.name || "",
    subjectName: c.subjectName || "",
    leadName: c.leadName || "",
    memberCount: c.members?.length || 0,
    members: ((c.members || []) as Array<Record<string, unknown>>).map((m) => ({ userId: String(m.userId), name: (m.name as string) || "" })),
  }));
}

// ─── Profile ──────────────────────────────────────────

export type FacultyProfile = {
  fullName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  department: string;
  yearsOfExperience: string;
};

export async function getFacultyProfile(): Promise<FacultyProfile> {
  const { dbUser, facultyId } = await authGuard();
  const u = dbUser as unknown as Record<string, unknown>;
  return {
    fullName: decrypt<string>(u.fullName) ?? "",
    email: decrypt<string>(u.email) ?? "",
    phoneNumber: decrypt<string>(u.phoneNumber) ?? "",
    designation: decrypt<string>(u.designation) ?? "",
    department: (u.department as string) || "",
    yearsOfExperience: decrypt<string>(u.yearsOfExperience) ?? "",
  };
}

export async function updateFacultyProfile(data: { fullName?: string; phoneNumber?: string; designation?: string; yearsOfExperience?: string }) {
  const { facultyId } = await authGuard();
  const updates: Record<string, unknown> = {};
  if (data.fullName) updates.fullName = encryptValue(data.fullName);
  if (data.phoneNumber) updates.phoneNumber = encryptValue(data.phoneNumber);
  if (data.designation) updates.designation = encryptValue(data.designation);
  if (data.yearsOfExperience) updates.yearsOfExperience = encryptValue(data.yearsOfExperience);
  if (Object.keys(updates).length > 0) {
    await UserModel.updateOne({ _id: facultyId }, { $set: updates });
  }
  return { success: true };
}

// ─── Downloads ─────────────────────────────────────────

export type FacultyDownload = {
  id: string;
  name: string;
  url: string;
};

export async function getFacultyDownloads(): Promise<FacultyDownload[]> {
  return [
    { id: "1", name: "Attendance Sheet Template", url: "/templates/attendance-sheet.pdf" },
    { id: "2", name: "Marks Sheet Template", url: "/templates/marks-sheet.pdf" },
    { id: "3", name: "Lesson Plan Template", url: "/templates/lesson-plan.pdf" },
    { id: "4", name: "Student Report Template", url: "/templates/student-report.pdf" },
  ];
}

// ─── Exchange Desk ─────────────────────────────────────

export type ExchangeRequest = {
  id: string;
  fromSlot: string;
  toSlot: string;
  reason: string;
  targetFacultyId: string;
  targetFacultyName: string;
  status: string;
  createdAt: string;
  direction?: "sent" | "received";
};

export type OtherFaculty = {
  id: string;
  name: string;
  role: string;
};

export async function getOtherFaculty(): Promise<OtherFaculty[]> {
  const { institutionId, facultyId } = await authGuard();
  const faculty = await UserModel.find({
    institutionId,
    role: { $in: [UserRole.Faculty, UserRole.Reviewer, UserRole.DepartmentHead] },
    _id: { $ne: facultyId },
  }).lean();

  return faculty.map((f) => {
    const u = f as unknown as Record<string, unknown>;
    return {
      id: String(u._id),
      name: decrypt<string>(u.fullName) ?? "Unknown",
      role: (u.role as string) || "",
    };
  });
}

export async function getExchangeRequests(): Promise<ExchangeRequest[]> {
  const { facultyId } = await authGuard();
  const [sent, received] = await Promise.all([
    ExchangeRequestModel.find({ senderId: facultyId }).sort({ createdAt: -1 }).lean(),
    ExchangeRequestModel.find({ targetFacultyId: facultyId }).sort({ createdAt: -1 }).lean(),
  ]);
  return [
    ...sent.map((r) => ({
      id: String(r._id),
      fromSlot: r.fromSlot,
      toSlot: r.toSlot,
      reason: r.reason || "",
      targetFacultyId: String(r.targetFacultyId),
      targetFacultyName: r.targetFacultyName || "",
      status: r.status,
      createdAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
      direction: "sent" as const,
    })),
    ...received.map((r) => ({
      id: String(r._id),
      fromSlot: r.fromSlot,
      toSlot: r.toSlot,
      reason: r.reason || "",
      targetFacultyId: String(r.targetFacultyId),
      targetFacultyName: r.senderName || "",
      status: r.status,
      createdAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
      direction: "received" as const,
    })),
  ];
}

export async function createExchangeRequest(data: {
  fromSlot: string;
  toSlot: string;
  reason: string;
  targetFacultyId: string;
  targetFacultyName: string;
}) {
  const { institutionId, facultyId, dbUser } = await authGuard();
  const senderName = decrypt<string>((dbUser as unknown as Record<string, unknown>).fullName) ?? "Faculty";
  await ExchangeRequestModel.create({
    institutionId,
    senderId: facultyId,
    senderName,
    targetFacultyId: data.targetFacultyId,
    targetFacultyName: data.targetFacultyName,
    fromSlot: data.fromSlot,
    toSlot: data.toSlot,
    reason: data.reason,
    status: "pending",
  });
  return { success: true };
}

export async function respondToExchangeRequest(requestId: string, status: "accepted" | "rejected") {
  const { facultyId } = await authGuard();
  await ExchangeRequestModel.updateOne(
    { _id: requestId, targetFacultyId: facultyId },
    { $set: { status } },
  );
  return { success: true };
}
