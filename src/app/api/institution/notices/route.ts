import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { NoticeModel } from "@/models/notice/schemas/notice.schema";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await NoticeModel.find({}).sort({ createdAt: -1 }).limit(50).lean();
    const notices = items.map((n) => ({
      id: String(n._id),
      title: n.title,
      content: n.content,
      priority: n.priority,
      tags: Array.isArray(n.tags) ? n.tags.join(", ") : "",
      createdAt: n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
    }));
    return NextResponse.json({ notices });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}
