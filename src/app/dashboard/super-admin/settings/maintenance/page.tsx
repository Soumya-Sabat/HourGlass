"use client";

import { useState } from "react";
import { PageHeader, InputField, ActionButton, Card, SectionHeader } from "@/components/super-admin/ui";
import { Wrench, Clock, Save } from "lucide-react";

export default function MaintenancePage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance Mode" description="Control system maintenance windows and user-facing downtime messages" />

      <Card>
        <form onSubmit={handleSave} className="space-y-5">
          <SectionHeader title="Maintenance Status" />

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wrench className={`h-5 w-5 ${maintenanceMode ? "text-red-600" : "text-green-600"}`} />
              <div>
                <div className="text-[12px] font-black uppercase">
                  System is {maintenanceMode ? "UNDER MAINTENANCE" : "OPERATIONAL"}
                </div>
                <p className="text-[10px] font-bold text-[var(--text-primary)]/60 mt-0.5">
                  {maintenanceMode
                    ? "Users will see the maintenance message below"
                    : "All services are available to users"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative w-12 h-6 border-2 border-[var(--border-primary)] transition-all ${maintenanceMode ? "bg-red-400" : "bg-green-400"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-[var(--surface-white)] border-2 border-[var(--border-primary)] transition-all ${maintenanceMode ? "left-6" : "left-0.5"}`} />
            </button>
          </div>

          {maintenanceMode && (
            <>
              <div className="px-4">
                <label className="block text-[10px] font-black uppercase tracking-wider mb-1" htmlFor="message">Maintenance Message</label>
                <textarea
                  id="message" name="message" rows={3}
                  defaultValue="System is currently undergoing scheduled maintenance. Please check back in a few hours. We apologize for the inconvenience."
                  className="w-full px-3 py-2 text-[12px] font-bold border-2 border-[var(--border-primary)] bg-[var(--surface-white)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <SectionHeader title="Schedule Window (Optional)" />

              <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Start Time" name="startTime" type="datetime-local" />
                <InputField label="End Time" name="endTime" type="datetime-local" />
              </div>
            </>
          )}

          <div className="px-4 pb-4 flex items-center gap-3">
            <ActionButton label={saving ? "Saving..." : "Save Changes"} variant="primary" icon={Save} />
            <ActionButton label="Cancel" variant="ghost" />
          </div>
        </form>
      </Card>

      <Card>
        <SectionHeader title="Recent Maintenance Events" />
        <div className="space-y-3">
          {[
            { date: "2026-06-15", duration: "2 hours", status: "Completed", message: "Database migration v2.1" },
            { date: "2026-05-28", duration: "1 hour", status: "Completed", message: "SSL certificate renewal" },
            { date: "2026-04-10", duration: "4 hours", status: "Completed", message: "Server infrastructure upgrade" },
          ].map((event, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)]/30">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[var(--accent)]" />
                <div>
                  <div className="text-[11px] font-black">{event.message}</div>
                  <div className="text-[10px] font-bold text-[var(--text-primary)]/60">{event.date} · {event.duration}</div>
                </div>
              </div>
              <span className="text-[9px] font-black px-2 py-0.5 bg-green-200 text-green-900 border border-[var(--border-primary)]">
                {event.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
