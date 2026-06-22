"use client";

import { useState } from "react";
import { PageHeader, Card, StatusBadge, ActionButton, Modal } from "@/components/super-admin/ui";
import { Shield, FileText, AlertTriangle, CheckCircle } from "lucide-react";

const FRAMEWORKS = [
  {
    id: "gdpr",
    name: "GDPR Compliance",
    icon: Shield,
    description: "General Data Protection Regulation — EU privacy law governing personal data processing",
    status: "Compliant",
    lastAudit: "2026-06-15",
    nextAudit: "2026-09-15",
    checks: [
      { name: "Data Processing Records", pass: true },
      { name: "Consent Management", pass: true },
      { name: "Right to Access", pass: true },
      { name: "Right to Erasure", pass: true },
      { name: "Data Breach Notification", pass: true },
      { name: "Data Protection Officer", pass: true },
    ],
    score: 94,
  },
  {
    id: "india-it",
    name: "Indian IT Act 2000",
    icon: FileText,
    description: "Information Technology Act — Indian cyber law and data protection framework",
    status: "Compliant",
    lastAudit: "2026-06-10",
    nextAudit: "2026-08-10",
    checks: [
      { name: "Reasonable Security Practices", pass: true },
      { name: "Sensitive Personal Data Rules", pass: true },
      { name: "Cyber Incident Reporting", pass: true },
      { name: "Data Localization Requirements", pass: false },
      { name: "Intermediary Guidelines", pass: true },
      { name: "Grievance Redressal", pass: true },
    ],
    score: 83,
  },
  {
    id: "dpdp",
    name: "DPDP Act 2023",
    icon: AlertTriangle,
    description: "Digital Personal Data Protection Act — India's modern data protection legislation",
    status: "Partially Compliant",
    lastAudit: "2026-06-01",
    nextAudit: "2026-07-01",
    checks: [
      { name: "Data Fiduciary Registration", pass: false },
      { name: "Notice & Consent Framework", pass: true },
      { name: "Data Principal Rights", pass: true },
      { name: "Significant Data Fiduciary", pass: false },
      { name: "Data Protection Impact Assessment", pass: true },
      { name: "Data Transfer Restrictions", pass: false },
    ],
    score: 50,
  },
  {
    id: "security",
    name: "ISO 27001 (Info Security)",
    icon: CheckCircle,
    description: "International standard for information security management systems",
    status: "In Progress",
    lastAudit: "2026-05-20",
    nextAudit: "2026-08-20",
    checks: [
      { name: "Access Control Policy", pass: true },
      { name: "Cryptography Controls", pass: true },
      { name: "Physical Security", pass: true },
      { name: "Operations Security", pass: true },
      { name: "Incident Management", pass: false },
      { name: "Business Continuity", pass: true },
    ],
    score: 67,
  },
];

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = useState<typeof FRAMEWORKS[0] | null>(null);

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <PageHeader
        title="COMPLIANCE OVERVIEW"
        description="Monitor regulatory compliance status across data protection frameworks"
        actions={<ActionButton label="Generate Full Report" variant="primary" icon={FileText} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FRAMEWORKS.map((fw) => (
          <Card key={fw.id} className="flex flex-col">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="border-2 border-black bg-[#1a1a14] p-2">
                    <fw.icon className="h-5 w-5 text-[#f4ebd0]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase">{fw.name}</h3>
                    <StatusBadge status={fw.status} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black">{fw.score}%</div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-gray-500">Score</div>
                </div>
              </div>

              <p className="text-[11px] font-bold text-gray-600 leading-relaxed">{fw.description}</p>

              <div className="border-t border-dashed border-black pt-3 space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="uppercase tracking-wider">Last Audit</span>
                  <span>{fw.lastAudit}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="uppercase tracking-wider">Next Audit</span>
                  <span>{fw.nextAudit}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <ActionButton label="View Details" onClick={() => setSelectedFramework(fw)} />
                <ActionButton label="Generate Report" variant="primary" icon={FileText} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!selectedFramework} onClose={() => setSelectedFramework(null)} title={selectedFramework?.name || ""}>
        {selectedFramework && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <StatusBadge status={selectedFramework.status} />
              <span className="text-lg font-black">{selectedFramework.score}%</span>
            </div>
            <div className="space-y-2">
              {selectedFramework.checks.map((check, i) => (
                <div key={i} className="flex items-center justify-between border border-black p-2.5 text-[11px]">
                  <span className="font-bold">{check.name}</span>
                  {check.pass ? (
                    <span className="text-green-700 font-black text-[10px]">✓ PASS</span>
                  ) : (
                    <span className="text-red-700 font-black text-[10px]">✗ FAIL</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <ActionButton label="Download Full Report" variant="primary" icon={FileText} />
              <ActionButton label="Schedule Audit" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
