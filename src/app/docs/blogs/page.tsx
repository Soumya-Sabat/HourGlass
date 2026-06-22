import { connectToDatabase } from "@/lib/db/mongoose";
import { AnnouncementModel } from "@/models/announcement/schemas/announcement.schema";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { ArrowLeft, Calendar, Rss } from "lucide-react";

async function getBlogs() {
  try {
    await connectToDatabase();
    const items = await AnnouncementModel.find({ status: "Published" })
      .sort({ publishedAt: -1 })
      .lean();
    return items.map((a) => ({
      _id: String(a._id),
      title: a.title,
      content: a.content,
      publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString() : null,
      createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider mb-6 hover:underline"
        >
          <ArrowLeft className="h-3 w-3 stroke-[2.5]" />
          Back to Docs
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#eae3cb] border-2 border-black p-2">
            <Rss className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Blogs</h1>
            <p className="text-xs font-bold text-[#1a1a14]/70 mt-0.5">What we do and friction topics.</p>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-10 text-center">
            <p className="text-sm font-bold text-[#1a1a14]/50">No published articles yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6"
              >
                <h2 className="text-sm font-black uppercase tracking-tight mb-2">{blog.title}</h2>
                <div className="flex items-center gap-3 text-[10px] font-bold text-[#1a1a14]/50 mb-3">
                  <Calendar className="h-3 w-3 stroke-[2.5]" />
                  <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : new Date(blog.createdAt!).toLocaleDateString()}</span>
                </div>
                <div className="text-[12px] font-bold text-[#1a1a14]/80 leading-relaxed whitespace-pre-line line-clamp-4">
                  {blog.content}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
