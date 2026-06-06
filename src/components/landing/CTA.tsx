export default function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Container frame upgraded to vivid gradient border background */}
      <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="text-center lg:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to stop building timetables manually?
          </h2>
          <p className="text-sm text-blue-50 font-medium opacity-90">
            Join 500+ institutions already using SchedulAI.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <button className="bg-white text-slate-900 font-bold px-5 py-3 rounded-xl text-sm hover:bg-slate-50 transition shadow-md">
            Request a Demo
          </button>
          <button className="bg-slate-950 text-white font-bold px-5 py-3 rounded-xl text-sm hover:bg-slate-900 transition shadow-md border border-slate-800">
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  );
}