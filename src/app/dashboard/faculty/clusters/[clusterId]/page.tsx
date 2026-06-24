"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";
import { getClusterMessages, sendClusterMessage, type ClusterMessage } from "@/actions/cluster-message-actions";

export default function ClusterChatPage() {
  const params = useParams();
  const clusterId = params.clusterId as string;

  const [messages, setMessages] = useState<ClusterMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clusterId) return;
    getClusterMessages(clusterId)
      .then(setMessages)
      .catch((e) => setError(e?.message || "Failed to load messages"))
      .finally(() => setLoading(false));
  }, [clusterId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const msg = await sendClusterMessage(clusterId, input.trim());
      setMessages((prev) => [...prev, msg]);
      setInput("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-4 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[#eae3cb] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4 flex items-center gap-3">
        <Link href="/dashboard/faculty/clusters"
          className="border border-[var(--border-primary)] p-1.5 bg-[var(--surface-white)] hover:bg-[#e28774] transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[var(--accent)]" /> Cluster Chat
          </h1>
          <p className="text-[10px] font-bold text-gray-600">All members can read and send messages</p>
        </div>
      </div>

      {error && (
        <div className="border-2 border-[var(--border-primary)] bg-[#e28774] p-3 text-xs font-bold shadow-[3px_3px_0px_0px_var(--border-primary)]">
          {error}
        </div>
      )}

      <div className="border-2 border-[var(--border-primary)] bg-[#eae3cb] shadow-[4px_4px_0px_0px_var(--border-primary)] flex flex-col">
        <div className="p-4 bg-[var(--surface-white)] space-y-3 max-h-[500px] overflow-y-auto min-h-[300px]">
          {loading ? (
            <p className="text-xs font-bold text-gray-500 text-center py-8">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-xs font-bold text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="border border-[var(--border-primary)] p-2.5 bg-[#f4ebd0]/30">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase text-[var(--accent)]">{msg.senderName}</span>
                  <span className="text-[9px] font-bold text-gray-500 shrink-0">
                    {new Date(msg.createdAt).toLocaleString(undefined, {
                      month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs font-bold whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t-2 border-[var(--border-primary)] p-3 bg-[#eae3cb] flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 border-2 border-[var(--border-primary)] bg-[#f4ebd0] p-2 text-xs font-bold resize-none focus:outline-none"
          />
          <button onClick={handleSend} disabled={sending || !input.trim()}
            className="border-2 border-[var(--border-primary)] bg-[#e28774] px-4 py-2 text-xs font-black uppercase hover:bg-[#d17664] transition-colors disabled:opacity-50 flex items-center gap-1">
            <Send className="h-3.5 w-3.5" />
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
