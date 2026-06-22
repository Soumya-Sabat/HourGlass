"use client";

import { useState } from "react";
import { PageHeader, InputField, ActionButton, Card } from "@/components/super-admin/ui";
import { Send, Save } from "lucide-react";

export default function CreateAnnouncementPage() {
  const [audience, setAudience] = useState("All");

  return (
    <div className="space-y-6 font-mono text-[#1a1a14] max-w-3xl">
      <PageHeader
        title="CREATE ANNOUNCEMENT"
        description="Draft a new system-wide announcement or notification"
      />

      <Card>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Announcement created successfully!");
          }}
        >
          <InputField label="Title" name="title" placeholder="e.g. Semester Exam Schedule" required />

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1" htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={6}
              required
              placeholder="Write your announcement content here..."
              className="w-full px-3 py-2 text-[12px] font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#e28774]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Target Audience</label>
            <div className="flex flex-wrap gap-3">
              {["All", "Institution", "Specific Users"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="audience"
                    value={opt}
                    checked={audience === opt}
                    onChange={(e) => setAudience(e.target.value)}
                    className="accent-[#1a1a14]"
                  />
                  <span className="text-[12px] font-bold">{opt}</span>
                </label>
              ))}
            </div>
            {audience === "Institution" && (
              <select className="mt-2 w-full h-9 px-3 text-[12px] font-bold border-2 border-black bg-white focus:outline-none">
                <option value="">Select Institution</option>
                <option value="INST001">Springfields Academy</option>
                <option value="INST002">Greenwood High</option>
                <option value="INST003">Riverside School</option>
              </select>
            )}
            {audience === "Specific Users" && (
              <input
                type="text"
                placeholder="Enter user emails (comma separated)"
                className="mt-2 w-full h-9 px-3 text-[12px] font-bold border-2 border-black bg-white focus:outline-none"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Schedule Date" name="scheduledDate" type="datetime-local" />
            <InputField label="Expiry Date" name="expiryDate" type="datetime-local" />
          </div>

          <div className="flex items-center gap-3 pt-2 border-t-2 border-dashed border-black">
            <ActionButton label="Save as Draft" variant="default" icon={Save} />
            <ActionButton label="Publish Now" variant="primary" icon={Send} />
          </div>
        </form>
      </Card>
    </div>
  );
}
