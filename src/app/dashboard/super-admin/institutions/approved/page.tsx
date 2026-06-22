"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton, Modal } from "@/components/super-admin/ui";
import Link from "next/link";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";

export default function ApprovedInstitutionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [viewData, setViewData] = useState<any | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/institutions?status=approved");
      if (res.ok) setData((await res.json()).institutions || []);
    } catch {} finally { setLoading(false); }
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

  async function handleDelete() {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/super-admin/institutions/${deletingId}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => prev.filter((i: any) => i._id !== deletingId));
      }
    } catch {} finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
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
    <span key="c" className="font-mono tracking-wider">{inst.institutionId}</span>,
    <span key="t">{inst.type}</span>,
    <StatusBadge key="s" status="Approved" />,
    <span key="d">{inst.createdAt ? new Date(inst.createdAt).toISOString().split("T")[0] : "—"}</span>,
    <div key="a" className="flex gap-1">
      <ActionButton label="View" variant="ghost" icon={Eye} onClick={() => openView(inst._id)} />
      <ActionButton label="Delete" variant="ghost" icon={Trash2} onClick={() => setDeletingId(inst._id)} />
    </div>,
  ]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approved Institutions"
        description="Institutions that have been approved and are active"
        actions={
          <Link href="/dashboard/super-admin/institutions">
            <ActionButton label="Back to All" variant="ghost" icon={ArrowLeft} />
          </Link>
        }
      />
      <Table
        headers={["Institution Name", "Institution Code", "Type", "Status", "Registration Date", "Actions"]}
        rows={rows}
      />
      
      {/* popUP window */}
      <Modal isOpen={!!viewingId} onClose={closeView} title="Approved Institution Details">
        {viewLoading ? (
          <p className="text-sm font-bold">Loading...</p>
        ) : viewData ? (
          <div className="space-y-4 text-[11px] font-bold">
            <div className="bg-[#f4ebd0] border-2 border-black p-3 text-center">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]/60 mb-1">
                Enrollment / Institution Code
              </p>
              <p className="text-2xl font-black tracking-widest">{viewData.institutionId || "—"}</p>
            </div>

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
              <Field label="Approved" value={viewData.verifiedAt ? new Date(viewData.verifiedAt).toLocaleString() : "—"} />
              <Field label="Status" value={viewData.isVerified ? "Approved" : "—"} />
            </Section>
          </div>
        ) : (
          <p className="text-sm font-bold text-red-600">Failed to load details.</p>
        )}
      </Modal>

      <Modal isOpen={!!deletingId} onClose={() => !deleteLoading && setDeletingId(null)} title="Delete Institution">
        <div className="space-y-4">
          <p className="text-sm font-bold text-red-600">
            Are you sure you want to delete this institution? This action cannot be undone. All associated data will be permanently removed.
          </p>
          <div className="flex gap-2 justify-end">
            <ActionButton label="Cancel" variant="ghost" onClick={() => setDeletingId(null)} disabled={deleteLoading} />
            <ActionButton label="Delete" variant="danger" onClick={handleDelete} disabled={deleteLoading} />
          </div>
        </div>
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
