import { Cpu, ShieldCheck, Layers, CheckSquare, GraduationCap, Zap } from "lucide-react";

export default function Features() {
  const solutions = [
    { icon: <Cpu />, title: "AI-Powered Generation", desc: "Constraint-satisfaction AI generates multiple conflict-free timetable options in seconds." },
    { icon: <ShieldCheck />, title: "Zero-Conflict Scheduling", desc: "Automatic detection and resolution of room clashes, faculty overlaps, and workload violations." },
    { icon: <Layers />, title: "Multi-Department Support", desc: "Handle UG, PG, schools, and colleges across multiple departments and shifts simultaneously." },
    { icon: <CheckSquare />, title: "Approval Workflow", desc: "Built-in review and sign-off flow for HoDs and Deans before timetables go live." },
    { icon: <GraduationCap />, title: "NEP 2020 Ready", desc: "Compliant with National Education Policy norms on workload, electives, and credit structures." },
    { icon: <Zap />, title: "Dynamic Rescheduling", desc: "Instantly reschedule around faculty leaves, room maintenance, or new constraints." },
  ];

  return (
    <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mb-2">Everything you need</h2>
        <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Designed for the complexity of modern higher education
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all duration-300"
          >
            <div className="bg-indigo-50 p-3 rounded-xl w-fit border border-indigo-100 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-indigo-600">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-1.5">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}