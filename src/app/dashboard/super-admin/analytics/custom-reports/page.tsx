"use client";

import { useState, useEffect } from "react";
import { PageHeader, Card, Table, ActionButton, Modal, InputField, SelectField, StatusBadge } from "@/components/super-admin/ui";
import { FileText, Play, Plus, Save, Trash2 } from "lucide-react";

interface CustomReport {
  _id: string;
  name: string;
  columns: string[];
  createdBy: string;
  lastRunAt: string | null;
  createdAt: string;
}

export default function CustomReportsPage() {
  const [reports, setReports] = useState<CustomReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    columns: "",
    createdBy: "Super Admin",
  });
  const [generatedResult, setGeneratedResult] = useState<string[][] | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch("/api/super-admin/analytics/custom-reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data.items || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!form.name.trim()) return;
    const tempId = `temp-${Date.now()}`;
    const newReport: CustomReport = {
      _id: tempId,
      name: form.name,
      columns: form.columns.split(",").map((c) => c.trim()).filter(Boolean),
      createdBy: form.createdBy,
      lastRunAt: null,
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    setShowCreateModal(false);
    setForm({ name: "", columns: "", createdBy: "Super Admin" });
  }

  async function handleRun(reportId: string, reportName: string) {
    setRunning(reportId);
    await new Promise((r) => setTimeout(r, 1500));
    const mockResult = [
      ["Institution", "Users", "Subscriptions", "Revenue"],
      ["ABC College", "450", "Active", "₹4,99,000"],
      ["XYZ University", "1200", "Active", "₹12,00,000"],
      ["PQR Institute", "300", "Trial", "₹0"],
    ];
    setGeneratedResult(mockResult);
    setReports((prev) =>
      prev.map((r) =>
        r._id === reportId ? { ...r, lastRunAt: new Date().toISOString() } : r
      )
    );
    setRunning(null);
  }

  function handleDelete(reportId: string) {
    setReports((prev) => prev.filter((r) => r._id !== reportId));
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  const rows = reports.map((report) => [
    <span key="name" className="font-black text-[11px]">{report.name}</span>,
    <span key="cols" className="text-[10px]">{report.columns?.length || 0} columns</span>,
    <span key="by" className="text-[10px]">{report.createdBy || "—"}</span>,
    <span key="lr" className="text-[10px]">{report.lastRunAt ? new Date(report.lastRunAt).toLocaleDateString() : "Never"}</span>,
    <div key="ac" className="flex gap-1">
      <ActionButton
        label={running === report._id ? "Running..." : "Run"}
        variant="primary"
        icon={Play}
        onClick={() => handleRun(report._id, report.name)}
      />
      <ActionButton label="Delete" variant="danger" icon={Trash2} onClick={() => handleDelete(report._id)} />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Reports"
        description="Create, run, and manage custom analytics reports"
        actions={
          <ActionButton label="New Report" variant="primary" icon={Plus} onClick={() => setShowCreateModal(true)} />
        }
      />

      <Card title="Saved Reports">
        <Table
          headers={["Report Name", "Columns", "Created By", "Last Run", "Actions"]}
          rows={rows}
        />
      </Card>

      {generatedResult && (
        <Card title="Report Result">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono">
              <thead>
                <tr className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)]">
                  {generatedResult[0].map((h, i) => (
                    <th key={i} className="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generatedResult.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-b border-[var(--border-primary)]/10 hover:bg-[var(--bg-primary)]/50">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2.5 whitespace-nowrap font-bold">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-2">
            <ActionButton label="Download CSV" variant="default" />
            <ActionButton label="Download PDF" variant="default" />
            <ActionButton label="Clear Results" variant="ghost" onClick={() => setGeneratedResult(null)} />
          </div>
        </Card>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Custom Report">
        <div className="space-y-4">
          <InputField
            label="Report Name"
            name="name"
            placeholder="e.g. Monthly Institution Summary"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <InputField
            label="Columns (comma separated)"
            name="columns"
            placeholder="Institution, Users, Revenue, Subscriptions"
            value={form.columns}
            onChange={(e) => setForm((prev) => ({ ...prev, columns: e.target.value }))}
          />
          <InputField
            label="Created By"
            name="createdBy"
            value={form.createdBy}
            onChange={(e) => setForm((prev) => ({ ...prev, createdBy: e.target.value }))}
          />
          <div className="flex gap-2 pt-2">
            <ActionButton label="Save Report" variant="primary" icon={Save} onClick={handleCreate} />
            <ActionButton label="Cancel" variant="ghost" onClick={() => setShowCreateModal(false)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
