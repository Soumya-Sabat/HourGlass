import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">Cookie Protocol</h1>
        <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6 sm:p-8 space-y-5 text-[12px] font-bold leading-relaxed">
          {[
            { title: "Essential Cookies", body: "Required for authentication (JWT token), session management, and security. These cannot be disabled." },
            { title: "Functional Cookies", body: "Remember your preferences and settings across sessions. Disabling may affect user experience." },
            { title: "Analytics Cookies", body: "Help us understand how the platform is used so we can improve performance and features. Anonymized data only." },
            { title: "Third-Party Cookies", body: "We do not use third-party tracking cookies, advertising cookies, or social media pixels." },
            { title: "Cookie Duration", body: "Session cookies expire when you log out. Persistent cookies last up to 30 days unless manually cleared." },
            { title: "Managing Cookies", body: "You can control cookies through your browser settings. Note that disabling essential cookies will prevent the platform from functioning." },
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
