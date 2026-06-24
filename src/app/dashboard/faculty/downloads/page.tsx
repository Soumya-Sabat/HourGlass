"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { getFacultyDownloads, type FacultyDownload } from "@/actions/faculty-actions";

export default function FacultyDownloadsPage() {
  const [downloads, setDownloads] = useState<FacultyDownload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyDownloads().then(setDownloads).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="border-2 border-black bg-[#eae3cb] p-6 font-mono shadow-[4px_4px_0px_0px_#1a1a14]">Loading...</div>;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <Download className="h-5 w-5 text-[#e28774]" /> Downloads
        </h1>
        <p className="text-[10px] font-bold text-gray-600 mt-1">Templates and resources</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {downloads.map((d) => (
          <a key={d.id} href={d.url} download
            className="block border-2 border-black bg-[#eae3cb] shadow-[3px_3px_0px_0px_#1a1a14] p-4 hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
            <Download className="h-5 w-5 mb-2 text-[#e28774]" />
            <p className="text-xs font-black">{d.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
