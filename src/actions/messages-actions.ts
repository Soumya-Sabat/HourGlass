"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/auth";
import { UserRepository } from "@/models/user/repositories/user.repository";
import { UserModel } from "@/models/user/schemas/user.schema";
import { MessageModel } from "@/models/message/schemas/message.schema";
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

export type MessagingUser = {
  id: string;
  name: string;
  email: string;
};

export async function getInstitutionUsersForMessaging(): Promise<MessagingUser[]> {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found");

  const institutionId = dbUser.institutionId;
  if (!institutionId) throw new Error("No institution found");

  const users = await UserModel.find({ institutionId }).lean() as Record<string, unknown>[];

  return users.map((u) => ({
    id: String(u._id),
    name: decryptOptional<string>(u.fullName) ?? "Unknown",
    email: decryptOptional<string>(u.email) ?? "",
  })).filter((u) => u.id !== user.sub);
}

export type MessageEntry = {
  id: string;
  senderName: string;
  senderRole: string;
  senderId: string;
  receiverName: string;
  subject: string;
  content: string;
  read: boolean;
  direction: "incoming" | "outgoing";
  createdAt: string;
};

export async function getReceivedMessages(): Promise<MessageEntry[]> {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found");

  const messages = await MessageModel.find({
    $or: [
      { receiverId: dbUser._id },
      { receiverId: null },
      { senderId: dbUser._id },
    ],
  }).sort({ createdAt: -1 }).limit(100).lean();

  return messages.map((m) => ({
    id: String(m._id),
    senderName: m.senderName || "Unknown",
    senderRole: m.senderRole || "",
    senderId: String(m.senderId),
    receiverName: m.receiverName || "",
    subject: m.subject || "",
    content: m.content,
    read: m.read,
    direction: String(m.senderId) === user.sub ? "outgoing" : "incoming",
    createdAt: m.createdAt ? new Date(m.createdAt).toLocaleString() : "",
  }));
}

export async function markMessageRead(messageId: string) {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found");

  await MessageModel.updateOne({ _id: messageId, receiverId: dbUser._id }, { $set: { read: true } });
}

export type SendMessageInput = {
  receiverId: string;
  subject: string;
  content: string;
};

export async function sendMessage(input: SendMessageInput) {
  await connectToDatabase();
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const dbUser = await UserRepository.findById(user.sub);
  if (!dbUser) throw new Error("User not found");

  const institutionId = dbUser.institutionId;
  if (!institutionId) throw new Error("No institution found");

  const { receiverId, subject, content } = input;
  if (!content?.trim()) throw new Error("Message cannot be empty.");

  if (receiverId === "@all") {
    const allUsers = await UserModel.find({ institutionId }).select("_id").lean();
    const messages = allUsers.map((target) => ({
      institutionId,
      senderId: dbUser._id,
      senderName: user.name || "Unknown",
      senderRole: user.role || "",
      receiverId: target._id,
      receiverName: "",
      subject: subject?.trim() || "General",
      content: content.trim(),
      read: false,
    }));
    if (messages.length > 0) await MessageModel.insertMany(messages);
  } else {
    await MessageModel.create({
      institutionId,
      senderId: dbUser._id,
      senderName: user.name || "Unknown",
      senderRole: user.role || "",
      receiverId,
      receiverName: "",
      subject: subject?.trim() || "General",
      content: content.trim(),
      read: false,
    });
  }

  return { success: true };
}
