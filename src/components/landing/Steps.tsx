import { Settings, Cpu, ShieldCheck } from "lucide-react";

export default function Steps() {
  const workflowSteps = [
    {
      num: "01",
      icon: <Settings className="h-6 w-6 text-indigo-600" />,
      title: "Set Parameters",
      desc: "Enter classrooms, batches, faculty, subjects and constraints into the guided form.",
    },
    {
      num: "02",
      icon: <Cpu className="h-6 w-6 text-indigo-600" />,
      title: "AI Generates Options",
      desc: "The hybrid engine runs constraint satisfaction across all variables and returns 3 optimized timetables.",
    },
    {
      num: "03",
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />,
      title: "Review & Approve",
      desc: "Authorities review, compare options, append comments, and grant cross-department approval with one click.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
        <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-600 mb-2">How it works</h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          From parameters to published timetable in 3 steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {workflowSteps.map((step, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 relative shadow-sm hover:shadow-md transition">
            <div className="absolute top-6 right-6 text-3xl font-extrabold text-slate-100 select-none font-mono">
              {step.num}
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl w-fit">
              {step.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">{step.title}</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
