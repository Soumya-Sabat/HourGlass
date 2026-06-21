import { Settings, Cpu, ShieldCheck, Globe } from "lucide-react";

export default function Steps() {
  const processFlow = [
    {
      icon: <Settings className="h-5 w-5 text-[#1a1a14]" />,
      num: "01",
      title: "Set Parameters",
      desc: "Enter classrooms, batches, faculty, subjects, and constraints into the guided form configuration.",
    },
    {
      icon: <Cpu className="h-5 w-5 text-[#1a1a14]" />,
      num: "02",
      title: "AI Generates Options",
      desc: "The hybrid machine engine runs constraint satisfaction across all variables to return 3 optimized drafts.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#1a1a14]" />,
      num: "03",
      title: "Review & Approve",
      desc: "Authorities review, compare options, attach structural comments, and approve with a single click.",
    },
    {
      icon: <Globe className="h-5 w-5 text-[#1a1a14]" />,
      num: "04",
      title: "Publish to Portal",
      desc: "Approved timetables auto-publish instantly to your institutional portal or export directly to clean PDFs.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-[#1a1a14]">
      
      {/* Neo-brutalist Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16 p-6 border-2 border-[#1a1a14] bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
        <h2 className="text-xs uppercase font-black tracking-widest bg-[#1a1a14] text-[#f4ebd0] inline-block px-2 py-0.5 mb-3">
          How it works
        </h2>
        <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1a1a14]">
          From parameters to published timetable in 4 steps
        </p>
      </div>

      {/* Grid Display of Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {processFlow.map((step, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 border-2 border-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14] relative flex flex-col justify-between group transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1a1a14]"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {/* Thick-bordered Icon container */}
                <div className="bg-[#f4ebd0] p-2.5 border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14] [&_svg]:stroke-[2.5]">
                  {step.icon}
                </div>
                {/* Big high-contrast numeric badge */}
                <span className="text-2xl font-black text-[#1a1a14] bg-[#eae3cb] px-2 py-0.5 border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#e28774]">
                  {step.num}
                </span>
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-black uppercase text-[#1a1a14] mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-[#1a1a14]/80 leading-relaxed font-bold">
                  {step.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}