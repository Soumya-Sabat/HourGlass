"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function BugReportPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: "Bug Report" }),
      });
      if (res.ok) setSent(true);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-2">Report a Bug</h1>
        <p className="text-sm font-bold text-[#1a1a14]/70 mb-8">Found something broken? Let us know.</p>
        {sent ? (
          <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-8 text-center">
            <p className="text-sm font-black">Thank you!</p>
            <p className="text-[11px] font-bold text-[#1a1a14]/70 mt-1">Your bug report has been submitted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-9 px-3 text-[12px] font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#e28774]" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-9 px-3 text-[12px] font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#e28774]" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Description</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2 text-[12px] font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#e28774]" />
            </div>
            <button type="submit" className="bg-[#e28774] border-2 border-black px-6 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#1a1a14] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1a1a14] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Submit</button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
