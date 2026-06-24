"use server";

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/auth";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { UserModel } from "@/models/user/schemas/user.schema";
import { ClusterModel } from "@/models/cluster/schemas/cluster.schema";
import { SubjectModel } from "@/models/subject/schemas/subject.schema";
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
  if (user.role !== UserRole.Reviewer && user.role !== UserRole.DepartmentHead) {
    throw new Error("Not authorized");
  }
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

// ─── Reviewer Dashboard Stats ─────────────────────────

export type ReviewerDashboardStats = {
  totalClusters: number;
  totalFaculty: number;
  totalSubjects: number;
  totalMembers: number;
  recentClusters: { id: string; name: string; subject: string; memberCount: number }[];
};

export async function getReviewerDashboardStats(): Promise<ReviewerDashboardStats> {
  const { institutionId, department, userId } = await authGuard();
  const dept = department ? { department } : {};

  const [clusters, facultyCount] = await Promise.all([
    ClusterModel.find({ institutionId, ...dept, leadId: new mongoose.Types.ObjectId(userId) }).lean(),
    UserModel.countDocuments({ institutionId, ...dept, role: UserRole.Faculty }),
  ]);

  const subjects = await SubjectModel.find({ institutionId, ...dept }).lean();
  const totalMembers = clusters.reduce((acc, c) => acc + (c.members?.length || 0), 0);

  return {
    totalClusters: clusters.length,
    totalFaculty: facultyCount,
    totalSubjects: subjects.length,
    totalMembers,
    recentClusters: clusters.slice(0, 5).map((c) => ({
      id: String(c._id),
      name: c.name || "",
      subject: c.subjectName || "",
      memberCount: c.members?.length || 0,
    })),
  };
}

// ─── Clusters CRUD ────────────────────────────────────

export type ClusterData = {
  id: string;
  name: string;
  subjectId: string;
  subjectName: string;
  memberCount: number;
  members: { userId: string; name: string }[];
  createdAt: string;
};

export async function getReviewerClusters(): Promise<ClusterData[]> {
  const { institutionId, department, userId } = await authGuard();
  const dept = department ? { department } : {};
  const clusters = await ClusterModel.find({ institutionId, ...dept, leadId: new mongoose.Types.ObjectId(userId) })
    .sort({ order: 1, createdAt: -1 }).lean();

  return clusters.map((c) => ({
    id: String(c._id),
    name: c.name || "",
    subjectId: c.subjectId ? String(c.subjectId) : "",
    subjectName: c.subjectName || "",
    memberCount: c.members?.length || 0,
    members: ((c.members || []) as Array<{ userId: unknown; name: unknown }>).map((m) => ({ userId: String(m.userId), name: (m.name as string) || "" })),
    createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "",
  }));
}

export async function createCluster(data: {
  name: string;
  subjectId: string;
  subjectName: string;
  memberIds: string[];
}) {
  const { institutionId, department, userId, dbUser } = await authGuard();

  const leadName = decrypt<string>((dbUser as unknown as Record<string, unknown>).fullName) ?? "Reviewer";
  const allIds = [...new Set([userId, ...data.memberIds])];

  const nameDocs = await UserModel.find({ _id: { $in: allIds } }).lean();
  const nameMap = new Map<string, string>();
  for (const doc of nameDocs) {
    const d = doc as unknown as Record<string, unknown>;
    const id = String(d._id);
    nameMap.set(id, decrypt<string>(d.fullName) ?? "Unknown");
  }

  const enrichedMembers = data.memberIds.map((id) => ({
    userId: new mongoose.Types.ObjectId(id),
    name: nameMap.get(id) || "Unknown",
    joinedAt: new Date(),
  }));

  await ClusterModel.create({
    institutionId,
    department,
    name: data.name,
    subjectId: data.subjectId || undefined,
    subjectName: data.subjectName,
    leadId: new mongoose.Types.ObjectId(userId),
    leadName: nameMap.get(userId) || leadName,
    members: enrichedMembers,
  });

  return { success: true };
}

export async function addClusterMembers(clusterId: string, memberIds: string[]) {
  const { institutionId, department, userId } = await authGuard();
  const dept = department ? { department } : {};
  const userIdObj = new mongoose.Types.ObjectId(userId);
  const cluster = await ClusterModel.findOne({ _id: clusterId, institutionId, ...dept, leadId: userIdObj });
  if (!cluster) throw new Error("Cluster not found or not owned by you");

  const existingIds = new Set(((cluster.members || []) as Array<{ userId: unknown }>).map((m) => String(m.userId)));
  const newIds = memberIds.filter((id) => !existingIds.has(id));
  if (newIds.length === 0) return { success: true };

  const nameDocs = await UserModel.find({ _id: { $in: newIds } }).lean();
  const newMembers = nameDocs.map((doc) => ({
    userId: new mongoose.Types.ObjectId(String((doc as Record<string, unknown>)._id)),
    name: decrypt<string>((doc as Record<string, unknown>).fullName) ?? "Unknown",
    joinedAt: new Date(),
  }));

  await ClusterModel.updateOne(
    { _id: clusterId },
    { $push: { members: { $each: newMembers } } },
  );

  return { success: true };
}

export async function removeClusterMember(clusterId: string, memberUserId: string) {
  const { institutionId, department, userId } = await authGuard();
  const dept = department ? { department } : {};
  const userIdObj = new mongoose.Types.ObjectId(userId);
  await ClusterModel.updateOne(
    { _id: clusterId, institutionId, ...dept, leadId: userIdObj },
    { $pull: { members: { userId: new mongoose.Types.ObjectId(memberUserId) } } },
  );
  return { success: true };
}

export async function deleteCluster(clusterId: string) {
  const { institutionId, department, userId } = await authGuard();
  const dept = department ? { department } : {};
  await ClusterModel.deleteOne({ _id: clusterId, institutionId, ...dept, leadId: new mongoose.Types.ObjectId(userId) });
  return { success: true };
}

// ─── Available Faculty ────────────────────────────────

export type AvailableFaculty = {
  id: string;
  name: string;
};

export async function getAvailableFaculty(): Promise<AvailableFaculty[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const faculty = await UserModel.find({
    institutionId,
    ...dept,
    role: { $in: [UserRole.Faculty, UserRole.DepartmentHead] },
  }).lean();

  return faculty.map((f) => ({
    id: String((f as Record<string, unknown>)._id),
    name: decrypt<string>((f as Record<string, unknown>).fullName) ?? "Unknown",
  }));
}

// ─── Subjects available ───────────────────────────────

export type ReviewerSubject = { id: string; name: string };

export async function getReviewerSubjects(): Promise<ReviewerSubject[]> {
  const { institutionId, department } = await authGuard();
  const dept = department ? { department } : {};
  const subjects = await SubjectModel.find({ institutionId, ...dept }).sort({ name: 1 }).lean();
  return subjects.map((s) => ({
    id: String(s._id),
    name: (s as Record<string, unknown>).name as string || "",
  }));
}
