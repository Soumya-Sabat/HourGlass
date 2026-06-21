"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/auth";
import { UserRole } from "@/models/user/types/user-role.enum";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { AcademicProfileModel } from "@/models/academic/schemas/academic-profile.schema";
import { TimetableEntryModel } from "@/models/timetable/schemas/timetable-entry.schema";
import { SubjectModel } from "@/models/subject/schemas/subject.schema";
import { MessageModel } from "@/models/message/schemas/message.schema";
import { NoticeModel } from "@/models/notice/schemas/notice.schema";
import { AttendanceRecordModel } from "@/models/attendance/schemas/attendance-record.schema";
import { MarksheetEntryModel } from "@/models/marksheet/schemas/marksheet-entry.schema";
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
  if (user.role !== UserRole.Student) throw new Error("Not authorized.");
  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found.");
  return { user, dbUser, institutionId: dbUser.institutionId || "" };
}

// ─── Timetable ───────────────────────────────────────────────

export type TimetableDay = {
  dayLabel: string;
  dayIndex: number;
  entries: Array<{
    id: string;
    subjectName: string;
    facultyName: string;
    startTime: string;
    endTime: string;
    room: string;
    type: string;
  }>;
};

export async function getStudentTimetable(): Promise<TimetableDay[]> {
  const { institutionId, dbUser } = await authGuard();

  const profile = await AcademicProfileModel.findOne({ userId: dbUser._id });
  const batch = profile?.batchOrSection || (profile?.toObject() as Record<string, unknown>)?.batchOrSection as string || "default";

  const entries = await TimetableEntryModel.find({ institutionId, batch }).sort({ dayOfWeek: 1, startTime: 1 }).lean();

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const days: TimetableDay[] = DAYS.map((label, idx) => ({
    dayLabel: label,
    dayIndex: idx,
    entries: entries
      .filter((e) => e.dayOfWeek === idx)
      .map((e) => ({
        id: String(e._id),
        subjectName: e.subjectName || "",
        facultyName: e.facultyName || "",
        startTime: e.startTime || "",
        endTime: e.endTime || "",
        room: e.room || "",
        type: e.type || "lecture",
      })),
  }));

  return days;
}

// ─── Subjects ────────────────────────────────────────────────

export type SubjectInfo = {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  syllabus: string;
  syllabusFile: string;
};

export async function getStudentSubjects(): Promise<SubjectInfo[]> {
  const { institutionId } = await authGuard();
  const subjects = await SubjectModel.find({ institutionId }).sort({ semester: 1, name: 1 }).lean();
  return subjects.map((s) => ({
    id: String(s._id),
    name: s.name,
    code: s.code,
    credits: s.credits,
    semester: s.semester,
    syllabus: s.syllabus || "",
    syllabusFile: s.syllabusFile || "",
  }));
}

// ─── Faculties ───────────────────────────────────────────────

export type FacultyInfo = {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  classTimes: string[];
};

export async function getStudentFaculties(): Promise<FacultyInfo[]> {
  const { institutionId } = await authGuard();

  const entries = await TimetableEntryModel.find({ institutionId }).lean();
  const facultyMap = new Map<string, { subjects: Set<string>; times: Set<string> }>();

  for (const e of entries) {
    if (!e.facultyName) continue;
    const key = `${e.facultyName}|${e.facultyId || ""}`;
    if (!facultyMap.has(key)) facultyMap.set(key, { subjects: new Set(), times: new Set() });
    const entry = facultyMap.get(key)!;
    if (e.subjectName) entry.subjects.add(e.subjectName);
    if (e.startTime && e.dayOfWeek !== undefined) {
      const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      entry.times.add(`${DAYS[e.dayOfWeek]} ${e.startTime}-${e.endTime}`);
    }
  }

  // Get faculty user emails (users with role faculty in same institution)
  const { UserModel } = await import("@/models/user/schemas/user.schema");
  const facultyUsers = await UserModel.find({ institutionId, role: "faculty" }).lean();
  const emailMap = new Map<string, string>();
  for (const f of facultyUsers) {
    const name = displayVal(f.fullName);
    const email = displayVal(f.email);
    if (name) emailMap.set(name.toLowerCase(), email);
  }

  return Array.from(facultyMap.entries()).map(([key, data]) => {
    const name = key.split("|")[0];
    return {
      id: key.split("|")[1] || "",
      name,
      email: emailMap.get(name.toLowerCase()) || "",
      subjects: Array.from(data.subjects),
      classTimes: Array.from(data.times),
    };
  });
}

