import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">Terms of Service</h1>
        <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6 sm:p-8 space-y-5 text-[12px] font-bold leading-relaxed">
          {[
            { title: "1. Acceptance", body: "By accessing or using HourGlass, you agree to be bound by these terms. If you do not agree, do not use the service." },
            { title: "2. Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account." },
            { title: "3. Acceptable Use", body: "You may not use HourGlass for any unlawful purpose or in violation of any applicable laws or regulations." },
            { title: "4. Data Privacy", body: "We collect and process data as described in our Privacy Policy. You retain ownership of your data." },
            { title: "5. Service Level", body: "We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance." },
            { title: "6. Termination", body: "Either party may terminate the agreement with 30 days written notice. Upon termination, your data will be exported and deleted within 90 days." },
            { title: "7. Limitation of Liability", body: "HourGlass shall not be liable for indirect, incidental, or consequential damages arising from the use of the service." },
            { title: "8. Changes", body: "We reserve the right to modify these terms. Users will be notified 30 days before any material changes take effect." },
          ].map((s) => (
            <div key={s.title}>
              <h2 className="text-xs font-black uppercase tracking-tight mb-1">{s.title}</h2>
              <p className="text-[#1a1a14]/80">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-bold text-[#1a1a14]/40 mt-4">Last updated: January 1, 2026</p>
      </main>
      <Footer />
    </div>
  );
}
