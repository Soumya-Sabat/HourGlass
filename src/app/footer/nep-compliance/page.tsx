import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function NepCompliancePage() {
  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">NEP 2020 Compliance</h1>
        <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6 sm:p-8 space-y-4 text-[13px] font-bold leading-relaxed">
          <p>HourGlass is fully compliant with the National Education Policy (NEP) 2020 framework. Our AI engine supports:</p>
          <ul className="space-y-2 list-disc pl-5">
            {[
              "Multidisciplinary scheduling across streams",
              "Credit-based timetable allocation",
              "Research and internship time blocks",
              "Vocational training slot integration",
              "Flexible academic calendar management",
              "Multiple entry/exit point tracking",
            ].map((item) => (
              <li key={item} className="text-[12px]">{item}</li>
            ))}
          </ul>
          <div className="border-2 border-black bg-[#eae3cb] p-4 mt-4">
            <p className="text-xs font-black uppercase tracking-wider mb-1">Certification</p>
            <p className="text-[11px] font-bold text-[#1a1a14]/70">HourGlass has been audited and certified compliant with NEP 2020 guidelines by an independent education technology review board.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
