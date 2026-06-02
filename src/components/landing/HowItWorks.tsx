import { ClipboardList, Cpu, CheckSquare } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Set Parameters",
      desc: "Enter classrooms, batches, faculty workloads, subjects and custom constraints into the guided setup wizard.",
      icon: ClipboardList,
    },
    {
      num: "02",
      title: "AI Generates Options",
      desc: "The core hybrid optimization engine runs constraints matrices across all variables and maps out 3-5 distinct optimized options.",
      icon: Cpu,
    },
    {
      num: "03",
      title: "Review & Approve",
      desc: "Department heads review parameters, leave localized feedback comments, compare versions side-by-side, and sign off with a click.",
      icon: CheckSquare,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold tracking-wider text-indigo-600 uppercase">How it works</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            From raw constraints parameters to published schedules in 3 steps
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-3 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-black text-slate-100 select-none tracking-tight">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}