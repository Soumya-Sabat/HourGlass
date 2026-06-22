"use client";

import { useState } from "react";
import { PageHeader, Card, StatusBadge, ActionButton, Modal } from "@/components/super-admin/ui";

const DATA_TYPES = [
  {
    id: "user",
    name: "User Data",
    description: "Personal information, contact details, academic records, and authentication data",
    retentionPeriod: "36 months",
    legalBasis: "GDPR Art. 6(1)(b) — Contractual necessity",
    status: "Compliant",
  },
  {
    id: "institution",
    name: "Institution Data",
    description: "Institution profiles, affiliation records, accreditation documents, and operational data",
    retentionPeriod: "60 months",
    legalBasis: "Indian IT Act 2000 — Statutory obligation",
    status: "Compliant",
  },
  {
    id: "timetable",
    name: "Timetable Data",
    description: "Schedules, room allocations, faculty assignments, and historical timetable records",
    retentionPeriod: "24 months",
    legalBasis: "Legitimate interest — Service optimization",
    status: "Under Review",
  },
  {
    id: "billing",
    name: "Billing & Subscription Data",
    description: "Payment records, invoices, subscription plans, and transaction history",
    retentionPeriod: "84 months",
    legalBasis: "GDPR Art. 6(1)(c) — Legal obligation (tax)",
    status: "Compliant",
  },
  {
    id: "audit",
    name: "Audit Logs",
    description: "System activity logs, access records, and compliance trail data",
    retentionPeriod: "60 months",
    legalBasis: "GDPR Art. 30 — Records of processing activities",
    status: "Compliant",
  },
  {
    id: "communication",
    name: "Communications",
    description: "Email campaigns, in-app notifications, surveys, and announcement records",
    retentionPeriod: "12 months",
    legalBasis: "Consent — GDPR Art. 7",
    status: "Needs Review",
  },
];

export default function DataPrivacyPage() {
  const [selectedType, setSelectedType] = useState<typeof DATA_TYPES[0] | null>(null);

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <PageHeader
        title="DATA PRIVACY & RETENTION"
        description="Configure data retention policies and review compliance status across all data categories"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {DATA_TYPES.map((dt) => (
          <Card key={dt.id} title={dt.name} className="flex flex-col">
            <div className="space-y-3 text-[11px]">
              <p className="font-bold text-gray-600 leading-relaxed">{dt.description}</p>
              <div className="border-t border-dashed border-black pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="font-black uppercase text-[10px]">Retention</span>
                  <span className="font-bold">{dt.retentionPeriod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase text-[10px]">Status</span>
                  <StatusBadge status={dt.status} />
                </div>
              </div>
              <button
                onClick={() => setSelectedType(dt)}
                className="text-[10px] font-black uppercase underline underline-offset-2 hover:text-[#e28774] transition-colors"
              >
                View Details →
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!selectedType} onClose={() => setSelectedType(null)} title={selectedType?.name || ""}>
        {selectedType && (
          <div className="space-y-4 text-[12px]">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Data Category</label>
              <p className="font-bold">{selectedType.name}</p>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Description</label>
              <p className="font-bold text-gray-600">{selectedType.description}</p>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Retention Period</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={selectedType.retentionPeriod}
                  className="flex-1 h-9 px-3 text-[12px] font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#e28774]"
                />
                <ActionButton label="Save" variant="primary" onClick={() => setSelectedType(null)} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Legal Basis</label>
              <p className="font-bold text-gray-600">{selectedType.legalBasis}</p>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Compliance Status</label>
              <StatusBadge status={selectedType.status} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
