export default function CTA() {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden text-center md:text-left md:flex md:items-center md:justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Ready to stop building timetables manually?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Join 500+ institutions already using HourGlass to optimize multi-department conflict resolution tracks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 md:mt-0 shrink-0">
          <button className="bg-white text-slate-950 font-extrabold px-6 py-3 rounded-xl hover:bg-slate-100 transition shadow-md text-sm whitespace-nowrap">
            Request a Demo
          </button>
          <button className="bg-indigo-600 text-white font-extrabold px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md text-sm whitespace-nowrap">
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  );
}