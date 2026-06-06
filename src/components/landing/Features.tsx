import { Cpu, ShieldCheck, Layers, ClipboardCheck, GraduationCap, RefreshCw } from "lucide-react";

export default function Features() {
  const features = [
    { icon: <Cpu />, title: "AI-Powered Generation", desc: "Constraint-satisfaction AI generates multiple conflict-free timetable options in seconds." },
    { icon: <ShieldCheck />, title: "Zero-Conflict Scheduling", desc: "Automatic detection and resolution of room clashes, faculty overlaps, and workload violations." },
    { icon: <Layers />, title: "Multi-Department Support", desc: "Handle UG, PG, schools and colleges across multiple departments and shifts simultaneously." },
    { icon: <ClipboardCheck />, title: "Approval Workflow", desc: "Built-in review and sign-off flow for HoDs and Deans before timetables go live." },
    { icon: <GraduationCap />, title: "NEP 2020 Ready", desc: "Compliant with National Education Policy norms on workload, electives, and credit structures." },
    { icon: <RefreshCw />, title: "Dynamic Rescheduling", desc: "Instantly reschedule around faculty leaves, room maintenance, or new constraints." },
  ];

  return (
    <section id="features" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Everything you need</h2>
        <p className="text-base text-slate-500 mt-2 font-medium">Designed for the complexity of modern higher education</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => (
          /* Plain white background cards completely replaced with solid blue-to-green gradient faces */
          <div key={idx} className="bg-gradient-to-b from-blue-700 via-blue-800 to-emerald-600 text-white p-6 rounded-2xl shadow-lg border border-blue-500/20 flex flex-col gap-4">
            <div className="bg-white/10 w-fit p-2.5 rounded-xl border border-white/20 text-emerald-300">
              {feat.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight mb-1">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-blue-50 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}