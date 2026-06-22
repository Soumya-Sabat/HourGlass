import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">Privacy Statement</h1>
        <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6 sm:p-8 space-y-5 text-[12px] font-bold leading-relaxed">
          {[
            { title: "Data We Collect", body: "We collect registration information (name, email, phone), institution data, and usage analytics to provide and improve our service." },
            { title: "How We Use Data", body: "Your data is used to generate timetables, manage schedules, send notifications, and maintain account security. We do not sell personal data to third parties." },
            { title: "Data Encryption", body: "Sensitive data is encrypted at rest using AES-256-GCM. All communications are secured via TLS 1.3." },
            { title: "Data Retention", body: "We retain your data for the duration of your account plus 90 days after termination. Analytics data may be retained anonymized for up to 3 years." },
            { title: "Your Rights", body: "You may request access, correction, or deletion of your data at any time by contacting privacy@hourglass.dev." },
            { title: "Cookies", body: "We use essential cookies for authentication and functionality. See our Cookie Policy for details." },
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
