"use client";

import { useState } from "react";
import { Mails, Send } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Array<{ id: string; to: string; subject: string; content: string; time: string }>>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ to: "", subject: "", content: "" });

  const handleSend = () => {
    if (!form.to.trim() || !form.content.trim()) return;
    setMessages([{ id: Date.now().toString(), ...form, time: new Date().toLocaleString() }, ...messages]);
    setForm({ to: "", subject: "", content: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Mails className="h-5 w-5 text-[#e28774]" /> Messages
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Send and manage messages</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-3 py-2 text-xs font-black uppercase hover:bg-[#2a2a24]">
          <Send className="h-3 w-3" /> {showForm ? "Cancel" : "Compose"}
        </button>
      </div>

      {showForm && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 space-y-3">
          <input placeholder="To (email or user)" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
            className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
          <textarea placeholder="Message" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={4} className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold resize-none" />
          <button onClick={handleSend}
            className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase hover:bg-[#2a2a24]">
            <Send className="h-4 w-4" /> Send
          </button>
        </div>
      )}

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] text-[10px] uppercase">
              <th className="p-3 text-left">To</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Content</th>
              <th className="p-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center font-black">No messages sent yet.</td></tr>
            ) : messages.map((m) => (
              <tr key={m.id} className="border-b border-black">
                <td className="p-3 font-black">{m.to}</td>
                <td className="p-3">{m.subject}</td>
                <td className="p-3 max-w-[200px] truncate">{m.content}</td>
                <td className="p-3 text-[10px]">{m.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
