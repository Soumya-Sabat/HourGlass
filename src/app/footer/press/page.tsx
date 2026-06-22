import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">Press Wire</h1>
        <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6 sm:p-8 space-y-6">
          {/* <div className="border-b-2 border-black/10 pb-4">
            <p className="text-[10px] font-bold text-[#1a1a14]/50 mb-1">March 15, 2026</p>
            <h2 className="text-sm font-black uppercase tracking-tight mb-1">HourGlass Raises $10M Series A</h2>
            <p className="text-[11px] font-bold text-[#1a1a14]/70">Funding to expand AI timetable generation across Southeast Asian markets.</p>
          </div> */}
          <div className="border-b-2 border-black/10 pb-4">
            <p className="text-[10px] font-bold text-[#1a1a14]/50 mb-1">January 8, 2026</p>
            <h2 className="text-sm font-black uppercase tracking-tight mb-1">NEP 2020 Compliance Certification</h2>
            <p className="text-[11px] font-bold text-[#1a1a14]/70">HourGlass becomes first fully compliant timetable platform under India's new education policy.</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#1a1a14]/50 mb-1">October 22, 2025</p>
            <h2 className="text-sm font-black uppercase tracking-tight mb-1">Launch of AI Conflict Predictor</h2>
            <p className="text-[11px] font-bold text-[#1a1a14]/70">Proactive scheduling conflict detection using machine learning models.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
