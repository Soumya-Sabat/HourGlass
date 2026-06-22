"use client";

import { useState } from "react";
import { PageHeader, InputField, SelectField, ActionButton, Card } from "@/components/super-admin/ui";
import { Send, Paperclip } from "lucide-react";

export default function CreateTicketPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Support Ticket"
        description="Submit a new support ticket on behalf of an institution"
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Institution Name" name="institution" placeholder="e.g. Springfield High" required />
            <InputField label="User Name" name="userName" placeholder="e.g. John Doe" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="User Email" name="userEmail" type="email" placeholder="john@example.com" required />
            <SelectField
              label="Priority"
              name="priority"
              defaultValue="Medium"
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
            />
          </div>

          <InputField label="Subject" name="subject" placeholder="Brief description of the issue" required />

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1" htmlFor="description">Description</label>
            <textarea
              id="description" name="description" rows={5} required
              placeholder="Provide detailed information about the issue..."
              className="w-full px-3 py-2 text-[12px] font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#e28774]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Attachments</label>
            <div className="border-2 border-dashed border-black p-6 text-center bg-[#f4ebd0]/30">
              <Paperclip className="h-5 w-5 mx-auto mb-2 text-[#1a1a14]/40" />
              <p className="text-[10px] font-bold text-[#1a1a14]/60">Drag & drop files or click to browse</p>
              <input type="file" multiple className="hidden" />
            </div>
          </div>

          <SelectField
            label="Assign To"
            name="assignedTo"
            defaultValue=""
            options={[
              { value: "", label: "Unassigned" },
              { value: "Support Team A", label: "Support Team A" },
              { value: "Support Team B", label: "Support Team B" },
              { value: "Senior Support", label: "Senior Support" },
            ]}
          />

          <div className="flex items-center gap-3 pt-2">
            <ActionButton label={submitting ? "Submitting..." : "Create Ticket"} variant="primary" icon={Send} />
            <ActionButton label="Cancel" variant="ghost" />
          </div>
        </form>
      </Card>
    </div>
  );
}
