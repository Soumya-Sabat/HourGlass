"use client";

import { useState } from "react";
import { PageHeader, Table, StatusBadge, FilterBar, SearchInput, Tabs } from "@/components/super-admin/ui";

const ACTIVITY_LOGS = [
  { user: "Alice Johnson", action: "Approved institution SPR1001", target: "Institution", status: "Completed", timestamp: "2026-06-20 14:32", ip: "192.168.1.101" },
  { user: "Bob Smith", action: "Updated user permissions for Carol White", target: "User", status: "Completed", timestamp: "2026-06-20 13:15", ip: "192.168.1.102" },
  { user: "Ivy Clark", action: "Rejected institution OAK3003", target: "Institution", status: "Completed", timestamp: "2026-06-20 11:45", ip: "192.168.1.103" },
  { user: "Frank Miller", action: "Suspended institution BLU4004", target: "Institution", status: "Completed", timestamp: "2026-06-19 16:20", ip: "192.168.1.104" },
  { user: "Grace Wilson", action: "Exported user report", target: "Report", status: "Completed", timestamp: "2026-06-19 15:00", ip: "192.168.1.105" },
  { user: "David Brown", action: "Failed login attempt", target: "Auth", status: "Failed", timestamp: "2026-06-19 09:30", ip: "10.0.0.55" },
  { user: "Henry Taylor", action: "Modified pricing plan PREMIUM", target: "Pricing", status: "Completed", timestamp: "2026-06-18 22:10", ip: "192.168.1.106" },
  { user: "Eve Davis", action: "Created new department CSE at SPR1001", target: "Department", status: "Completed", timestamp: "2026-06-18 18:45", ip: "192.168.1.107" },
  { user: "Jack Lee", action: "Updated system settings", target: "Settings", status: "Completed", timestamp: "2026-06-18 16:30", ip: "192.168.1.108" },
  { user: "Carol White", action: "Deleted user account (user_1234)", target: "User", status: "Completed", timestamp: "2026-06-17 12:00", ip: "192.168.1.109" },
  { user: "Nathan Thomas", action: "Generated audit report", target: "Report", status: "Completed", timestamp: "2026-06-17 10:15", ip: "192.168.1.110" },
  { user: "Olivia Garcia", action: "Password reset request for Eve Davis", target: "Auth", status: "Completed", timestamp: "2026-06-16 08:50", ip: "10.0.0.56" },
  { user: "Quinn Anderson", action: "Bulk invite sent to 25 users", target: "User", status: "Completed", timestamp: "2026-06-15 14:20", ip: "192.168.1.111" },
  { user: "Peter Robinson", action: "API key rotation", target: "Settings", status: "Completed", timestamp: "2026-06-14 11:05", ip: "192.168.1.112" },
  { user: "Mike Johnson", action: "Failed institution verification", target: "Institution", status: "Failed", timestamp: "2026-06-13 09:15", ip: "10.0.0.57" },
];

const TABS = [
  { id: "all", label: "All Activity" },
  { id: "institution", label: "Institutions" },
  { id: "user", label: "Users" },
  { id: "auth", label: "Auth" },
  { id: "settings", label: "Settings" },
];

export default function ActivityLogsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ACTIVITY_LOGS.filter((log) => {
    const matchesTab = activeTab === "all" || log.target.toLowerCase() === activeTab;
    const matchesSearch = !search || log.user.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const rows = filtered.map((log, i) => [
    <span key="u" className="font-black">{log.user}</span>,
    <span key="a" className="max-w-[280px] truncate block">{log.action}</span>,
    <span key="t">{log.target}</span>,
    <StatusBadge key="s" status={log.status} />,
    <span key="ts" className="text-[10px]">{log.timestamp}</span>,
    <span key="ip" className="text-[10px] text-gray-500">{log.ip}</span>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        description="Track all user actions and system events"
      />
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by user or action..." />
      </FilterBar>
      <Table
        headers={["User", "Action", "Target", "Status", "Timestamp", "IP Address"]}
        rows={rows}
      />
    </div>
  );
}
