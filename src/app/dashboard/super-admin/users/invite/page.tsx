"use client";

import { useState } from "react";
import { PageHeader, Card, InputField, SelectField, ActionButton } from "@/components/super-admin/ui";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

const INSTITUTION_OPTIONS = [
  { value: "SPR1001", label: "Springfield University (SPR1001)" },
  { value: "GRN2002", label: "Greenwood College (GRN2002)" },
  { value: "OAK3003", label: "Oakridge Institute (OAK3003)" },
  { value: "BLU4004", label: "Bluebell Academy (BLU4004)" },
  { value: "RIV5005", label: "Riverdale School (RIV5005)" },
  { value: "SUN6006", label: "Sunrise Polytechnic (SUN6006)" },
];

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "institution_admin", label: "Institution Admin" },
  { value: "department_admin", label: "Department Admin" },
  { value: "department_head", label: "Department Head" },
  { value: "faculty", label: "Faculty" },
  { value: "reviewer", label: "Reviewer" },
  { value: "student", label: "Student" },
];

const PERMISSION_GROUPS = [
  { id: "users", label: "User Management" },
  { id: "institutions", label: "Institution Management" },
  { id: "pricing", label: "Pricing & Billing" },
  { id: "reports", label: "Reports & Analytics" },
  { id: "settings", label: "System Settings" },
  { id: "audit", label: "Audit Logs" },
];

export default function InviteUserPage() {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invite User"
        description="Send an invitation to a new platform user"
        actions={
          <Link href="/dashboard/super-admin/users">
            <ActionButton label="Back to Users" variant="ghost" icon={ArrowLeft} />
          </Link>
        }
      />

      <Card title="User Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Institution" name="institution" options={INSTITUTION_OPTIONS} />
          <InputField label="Email Address" name="email" type="email" placeholder="user@example.com" required />
          <SelectField label="Role" name="role" options={ROLE_OPTIONS} />
          <InputField label="Full Name" name="fullName" placeholder="Enter full name" required />
        </div>
      </Card>

      <Card title="Permissions">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PERMISSION_GROUPS.map((perm) => (
            <label
              key={perm.id}
              className={`flex items-center gap-2 p-3 border-2 border-[var(--border-primary)] cursor-pointer transition-all ${
                selectedPermissions.includes(perm.id)
                  ? "bg-[var(--accent)] text-white shadow-[2px_2px_0px_0px_var(--border-primary)]"
                  : "bg-[var(--surface-white)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedPermissions.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
                className="sr-only"
              />
              <span className="text-[10px] font-black uppercase">{perm.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card title="Invitation Message">
        <InputField
          label="Custom Message (Optional)"
          name="message"
          placeholder="Add a personal note to the invitation..."
        />
      </Card>

      <div className="flex justify-end">
        <ActionButton label="Send Invitation" variant="primary" icon={Send} />
      </div>
    </div>
  );
}
