"use client";

import { useEffect, useState } from "react";
import { BellRing, Plus, Trash2 } from "lucide-react";
import { getDepartmentNotices, createDepartmentNotice, deleteDepartmentNotice, type DepartmentNotice } from "@/actions/department-actions";

export default function DepartmentNoticesPage() {
  const [notices, setNotices] = useState<DepartmentNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => getDepartmentNotices().then(setNotices).catch((err) => setError(err.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setSaving(true);
    try {
      await createDepartmentNotice({ title: newTitle, content: newContent });
      setShowAdd(false);
      setNewTitle("");
      setNewContent("");
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartmentNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading notices...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <BellRing className="h-5 w-5 text-[#e28774]" /> Department Notices
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Post and manage department announcements</p>
      </div>

      <button onClick={() => setShowAdd(true)}
        className="flex items-center gap-1.5 border-2 border-black bg-[#e28774] px-4 py-2 text-xs font-black text-white hover:bg-[#d97766]">
        <Plus className="h-3.5 w-3.5" /> New Notice
      </button>

      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n.id} className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-black">{n.title}</h3>
                <p className="text-[10px] font-bold text-gray-500 mt-0.5">{n.date}</p>
              </div>
              <button onClick={() => handleDelete(n.id)} className="p-1 border border-black bg-red-200 hover:bg-red-300" title="Delete">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <p className="mt-2 text-xs font-bold">{n.content}</p>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-6 text-center text-sm font-bold text-gray-500">
            No notices yet.
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md border-2 border-black bg-[#f4ebd0] p-6 shadow-[6px_6px_0px_0px_#1a1a14]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-black uppercase mb-4">New Notice</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Title</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="Notice title" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1">Content</label>
                <textarea required rows={4} value={newContent} onChange={(e) => setNewContent(e.target.value)}
                  className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="Notice content..." />
              </div>
              {error && <p className="text-xs font-bold text-red-600">{error}</p>}
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowAdd(false)} disabled={saving} className="border-2 border-black bg-white px-4 py-1.5 text-xs font-black hover:bg-[#eae3cb] disabled:opacity-40">Cancel</button>
                <button type="submit" disabled={saving} className="border-2 border-black bg-[#e28774] px-4 py-1.5 text-xs font-black text-white hover:bg-[#d97766] disabled:opacity-40">{saving ? "Posting..." : "Post Notice"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
