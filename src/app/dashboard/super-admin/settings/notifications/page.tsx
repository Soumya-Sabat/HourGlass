"use client";

import { useState } from "react";
import { PageHeader, Card, StatusBadge, FilterBar } from "@/components/super-admin/ui";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

const NOTIFICATION_TYPES = [
  { id: "1", type: "Attendance Alert", channel: "Email", recipients: "Parents, Teachers", enabled: true },
  { id: "2", type: "Exam Schedule", channel: "Push Notification", recipients: "Students, Teachers", enabled: true },
  { id: "3", type: "Fee Reminder", channel: "Email", recipients: "Parents", enabled: true },
  { id: "4", type: "System Announcement", channel: "In-App", recipients: "All Users", enabled: false },
  { id: "5", type: "Grade Published", channel: "Email", recipients: "Students, Parents", enabled: true },
  { id: "6", type: "Maintenance Notice", channel: "SMS", recipients: "Admins", enabled: false },
  { id: "7", type: "New Feature Release", channel: "In-App", recipients: "All Users", enabled: true },
  { id: "8", type: "Password Expiry", channel: "Email", recipients: "All Users", enabled: true },
];

const channelIcons: Record<string, React.ReactNode> = {
  "Email": <Mail className="h-3.5 w-3.5" />,
  "Push Notification": <Bell className="h-3.5 w-3.5" />,
  "In-App": <MessageSquare className="h-3.5 w-3.5" />,
  "SMS": <Smartphone className="h-3.5 w-3.5" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATION_TYPES);
  const [filter, setFilter] = useState("All");

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const filtered = filter === "All" ? notifications : notifications.filter((n) => n.channel === filter);
  const channels = ["All", ...Array.from(new Set(notifications.map((n) => n.channel)))];

  return (
    <div className="space-y-6">
      <PageHeader title="Notification Settings" description="Configure notification delivery channels and preferences" />

      <FilterBar>
        {channels.map((ch) => (
          <button
            key={ch}
            onClick={() => setFilter(ch)}
            className={`px-3 py-1.5 text-[10px] font-black uppercase border-2 border-[var(--border-primary)] transition-all ${
              filter === ch
                ? "bg-[var(--dark-bg)] text-[var(--light-text)]"
                : "bg-[var(--surface-white)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            {ch === "All" ? "All Channels" : ch}
          </button>
        ))}
      </FilterBar>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((n) => (
          <Card key={n.id} className="!bg-[var(--surface-white)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[var(--text-primary)]/60">{channelIcons[n.channel]}</div>
                <div>
                  <h3 className="text-[12px] font-black uppercase">{n.type}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={n.channel} />
                    <span className="text-[10px] font-bold text-[var(--text-primary)]/60">{n.recipients}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleNotification(n.id)}
                className={`relative w-10 h-5 border-2 border-[var(--border-primary)] transition-all ${
                  n.enabled ? "bg-green-400" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-3.5 h-3.5 bg-[var(--surface-white)] border-2 border-[var(--border-primary)] transition-all ${
                    n.enabled ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
