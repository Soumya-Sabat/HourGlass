import { Cpu, Sliders, Shield, BookOpen } from "lucide-react";

export default function Features() {
  const featureList = [
    {
      icon: <Cpu className="h-5 w-5 text-indigo-600" />,
      title: "AI-Powered Generation",
      desc: "Constraint-satisfaction AI generates multiple conflict-free timetable options in seconds.",
    },
    {
      icon: <Shield className="h-5 w-5 text-indigo-600" />,
      title: "Zero-Conflict Scheduling",
      desc: "Automatic real-time detection and resolution of room clashes, faculty overlaps, and workload violations.",
    },
    {
      icon: <Sliders className="h-5 w-5 text-indigo-600" />,
      title: "Approval Workflow",
      desc: "Built-in review and sign-off flow for HoDs, Deans, and reviewers before timetables go live.",
    },
    {
      icon: <BookOpen className="h-5 w-5 text-indigo-600" />,
      title: "NEP 2020 Ready",
      desc: "Compliant with National Education Policy norms on dynamic course structures, electives, and credit weighting.",
    },
  ];

  return (
    <section id="features" className="bg-slate-100 py-16 md:py-24 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-600 mb-2">Everything you need</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for the complexity of modern higher education
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((feat, index) => (
            <div key={index} className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
              <div className="bg-indigo-50 p-2.5 rounded-lg w-fit">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
