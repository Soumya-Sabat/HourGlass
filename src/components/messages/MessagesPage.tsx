"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Search, Users, CheckCircle, Mail, X, Reply } from "lucide-react";
import { getInstitutionUsersForMessaging, getReceivedMessages, sendMessage, markMessageRead, type MessagingUser, type MessageEntry } from "@/actions/messages-actions";

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [users, setUsers] = useState<MessagingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MessagingUser | "@all" | null>(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [replyTarget, setReplyTarget] = useState<MessagingUser | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const load = () => {
    setLoading(true);
    Promise.all([getReceivedMessages(), getInstitutionUsersForMessaging()])
      .then(([m, u]) => { setMessages(m); setUsers(u); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!showCompose) {
      setSelectedUser(null);
      setSearchQuery("");
      setSubject("");
      setContent("");
      setSendSuccess(false);
      setReplyTarget(null);
    }
  }, [showCompose]);

  const handleReply = (m: MessageEntry) => {
    const sender = users.find((u) => u.id === m.senderId);
    if (sender) {
      setReplyTarget(sender);
      setSelectedUser(sender);
      setSearchQuery(sender.name);
      setSubject(`Re: ${m.subject || "General"}`);
      setShowCompose(true);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markMessageRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch {}
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || sending) return;
    setSending(true);
    setError(null);
    try {
      const receiverId = selectedUser === "@all" ? "@all" : selectedUser.id;
      await sendMessage({ receiverId, subject, content });
      setSendSuccess(true);
      setTimeout(() => { setShowCompose(false); }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading messages...</div>;

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[var(--accent)]" /> Messages
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-black text-white">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Institution-wide messaging</p>
        </div>
        <button onClick={() => setShowCompose(true)}
          className="flex items-center gap-1.5 border-2 border-[var(--border-primary)] bg-[var(--accent)] px-4 py-2 text-xs font-black text-white hover:bg-[var(--accent)]">
          <Mail className="h-3.5 w-3.5" /> Compose
        </button>
      </div>

      {error && (
        <div className="border-2 border-[var(--border-primary)] bg-[var(--accent)]/20 p-3 text-xs font-bold text-red-700">{error}</div>
      )}

      {/* Compose */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !sending && setShowCompose(false)}>
          <div className="w-full max-w-lg border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-[6px_6px_0px_0px_var(--border-primary)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase">{replyTarget ? `Reply to ${replyTarget.name}` : "New Message"}</h3>
              {sendSuccess ? (
                <span className="flex items-center gap-1 text-xs font-black text-green-700"><CheckCircle className="h-4 w-4" /> Sent!</span>
              ) : (
                <button onClick={() => setShowCompose(false)} className="p-1 hover:bg-black/10"><X className="h-4 w-4" /></button>
              )}
            </div>
            {!sendSuccess && (
              <form onSubmit={handleSend} className="space-y-3">
                {/* To field with search */}
                <div ref={searchRef} className="relative">
                  <label className="block text-[10px] font-black uppercase mb-1">To</label>
                  <div className="flex gap-1 mb-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={selectedUser === "@all" ? "@all" : selectedUser ? selectedUser.name : searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSelectedUser(null); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search by name or email..."
                        className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 pl-8 text-xs font-bold"
                        required={!selectedUser}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedUser("@all"); setSearchQuery(""); setShowDropdown(false); }}
                      className={`flex items-center gap-1 border-2 border-[var(--border-primary)] px-3 py-2 text-[10px] font-black uppercase whitespace-nowrap ${selectedUser === "@all" ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-white)] hover:bg-[var(--bg-secondary)]"}`}
                    >
                      <Users className="h-3 w-3" /> @all
                    </button>
                  </div>
                  {showDropdown && selectedUser !== "@all" && (
                    <div className="absolute z-50 top-full mt-1 left-0 right-14 border-2 border-[var(--border-primary)] bg-[var(--surface-white)] shadow-[3px_3px_0px_0px_var(--border-primary)] max-h-48 overflow-y-auto">
                      {filtered.length === 0 ? (
                        <div className="p-3 text-[10px] font-bold text-gray-500">No users found.</div>
                      ) : filtered.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => { setSelectedUser(u); setSearchQuery(u.name); setShowDropdown(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]/10 last:border-b-0"
                        >
                          <span className="block text-xs font-black">{u.name}</span>
                          <span className="block text-[10px] font-bold text-gray-600">{u.email}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Subject</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                    className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold" placeholder="General" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Message</label>
                  <textarea rows={4} required value={content} onChange={(e) => setContent(e.target.value)}
                    className="w-full border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-2 text-xs font-bold resize-none" placeholder="Type your message..." />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowCompose(false)} disabled={sending}
                    className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] px-4 py-1.5 text-xs font-black hover:bg-[var(--bg-secondary)] disabled:opacity-40">Cancel</button>
                  <button type="submit" disabled={sending || !selectedUser}
                    className="flex items-center gap-1 border-2 border-[var(--border-primary)] bg-[var(--accent)] px-4 py-1.5 text-xs font-black text-white hover:bg-[var(--accent)] disabled:opacity-40">
                    {sending ? "Sending..." : <><Send className="h-3 w-3" /> Send</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Inbox */}
      <div className="space-y-2">
        {messages.length === 0 && (
          <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[3px_3px_0px_0px_var(--border-primary)] p-6 text-center text-sm font-bold text-gray-500">
            No messages yet.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            onClick={() => m.direction === "incoming" && !m.read && handleMarkRead(m.id)}
            className={`border-2 border-[var(--border-primary)] shadow-[2px_2px_0px_0px_var(--border-primary)] p-3 cursor-pointer transition-all ${m.read ? "bg-[var(--bg-secondary)]/60 opacity-70" : "bg-[var(--bg-secondary)]"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {m.direction === "outgoing" ? (
                    <Send className="h-3 w-3 shrink-0 text-gray-500" />
                  ) : !m.read ? (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  ) : null}
                  <span className="text-xs font-black">{m.direction === "outgoing" ? `To: ${m.receiverName || "All"}` : m.senderName}</span>
                  {m.direction === "incoming" && <span className="text-[9px] font-bold uppercase px-1 py-0.5 bg-white/60 border border-[var(--border-primary)]">{m.senderRole}</span>}
                  <span className="text-[9px] font-bold text-gray-500">{m.createdAt}</span>
                </div>
                {m.subject && <p className="text-[10px] font-black text-gray-700 mt-0.5">{m.subject}</p>}
                <p className="text-xs font-bold mt-0.5 break-words">{m.content}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {m.direction === "incoming" && (
                  <button onClick={(e) => { e.stopPropagation(); handleReply(m); }}
                    className="p-1 border border-[var(--border-primary)] bg-blue-200 hover:bg-blue-300 shrink-0" title="Reply">
                    <Reply className="h-3 w-3" />
                  </button>
                )}
                {m.direction === "incoming" && !m.read && (
                  <button onClick={(e) => { e.stopPropagation(); handleMarkRead(m.id); }}
                    className="p-1 border border-[var(--border-primary)] bg-green-200 hover:bg-green-300 shrink-0" title="Mark read">
                    <CheckCircle className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
