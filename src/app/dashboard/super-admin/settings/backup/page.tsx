"use client";

import { useState, useEffect } from "react";
import { PageHeader, Card, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { Database, Download, Upload, Clock } from "lucide-react";

function formatBytes(bytes?: number) {
  if (!bytes) return "—";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default function BackupPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/settings/backup");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  const lastBackup = data.find((b: any) => b.status === "Completed");
  const latestDate = lastBackup ? new Date(lastBackup.completedAt).toLocaleString() : "No backups available";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Backup Management"
        description="Manage system database backups and restoration"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-[var(--accent)]" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider opacity-70">Last Backup</div>
              <div className="text-sm font-black mt-0.5">{latestDate}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-[var(--accent)]" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider opacity-70">Total Backups</div>
              <div className="text-sm font-black mt-0.5">{data.length} records</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6 text-[var(--accent)]" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider opacity-70">Latest Size</div>
              <div className="text-sm font-black mt-0.5">{lastBackup ? formatBytes(lastBackup.fileSize) : "—"}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <ActionButton label="Trigger Backup" variant="primary" icon={Database} />
        <ActionButton label="Restore from Backup" variant="default" icon={Upload} />
      </div>

      <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] overflow-x-auto">
        <table className="w-full text-left text-[11px] font-mono">
          <thead>
            <tr className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)]">
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">File Name</th>
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">Size</th>
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">Type</th>
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">Status</th>
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">Completed At</th>
              <th className="px-3 py-2.5 text-[10px] font-black uppercase">Retention</th>
            </tr>
          </thead>
          <tbody>
            {data.map((b: any) => (
              <tr key={b._id} className="border-b border-[var(--border-primary)]/10 hover:bg-[var(--bg-primary)]/50 transition-colors">
                <td className="px-3 py-2.5 font-mono text-[10px] font-black">{b.fileName}</td>
                <td className="px-3 py-2.5 text-[10px]">{formatBytes(b.fileSize)}</td>
                <td className="px-3 py-2.5"><StatusBadge status={b.type} /></td>
                <td className="px-3 py-2.5"><StatusBadge status={b.status} /></td>
                <td className="px-3 py-2.5 text-[10px]">{b.completedAt ? new Date(b.completedAt).toLocaleDateString() : "—"}</td>
                <td className="px-3 py-2.5 text-[10px]">{b.retentionDays} days</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-[12px] font-bold text-[var(--text-primary)]/40">
                  No backup records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
