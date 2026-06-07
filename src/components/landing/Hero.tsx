import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content Column */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
            Generate conflict-free <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-blue-500 to-emerald-500">
              timetables in seconds
            </span>{" "}
            not weeks.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            HourGlass helps colleges and schools create optimized, NEP-compliant timetables using AI — handling faculty constraints, room allocation, batch splits, and multi-shift scheduling automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-600 text-white font-bold px-6 py-3.5 rounded-full hover:opacity-95 transition shadow-lg w-full sm:w-auto">
              Start Generating Free
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold px-6 py-3.5 rounded-full hover:bg-slate-50 transition w-full sm:w-auto shadow-sm">
              <Play className="h-4 w-4 fill-current text-slate-600" /> Watch Demo
            </button>
          </div>

          {/* Quick Metrics Bar directly matching image */}
          <div className="grid grid-cols-4 gap-4 pt-3 border-t border-slate-200 text-center lg:text-left">
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">500+</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Institutions</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">12K+</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Timetables</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">98%</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Conflict-Free</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">4x</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Faster</div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Mockup - White background replaced by sharp, vivid gradient frame */}
        <div className="lg:col-span-6 w-full max-w-xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 p-1.5 rounded-2xl shadow-2xl">
            <div className="bg-slate-950 rounded-[12px] p-4 font-sans text-xs text-slate-300">
              
              {/* Fake Window Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-slate-400 font-medium ml-2">HourGlass Dashboard</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">● Online</span>
              </div>

              {/* Upper Analytics Panel Inside Mockup */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Timetables</div>
                  <div className="text-lg font-black text-white">24</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Conflicts</div>
                  <div className="text-lg font-black text-rose-500">0</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">AI Score</div>
                  <div className="text-lg font-black text-emerald-400">97%</div>
                </div>
              </div>

              {/* Matrix Layout Grid */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="text-[11px] font-bold text-blue-400">B.Tech CSE Sem 5 — Option 1</div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                  <span className="bg-slate-800 text-slate-400 py-1 rounded">Mon</span>
                  <span className="bg-blue-600 text-white font-bold py-1 rounded">CS301</span>
                  <span className="bg-slate-800 py-1 rounded">MA201</span>
                  <span className="bg-emerald-600 text-white font-bold py-1 rounded">CS Lab</span>
                  
                  <span className="bg-slate-800 text-slate-400 py-1 rounded">Tue</span>
                  <span className="bg-emerald-600 text-white font-bold py-1 rounded">PH101</span>
                  <span className="bg-slate-800 py-1 rounded">CS302</span>
                  <span className="bg-blue-600 text-white font-bold py-1 rounded">MA201</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
