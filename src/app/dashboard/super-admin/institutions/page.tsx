"use client";

import { useState, useEffect } from "react";
import { PageHeader, Table, StatusBadge, ActionButton, SearchInput, FilterBar } from "@/components/super-admin/ui";
import { Eye } from "lucide-react";

interface Institution {
  _id: string;
  institutionId: string;
  name: string;
  type: string;
  contactPerson: string;
  contactEmail: string;
  isVerified: boolean;
  createdAt: string | null;
}

export default function InstitutionsPage() {
  const [data, setData] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/institutions");
      if (res.ok) {
        const json = await res.json();
        setData(json.institutions || []);
      }
    } catch {
      // fallback to empty
    } finally {
      setLoading(false);
    }
  }

  function getStatus(inst: Institution): string {
    if (inst.isVerified) return "Approved";
    return "Pending";
  }

  const filtered = data.filter((inst) => {
    if (typeFilter !== "All Types" && inst.type !== typeFilter) return false;
    const status = getStatus(inst);
    if (statusFilter !== "All Status" && status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!inst.name.toLowerCase().includes(q) && !inst.institutionId.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const rows = filtered.map((inst) => [
    <span key="n" className="font-black">{inst.name}</span>,
    <span key="c">{inst.institutionId}</span>,
    <span key="t">{inst.type}</span>,
    <StatusBadge key="s" status={getStatus(inst)} />,
    <span key="d">{inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : "—"}</span>,
    <div key="a" className="flex gap-1">
      <ActionButton label="View" variant="ghost" icon={Eye} onClick={() => {}} />
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Institutions"
        description="Manage all registered institutions across the platform"
        actions={
          <ActionButton label="Pending Reviews" variant="primary" onClick={() => window.location.href = "/dashboard/super-admin/institutions/pending"} />
        }
      />
      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search institutions..." />
        <select className="h-9 px-2 text-[10px] font-black uppercase border-2 border-[var(--border-primary)] bg-[var(--surface-white)]" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option>All Types</option>
          <option>University</option>
          <option>College</option>
          <option>Institute</option>
          <option>School</option>
        </select>
        <select className="h-9 px-2 text-[10px] font-black uppercase border-2 border-[var(--border-primary)] bg-[var(--surface-white)]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>
      </FilterBar>
      {loading ? (
        <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>
      ) : (
        <Table headers={["Institution Name", "Institution Code", "Type", "Status", "Registration Date", "Actions"]} rows={rows} />
      )}
    </div>
  );
}
