"use client";

import { useState } from "react";
import { PageHeader, InputField, ActionButton, Card } from "@/components/super-admin/ui";
import { Save, Send, CheckCircle, XCircle } from "lucide-react";

export default function EmailSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult(Math.random() > 0.3 ? "success" : "error");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Email Settings" description="Configure SMTP server and email delivery" />

      <Card>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="SMTP Host" name="smtpHost" defaultValue="smtp.sendgrid.net" placeholder="smtp.example.com" required />
            <InputField label="SMTP Port" name="smtpPort" type="number" defaultValue="587" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="SMTP Username" name="smtpUser" defaultValue="apikey" placeholder="SMTP username" required />
            <InputField label="SMTP Password" name="smtpPass" type="password" defaultValue="••••••••" placeholder="SMTP password" required />
          </div>

          <InputField label="From Email" name="fromEmail" type="email" defaultValue="noreply@hourglass.com" placeholder="noreply@hourglass.com" required />

          <div className="flex items-center gap-3 pt-2">
            <ActionButton label={saving ? "Saving..." : "Save Changes"} variant="primary" icon={Save} />
            <ActionButton
              label={testing ? "Testing..." : "Test Email"}
              variant="default"
              icon={Send}
              onClick={handleTest}
            />
          </div>

          {testResult === "success" && (
            <div className="flex items-center gap-2 p-3 border-2 border-black bg-green-100 text-green-900 text-[11px] font-black">
              <CheckCircle className="h-4 w-4" />
              Test email sent successfully! Check your inbox.
            </div>
          )}
          {testResult === "error" && (
            <div className="flex items-center gap-2 p-3 border-2 border-black bg-red-100 text-red-900 text-[11px] font-black">
              <XCircle className="h-4 w-4" />
              Test email failed. Please verify your SMTP configuration.
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
