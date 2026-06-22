"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton, Modal } from "@/components/super-admin/ui";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Eye } from "lucide-react";

export default function PendingInstitutionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [viewData, setViewData] = useState<any | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/institutions?status=pending");
      if (res.ok) setData((await res.json()).institutions || []);
    } catch {} finally { setLoading(false); }
  }

  async function handleApprove(id: string) {
    const res = await fetch(`/api/super-admin/institutions/${id}/approve`, { method: "POST" });
    const body = await res.json();
    if (res.ok) {
      setMessage(`Approved — new code: ${body.institutionId}`);
      fetchData();
    } else {
      setMessage(`Error: ${body.error}`);
    }
  }

  async function handleReject(id: string) {
    const res = await fetch(`/api/super-admin/institutions/${id}/reject`, { method: "POST" });
    const body = res.ok ? null : await res.json();
    if (res.ok) {
      setMessage("Institution query rejected");
      fetchData();
    } else {
      setMessage(`Error: ${body?.error}`);
    }
  }

  async function openView(id: string) {
    setViewingId(id);
    setViewLoading(true);
    setViewData(null);
    try {
      const res = await fetch(`/api/super-admin/institutions/${id}`);
      if (res.ok) setViewData((await res.json()).institution);
    } catch {} finally { setViewLoading(false); }
  }

  function closeView() {
    setViewingId(null);
    setViewData(null);
  }

  function renderAddress(addr: unknown): string {
    if (!addr) return "—";
    if (typeof addr === "object" && addr !== null) {
      const a = addr as Record<string, string>;
      return [a.line, a.city, a.state, a.country, a.postalCode].filter(Boolean).join(", ");
    }
    return String(addr);
  }

  const rows = data.map((inst: any) => [
    <span key="n" className="font-black">{inst.name}</span>,
    <span key="c">{inst.institutionId || "—"}</span>,
    <span key="t">{inst.type}</span>,
    <StatusBadge key="s" status="Pending" />,
    <span key="d">{inst.createdAt ? new Date(inst.createdAt).toISOString().split("T")[0] : "—"}</span>,
    <div key="a" className="flex gap-1">
      <ActionButton label="View" variant="ghost" icon={Eye} onClick={() => openView(inst._id)} />
      <ActionButton label="Approve" variant="primary" icon={CheckCircle} onClick={() => handleApprove(inst._id)} />
      <ActionButton label="Reject" variant="danger" icon={XCircle} onClick={() => handleReject(inst._id)} />
    </div>,
  ]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Institutions"
        description="Review and approve or reject institution registration requests"
        actions={
          <Link href="/dashboard/super-admin/institutions">
            <ActionButton label="Back to All" variant="ghost" icon={ArrowLeft} />
          </Link>
        }
      />
      {message && (
        <div className="rounded bg-blue-50 p-3 text-sm text-blue-700">{message}</div>
      )}
      <Table
        headers={["Institution Name", "Institution Code", "Type", "Status", "Registration Date", "Actions"]}
        rows={rows}
      />

      <Modal isOpen={!!viewingId} onClose={closeView} title="Institution Registration Details">
        {viewLoading ? (
          <p className="text-sm font-bold">Loading...</p>
        ) : viewData ? (
          <div className="space-y-4 text-[11px] font-bold">
            <Section label="Institution">
              <Field label="Name" value={viewData.name} />
              <Field label="Type" value={viewData.type} />
              <Field label="Academic Mode" value={viewData.academicMode} />
              <Field label="Affiliation" value={viewData.affiliation} />
              <Field label="Est. Year" value={viewData.establishedYear} />
              <Field label="Website" value={viewData.website} />
            </Section>

            <Section label="Contact Person">
              <Field label="Name" value={viewData.contactPerson} />
              <Field label="Email" value={viewData.contactEmail} />
              <Field label="Phone" value={viewData.contactPhone} />
            </Section>

            <Section label="Address">
              <Field label="Address" value={renderAddress(viewData.address)} />
            </Section>

            <Section label="Registration">
              <Field label="Submitted" value={viewData.createdAt ? new Date(viewData.createdAt).toLocaleString() : "—"} />
              <Field label="Status" value={viewData.isVerified ? "Approved" : "Pending"} />
            </Section>
          </div>
        ) : (
          <p className="text-sm font-bold text-red-600">Failed to load details.</p>
        )}
      </Modal>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-black uppercase tracking-wider text-[#e28774] mb-1.5 border-b border-black/10 pb-1">{label}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="flex gap-2">
      <span className="text-[#1a1a14]/50 w-24 shrink-0">{label}:</span>
      <span className="break-words">{value || "—"}</span>
    </div>
  );
}
