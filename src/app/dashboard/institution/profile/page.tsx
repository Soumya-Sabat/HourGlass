"use client";

import { useEffect, useState } from "react";
import { Building2, Save, Loader } from "lucide-react";
import { getInstitutionProfile, updateInstitutionProfile, type InstitutionProfile } from "@/actions/institution-actions";

export default function InstitutionProfilePage() {
  const [profile, setProfile] = useState<InstitutionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getInstitutionProfile()
      .then(setProfile)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateInstitutionProfile({
        name: profile.name,
        type: profile.type,
        academicMode: profile.academicMode,
        affiliation: profile.affiliation,
        website: profile.website,
        contactPerson: profile.contactPerson,
        contactEmail: profile.contactEmail,
        contactPhone: profile.contactPhone,
        address: profile.address,
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">Loading profile...</div>;
  if (error) return <div className="border-2 border-[var(--border-primary)] bg-[var(--accent)] p-6 font-mono shadow-[4px_4px_0px_0px_var(--border-primary)]">{error}</div>;
  if (!profile) return null;

  const fields: Array<{ key: keyof InstitutionProfile; label: string }> = [
    { key: "name", label: "Institution Name" },
    { key: "type", label: "Type" },
    { key: "academicMode", label: "Academic Mode" },
    { key: "affiliation", label: "Affiliation" },
    { key: "establishedYear", label: "Established Year" },
    { key: "website", label: "Website" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "contactEmail", label: "Contact Email" },
    { key: "contactPhone", label: "Contact Phone" },
    { key: "address", label: "Address" },
    { key: "academicYear", label: "Current Academic Year" },
    { key: "institutionId", label: "Institution Code" },
  ];

  return (
    <div className="space-y-6 font-mono text-[var(--text-primary)]">
      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[var(--accent)]" /> Institution Profile
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">View and edit institution details</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 border-2 border-[var(--border-primary)] bg-[var(--dark-bg)] text-[var(--light-text)] px-4 py-2 text-xs font-black uppercase hover:bg-[var(--bg-primary)] disabled:opacity-50">
          {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {message && (
        <div className={`border-2 border-[var(--border-primary)] p-3 text-xs font-black shadow-[3px_3px_0px_0px_var(--border-primary)] ${message.includes("success") ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>
          {message}
        </div>
      )}

      <div className="border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[4px_4px_0px_0px_var(--border-primary)] p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-[10px] font-black uppercase tracking-wide mb-1 block">{f.label}</label>
              <input
                type="text"
                value={profile[f.key] as string}
                onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                disabled={f.key === "institutionId" || f.key === "academicYear"}
                className="w-full border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-2 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
