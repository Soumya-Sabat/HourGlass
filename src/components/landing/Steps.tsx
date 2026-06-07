import { Settings, Cpu, ShieldCheck, Globe } from "lucide-react";

export default function Steps() {
  const processFlow = [
    {
      icon: <Settings className="h-5 w-5 text-indigo-600" />,
      num: "01",
      title: "Set Parameters",
      desc: "Enter classrooms, batches, faculty, subjects, and constraints into the guided form configuration.",
    },
    {
      icon: <Cpu className="h-5 w-5 text-indigo-600" />,
      num: "02",
      title: "AI Generates Options",
      desc: "The hybrid machine engine runs constraint satisfaction across all variables to return 3 optimized drafts.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-indigo-600" />,
      num: "03",
      title: "Review & Approve",
      desc: "Authorities review, compare options, attach structural comments, and approve with a single click.",
    },
    {
      icon: <Globe className="h-5 w-5 text-indigo-600" />,
      num: "04",
      title: "Publish to Portal",
      desc: "Approved timetables auto-publish instantly to your institutional portal or export directly to clean PDFs.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mb-2">How it works</h2>
        <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          From parameters to published timetable in 4 steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {processFlow.map((step, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm relative flex flex-col justify-between group hover:shadow-md transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-indigo-100 font-mono group-hover:text-indigo-200 transition-colors">
                  {step.num}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
