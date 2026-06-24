"use client";

import { useEffect, useState } from "react";
import { Settings, Save } from "lucide-react";
import { getDepartmentSettings, updateDepartmentSettings } from "@/actions/department-actions";

export default function DepartmentSettingsPage() {
  const [displayName, setDisplayName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDepartmentSettings()
      .then((data) => {
        setDisplayName(data.displayName);
        setCode(data.code);
        setDescription(data.description);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateDepartmentSettings({ displayName, code, description });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading settings...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#e28774]" /> Department Settings
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Configure your department preferences</p>
      </div>

      <form onSubmit={handleSave} className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-6 space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase mb-1">Department Display Name</label>
          <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="e.g. Computer Science" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase mb-1">Department Code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)}
            className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="e.g. CS" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase mb-1">Description</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border-2 border-black bg-white p-2 text-xs font-bold" placeholder="Brief description of the department" />
        </div>
        {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-1.5 border-2 border-black bg-[#e28774] px-4 py-2 text-xs font-black text-white hover:bg-[#d97766] disabled:opacity-40">
            <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
