"use client";

import { useState, useEffect } from "react";
import { PageHeader, InputField, SelectField, ActionButton, Card } from "@/components/super-admin/ui";
import { Save } from "lucide-react";

export default function GeneralSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "HourGlass",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    language: "en",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="General Settings" description="Configure core system preferences" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Site Name" name="siteName" defaultValue={settings.siteName} placeholder="HourGlass" required />
            <SelectField
              label="Default Timezone"
              name="timezone"
              defaultValue={settings.timezone}
              options={[
                { value: "UTC", label: "UTC (Coordinated Universal Time)" },
                { value: "US/Eastern", label: "US/Eastern (EST)" },
                { value: "US/Central", label: "US/Central (CST)" },
                { value: "US/Mountain", label: "US/Mountain (MST)" },
                { value: "US/Pacific", label: "US/Pacific (PST)" },
                { value: "Europe/London", label: "Europe/London (GMT)" },
                { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Date Format"
              name="dateFormat"
              defaultValue={settings.dateFormat}
              options={[
                { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                { value: "DD.MM.YYYY", label: "DD.MM.YYYY" },
              ]}
            />
            <SelectField
              label="Language"
              name="language"
              defaultValue={settings.language}
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
                { value: "hi", label: "Hindi" },
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
