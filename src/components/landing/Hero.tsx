import { ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Structural High-Intensity Background Accents */}
      <div className="absolute top-0 left-1/4 -z-10 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-500 rounded-full filter blur-[130px] opacity-40 animate-pulse duration-6000" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Text Presentation Column */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-full px-4 py-1 text-xs sm:text-sm font-bold tracking-wide shadow-md">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>AI-Powered & NEP 2020 Compliant</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Generate conflict-free timetables in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 drop-shadow-sm">
              seconds
            </span>
            , not weeks.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium">
            HourGlass helps colleges and schools create optimized, NEP-compliant timetables using AI—handling faculty constraints, room allocation, batch splits, and multi-shift scheduling automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl hover:scale-[1.01] transition-all shadow-xl shadow-blue-600/20 w-full sm:w-auto">
              Start Generating Free <ArrowRight className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-xl hover:bg-slate-50 transition w-full sm:w-auto shadow-sm">
              <Play className="h-4 w-4 fill-current text-slate-600" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Dashboard Canvas Image Alternative - Strictly Replacing White with Vivid Blue-Green Gradient */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
          <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 text-white rounded-2xl shadow-2xl p-0.5 transform transition hover:scale-[1.01]">
            <div className="bg-slate-950/95 backdrop-blur-xl rounded-[14px] p-5 sm:p-6 font-mono text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-slate-400 text-[11px]">HourGlass Matrix Engine</div>
              </div>

              {/* Saturated Image Inset Substitute */}
              <div className="bg-gradient-to-r from-blue-700 to-emerald-600 p-4 rounded-xl border border-blue-500/30 mb-4 text-white">
                <div className="text-[10px] uppercase tracking-wider opacity-80 font-bold">Active Compilation State</div>
                <div className="text-xl font-extrabold mt-0.5 tracking-tight">24 Active Layout Profiles</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
                <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Optimized Core Resolution Verified
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-[100%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}