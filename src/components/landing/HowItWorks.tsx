export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Set Parameters", desc: "Enter classrooms, batches, faculty, subjects and constraints into the guided form." },
    { num: "02", title: "AI Generates Options", desc: "The engine runs constraint satisfaction across all variables and returns 3 optimized timetables." },
    { num: "03", title: "Review & Approve", "desc": "Authorities review, compare options, add comments and approve with one click." },
    { num: "04", title: "Publish to Portal", desc: "Approved timetable auto-publishes to your college website and is available as PDF." },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-slate-100 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">How it works</h2>
          <p className="text-base text-slate-600 mt-2 font-medium">From parameters to published timetable in 4 steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            /* Upgraded to high-contrast blue-green gradients to eliminate basic text blocks */
            <div key={idx} className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white p-6 rounded-2xl shadow-md relative group hover:-translate-y-1 transition-all">
              <div className="text-4xl font-black opacity-15 font-mono absolute top-4 right-4">{step.num}</div>
              <h3 className="text-lg font-bold tracking-tight mb-2 mt-4">{step.title}</h3>
              <p className="text-xs sm:text-sm text-blue-50 leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}