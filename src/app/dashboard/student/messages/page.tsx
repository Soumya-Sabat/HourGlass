"use client";

import { useEffect, useState, useCallback } from "react";
import { ScrollText, Send, RefreshCw, Loader, Mail, MailOpen, User } from "lucide-react";
import { getStudentMessages, sendStudentMessage, markMessageRead, type MessageInfo } from "@/actions/student-academic-actions";

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newSubject, setNewSubject] = useState("");

  const fetchMessages = useCallback(async () => {
    try {
      const data = await getStudentMessages();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  async function handleSend(formData: FormData) {
    if (sending) return;
    setSending(true);
    try {
      await sendStudentMessage(formData);
      setNewContent("");
      setNewSubject("");
      await fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send.");
    }
    setSending(false);
  }

  async function handleMarkRead(id: string) {
    try {
      await markMessageRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch {}
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-4 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading messages...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <ScrollText className="h-5 w-5" /> MESSAGES
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Auto-refreshes every 15s • {unreadCount > 0 ? `${unreadCount} unread` : "All read"}</p>
        </div>
        <button onClick={fetchMessages}
          className="flex items-center gap-2 border-2 border-black bg-[#f4ebd0] px-3 py-2 text-xs font-black uppercase hover:bg-[#eae3cb]">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="border-2 border-black bg-[#e28774] p-3 text-xs font-black">{error}</div>
      )}

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
        <div className="border-b-2 border-black bg-[#1a1a14] p-3 text-[#f4ebd0] text-xs font-black uppercase">Send Message</div>
        <form action={handleSend} className="p-4 space-y-3 bg-white">
          <input
            name="subject"
            placeholder="Subject (optional)"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="w-full border-2 border-black bg-[#f4ebd0] px-3 py-2 text-xs font-black uppercase outline-none focus:bg-white"
          />
          <textarea
            name="content"
            placeholder="Type your message..."
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            className="w-full border-2 border-black bg-[#f4ebd0] px-3 py-2 text-xs font-black uppercase outline-none focus:bg-white"
          />
          <button type="submit" disabled={sending || !newContent.trim()}
            className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase hover:bg-[#2a2a24] disabled:opacity-50">
            {sending ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id}
            onClick={() => !msg.read && handleMarkRead(msg.id)}
            className={`border-2 border-black shadow-[3px_3px_0px_0px_#1a1a14] cursor-pointer transition-all ${msg.read ? "bg-[#eae3cb]" : "bg-white ring-2 ring-[#e28774]"}`}>
            <div className="p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase">
                  {msg.read ? <MailOpen className="h-3 w-3 text-gray-500" /> : <Mail className="h-3 w-3 text-[#e28774]" />}
                  {msg.senderName}
                  <span className="text-[9px] font-bold text-gray-500">({msg.senderRole})</span>
                </div>
                <span className="text-[9px] font-bold text-gray-500">{msg.createdAt}</span>
              </div>
              {msg.subject && <div className="text-[11px] font-bold text-gray-700">{msg.subject}</div>}
              <div className="text-[11px] text-gray-600 whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="border-2 border-black bg-[#eae3cb] p-8 text-center text-xs font-black shadow-[4px_4px_0px_0px_#1a1a14]">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
