"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, InputField, SelectField, ActionButton } from "@/components/super-admin/ui";
import { ArrowLeft, Save } from "lucide-react";

export default function CreatePricingPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    priceMonthly: "",
    priceYearly: "",
    features: "",
    maxUsers: "100",
    maxTimetablesPerMonth: "10",
    trialPeriodDays: "14",
    isActive: "true",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/super-admin/pricing/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          priceMonthly: Number(form.priceMonthly),
          priceYearly: Number(form.priceYearly),
          features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
          maxUsers: Number(form.maxUsers),
          maxTimetablesPerMonth: Number(form.maxTimetablesPerMonth),
          trialPeriodDays: Number(form.trialPeriodDays),
          isActive: form.isActive === "true",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create plan");
      }

      router.push("/dashboard/super-admin/pricing");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Pricing Plan"
        description="Define a new subscription plan for institutions"
        actions={
          <ActionButton
            label="Back"
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => router.back()}
          />
        }
      />

      <Card title="Plan Details">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 border-2 border-red-500 bg-red-100 text-red-800 text-[11px] font-bold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Plan Name"
              name="name"
              placeholder="e.g. Pro Plan"
              required
              value={form.name}
              onChange={handleChange}
            />
            <SelectField
              label="Status"
              name="isActive"
              value={form.isActive}
              onChange={handleChange}
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Disabled" },
              ]}
            />
            <InputField
              label="Monthly Price (₹)"
              name="priceMonthly"
              type="number"
              placeholder="0"
              required
              value={form.priceMonthly}
              onChange={handleChange}
            />
            <InputField
              label="Yearly Price (₹)"
              name="priceYearly"
              type="number"
              placeholder="0"
              required
              value={form.priceYearly}
              onChange={handleChange}
            />
            <InputField
              label="Max Users"
              name="maxUsers"
              type="number"
              placeholder="100"
              value={form.maxUsers}
              onChange={handleChange}
            />
            <InputField
              label="Max Timetables / Month"
              name="maxTimetablesPerMonth"
              type="number"
              placeholder="10"
              value={form.maxTimetablesPerMonth}
              onChange={handleChange}
            />
            <InputField
              label="Trial Period (Days)"
              name="trialPeriodDays"
              type="number"
              placeholder="14"
              value={form.trialPeriodDays}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1">
              Features (comma separated)
            </label>
            <input
              type="text"
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder="Up to 500 users, AI Timetable Generation, Priority Support"
              className="w-full h-9 px-3 text-[12px] font-bold border-2 border-[var(--border-primary)] bg-[var(--surface-white)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <ActionButton label={loading ? "Saving..." : "Save Plan"} variant="primary" icon={Save} />
            <ActionButton label="Cancel" variant="ghost" onClick={() => router.back()} />
          </div>
        </form>
      </Card>
    </div>
  );
}
