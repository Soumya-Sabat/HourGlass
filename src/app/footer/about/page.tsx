import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">Our Mission</h1>
        <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6 sm:p-8 space-y-4 text-[13px] font-bold leading-relaxed">
          <p>HourGlass is an AI-powered timetable generator and scheduler built for educational institutions. Our mission is to eliminate manual scheduling conflicts, reduce administrative overhead, and optimize resource utilization across campuses.</p>
          <p>We leverage constraint satisfaction AI to automatically resolve room conflicts, faculty workload overlaps, and regulatory compliance requirements — all in real time.</p>
          <div className="border-2 border-black bg-[#eae3cb] p-4 mt-4">
            <h2 className="text-xs font-black uppercase tracking-wider mb-2">Key Numbers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              {[{ n: "10K+", l: "Institutions" }, { n: "500K+", l: "Users" }, { n: "99.9%", l: "Uptime" }].map((s) => (
                <div key={s.l} className="border-2 border-black bg-white p-3">
                  <p className="text-xl font-black">{s.n}</p>
                  <p className="text-[9px] font-bold text-[#1a1a14]/60 uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
