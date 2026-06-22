"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2, Loader, Send } from "lucide-react";
import { getAnnouncements, createAnnouncement, deleteAnnouncement, type InstitutionAnnouncement } from "@/actions/institution-actions";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<InstitutionAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getAnnouncements()
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSending(true);
    try {
      await createAnnouncement(form);
      const updated = await getAnnouncements();
      setAnnouncements(updated);
      setForm({ title: "", content: "" });
      setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]"><Loader className="h-4 w-4 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[#e28774]" /> Announcements
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Communicate with users in the institution</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-3 py-2 text-xs font-black uppercase hover:bg-[#2a2a24]">
          <Plus className="h-3 w-3" /> {showForm ? "Cancel" : "New"}
        </button>
      </div>

      {showForm && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 space-y-3">
          <input placeholder="Announcement Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
          <textarea placeholder="Announcement Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={4} className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold resize-none" />
          <button onClick={handleCreate} disabled={sending || !form.title || !form.content}
            className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase hover:bg-[#2a2a24] disabled:opacity-50">
            {sending ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sending ? "Publishing..." : "Publish"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-6 text-center text-xs font-black">No announcements yet.</div>
        ) : announcements.map((a) => (
          <div key={a.id} className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase">{a.title}</h3>
                <p className="text-xs font-bold mt-1 whitespace-pre-wrap">{a.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-bold text-gray-500">{a.createdAt}</span>
                  <span className="px-2 py-0.5 bg-[#1a1a14] text-[#f4ebd0] text-[9px] font-black uppercase">{a.status}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(a.id)} className="p-1.5 border border-black bg-red-200 hover:bg-red-300 shrink-0">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
