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
    <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-[#1a1a14]">
      {/* Header Block */}
      <div className="text-center max-w-3xl mx-auto mb-16 p-6 border-2 border-[#1a1a14] bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
        <h2 className="text-xs uppercase font-black tracking-widest bg-[#1a1a14] text-[#f4ebd0] inline-block px-2 py-0.5 mb-3">
          Everything you need
        </h2>
        <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1a1a14]">
          Designed for the complexity of modern higher education
        </p>
      </div>

      {/* Grid Grid Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 sm:p-8 border-2 border-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14] flex flex-col gap-4 transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1a1a14]"
          >
            {/* Rigid Square Icon Badge */}
            <div className="bg-[#f4ebd0] p-3 w-fit border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-[#1a1a14] [&_svg]:stroke-[2.5]">
              {item.icon}
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-[#1a1a14] mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-[#1a1a14]/80 leading-relaxed font-bold">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}