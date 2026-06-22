"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Search, Loader } from "lucide-react";
import { getComplaints, resolveComplaint, type ComplaintTicket } from "@/actions/institution-actions";

export default function ComplaintsPage() {
  const [tickets, setTickets] = useState<ComplaintTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getComplaints()
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await resolveComplaint(id);
      setTickets(tickets.map((t) => t.id === id ? { ...t, status: "Resolved" } : t));
    } catch (err) { console.error(err); }
  };

  const filtered = tickets.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.userName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]"><Loader className="h-4 w-4 animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#e28774]" /> Complaints & Support
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Manage support tickets and complaints</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-black bg-[#f4ebd0] p-2 pl-9 text-xs font-bold" />
      </div>

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead>
            <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] text-[10px] uppercase">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center font-black">No tickets found.</td></tr>
            ) : filtered.map((t) => (
              <tr key={t.id} className="border-b border-black">
                <td className="p-3 font-black">{t.userName}</td>
                <td className="p-3">{t.subject}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${
                    t.priority === "High" ? "bg-red-200 text-red-900" :
                    t.priority === "Medium" ? "bg-yellow-200 text-yellow-900" :
                    "bg-green-200 text-green-900"
                  }`}>{t.priority}</span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${t.status === "Open" ? "bg-blue-200 text-blue-900" : t.status === "Resolved" ? "bg-green-200 text-green-900" : "bg-gray-200 text-gray-600"}`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-3 text-[10px]">{t.createdAt}</td>
                <td className="p-3">
                  {t.status !== "Resolved" && (
                    <button onClick={() => handleResolve(t.id)}
                      className="p-1.5 border border-black bg-green-200 hover:bg-green-300" title="Resolve">
                      <CheckCircle className="h-3 w-3" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
