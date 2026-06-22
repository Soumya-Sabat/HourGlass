"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Settings } from "lucide-react";
import { getRegistrationConfig, updateRegistrationConfig, type RegistrationConfig } from "@/actions/institution-actions";

type FieldList = {
  key: keyof RegistrationConfig;
  label: string;
  placeholder: string;
};

const fields: FieldList[] = [
  { key: "departmentHeadRoles", label: "Department Head Roles", placeholder: "Head of Events" },
  { key: "facultyPositions", label: "Faculty Positions", placeholder: "Senior Professor" },
  { key: "studentClasses", label: "Student Classes", placeholder: "B.Tech CSE" },
  { key: "studentSections", label: "Student Sections", placeholder: "A" },
  { key: "studentBatches", label: "Student Batches", placeholder: "2024-28" },
];

export default function RegistrationSettingsPage() {
  const [config, setConfig] = useState<RegistrationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getRegistrationConfig()
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addItem = (key: keyof RegistrationConfig) => {
    if (!config) return;
    setConfig({ ...config, [key]: [...config[key], ""] });
  };

  const updateItem = (key: keyof RegistrationConfig, index: number, value: string) => {
    if (!config) return;
    const arr = [...config[key]];
    arr[index] = value;
    setConfig({ ...config, [key]: arr });
  };

  const removeItem = (key: keyof RegistrationConfig, index: number) => {
    if (!config) return;
    setConfig({ ...config, [key]: config[key].filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMessage("");
    try {
      const cleaned: RegistrationConfig = {
        departmentHeadRoles: config.departmentHeadRoles.map((s) => s.trim()).filter(Boolean),
        facultyPositions: config.facultyPositions.map((s) => s.trim()).filter(Boolean),
        studentClasses: config.studentClasses.map((s) => s.trim()).filter(Boolean),
        studentSections: config.studentSections.map((s) => s.trim()).filter(Boolean),
        studentBatches: config.studentBatches.map((s) => s.trim()).filter(Boolean),
      };
      await updateRegistrationConfig(cleaned);
      setConfig(cleaned);
      setMessage("Saved successfully.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading...</div>;
  if (!config) return null;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#e28774]" /> Registration Settings
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">
            Define the options users see when registering under your institution
          </p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase hover:bg-[#2a2a24] disabled:opacity-50">
          <Save className="h-3 w-3" /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {message && (
        <div className={`border-2 border-black p-3 text-xs font-black shadow-[3px_3px_0px_0px_#1a1a14] ${message.includes("success") ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black uppercase">{f.label}</h2>
              <button onClick={() => addItem(f.key)}
                className="flex items-center gap-1 border-2 border-black bg-white px-2 py-1 text-[10px] font-black hover:bg-[#f4ebd0]">
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            {config[f.key].length === 0 ? (
              <p className="text-[10px] font-bold text-gray-500 italic">No items defined. Users will see a text input instead of a dropdown.</p>
            ) : (
              <div className="space-y-2">
                {config[f.key].map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={item} onChange={(e) => updateItem(f.key, i, e.target.value)}
                      className="flex-1 border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold" placeholder={f.placeholder} />
                    <button onClick={() => removeItem(f.key, i)}
                      className="p-2 border border-black bg-red-200 hover:bg-red-300">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}