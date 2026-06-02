import { ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* High-Intensity Dynamic Blurred Aurora Gradient Background */}
      <div className="absolute top-0 left-1/4 -z-10 w-[450px] h-[450px] bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-45 animate-pulse duration-4000" />
      <div className="absolute top-10 right-1/4 -z-10 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500 via-teal-400 to-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Copy Panel */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-emerald-50 border border-emerald-200/60 text-slate-700 rounded-full px-4 py-1 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              AI-Powered & NEP 2020 Compliant
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Generate conflict-free timetables in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              seconds
            </span>
            , not weeks.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            HourGlass helps colleges and schools create optimized, NEP-compliant timetables using AI—handling faculty constraints, room allocation, batch splits, and multi-shift scheduling automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl hover:opacity-95 transition shadow-lg shadow-blue-600/10 w-full sm:w-auto">
              Start Generating Free <ArrowRight className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-xl hover:bg-slate-50 transition w-full sm:w-auto shadow-sm">
              <Play className="h-4 w-4 fill-current text-slate-600" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Right Preview Card (Responsive Mockup UI) */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
          <div className="bg-slate-900/95 backdrop-blur-md text-slate-100 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-800 font-mono text-xs sm:text-sm transform transition hover:scale-[1.01]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="text-slate-400 text-[11px] sm:text-xs">HourGlass Dashboard</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800/60">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Active Schedules</div>
                <div className="text-xl font-bold text-white mt-1">24 Timetables</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800/60">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Live Clashes</div>
                <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0" /> 0 Conflicts
                </div>
              </div>
            </div>

            {/* Timetable Grid Simulation */}
            <div className="space-y-2">
              <div className="bg-blue-950/20 border border-blue-900/40 p-2.5 rounded-lg">
                <div className="text-blue-400 text-[11px] font-bold">B.Tech CSE | Sem 5 - Option 1</div>
                <div className="grid grid-cols-3 gap-1 mt-2 text-center text-[11px] text-slate-300">
                  <span className="bg-slate-800 py-1 rounded">Slots</span>
                  <span className="bg-slate-800 py-1 rounded">Mon</span>
                  <span className="bg-slate-800 py-1 rounded">Tue</span>
                  
                  <span className="py-1 text-slate-500">9-10 AM</span>
                  <span className="bg-blue-600/30 text-blue-300 rounded py-1 border border-blue-500/20">CS301</span>
                  <span className="bg-emerald-600/30 text-emerald-300 rounded py-1 border border-emerald-500/20">PH101</span>

                  <span className="py-1 text-slate-500">10-11 AM</span>
                  <span className="bg-indigo-600/30 text-indigo-300 rounded py-1 border border-indigo-500/20">MA201</span>
                  <span className="bg-blue-600/30 text-blue-300 rounded py-1 border border-blue-500/20">CS302</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic pt-1 text-center">
                ✨ Top 3 alternative profiles parsed smoothly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}