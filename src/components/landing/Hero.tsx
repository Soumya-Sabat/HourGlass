import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-36 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-[#1a1a14]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content Column */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-[#1a1a14]">
            Generate conflict-free <br className="hidden sm:inline" />
            <span className="bg-[#e28774] px-2 py-0.5 inline-block border-2 border-[#1a1a14] my-1 transform -rotate-2">
              timetables in seconds
            </span>{" "}
            not weeks.
          </h1>
          
          <p className="text-sm sm:text-base text-[#1a1a14]/90 max-w-xl mx-auto lg:mx-0 font-bold leading-relaxed">
            HourGlass helps colleges and schools create optimized, NEP-compliant timetables using AI — handling faculty constraints, room allocation, batch splits, and multi-shift scheduling automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button className="flex items-center justify-center gap-2 bg-[#e28774] text-[#1a1a14] border-2 border-[#1a1a14] font-black uppercase px-6 py-3.5 shadow-[4px_4px_0px_0px_#1a1a14] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-xs tracking-wider w-full sm:w-auto">
              Start Generating Free
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-[#1a1a14] border-2 border-[#1a1a14] font-black uppercase px-6 py-3.5 shadow-[4px_4px_0px_0px_#1a1a14] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-xs tracking-wider w-full sm:w-auto">
              <Play className="h-4 w-4 fill-[#1a1a14] text-[#1a1a14] stroke-[2.5]" /> Watch Demo
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 pt-5 border-t-2 border-[#1a1a14] text-center lg:text-left bg-[#eae3cb] p-4 border-2 border-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14]">
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#1a1a14]">500+</div>
              <div className="text-[9px] font-black uppercase tracking-tight text-[#1a1a14]/70">Institutions</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#1a1a14]">12K+</div>
              <div className="text-[9px] font-black uppercase tracking-tight text-[#1a1a14]/70">Timetables</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#1a1a14]">92%</div>
              <div className="text-[9px] font-black uppercase tracking-tight text-[#1a1a14]/70">Conflict-Free</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#1a1a14]">4x</div>
              <div className="text-[9px] font-black uppercase tracking-tight text-[#1a1a14]/70">Faster</div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Mockup */}
        <div className="lg:col-span-6 w-full max-w-xl mx-auto">
          <div className="border-4 border-[#1a1a14] bg-white p-1 shadow-[8px_8px_0px_0px_#1a1a14]">
            <div className="bg-[#f4ebd0] border-2 border-[#1a1a14] p-4 font-mono text-xs text-[#1a1a14]">
              
              {/* Fake Window Header */}
              <div className="flex items-center justify-between border-b-2 border-[#1a1a14] pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-none border-2 border-[#1a1a14] bg-white" />
                  <span className="w-3 h-3 rounded-none border-2 border-[#1a1a14] bg-[#e28774]" />
                  <span className="w-3 h-3 rounded-none border-2 border-[#1a1a14] bg-[#1a1a14]" />
                  <span className="text-[11px] font-black uppercase ml-2 tracking-tight">HourGlass Dashboard</span>
                </div>
                <span className="text-[9px] text-[#1a1a14] bg-white border border-[#1a1a14] px-2 py-0.5 font-black uppercase">● Online</span>
              </div>

              {/* Upper Analytics Panel Inside Mockup */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white p-2 border-2 border-[#1a1a14] text-center shadow-[2px_2px_0px_0px_#1a1a14]">
                  <div className="text-[#1a1a14]/70 text-[9px] uppercase font-black">Timetables</div>
                  <div className="text-base font-black text-[#1a1a14]">24</div>
                </div>
                <div className="bg-white p-2 border-2 border-[#1a1a14] text-center shadow-[2px_2px_0px_0px_#1a1a14]">
                  <div className="text-[#1a1a14]/70 text-[9px] uppercase font-black">Conflicts</div>
                  <div className="text-base font-black text-[#1a1a14] bg-[#e28774] px-1">0</div>
                </div>
                <div className="bg-white p-2 border-2 border-[#1a1a14] text-center shadow-[2px_2px_0px_0px_#1a1a14]">
                  <div className="text-[#1a1a14]/70 text-[9px] uppercase font-black">AI Score</div>
                  <div className="text-base font-black text-[#1a1a14]">97%</div>
                </div>
              </div>

              {/* Matrix Layout Grid */}
              <div className="bg-white border-2 border-[#1a1a14] p-3 space-y-2 shadow-[2px_2px_0px_0px_#1a1a14]">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#1a1a14]">B.Tech CSE Sem 5 — Option 1</div>
                <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-bold">
                  <span className="bg-[#eae3cb] border border-[#1a1a14] text-[#1a1a14] py-1 font-black uppercase">Mon</span>
                  <span className="bg-[#e28774] border border-[#1a1a14] text-[#1a1a14] py-1">CS301</span>
                  <span className="bg-[#f4ebd0] border border-[#1a1a14] py-1">MA201</span>
                  <span className="bg-[#1a1a14] text-[#f4ebd0] border border-[#1a1a14] py-1">CS Lab</span>
                  
                  <span className="bg-[#eae3cb] border border-[#1a1a14] text-[#1a1a14] py-1 font-black uppercase">Tue</span>
                  <span className="bg-[#1a1a14] text-[#f4ebd0] border border-[#1a1a14] py-1">PH101</span>
                  <span className="bg-[#f4ebd0] border border-[#1a1a14] py-1">CS302</span>
                  <span className="bg-[#e28774] border border-[#1a1a14] text-[#1a1a14] py-1">MA201</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}