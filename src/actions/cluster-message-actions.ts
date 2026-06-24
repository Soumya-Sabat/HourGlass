"use server";

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/auth";
import { ClusterModel } from "@/models/cluster/schemas/cluster.schema";
import { ClusterMessageModel } from "@/models/cluster-message/schemas/cluster-message.schema";

export type ClusterMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
};

async function authGuard() {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return { userId: user.sub, userName: user.name };
}

async function verifyMembership(clusterId: string, userId: string) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const cluster = await ClusterModel.findOne({
    _id: clusterId,
    $or: [{ "members.userId": userObjectId }, { leadId: userObjectId }],
  }).lean();
  if (!cluster) throw new Error("You are not a member of this cluster");
  return cluster;
}

export async function sendClusterMessage(clusterId: string, content: string): Promise<ClusterMessage> {
  const { userId, userName } = await authGuard();
  await verifyMembership(clusterId, userId);

  if (!content.trim()) throw new Error("Message cannot be empty");

  const msg = await ClusterMessageModel.create({
    clusterId: new mongoose.Types.ObjectId(clusterId),
    senderId: new mongoose.Types.ObjectId(userId),
    senderName: userName,
    content: content.trim(),
  });

  return {
    id: String(msg._id),
    senderId: userId,
    senderName: userName,
    content: content.trim(),
    createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : "",
  };
}

export async function getClusterMessages(clusterId: string): Promise<ClusterMessage[]> {
  const { userId } = await authGuard();
  await verifyMembership(clusterId, userId);

  const messages = await ClusterMessageModel.find({
    clusterId: new mongoose.Types.ObjectId(clusterId),
  })
    .sort({ createdAt: 1 })
    .lean();

  return messages.map((m) => ({
    id: String(m._id),
    senderId: String(m.senderId),
    senderName: (m as Record<string, unknown>).senderName as string || "",
    content: (m as Record<string, unknown>).content as string || "",
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : "",
  }));
}
