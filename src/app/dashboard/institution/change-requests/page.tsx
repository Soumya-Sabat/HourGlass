"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import { getChangeRequests, approveChangeRequest, rejectChangeRequest, type ChangeRequestEntry } from "@/actions/institution-actions";

export default function ChangeRequestsPage() {
  const [requests, setRequests] = useState<ChangeRequestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    getChangeRequests()
      .then(setRequests)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  async function handleAction(id: string) {
    if (!actionType) return;
    const fn = actionType === "approve" ? approveChangeRequest : rejectChangeRequest;
    const result = await fn(id, actionNote);
    if (result.success) {
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: actionType === "approve" ? "approved" : "rejected", adminNote: actionNote } : r)));
      setActionId(null);
      setActionNote("");
      setActionType(null);
    } else {
      setError(result.error ?? "Action failed.");
    }
  }

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading change requests...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#e28774]" /> Change Requests
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Review student change requests</p>
      </div>

      {requests.length === 0 && (
        <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-6 text-center text-sm font-bold text-gray-500">
          No pending change requests.
        </div>
      )}

      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req._id} className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase">{req.userName}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 border border-black ${
                    req.status === "pending" ? "bg-yellow-200" :
                    req.status === "approved" ? "bg-green-200" : "bg-red-200"
                  }`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-600">{req.userEmail} &middot; {req.createdAt}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="border border-black/20 p-2 bg-white/50">
                    <span className="font-black uppercase">Field</span>
                    <p className="font-bold break-words">{req.fieldName}</p>
                  </div>
                  <div className="border border-black/20 p-2 bg-white/50">
                    <span className="font-black uppercase">Current</span>
                    <p className="font-bold break-words">{req.currentValue || "—"}</p>
                  </div>
                  <div className="border border-black/20 p-2 bg-white/50">
                    <span className="font-black uppercase">Requested</span>
                    <p className="font-bold break-words">{req.requestedValue}</p>
                  </div>
                  <div className="border border-black/20 p-2 bg-white/50">
                    <span className="font-black uppercase">Reason</span>
                    <p className="font-bold break-words">{req.reason || "—"}</p>
                  </div>
                </div>
                {req.adminNote && (
                  <div className="mt-1 border border-black/20 p-2 bg-white/50">
                    <span className="font-black uppercase text-[9px]">Admin Note</span>
                    <p className="text-[10px] font-bold">{req.adminNote}</p>
                  </div>
                )}
              </div>
              {req.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { setActionId(req._id); setActionType("approve"); setActionNote(""); }}
                    className="inline-flex h-8 items-center gap-1 rounded-none border-2 border-black bg-green-200 px-3 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#1a1a14] hover:bg-green-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <CheckCircle className="h-3 w-3" /> Approve
                  </button>
                  <button
                    onClick={() => { setActionId(req._id); setActionType("reject"); setActionNote(""); }}
                    className="inline-flex h-8 items-center gap-1 rounded-none border-2 border-black bg-red-200 px-3 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#1a1a14] hover:bg-red-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <XCircle className="h-3 w-3" /> Reject
                  </button>
                </div>
              )}
            </div>

            {actionId === req._id && (
              <div className="mt-3 border-t-2 border-black pt-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[9px] font-black uppercase mb-1">Admin Note (optional)</label>
                    <input
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      placeholder="Add a note..."
                      className="w-full border-2 border-black bg-white px-2 py-1.5 text-xs font-bold outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleAction(req._id)}
                    className="inline-flex h-8 items-center gap-1 rounded-none border-2 border-black bg-[#1a1a14] px-3 text-[10px] font-black uppercase text-[#f4ebd0] shadow-[2px_2px_0px_0px_#1a1a14] hover:opacity-90 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <Clock className="h-3 w-3" /> Confirm
                  </button>
                  <button
                    onClick={() => { setActionId(null); setActionNote(""); setActionType(null); }}
                    className="inline-flex h-8 items-center rounded-none border-2 border-black bg-white px-3 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#1a1a14] hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}