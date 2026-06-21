export default function CTA() {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-[#1a1a14]">
      <div className="bg-[#eae3cb] p-8 md:p-12 text-[#1a1a14] relative overflow-hidden text-center md:text-left md:flex md:items-center md:justify-between gap-6 border-2 border-[#1a1a14] shadow-[6px_6px_0px_0px_#1a1a14]">
        
        {/* Left Column: Heading and Context Block */}
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
            Ready to stop building timetables manually?
          </h2>
          <p className="text-[#1a1a14]/80 text-sm sm:text-base font-bold">
            Join 500+ institutions already using HourGlass to optimize multi-department conflict resolution tracks.
          </p>
        </div>

        {/* Right Column: High Contrast Push Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 md:mt-0 shrink-0">
          <button className="bg-white text-[#1a1a14] border-2 border-[#1a1a14] font-black uppercase px-6 py-3 shadow-[4px_4px_0px_0px_#1a1a14] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-xs tracking-wider whitespace-nowrap">
            Request a Demo
          </button>
          <button className="bg-[#e28774] text-[#1a1a14] border-2 border-[#1a1a14] font-black uppercase px-6 py-3 shadow-[4px_4px_0px_0px_#1a1a14] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-xs tracking-wider whitespace-nowrap">
            Get Started Free
          </button>
        </div>
        
      </div>
    </section>
  );
}