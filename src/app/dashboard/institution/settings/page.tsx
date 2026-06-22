"use client";

import { useState } from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    language: "English",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#e28774]" /> Institution Settings
          </h1>
          <p className="text-[10px] font-bold text-gray-600 mt-1">Configure institution-wide settings</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 border-2 border-black bg-[#1a1a14] text-[#f4ebd0] px-4 py-2 text-xs font-black uppercase hover:bg-[#2a2a24]">
          <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save"}
        </button>
      </div>

      {saved && <div className="border-2 border-black bg-green-200 text-green-900 p-3 text-xs font-black shadow-[3px_3px_0px_0px_#1a1a14]">Settings saved successfully.</div>}

      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4 sm:p-6 space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wide">General Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase block mb-1">Timezone</label>
            <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold">
              <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">EST (America/New_York)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase block mb-1">Date Format</label>
            <select value={form.dateFormat} onChange={(e) => setForm({ ...form, dateFormat: e.target.value })}
              className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold">
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase block mb-1">Language</label>
            <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="w-full border-2 border-black bg-[#f4ebd0] p-2 text-xs font-bold">
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