// ─── Messages ────────────────────────────────────────────────

export type MessageInfo = {
  id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
};

export async function getStudentMessages(): Promise<MessageInfo[]> {
  const { institutionId, dbUser } = await authGuard();
  const messages = await MessageModel.find({
    institutionId,
    $or: [{ receiverId: dbUser._id }, { receiverId: null }],
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return messages.map((m) => ({
    id: String(m._id),
    senderName: m.senderName,
    senderRole: m.senderRole,
    subject: m.subject,
    content: m.content,
    read: m.read,
    createdAt: m.createdAt ? new Date(m.createdAt).toLocaleString() : "",
  }));
}

export async function sendStudentMessage(formData: FormData) {
  const { institutionId, dbUser, user } = await authGuard();

  const content = (formData.get("content") as string)?.trim();
  const receiverId = formData.get("receiverId") as string;
  const subject = (formData.get("subject") as string)?.trim() || "General";

  if (!content) throw new Error("Message cannot be empty.");

  await MessageModel.create({
    institutionId,
    senderId: dbUser._id,
    senderName: user.name,
    senderRole: "student",
    receiverId: receiverId || null,
    receiverName: "",
    subject,
    content,
    read: false,
  });
}

export async function markMessageRead(messageId: string) {
  const { dbUser } = await authGuard();
  await MessageModel.updateOne(
    { _id: messageId, receiverId: dbUser._id },
    { $set: { read: true } },
  );
}

// ─── Notices ─────────────────────────────────────────────────

export type NoticeInfo = {
  id: string;
  title: string;
  content: string;
  issuerName: string;
  issuerRole: string;
  priority: string;
  tags: string[];
  createdAt: string;
};

export async function getStudentNotices(): Promise<NoticeInfo[]> {
  const { institutionId } = await authGuard();
  const now = new Date();
  const notices = await NoticeModel.find({
    institutionId,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return notices.map((n) => ({
    id: String(n._id),
    title: n.title,
    content: n.content,
    issuerName: n.issuerName,
    issuerRole: n.issuerRole,
    priority: n.priority,
    tags: n.tags || [],
    createdAt: n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
  }));
}

// ─── Attendance ──────────────────────────────────────────────

export type AttendanceSummary = {
  subjectName: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
};

export async function getStudentAttendance(): Promise<AttendanceSummary[]> {
  const { institutionId, dbUser } = await authGuard();

  const records = await AttendanceRecordModel.find({
    institutionId,
    studentId: dbUser._id,
  }).lean();

  const subjectMap = new Map<string, { present: number; absent: number }>();

  for (const r of records) {
    const key = r.subjectName || "Unknown";
    if (!subjectMap.has(key)) subjectMap.set(key, { present: 0, absent: 0 });
    const entry = subjectMap.get(key)!;
    if (r.status === "present") entry.present++;
    else if (r.status === "absent") entry.absent++;
  }

  return Array.from(subjectMap.entries()).map(([subjectName, data]) => {
    const total = data.present + data.absent;
    return {
      subjectName,
      present: data.present,
      absent: data.absent,
      total,
      percentage: total > 0 ? Math.round((data.present / total) * 100) : 0,
    };
  });
}

// ─── Marksheet ───────────────────────────────────────────────

export type MarksheetEntry = {
  subjectName: string;
  examName: string;
  examType: string;
  marksObtained: number;
  totalMarks: number;
};

export type MarksheetData = {
  examNames: string[];
  rows: Array<{
    subjectName: string;
    marks: Array<{ obtained: number; total: number }>;
  }>;
};

export async function getStudentMarksheet(): Promise<MarksheetData> {
  const { institutionId, dbUser } = await authGuard();

  const entries = await MarksheetEntryModel.find({
    institutionId,
    studentId: dbUser._id,
  }).lean();

  const examOrder = entries
    .map((e) => ({ name: e.examName, type: e.examName }))
    .filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);

  const subjectMap = new Map<string, Map<string, { obtained: number; total: number }>>();

  for (const e of entries) {
    if (!subjectMap.has(e.subjectName)) subjectMap.set(e.subjectName, new Map());
    subjectMap.get(e.subjectName)!.set(e.examName, { obtained: e.marksObtained, total: e.totalMarks });
  }

  const rows = Array.from(subjectMap.entries()).map(([subjectName, exams]) => ({
    subjectName,
    marks: examOrder.map((ex) => exams.get(ex.name) || { obtained: 0, total: 0 }),
  }));

  return {
    examNames: examOrder.map((e) => e.name),
    rows,
  };
}
