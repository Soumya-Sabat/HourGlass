"use client";

import { CalendarClock, ChartNoAxesColumnIncreasing, CheckCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = ["08:30", "09:20", "10:10", "11:20", "12:10", "02:00"];
const classes = [
  { label: "PHY", area: "Lab 2", color: "bg-[#e28774]", cell: "col-start-2 row-start-2", delay: "0s" },
  { label: "MTH", area: "Room 104", color: "bg-emerald-400", cell: "col-start-4 row-start-3", delay: "0.5s" },
  { label: "CSE", area: "Lab 1", color: "bg-amber-400", cell: "col-start-3 row-start-5", delay: "1s" },
  { label: "ENG", area: "Room 208", color: "bg-sky-400", cell: "col-start-5 row-start-4", delay: "1.5s" },
];

export function AuthTimetableVisual({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="relative min-h-[24rem] w-full border-4 border-[#1a1a14] bg-[#eae3cb] p-4 shadow-[6px_6px_0px_0px_#1a1a14] sm:min-h-[28rem] lg:min-h-[calc(100dvh-9rem)] font-mono text-[#1a1a14]">
      <Link href="/" >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes slotPulse {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(-2px, -2px); }
            }

            @keyframes scanLine {
              0% { transform: translateX(-110%); }
              100% { transform: translateX(110%); }
            }

            @keyframes barGrow {
              0%, 100% { transform: scaleX(0.62); }
              50% { transform: scaleX(1); }
            }
          `,
        }}
      />

      <div className="relative z-10 flex h-full min-h-[22rem] flex-col justify-between gap-5">
        
        {/* Header Block */}
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#1a1a14] pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest bg-[#1a1a14] text-[#f4ebd0] inline-block px-1.5 py-0.5">
              HourGlass
            </p>
            <h2 className="mt-2 text-xl font-black uppercase tracking-tight text-[#1a1a14] sm:text-2xl">
              {mode === "login" ? "Resume the schedule." : "Build the timetable."}
            </h2>
          </div>
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#1a1a14] bg-[#f4ebd0] text-[#1a1a14] shadow-[3px_3px_0px_0px_#1a1a14]">
            <Sparkles className="h-5 w-5 stroke-[2.5]" />
          </span>
        </div>

        {/* Timetable Container Grid Block */}
        <div className="relative border-2 border-[#1a1a14] bg-white p-3 shadow-[4px_4px_0px_0px_#1a1a14]">
          {/* Animated stylized alert scanline overlay */}
          <div className="absolute inset-0 z-40 bg-gradient-to-r from-transparent via-[#e28774]/10 to-transparent pointer-events-none" style={{ animation: "scanLine 5s linear infinite" }} />
          
          {/* Main Matrix Grid Container */}
          <div className="relative grid grid-cols-[3.8rem_repeat(5,minmax(0,1fr))] gap-1 text-[9px] font-black uppercase text-[#1a1a14]">
            
            {/* Row 1: Header Spacer & Days */}
            <span />
            {days.map((day) => (
              <span key={day} className="z-10 border-2 border-[#1a1a14] bg-[#eae3cb] px-1 py-1.5 text-center font-black shadow-[1px_1px_0px_0px_#1a1a14]">
                {day}
              </span>
            ))}

            {/* Matrix Body Content */}
            {periods.map((period) => (
              <div key={period} className="contents">
                {/* Period Time Column Cell */}
                <span className="z-10 flex items-center justify-center border-2 border-[#1a1a14] bg-[#f4ebd0] px-1 py-2 text-center text-[#1a1a14] font-black shadow-[1px_1px_0px_0px_#1a1a14]">
                  {period}
                </span>

                {/* Day Columns Empty Cells Matrix */}
                {days.map((_, colIndex) => (
                  <span 
                    key={colIndex} 
                    className="h-10 border-2 border-dashed border-[#1a1a14]/30 bg-[#f4ebd0]/10 transition-colors hover:bg-slate-50" 
                  />
                ))}
              </div>
            ))}

            {/* Class Cards Absolutes Layout Overlaid Layer */}
            <div className="pointer-events-none absolute bottom-0 right-0 left-[3.8rem] top-[28px] grid grid-cols-5 grid-rows-6 gap-1 p-0.5">
              {classes.map((item) => (
                <div
                  key={item.label}
                  className={`${item.cell} z-30 flex flex-col justify-center border-2 border-[#1a1a14] px-1.5 py-1 text-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14] ${item.color}`}
                  style={{ animation: `slotPulse 4s ease-in-out ${item.delay} infinite` }}
                >
                  <span className="text-[10px] font-black uppercase leading-tight tracking-tight">{item.label}</span>
                  <span className="truncate text-[8px] font-extrabold opacity-90">{item.area}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Brutalist Bottom Metrics Summary Footer */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: CalendarClock, label: "Conflicts", value: "0" },
            { icon: ChartNoAxesColumnIncreasing, label: "Utilization", value: "92%" },
            { icon: CheckCheck, label: "Approvals", value: "3-step" },
          ].map((metric, index) => {
            const Icon = metric.icon;

            return (
              <div key={metric.label} className="border-2 border-[#1a1a14] bg-white p-3 shadow-[3px_3px_0px_0px_#1a1a14]">
                <div className="flex items-center gap-2 text-[#1a1a14]/70">
                  <Icon className="h-4 w-4 stroke-[2.5]" />
                  <span className="text-[9px] font-black uppercase tracking-wider">{metric.label}</span>
                </div>
                <p className="mt-1 text-lg font-black uppercase text-[#1a1a14]">{metric.value}</p>
                <span className="mt-2 block h-2 origin-left border border-[#1a1a14] bg-[#e28774]" style={{ animation: `barGrow ${3 + index * 0.4}s ease-in-out infinite` }} />
              </div>
            );
          })}
        </div>
      </div>
    </Link>
    </div>
  );
}