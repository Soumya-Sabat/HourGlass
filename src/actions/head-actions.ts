"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/auth";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { UserModel } from "@/models/user/schemas/user.schema";
import { ClusterModel } from "@/models/cluster/schemas/cluster.schema";
import { SubjectModel } from "@/models/subject/schemas/subject.schema";
import { NoticeModel } from "@/models/notice/schemas/notice.schema";
import { ExchangeRequestModel } from "@/models/exchange-request/schemas/exchange-request.schema";
import { ChangeRequestModel } from "@/models/support/schemas/change-request.schema";
import { decryptValue, type EncryptedValue } from "@/helpers/crypto/encryption";
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
  if (user.role !== UserRole.DepartmentHead) throw new Error("Not authorized");
  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found");
  return {
    user,
    dbUser,
    institutionId: dbUser.institutionId || "",
    department: dbUser.department || "",
    userId: user.sub,
  };
}

// ─── User Identity ────────────────────────────────────

export async function getCurrentUserId(): Promise<string> {
  const { userId } = await authGuard();
  return userId;
}

// ─── HOD Dashboard Stats ──────────────────────────────

export type HeadDashboardStats = {
  totalFaculty: number;
  totalStudents: number;
  totalSubjects: number;
  totalClusters: number;
  pendingApprovals: number;
  recentNotices: number;
  clusters: { id: string; name: string; lead: string; memberCount: number }[];
};

export async function getHeadDashboardStats(): Promise<HeadDashboardStats> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};

  const [facultyCount, studentCount, subjects, clusters] = await Promise.all([
    UserModel.countDocuments({ institutionId, ...dept, role: { $in: [UserRole.Faculty, UserRole.Reviewer] } }),
    UserModel.countDocuments({ institutionId, ...dept, role: UserRole.Student }),
    SubjectModel.find({ institutionId, ...dept }).lean(),
    ClusterModel.find({ institutionId, ...dept }).sort({ order: 1 }).lean(),
  ]);

  const notices = await NoticeModel.find({ institutionId, ...dept }).lean();

  return {
    totalFaculty: facultyCount,
    totalStudents: studentCount,
    totalSubjects: subjects.length,
    totalClusters: clusters.length,
    pendingApprovals: await ExchangeRequestModel.countDocuments({ institutionId, status: "pending" })
      + await ChangeRequestModel.countDocuments({ institutionId, status: "pending" }),
    recentNotices: notices.length,
    clusters: clusters.map((c) => ({
      id: String(c._id),
      name: c.name || "",
      lead: c.leadName || "",
      memberCount: c.members?.length || 0,
    })),
  };
}

// ─── Cluster Oversight ────────────────────────────────

export type AllClusterData = {
  id: string;
  name: string;
  subjectName: string;
  leadId: string;
  leadName: string;
  memberCount: number;
  members: { userId: string; name: string }[];
  order: number;
  createdAt: string;
};

export async function getAllClusters(): Promise<AllClusterData[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const clusters = await ClusterModel.find({ institutionId, ...dept })
    .sort({ order: 1, createdAt: -1 }).lean();

  return clusters.map((c) => ({
    id: String(c._id),
    name: c.name || "",
    subjectName: c.subjectName || "",
    leadId: String(c.leadId),
    leadName: c.leadName || "",
    memberCount: c.members?.length || 0,
    members: ((c.members || []) as Array<{ userId: unknown; name: unknown }>).map((m) => ({ userId: String(m.userId), name: (m.name as string) || "" })),
    order: c.order ?? 0,
    createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "",
  }));
}

export async function rearrangeCluster(clusterId: string, newOrder: number) {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  await ClusterModel.updateOne(
    { _id: clusterId, institutionId, ...dept },
    { $set: { order: newOrder } },
  );
  return { success: true };
}

export async function removeClusterMemberByHod(clusterId: string, memberUserId: string) {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  await ClusterModel.updateOne(
    { _id: clusterId, institutionId, ...dept },
    { $pull: { members: { userId: memberUserId } } },
  );
  return { success: true };
}

export async function addHodToCluster(clusterId: string) {
  const { institutionId, department, userId, dbUser } = await authGuard();
  const dept = department ? { department } : {};
  const cluster = await ClusterModel.findOne({ _id: clusterId, institutionId, ...dept });
  if (!cluster) throw new Error("Cluster not found");

  const alreadyMember = ((cluster.members || []) as Array<{ userId: unknown }>).some((m) => String(m.userId) === userId);
  if (alreadyMember) return { success: true };

  const name = decrypt<string>((dbUser as unknown as Record<string, unknown>).fullName) ?? "HOD";
  await ClusterModel.updateOne(
    { _id: clusterId },
    { $push: { members: { userId, name, joinedAt: new Date() } } },
  );
  return { success: true };
}

export async function removeHodFromCluster(clusterId: string) {
  const { institutionId, department, userId } = await authGuard();
  const dept = department ? { department } : {};
  await ClusterModel.updateOne(
    { _id: clusterId, institutionId, ...dept },
    { $pull: { members: { userId } } },
  );
  return { success: true };
}

// ─── Faculty Roster ───────────────────────────────────

export type RosterFaculty = {
  id: string;
  name: string;
  role: string;
  clusters: string[];
};

export async function getFacultyRoster(): Promise<RosterFaculty[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const [faculty, clusters] = await Promise.all([
    UserModel.find({
      institutionId,
      ...dept,
      role: { $in: [UserRole.Faculty, UserRole.Reviewer, UserRole.DepartmentHead] },
    }).lean(),
    ClusterModel.find({ institutionId, ...dept }).lean(),
  ]);

  const clusterMap = new Map<string, string[]>();
  for (const c of clusters) {
    for (const m of (c.members || []) as Array<{ userId: unknown }>) {
      const uid = String(m.userId);
      if (!clusterMap.has(uid)) clusterMap.set(uid, []);
      clusterMap.get(uid)!.push(c.name || "Unnamed");
    }
  }

  return faculty.map((f) => {
    const u = f as unknown as Record<string, unknown>;
    return {
      id: String(u._id),
      name: decrypt<string>(u.fullName) ?? "Unknown",
      role: (u.role as string) || "",
      clusters: clusterMap.get(String(u._id)) || [],
    };
  });
}

// ─── Subjects ──────────────────────────────────────────

export type HeadSubject = {
  id: string;
  name: string;
  code: string;
  faculty: string;
};

export async function getHeadSubjects(): Promise<HeadSubject[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};

  const subjects = await SubjectModel.find({ institutionId, ...dept }).sort({ name: 1 }).lean() as Record<string, unknown>[];

  const allFacultyIds = [...new Set(subjects.flatMap((s) => (s.facultyIds as string[] || []).filter(Boolean)))];
  const facultyUsers = allFacultyIds.length > 0
    ? await UserModel.find({ _id: { $in: allFacultyIds } }).lean() as Record<string, unknown>[]
    : [];
  const facultyMap = new Map(facultyUsers.map((f) => [String(f._id), decrypt<string>(f.fullName) ?? "Unknown"]));

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

// ─── Notices ───────────────────────────────────────────

export type HeadNotice = {
  id: string;
  title: string;
  content: string;
  date: string;
  issuer: string;
};

export async function getHeadNotices(): Promise<HeadNotice[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const notices = await NoticeModel.find({ institutionId, ...dept }).sort({ createdAt: -1 }).lean();
  return notices.map((n) => ({
    id: String(n._id),
    title: n.title,
    content: n.content,
    date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "",
    issuer: n.issuerName || "Admin",
  }));
}
