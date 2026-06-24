"use client";

import { useState } from "react";
import { PageHeader, FilterBar, ActionButton } from "@/components/super-admin/ui";
import { AlertTriangle, Info, XCircle, RefreshCw } from "lucide-react";

const MOCK_LOGS = [
  { id: 1, timestamp: "2026-06-22 10:23:45", level: "Info", component: "AuthService", message: "User login successful for admin@hourglass.com" },
  { id: 2, timestamp: "2026-06-22 10:20:12", level: "Warning", component: "Database", message: "Query execution time exceeded threshold (2.3s)" },
  { id: 3, timestamp: "2026-06-22 10:15:33", level: "Error", component: "PaymentGateway", message: "Payment verification failed for transaction TX-2024" },
  { id: 4, timestamp: "2026-06-22 10:10:01", level: "Info", component: "BackupService", message: "Scheduled backup completed successfully" },
  { id: 5, timestamp: "2026-06-22 10:05:22", level: "Warning", component: "RateLimiter", message: "Rate limit approaching threshold for API key external-svc-1" },
  { id: 6, timestamp: "2026-06-22 09:55:44", level: "Error", component: "SyncEngine", message: "Data sync failed for institution ID: INST-042" },
  { id: 7, timestamp: "2026-06-22 09:50:18", level: "Info", component: "EmailService", message: "Bulk email campaign dispatched to 1,240 recipients" },
  { id: 8, timestamp: "2026-06-22 09:45:09", level: "Warning", component: "Storage", message: "Disk usage at 85% on primary volume" },
  { id: 9, timestamp: "2026-06-22 09:40:55", level: "Error", component: "CacheService", message: "Redis connection timeout after 5 retries" },
  { id: 10, timestamp: "2026-06-22 09:35:30", level: "Info", component: "CronJob", message: "Daily report generation started" },
  { id: 11, timestamp: "2026-06-22 09:30:12", level: "Info", component: "APIGateway", message: "New API key generated for external-integration-v2" },
  { id: 12, timestamp: "2026-06-22 09:25:47", level: "Warning", component: "AuthService", message: "Failed login attempt from IP 192.168.1.45" },
];

const levelIcon: Record<string, React.ReactNode> = {
  Info: <Info className="h-3 w-3 text-blue-600" />,
  Warning: <AlertTriangle className="h-3 w-3 text-yellow-600" />,
  Error: <XCircle className="h-3 w-3 text-red-600" />,
};

const levelColors: Record<string, string> = {
  Info: "bg-blue-100 text-blue-900 border-blue-300",
  Warning: "bg-yellow-100 text-yellow-900 border-yellow-300",
  Error: "bg-red-100 text-red-900 border-red-300",
};

export default function SystemLogsPage() {
  const [filter, setFilter] = useState<string>("All");
  const [logs, setLogs] = useState(MOCK_LOGS);

  const filteredLogs = filter === "All" ? logs : logs.filter((l) => l.level === filter);
  const levels = ["All", "Info", "Warning", "Error"];

  const countByLevel = (level: string) => level === "All" ? logs.length : logs.filter((l) => l.level === level).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Logs"
        description="Monitor system events, warnings, and errors"
        actions={
          <ActionButton label="Refresh" variant="default" icon={RefreshCw} onClick={() => setLogs([...MOCK_LOGS])} />
        }
      />

      <FilterBar>
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1.5 text-[10px] font-black uppercase border-2 border-[var(--border-primary)] transition-all ${
              filter === level
                ? "bg-[var(--dark-bg)] text-[var(--light-text)] shadow-[2px_2px_0px_0px_var(--border-primary)]"
                : "bg-[var(--surface-white)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            {level} <span className="ml-1 text-[9px]">({countByLevel(level)})</span>
          </button>
        ))}
      </FilterBar>

      <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] overflow-x-auto">
        <table className="w-full text-left text-[11px] font-mono">
          <thead>
            <tr className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)]">
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">Timestamp</th>
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">Level</th>
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">Component</th>
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-[var(--border-primary)]/10 hover:bg-[var(--bg-primary)]/50 transition-colors">
                <td className="px-3 py-2.5 whitespace-nowrap font-mono text-[10px]">{log.timestamp}</td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 border border-[var(--border-primary)] ${levelColors[log.level]}`}>
                    {levelIcon[log.level]}
                    {log.level.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap font-black">{log.component}</td>
                <td className="px-3 py-2.5 font-bold">{log.message}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-[12px] font-bold text-[var(--text-primary)]/40">
                  No log entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
