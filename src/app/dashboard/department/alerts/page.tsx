"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { getMyAlerts, markAlertRead, type AlertEntry } from "@/actions/department-actions";

export default function DepartmentAlertsPage() {
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => getMyAlerts().then(setAlerts).catch((err) => setError(err.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAlertRead(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading alerts...</div>;
  if (error) return <div className="border-2 border-black bg-[#e28774] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">{error}</div>;

  const unread = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#e28774]" /> Alerts &amp; Notifications
          {unread > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#e28774] px-1.5 text-[10px] font-black text-white">
              {unread}
            </span>
          )}
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Notifications from events, exams, and announcements</p>
      </div>

      <div className="space-y-2">
        {alerts.length === 0 && (
          <div className="border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-6 text-center text-sm font-bold text-gray-500">
            No alerts yet.
          </div>
        )}
        {alerts.map((a) => (
          <div key={a.id} className={`border-2 border-black shadow-[2px_2px_0px_0px_#1a1a14] p-3 ${a.read ? "bg-[#eae3cb]/60 opacity-70" : "bg-[#eae3cb]"}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {!a.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#e28774]" />}
                  <span className="text-[9px] font-black uppercase px-1 py-0.5 bg-white/60 border border-black">{a.type}</span>
                  <span className="text-[9px] font-bold text-gray-500">{a.createdAt}</span>
                </div>
                <p className="text-xs font-black mt-0.5 break-words">{a.title}</p>
                {a.message && <p className="text-[10px] font-bold text-gray-600 mt-0.5 break-words">{a.message}</p>}
              </div>
              {!a.read && (
                <button onClick={() => handleMarkRead(a.id)} className="p-1 border border-black bg-green-200 hover:bg-green-300 shrink-0" title="Mark as read">
                  <CheckCircle className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
