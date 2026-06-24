"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, Send, Inbox } from "lucide-react";
import { createExchangeRequest, getOtherFaculty, getExchangeRequests, respondToExchangeRequest, type OtherFaculty, type ExchangeRequest } from "@/actions/faculty-actions";

export default function FacultyExchangeDeskPage() {
  const [faculty, setFaculty] = useState<OtherFaculty[]>([]);
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromSlot, setFromSlot] = useState("");
  const [toSlot, setToSlot] = useState("");
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"send" | "inbox">("send");

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [f, r] = await Promise.all([
        getOtherFaculty().catch(() => []),
        getExchangeRequests().catch(() => []),
      ]);
      setFaculty(f);
      setRequests(r);
      if (f.length === 0) setError("No other faculty members found.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data.");
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const handleSubmit = async () => {
    if (!fromSlot || !toSlot || !targetId || !reason) { setMsg("All fields required."); return; }
    const target = faculty.find((f) => f.id === targetId);
    try {
      await createExchangeRequest({ fromSlot, toSlot, reason, targetFacultyId: targetId, targetFacultyName: target?.name || "" });
      setMsg("Exchange request sent!");
      setFromSlot(""); setToSlot(""); setTargetId(""); setReason("");
      await loadAll();
    } catch { setMsg("Failed to submit request."); }
  };

  const handleRespond = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      await respondToExchangeRequest(requestId, status);
      setMsg(`Request ${status}.`);
      await loadAll();
    } catch { setMsg("Failed to update request."); }
  };

  const sentRequests = requests.filter((r) => r.direction === "sent");
  const receivedRequests = requests.filter((r) => r.direction === "received");

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-[#e28774]" /> Exchange Desk
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Request slot exchanges with colleagues</p>
      </div>

      {error && (
        <div className="border-2 border-black bg-red-100 p-3 text-xs font-bold shadow-[3px_3px_0px_0px_#1a1a14]">{error}</div>
      )}
      {msg && (
        <div className="border-2 border-black bg-green-100 p-3 text-xs font-bold shadow-[3px_3px_0px_0px_#1a1a14]">{msg}</div>
      )}

      <div className="flex gap-1 border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-1 w-fit">
        <button onClick={() => setTab("send")}
          className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase transition-all ${tab === "send" ? "bg-[#1a1a14] text-[#f4ebd0]" : "bg-[#f4ebd0] text-[#1a1a14] hover:bg-[#e28774]"}`}>
          <Send className="h-3 w-3" /> New Request
        </button>
        <button onClick={() => setTab("inbox")}
          className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase transition-all ${tab === "inbox" ? "bg-[#1a1a14] text-[#f4ebd0]" : "bg-[#f4ebd0] text-[#1a1a14] hover:bg-[#e28774]"}`}>
          <Inbox className="h-3 w-3" /> Inbox ({receivedRequests.length})
        </button>
      </div>

      {tab === "send" && (
        <div className="max-w-md border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4 space-y-3">
          {loading ? (
            <p className="text-xs font-bold text-gray-500">Loading...</p>
          ) : (
            <>
              <input type="text" placeholder="From slot (e.g., Mon 10:00-11:00)" value={fromSlot} onChange={(e) => setFromSlot(e.target.value)}
                className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
              <input type="text" placeholder="To slot (e.g., Wed 14:00-15:00)" value={toSlot} onChange={(e) => setToSlot(e.target.value)}
                className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" />
              <select value={targetId} onChange={(e) => setTargetId(e.target.value)}
                className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold">
                <option value="">Select faculty to exchange with</option>
                {faculty.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}{f.role ? ` (${f.role.replace("_", " ")})` : ""}</option>
                ))}
              </select>
              <textarea placeholder="Reason for exchange" value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
                className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold resize-none" />
              <button onClick={handleSubmit}
                className="w-full border-2 border-black bg-[#e28774] text-[#1a1a14] p-2 text-xs font-black uppercase shadow-[3px_3px_0px_0px_#1a1a14] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
                Send Request
              </button>
            </>
          )}
        </div>
      )}

      {tab === "inbox" && (
        <div className="space-y-3">
          {receivedRequests.length === 0 && (
            <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-6 text-center text-sm font-bold text-gray-500">
              No received requests.
            </div>
          )}
          {receivedRequests.map((r) => (
            <div key={r.id} className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-3">
              <div className="text-xs font-black">{r.targetFacultyName} wants to exchange</div>
              <div className="text-[10px] font-bold text-gray-600 mt-1">
                {r.fromSlot} &harr; {r.toSlot}
              </div>
              {r.reason && <div className="text-[10px] font-bold mt-1">Reason: {r.reason}</div>}
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[9px] font-black uppercase px-1 py-0.5 border border-black ${
                  r.status === "pending" ? "bg-yellow-200" : r.status === "accepted" ? "bg-green-200" : "bg-red-200"
                }`}>{r.status}</span>
                <span className="text-[9px] text-gray-500">{r.createdAt}</span>
              </div>
              {r.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleRespond(r.id, "accepted")}
                    className="text-[9px] font-black uppercase border border-black px-2 py-1 bg-green-300 hover:bg-green-400 transition-colors">
                    Accept
                  </button>
                  <button onClick={() => handleRespond(r.id, "rejected")}
                    className="text-[9px] font-black uppercase border border-black px-2 py-1 bg-red-300 hover:bg-red-400 transition-colors">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sent requests history */}
      {sentRequests.length > 0 && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
          <h2 className="text-sm font-black uppercase flex items-center gap-2 mb-3">
            <Send className="h-4 w-4 text-[#e28774]" /> Sent Requests
          </h2>
          <div className="space-y-2">
            {sentRequests.map((r) => (
              <div key={r.id} className="border border-black bg-white p-2 text-[10px] font-bold">
                To: {r.targetFacultyName}
                <br />{r.fromSlot} &harr; {r.toSlot}
                {r.reason && <><br />Reason: {r.reason}</>}
                <br />
                <span className={`text-[9px] font-black uppercase px-1 py-0.5 border border-black ${
                  r.status === "pending" ? "bg-yellow-200" : r.status === "accepted" ? "bg-green-200" : "bg-red-200"
                }`}>{r.status}</span>
                <span className="text-[9px] text-gray-500 ml-2">{r.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
