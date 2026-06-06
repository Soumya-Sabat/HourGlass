import { Settings, Cpu, ShieldCheck } from "lucide-react";

export default function Steps() {
  const workflowSteps = [
    {
      num: "01",
      icon: <Settings className="h-6 w-6 text-white" />,
      title: "Set Parameters",
      desc: "Enter classrooms, batches, faculty, subjects and constraints into the guided form configuration.",
    },
    {
      num: "02",
      icon: <Cpu className="h-6 w-6 text-white" />,
      title: "AI Generates Options",
      desc: "The hybrid machine engine runs structural constraints and produces 3 distinct conflict-free drafts.",
    },
    {
      num: "03",
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Review & Approve",
      desc: "Authorities analyze alternatives, attach structural context logs, and dispatch immediate approval paths.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
        <h2 className="text-xs uppercase font-bold tracking-widest text-blue-600 mb-2">How it works</h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          From data points to production schedule in 3 steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {workflowSteps.map((step, index) => (
          /* Replaced white background entirely with dynamic high-visibility gradients */
          <div 
            key={index} 
            className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white rounded-2xl p-6 sm:p-8 space-y-4 relative shadow-xl transform transition hover:-translate-y-1"
          >
            <div className="absolute top-6 right-6 text-4xl font-black text-white/10 select-none font-mono">
              {step.num}
            </div>
            <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl w-fit border border-white/20">
              {step.icon}
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">{step.title}</h3>
            <p className="text-sm text-blue-50 leading-relaxed font-medium">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}