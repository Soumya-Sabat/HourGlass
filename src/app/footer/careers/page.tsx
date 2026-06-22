import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const roles = [
  { title: "Senior Full-Stack Engineer", dept: "Engineering", loc: "Remote" },
  { title: "AI/ML Engineer", dept: "AI Research", loc: "Remote" },
  { title: "Product Designer", dept: "Design", loc: "Remote" },
  { title: "Customer Success Manager", dept: "Operations", loc: "Remote" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-2">Careers</h1>
        <p className="text-sm font-bold text-[#1a1a14]/70 mb-8">Join us in building the future of education scheduling.</p>
        <div className="space-y-4">
          {roles.map((r) => (
            <div key={r.title} className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-5 flex items-center justify-between gap-4 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#1a1a14] transition-all">
              <div>
                <h2 className="text-sm font-black uppercase tracking-tight">{r.title}</h2>
                <p className="text-[10px] font-bold text-[#1a1a14]/60 mt-0.5">{r.dept} · {r.loc}</p>
              </div>
              <span className="text-[10px] font-black uppercase bg-[#e28774] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#1a1a14] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer">Apply</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] font-bold text-[#1a1a14]/50 mt-8 text-center">No open roles match your skills? Reach out at careers@hourglass.dev</p>
      </main>
      <Footer />
    </div>
  );
}
