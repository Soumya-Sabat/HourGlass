"use client";

import { useState } from "react";
import { PageHeader, InputField, SelectField, ActionButton, Card, SectionHeader } from "@/components/super-admin/ui";
import { Save, Shield } from "lucide-react";

export default function SecuritySettingsPage() {
  const [saving, setSaving] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Security Settings" description="Configure authentication and system security policies" />

      <Card>
        <SectionHeader title="Password Policy" />
        <form onSubmit={handleSave} className="p-4 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Minimum Password Length" name="minLength" type="number" defaultValue="8" />
            <SelectField
              label="Password Complexity"
              name="complexity"
              defaultValue="medium"
              options={[
                { value: "low", label: "Low (letters + numbers)" },
                { value: "medium", label: "Medium (+ uppercase + special chars)" },
                { value: "high", label: "High (+ no repeating chars + min entropy)" },
              ]}
            />
          </div>

          <SectionHeader title="Session & Authentication" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Session Timeout"
              name="sessionTimeout"
              defaultValue="60"
              options={[
                { value: "15", label: "15 minutes" },
                { value: "30", label: "30 minutes" },
                { value: "60", label: "1 hour" },
                { value: "120", label: "2 hours" },
                { value: "480", label: "8 hours" },
                { value: "1440", label: "24 hours" },
              ]}
            />
            <div className="flex items-end pb-2">
              <div className="w-full">
                <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Two-Factor Authentication</label>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setTwoFA(!twoFA)}
                    className={`relative w-10 h-5 border-2 border-black transition-all ${twoFA ? "bg-green-400" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white border-2 border-black transition-all ${twoFA ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                  <span className="text-[11px] font-bold">{twoFA ? "Enforced for all admins" : "Not enforced"}</span>
                </div>
              </div>
            </div>
          </div>

          <SectionHeader title="Two-Factor Settings" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="2FA Method"
              name="twoFAMethod"
              defaultValue="authenticator"
              options={[
                { value: "authenticator", label: "Authenticator App" },
                { value: "sms", label: "SMS OTP" },
                { value: "email", label: "Email OTP" },
              ]}
            />
            <SelectField
              label="2FA Enforcement Scope"
              name="twoFAScope"
              defaultValue="admin"
              options={[
                { value: "admin", label: "Admin Only" },
                { value: "super-admin", label: "Super Admin Only" },
                { value: "all", label: "All Users" },
              ]}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <ActionButton label={saving ? "Saving..." : "Save Changes"} variant="primary" icon={Save} />
            <ActionButton label="Reset" variant="ghost" />
          </div>
        </form>
      </Card>
    </div>
  );
}
